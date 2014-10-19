var util = require("util");
var achilles = require("achilles");
var Content = require("./Content");

function QuestionAttempt() {
	achilles.Model.call(this);

	this.define("question", String); // refers to question
	this.define("answer_type", String); // "text", "number", "radio", "checkbox"
	this.define("answer_text", String);
	this.define("answer_number", Number);
	this.define("answer_radio", String);
	this.define("answer_checkbox", [String]);
}

util.inherits(QuestionAttempt, achilles.Model);


function QuizAttempt() {
	achilles.Model.call(this);

	this.ref("user", achilles.User);
	this.define("question", [QuestionAttempt]);
}

util.inherits(QuizAttempt, achilles.Model);

function Question() {
	achilles.Model.call(this);

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
}

util.inherits(Question, achilles.Model);

Question.prototype.delAnswer = function() {
	this.answer_text = null;
	this.answer_number = null;
	this.answer_radio = null;
	this.answer_checkbox = null;

	if(this.answer_type !== "radio" || this.answer_type !== "checkbox") {
		this.options = [];
	}
};

function Quiz() {
	achilles.Model.call(this);

	this.define("questions", [Question]);
	this.define("title", String);
	this.define("randomise_questions", Boolean);
	this.define("attempts", [QuizAttempt]);

	this.questions = [];
}

util.inherits(Quiz, achilles.Model);

module.exports = Quiz;
