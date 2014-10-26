var models = {};

models.Content = require("./Content");
models.Post = require("./Post");
models.Question = require("./Question");
models.Quiz = require("./Quiz");
models.VocabQuiz = require("./VocabQuiz").VocabQuiz;
models.VocabQuestion = require("./VocabQuiz").VocabQuestion;
models.Course = require("./Course");
models.Club = require("./Club");
models.Option = require("./Option");

module.exports = models;
