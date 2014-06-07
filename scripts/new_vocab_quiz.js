var Backbone = require("./backbone");
var questionTemplate = require("../views/vocab_question.dust");
var NewVocabQuizController = Backbone.Controller.extend({
    events: {
		"click .add-question": "addQuestion"
    },

    addQuestion: function(e) {
		questionTemplate((function(err, html) {
			this.$el.find("#questions").append(html);
		}).bind(this));
		e.preventDefault();
    }
});

$(document).ready(function() {
    NewVocabQuizController.create({
		el: $("main")
    });
});
