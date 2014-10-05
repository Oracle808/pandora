var models = require("../models");
var achilles = require("achilles");
var page = require("page");
var util = require("util");

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
	page();
};
