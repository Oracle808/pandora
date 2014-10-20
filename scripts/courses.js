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

function CreateView(el, Model) {
	achilles.View.call(this, el);
	this.fields = [];
	this.nova = new Model();
	Object.keys(this.nova._type).forEach(function(key) {
		var type;
		if(this.nova._type[key] === String && key !== "_id") {
			type = "text";
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
	this.data.del(function() {
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
	if(!this.model.container) {
		var y = new models.Course();
		y._id = this.id;
		y.posts = [this.model];
	}
	this.model.save(function(err) {
		if(err) {
			this.error = err;
		}
		page("/course/" + this.id + "/blog");
	}.bind(this));
};

CreatePostView.prototype.templateSync = require("../views/createPost.mustache");

function ListQuizView(el, options) {
	achilles.View.call(this, el, options);
	this.title = options.title;
	this.data = options.data;
	console.log(this.data);
	this.section = options.section;
	this.id = options.id;
}

util.inherits(ListQuizView, achilles.View);

ListQuizView.prototype.templateSync = require("../views/listQuiz.mustache");

function VocabQuestion(el) {
	achilles.View.call(this, document.createElement("tr"));
	this.bind(".question", "question");
	this.bind(".answer", "answer");
	this.on("click .remove", this.remove.bind(this));
}

util.inherits(VocabQuestion, achilles.View);

VocabQuestion.prototype.remove = function(e) {
	e.preventDefault();
	this.model.remove();
};

VocabQuestion.prototype.templateSync = require("../views/vocabQuestion.mustache");

function CreateVocabQuizView(el, options) {
	achilles.View.call(this, el);
	this.id = options.id;
	this.model = options.model;
	this.bind(".title", "title");
	this.on("click .create-question", this.addQuestion.bind(this));
	this.on("click .submit", this.submit.bind(this));

	this.delegate(".questions", "questions", new achilles.Collection(VocabQuestion));
}

util.inherits(CreateVocabQuizView, achilles.View);

CreateVocabQuizView.prototype.addQuestion = function() {
	this.model.questions.push(new models.VocabQuestion());
};

CreateVocabQuizView.prototype.templateSync = require("../views/createVocabQuiz.mustache");

CreateVocabQuizView.prototype.submit = function() {
	console.log(this.model);
	if(!this.model.container) {
		console.log("here");
		var nova = new models.Course();
		nova._id = this.id;
		nova.vocabQuizzes = [this.model];
	}
	this.model.save(function(err) {
		if(err) {
			throw err;
		}
		page("/course/" + this.id + "/vocab_quizzes");
	}.bind(this));
};

function VocabQuiz(el, options) {
	achilles.View.call(this, el);
	this.data = options.data;
	this.id = options.id;
	this.on("keyup input", this.changeInput.bind(this));
	this.on("click .reset", this.reset.bind(this));
	this.on("click .answers", this.revealAnswers.bind(this));
}

util.inherits(VocabQuiz, achilles.View);

VocabQuiz.prototype.templateSync = require("../views/vocabQuiz.mustache");

VocabQuiz.prototype.changeInput = function(e) {
	if(e.target.dataset.answer.toLowerCase().split(",").indexOf(e.target.value.toLowerCase()) !== -1) {
		e.target.classList.add("correct");
		e.target.classList.remove("incorrect");
		e.target.blur();
		if(e.target.nextSibling && e.target.nextSibling.nextSibling) {
			e.target.nextElementSibling.nextElementSibling.focus();
		}
	} else if(e.target.value !== "") {
		e.target.classList.add("incorrect");
		e.target.classList.remove("correct");
	}
};

VocabQuiz.prototype.revealAnswers = function() {
		Array.prototype.slice.call(this.el.querySelectorAll("input")).forEach(function(el) {
			if(!el.classList.contains("correct")) {
				el.classList.add("incorrect");
			}
			el.value = el.dataset.answer;
			el.readOnly = true;
		});
};

VocabQuiz.prototype.reset = function() {
		Array.prototype.slice.call(this.el.querySelectorAll("input")).forEach(function(el) {
			el.value = "";
			el.classList.remove("correct")
			el.classList.remove("incorrect");
			el.readOnly = false;
		});
};

models.Course.connection = new achilles.Connection(window.location.protocol + "//" + window.location.host + "/courses");

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
		models.Course.getById(e.params.course, function(err, doc) {
			var m = new models.Post();
			doc.posts.push(m);
			new CreatePostView(document.querySelector(".course"), {id:e.params.course, model: m});
		});
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
	page("/course/:course/quizzes", function(e) {
		models.Course.getById(e.params.course, function(err, doc) {
			new ListQuizView(document.querySelector(".course"), {data: doc.quizzes, id:doc._id, section:"quizzes", title:"Quizzes"});
		});
	});
	page("/course/:course/vocab_quizzes", function(e) {
		models.Course.getById(e.params.course, function(err, doc) {
			new ListQuizView(document.querySelector(".course"), {data: doc.vocabQuizzes, id:doc._id, section:"vocab_quizzes", title:"Vocabulary Quizzes"});
		});
	});
	page("/course/:course/vocab_quizzes/create", function(e) {
		models.Course.getById(e.params.course, function(err, doc) {
			var m = new models.VocabQuiz();
			doc.vocabQuizzes.push(m);
			new CreateVocabQuizView(document.querySelector(".course"), {id:doc._id, model:m});
		});
	});
	page("/course/:course/vocab_quizzes/:quiz", function(e) {
		models.Course.getById(e.params.course, function(err, doc) {
			new VocabQuiz(document.querySelector(".course"), {id:doc._id, data:doc.vocabQuizzes[e.params.quiz]});
		});
	});
	page("/course/:course/vocab_quizzes/:quiz/edit", function(e) {
		models.Course.getById(e.params.course, function(err, doc) {
			new CreateVocabQuizView(document.querySelector(".course"), {id:doc._id, model:doc.vocabQuizzes[e.params.quiz]});
		});
	});
	page();
};
