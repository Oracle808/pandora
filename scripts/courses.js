var models = require("../models");
var achilles = require("achilles");
var page = require("page");
var util = require("util");
var Editor = require("./Editor");

MathJax.Hub.Config({
	tex2jax: {
		displayMath: [],
		inlineMath: []
	},
	showMathMenu:false
});

function ListView(el, data) {
	achilles.View.call(this, el);
	this.define("data", [models.Course]);
	this.define("grid", Boolean);
	this.data = data;
	this.grid = true;
	this.on("click .grid", function() {
		this.grid = true;
		this.render();
	});
	this.on("click .list", function() {
		this.grid = false;
		this.render();
	});
	this.on("change grid", this.render.bind(this));
}

util.inherits(ListView, achilles.View);

ListView.prototype.templateSync = require("../views/list.mustache");

function CreateView(el, model) {
	achilles.View.call(this, el);
	this.fields = [];
	this.nova = new model();
	Object.keys(this.nova._type).forEach(function(key) {
		if(this.nova._type[key] === String && key != "_id") {
			var type = "text";
		} else {
			return;
		}

		var title = key.replace(/([a-z])([A-Z])/g, '$1 $2')
		// space before last upper in a sequence followed by lower
			.replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
		// uppercase the first character
			.replace(/^./, function(str){ return str.toUpperCase(); });

		this.fields.push({
			key: key,
			title: title,
			type: type
		});
		this.on("keyup .control-" + key, function(e) {
			console.log(e.target.value);
			this.nova[key] = e.target.value;
		});
	}.bind(this));
	this.on("click .submit", this.submit.bind(this));
}

util.inherits(CreateView, achilles.View);

CreateView.prototype.submit = function(e) {
	console.log(this.nova);
	e.preventDefault();
	this.error = null;
	this.success = null;
	this.nova.save(function(err) {
		if(err) {
			this.error = err;
		} else {
			this.success = true;
		}
		this.render();
	}.bind(this));
};

CreateView.prototype.templateSync = require("../views/create.mustache");

function CourseView(el, options) {
	achilles.View.call(this, el);
	this.data = options.data;
	this[options.section] = true;
}

util.inherits(CourseView, achilles.View);

CourseView.prototype.templateSync = require("../views/course.mustache");

function BlogView(el, options) {
	achilles.View.call(this, el);
	this.data = options.data;
	this.id = options.id;
	console.log(this.id);
}

util.inherits(BlogView, achilles.View);

BlogView.prototype.templateSync = require("../views/blog.mustache");

function PostView(el, options) {
	achilles.View.call(this, el);
	this.data = options.data;
	this.id = options.id;

	this.on("click .del", this.del);
}

util.inherits(PostView, achilles.View);

PostView.prototype.templateSync = require("../views/post.mustache");

PostView.prototype.del = function() {
	this.data.del(function(err) {
		page("/course/" + this.id + "/blog");
	}.bind(this));
};

BlogView.prototype.render = PostView.prototype.render = function() {
	achilles.View.prototype.render.call(this);
	Array.prototype.slice.call(this.el.querySelectorAll(".preview-latex")).forEach(function(y) {
		MathJax.Hub.Queue(["Typeset", MathJax.Hub, y]);
	});
};

function CreatePostView(el, options) {
	achilles.View.call(this, el);
	this.model = options.model;
	this.bind(".title", "title");
	this.delegate(".content", "content", new Editor());
	this.on("click .submit", this.submit.bind(this));
	this.id = options.id;
}

util.inherits(CreatePostView, achilles.View);

CreatePostView.prototype.submit = function(e) {
	e.preventDefault();
	console.log(this.model);
	this.error = false;
	if(!this.model.date) {
		this.model.date = new Date(Date.now());
	}
	var y = new models.Course();
	y._id = this.id;
	y.posts = [this.model];
	this.model.save(function(err) {
		if(err) {
			this.error = err;
		}
		page("/course/" + this.id + "/blog");
	}.bind(this));
};

CreatePostView.prototype.templateSync = require("../views/createPost.mustache");

models.Course.connection = new achilles.Connection("http://localhost:5000/courses");

window.onload = function() {
	var main = document.querySelector("main");
	page("/", function() {
		console.log("here");
		models.Course.get(function(err, docs) {
			console.log(docs);
			new ListView(main, docs);
		});
	});
	page("/create", function() {
		new CreateView(main, models.Course);
	});
	page("/course/:course/:section", function(e, next) {
		models.Course.getById(e.params.course, function(err, doc) {
			new CourseView(main, {data: doc, section: e.params.section});
			next();
		});
	});
	page("/course/:course/blog", function(e) {
		models.Course.getById(e.params.course, function(err, doc) {
			new BlogView(document.querySelector(".course"), {data: doc.posts, id:doc._id});
		});
	});
	page("/course/:course/blog/create", function(e) {
		new CreatePostView(document.querySelector(".course"), {id:e.params.course, model: new models.Post()});
	});
	page("/course/:course/blog/:post", function(e) {
		models.Course.getById(e.params.course, function(err, doc) {
			new PostView(document.querySelector(".course"), {data: doc.posts[e.params.post], id:doc._id});
		});
	});
	page("/course/:course/blog/:post/edit", function(e) {
		console.log("here");
		models.Course.getById(e.params.course, function(err, doc) {
			new CreatePostView(document.querySelector(".course"), {model: doc.posts[e.params.post], id:doc._id});
		});
	});
	page();
};
