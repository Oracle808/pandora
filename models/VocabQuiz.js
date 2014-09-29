var util = require("util");
var achilles = require("achilles");

function VocabQuestion(title, answer) {
	achilles.Model.call(this);
	this.define("title", String);
	this.define("answer", String);
	
	this.title = title;
	this.answer = answer;
}

util.inherits(VocabQuestion, achilles.Model);

<<<<<<< HEAD
function VocabQuiz() {
	couchdb.Model.call(this);
=======
function VocabQuiz(type, data) {
	achilles.Model.call(this);
>>>>>>> 5d2c5dda9fa853da9ef300d9c830a1ba429bcee3
	this.define("title", String);
	this.define("questions", [VocabQuestion]);
	this.define("randomise_questions", Boolean);
}

util.inherits(VocabQuiz, achilles.Model);

module.exports = VocabQuiz;
