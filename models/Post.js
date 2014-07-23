var util = require("util");
var achilles = require("achilles");
var Content = require("./Content");

function Post(type, data) {
	achilles.Model.call(this);

	this.define("title", String);
	this.define("content", Content); 

	this.type = type;
	this.data = data;
}

util.inherits(Post, achilles.Model);

module.exports = Post;
