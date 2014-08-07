var util = require("util");
var couchdb = require("achilles-couchdb");

function Content(type, data) {
	couchdb.Model.call(this);

	this.define("type", String); // "rich", "latex"
	this.define("data", String);

	this.type = type;
	this.data = data;
}

util.inherits(Content, couchdb.Model);

module.exports = Content;
