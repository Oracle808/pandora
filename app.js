var achilles = require("achilles");
var mongodb = require("achilles-mongodb");
var express = require("express");
var hogan = require("hogan.js");
var fs = require("fs");
var serveStatic = require("serve-static");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var models = require("./models");
var browserify = require("browserify-middleware");

require.extensions[".mustache"] = function(module, filename) {
	var template = hogan.compile(fs.readFileSync(filename).toString());
	module.exports = function(data) {
		return template.render(data);
	};
};

var mongodb = require("achilles-mongodb");

var secrets = require("./config/secrets");

achilles.User.connection
= models.Course.connection
= new mongodb.Connection(secrets.db);

var app = new express();

app.use(serveStatic("./public", {
	extensions: ["html"]
}));
app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(bodyParser.json());
app.use(cookieParser("fsfds"));
app.use(session({
 cookie : {
    maxAge: 3600000 // see below
  }
}));
app.use("/scripts", browserify("./scripts", {
	transform:["browserify-mustache"]
}));

app.post("/login", function(req, res, cb) {
	achilles.User.login(req.body.username, req.body.password, function(err, user) {
		if(err) {
			return cb(err);
		} else if(!user) {
			res.redirect("/login");
		} else {
			req.session.user = user.toJSON();
			res.redirect("/");
		}
	});
});

app.all("*", function(req, res, cb) {
	if(req.session.user) {
		cb();
	} else {
		res.redirect("/login");
	}

});

var courses = require("./views/courses.mustache");

app.get("/", function(req, res, cb) {
	if(!req.xhr) {
		res.end(courses());
	} else {
		cb();
	}
});

app.use("/courses", new achilles.Service(models.Course));

app.set("port", process.env.PORT || 5000);

app.listen(app.get("port"), function () {
	console.log("Pandora listening at port" + app.get("port"));
});
