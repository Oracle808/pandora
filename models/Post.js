var util = require("util");
var achilles = require("achilles");
var Content = require("./Content");

function Post() {
	achilles.Model.call(this);

	this.define("title", String);
	this.define("content", Content);
	this.define("date", Date);

	this.content = new Content();
}

util.inherits(Post, achilles.Model);

module.exports = Post;
