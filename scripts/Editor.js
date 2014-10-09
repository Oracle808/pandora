var achilles = require("achilles");
var util = require("util");
var CodeBox = require("./codebox");
var Content = require("../models/Content");

var EditorModes = {};
EditorModes.RichText = "rich-text-editor";
EditorModes.LaTeX = "latex";

var EditorController = function(el, value) {
	achilles.View.call(this, el);

	// Property Declerations
	this.define("model", Content);
	this.define("open_tab", String); //"preview", "editor"
	this.open_tab = "editor";

	// Event Declerations
	this.on("click .editor-formatting button", this.updateFormat.bind(this)); // Formatting
	this.on("change .font-control", this.updateFont.bind(this)); // Font
	this.on("click .editor-rich", this.reconfigure.bind(this)); // Reconfigure Editor Rich
	this.on("keydown .editor-rich", this.reconfigure.bind(this)); // Reconfigure Editor Rich
	this.on("click .open-tab", this.openTab.bind(this)); // Open Tab
	this.on("change:model", this.setupModel.bind(this));

	this.on("render", (function() {
		console.log(this.el);
	}).bind(this));

	this.bind(".editor-rich", "data");
	this.bind(".editor-mode", "type");
	this.delegate(".editor-latex", "data", new CodeBox(CodeBox.Modes.LaTeX));
	console.log(el);
};

util.inherits(EditorController, achilles.View);

EditorController.prototype.templateSync = require("../views/editor.mustache");

EditorController.prototype.setupModel = function() {
	this.model.on("change:type", this.render.bind(this));
};

EditorController.prototype.render = function() {
	this.editorOpen = this.open_tab === "editor";
	if(this.model) {
		this.rich = this.model.type === "rich-text-editor";
	}
	achilles.View.prototype.render.call(this);
	if(this.open_tab === "preview" && this.model.type === EditorModes.LaTeX) {
		MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.el.querySelector(".preview")]);
	}
};

EditorController.prototype.updateFont = function(e) {
	document.execCommand("fontName", false, e.target.value);
};

EditorController.prototype.updateFormat = function(e) {
	document.execCommand(e.target.value);
	e.target.classList.toggle("active");
	e.preventDefault();
};

EditorController.prototype.reconfigure = function() {
	["bold", "underline", "italic", "insertOrderedList", "insertUnorderedList"].forEach((function(option) {
		if(document.queryCommandState(option)) {
			this.el.querySelector("[value=\"" + option + "\"]").classList.add("active");
		} else {
			this.el.querySelector("[value=\"" + option + "\"]").classList.remove("active");
		}
	}).bind(this));
};

EditorController.prototype.openTab = function(e) {
	this.open_tab = e.target.value;
	this.render();
};

module.exports = EditorController;
