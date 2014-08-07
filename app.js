var achilles = require("achilles");
var http = require("http");
var hogan = require("hogan.js");
var fs = require("fs");
var serveStatic = require("serve-static");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");

require.extensions[".mustache"] = function(module, filename) {
	var template = hogan.compile(fs.readFileSync(filename).toString());
	module.exports = function(data) {
		return template.render(data);
	};
};

var couchdb = require("achilles-couchdb");
couchdb.User.URL = "http://localhost:5984/_users";

passport.use(new LocalStrategy(function() {
	couchdb.User.Login.apply(couchdb.User, arguments);
}));

passport.serializeUser(function(user, done) {
	done(null, user.toJSON());
});

passport.deserializeUser(function(user, done) {
	console.log(user);
	done(null, user);
});



var server = new achilles.Router();
server.use(serveStatic("./public"));
server.use(bodyParser.urlencoded());
server.use(bodyParser.json());
server.use(cookieParser("fsfsddfs"));
server.use(session({secret:"fsfsddfs"}));
server.use(passport.initialize());
server.use(passport.session());


server.view("/login", require("./views/login.mustache"));

server.post("/login", passport.authenticate("local", {
	successRedirect: "/courses",
	failureRedirect: "/login"
}));

server.use(function(req, res, next) {
	console.log("dsds");
	console.log(req.isAuthenticated());
	if(req.isAuthenticated()) {
		console.log("fsdfsd");
		next();
	} else {
		res.redirect("/login");
	}
});


var Course = require("./models/Course");
var courseService = new achilles.Service(Course);
var homePage = require("./views/home.mustache");

courseService.get("/", function(req, res, next) {
	console.log(req.isAuthenticated());
	Course.findByRef("students", req.user._id, function(err, courses) {
		console.log(courses);
		res.end(homePage({courses:courses}));
	});
//	next();
});

server.use("/courses", courseService);

http.createServer(server.route).listen(5000);
