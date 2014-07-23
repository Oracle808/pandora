var util = require("util");
var achilles = require("achilles");
var Content = require("./Content");

function Question() {
	achilles.Object.call(this);

	this.define("content", Content);
	this.define("answer_type", String); // "text", "number", "radio", "checkbox"
	this.define("answer", String);
	this.define("options", [String]);
	this.options = [];

	this.answer_type = "text";
	this.on("change:answer_type", this.redefineAnswer.bind(this));
};

Question.prototype.redefineAnswer = function() {
	if(this.answer_type === "number") {
		this.define("answer", Number);
	} else if(this.answer_type === "checkbox") {
		this.define("answer", [String]);
	} else if(this.answer_type === "text" || this.answer_type === "radio") {
		this.define("answer", String);
	}

	if(this.answer_type !== "radio") {
		this.options = [];
	}
};

util.inherits(Question, achilles.Model);

function Quiz() {
	achilles.Object.call(this);
	
	this.define("questions", [Question]);
	this.define("title", String);
	this.define("randomise_questions", Boolean);

	this.questions = [];
}

util.inherits(Quiz, achilles.Model);

module.exports = Quiz;
