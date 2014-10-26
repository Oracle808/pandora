var achilles = require("achilles");
var util = require("util");
var Content = require("./Content");
var Option = require("./Option");

function Question() {
  achilles.Model.call(this);

  this.define("content", Content);
  this.define("answer_type", String); // "text", "number", "radio", "checkbox"
  this.define("answer_text", String);
  this.define("answer_number", Number);
  this.define("options", [Option]);
  this.options = [];

  Object.defineProperty(this, "number", {
    get: function() {
      return this.index + 1;
    }
  });

  Object.defineProperty(this, "isNumber", {
    get: function() {
      return this.answer_type === "number";
    }
  });

  Object.defineProperty(this, "isText", {
    get: function() {
      return this.answer_type === "text";
    }
  });

  Object.defineProperty(this, "isRadio", {
    get: function() {
      return this.answer_type === "radio";
    }
  });

  Object.defineProperty(this, "isCheckbox", {
    get: function() {
      return this.answer_type === "checkbox";
    }
  });

  this.answer_type = "text";
  this.content = new Content();
  this.on("change:answer_type", this.delAnswer.bind(this));
}

util.inherits(Question, achilles.Model);

Question.prototype.delAnswer = function() {
  this.answer_text = null;
  this.answer_number = null;

  if(this.answer_type !== "radio" || this.answer_type !== "checkbox") {
    this.options = [];
  }
};

module.exports = Question;
