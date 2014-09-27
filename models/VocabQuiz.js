var util = require("util");
var couchdb = require("achilles-couchdb");

function VocabQuestion(title, answer) {
	couchdb.Model.call(this);
	this.define("title", String);
	this.define("answer", String);
	
	this.title = title;
	this.answer = answer;
}

util.inherits(VocabQuestion, couchdb.Model);

function VocabQuiz() {
	couchdb.Model.call(this);
	this.define("title", String);
	this.define("questions", [VocabQuestion]);
	this.define("randomise_questions", Boolean);
}

util.inherits(VocabQuiz, couchdb.Model);

module.exports = VocabQuiz;
