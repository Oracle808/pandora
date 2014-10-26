var util = require("util");
var achilles = require("achilles");
var Content = require("./Content");

function QuestionAttempt() {
	achilles.Model.call(this);

	this.define("question", Content); // refers to question
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

var Question = require("./Question");

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
