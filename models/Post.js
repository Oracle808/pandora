var util = require("util");
var achilles = require("achilles");
var Content = require("./Content");

function Post(title, content) {
	achilles.Model.call(this);

	this.define("title", String);
	this.define("content", Content); 
	
	this.content = new Content();

	Object.defineProperty(this, "index", {
		get: function() {
			console.log(this.container);
			console.log(this);
			return this.container.indexOf(this);
		}
	});
}

util.inherits(Post, achilles.Model);

module.exports = Post;
