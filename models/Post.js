var util = require("util");
var couchdb = require("achilles-couchdb");
var Content = require("./Content");

function Post(type, data) {
	couchdb.Model.call(this);

	this.define("title", String);
	this.define("content", Content); 

	this.type = type;
	this.data = data;
}

util.inherits(Post, couchdb.Model);

module.exports = Post;
