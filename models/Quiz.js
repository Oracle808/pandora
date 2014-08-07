var util = require("util");
var couchdb = require("achilles-couchdb");
var Content = require("./Content");

function Question() {
	couchdb.Model.call(this);

	this.define("content", Content);
	this.define("answer_type", String); // "text", "number", "radio", "checkbox"
	this.define("answer_text", String);
	this.define("answer_number", Number);
	this.define("answer_radio", String);
	this.define("answer_checkbox", [String]);
	this.define("options", [String]);
	this.options = [];

	this.answer_type = "text";
	this.on("change:answer_type", this.delAnswer.bind(this));
};

Question.prototype.delAnswer = function() {
	this.answer_text = null;
	this.answer_number = null;
	this.answer_radio = null;
	this.answer_checkbox = null;

	if(this.answer_type !== "radio" || this.answer_type !== "checkbox") {
		this.options = [];
	}
};

util.inherits(Question, couchdb.Model);

function Quiz() {
	couchdb.Model.call(this);
	
	this.define("questions", [Question]);
	this.define("title", String);
	this.define("randomise_questions", Boolean);

	this.questions = [];
}

util.inherits(Quiz, couchdb.Model);

module.exports = Quiz;
