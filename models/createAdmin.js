var achilles = require("achilles");
var mongodb = require("achilles-mongodb");
var secrets = require("./config/secrets");

achilles.User.connection = new mongodb.Connection(secrets.db);

var admin = new achilles.User();
admin.name = "Admin";
admin.password = "Admin";
admin.roles = ["admin"];
admin.save(function(err) {
	if(err) { 
		throw err;
	}
	achilles.User.connection.close();
});

