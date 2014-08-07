var util = require("util");
var couchdb = require("achilles-couchdb");
var Post = require("./Post");
var Quiz = require("./Quiz");
var Content = require("./Content");
var VocabQuiz = require("./VocabQuiz");

function Page(title) {
	couchdb.Model.call(this);
	this.define("title", String);
	this.define("content", Content);

	this.title = title;
}

util.inherits(Page, couchdb.Model);

function Link(title, url) {
	couchdb.Model.call(this);
	this.define("title", String);
	this.define("url", String);

	this.title = title;
	this.url = url;
}

util.inherits(Link, couchdb.Model);

function Course(title) {
	couchdb.Model.call(this);

	this.define("title", String); // E.g. "10a/Fr1"
	this.define("posts", [Post]); // I.e. Blog
	this.define("quizzes", [Quiz]);
	this.define("vocabQuizzes", [VocabQuiz]);
	this.define("links", [Link]);
	this.define("pages", [Page]);
	
	this.ref("teachers", [couchdb.User]); // Subjects can have multiple teachers
	this.ref("students", [couchdb.User]); 

	this.title = title;
}

Course.URL = "http://localhost:5984/courses";

util.inherits(Course, couchdb.Model);

module.exports = Course;
