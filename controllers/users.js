var listUsers = require("../views/users.dust");
var novaUser = require("../views/new_user.dust");
var massUserCreationTemplate = require("../views/mass_user_creation.dust");
var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var User = mongoose.model("User");

exports.list = function(req, res) {
    var query = {};
    var max = req.query.max || 10;
    if(req.query.role) {
		query.role = req.query.role;
    }
    if(req.query.startsWith) {
//		query.username = new RegExp("$" + req.query.startsWith);
    }
	console.log(query);
    User.find(query).limit(max).exec(function(err, docs) {
		if(err) {
			res.error(err);
		} else {
			res.format({
				json: function() {
					console.log(docs);
					res.json(docs);
				},
				html: function() {
					res.render(listUsers, {users:docs});
				}
			});
		}
    });
};

exports.nova = function(req, res) {
	Subject.find({}, function(err, docs) { // Get a list of every single subject
		if(err) {
			res.error(err);
		} else {
			res.render(novaUser, {subjects: docs});
		}
	});
};

exports.post = function(req, res) {
	var newbie = new User({
		username: req.body.username,
		password: req.body.username,
		role: req.body.role
	});
	if(newbie.role === "student") {
		newbie.subjects = req.body.subjects;
	}
	newbie.save(function(err) {
		if(err) {
			res.error(err);
		} else if(req.body.role === "teacher") {
			Subject.find({_id: {$in: req.body.subjects}}).update({$push: {teacher: newbie._id}}).exec(function(err) {
				if(err) {
					res.error(err);
				} else {
					exports.list(req, res);
				}
			});
		} else {
			exports.list(req, res);
		}
	});
};

// Mass user creation form
exports.massUserCreation = function(req, res) {
    Subject.find({}, function(err, docs) {
		if(err) {
			res.error(err);
		} else {
			res.render(massUserCreationTemplate, {subjects: docs});
		}
    });
};

// Mass user creation submit
module.exports.postMassUserCreation = function(req, res) {
    if(req.body.username && req.body.dofb) {
		var docs = [];
		for(var i = 0; (i < req.body.username.length) && (i < req.body.dofb.length); i++) {
			var date = req.body.dofb[i].split("-");

			docs.push({
				username: req.body.username[i],
				role: "student",
				password: date[2] + date[1] + date[0].slice(2),
				subjects: req.body.subjects
			});
		}
		User.create(docs, function(err) {
			if(err) {
				res.error(err);
			}
		});
    }
    res.end();
};

exports.del = function(req, res) {
	User.findByIdAndRemove(req.param("user"), function(err, doc) {
		if(err) {
			res.error(err);
		} else {
			if(doc.role === "teacher") {
				Subject.find({teacher: {$in: [doc._id]}}).update({$pull: {teacher: doc._id}}).exec(function(err) {
					if(err) {
						res.error(err);
					} else {
						exports.list(req, res);
					}
				});
			} else {
				exports.list(req, res);
			}
		}
	});
};
