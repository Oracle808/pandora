var achilles = require("achilles");
var mongodb = require("achilles-mongodb");

achilles.User.connection = new mongodb.Connection(process.env.MONGOLAB_URI || "mongodb://localhost:27017/pandora");

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

