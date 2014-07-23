var util = require("util");
var achilles = require("achilles");
var types = require("achilles-types");

function User(username, password) {
	achilles.Model.call(this);

	this.define("username", String); // "10PunchihewaH"
	this.define("password", types.Password); // types.Password automatically encrypts passwords
}

util.inherits(Content, achilles.Model);

module.exports = Content;
