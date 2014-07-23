var util = require("util");
var achilles = require("achilles");
var Post = require("./Post");
var Quiz = require("./Quiz");
var Content = require("./Content");
var VocabQuiz = require("./VocabQuiz");
var User = require("./User");
var types = require("achilles-types");

function Page(title) {
	achilles.Model.call(this);
	this.define("title", String);
	this.define("content", Content);

	this.title = title;
}

function Link(title, url) {
	achilles.Model.call(this);
	this.define("title", String);
	this.define("url", types.URL);

	this.title = title;
	this.url = url;
}

function Course(title) {
	achilles.Model.call(this);

	this.define("title", String); // E.g. "10a/Fr1"
	this.define("posts", [Post]); // I.e. Blog
	this.define("quizzes", [Quiz]);
	this.define("vocabQuizzes", [VocabQuiz]);
	this.define("links", [Link]);
	this.define("pages", [Page]);
	
	this.ref("teachers", [User]); // Subjects can have multiple teachers
	this.ref("students", [User]); 

	this.title = title;
}

util.inherits(Course, achilles.Model);

module.exports = Course;
