var util = require("util");
var achilles = require("achilles");

function Content(type, data) {
	achilles.Model.call(this);

	this.define("type", String); // "rich", "latex"
	this.define("data", String);

	this.type = type || "rich-text-editor";
	this.data = data;
}

util.inherits(Content, achilles.Model);

module.exports = Content;
