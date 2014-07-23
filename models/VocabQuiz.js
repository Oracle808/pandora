var util = require("util");
var achilles = require("achilles");

function VocabQuestion(title, answer) {
	this.define("title", String);
	this.define("answer", String);
	
	this.title = title;
	this.answer = answer;
}

util.inherits(VocabQuestion, achilles.Model);

function VocabQuiz(type, data) {
	achilles.Model.call(this);
	this.define("title", String);
	this.define("questions", [VocabQuestion]);
	this.define("randomise_questions", Boolean);
}

util.inherits(VocabQuiz, achilles.Model);

module.exports = VocabQuiz;
