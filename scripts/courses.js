var models = require("../models");
var achilles = require("achilles");
var page = require("page");
var util = require("util");

function ListView(el, data) {
	achilles.View.call(this, el);
	this.define("data", [models.Course]);
	this.data = data;
}
console.log(achilles.View);
util.inherits(ListView, achilles.View);

ListView.prototype.templateSync = require("../views/list.mustache");

models.Course.connection = new achilles.Connection("http://localhost:5000/courses");

window.onload = function() {
	page("/", function() {
		console.log("hi");
		models.Course.get(function(err, docs) {
			new ListView(document.querySelector("main"), docs);
		});
	});
	page("/?create", function() {
		console.log("create");
	});
	page();
};
