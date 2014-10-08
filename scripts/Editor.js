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
	this.model = new Content(EditorModes.RichText, value || "");
	this.rich = true;
	this.openEditor = true;

	// Event Declerations
	this.on("click .editor-toolbar button", this.updateFormat.bind(this)); // Formatting
	this.on("change .font-control", this.updateFont.bind(this)); // Font
	this.on("click .editor-rich", this.reconfigure.bind(this)); // Reconfigure Editor Rich
	this.on("keydown .editor-rich", this.reconfigure.bind(this)); // Reconfigure Editor Rich
	this.on("click .open-tab", this.openTab.bind(this)); // Open Tasb
	this.on("change:el", this.render.bind(this));

	this.on("render", (function() {
		console.log(this.el);
	}).bind(this));

	this.bind(".editor-rich", "data");
	this.bind(".editor-mode", "type");
	this.delegate(".editor-latex", "data", new CodeBox(CodeBox.Modes.LaTeX));
};

util.inherits(EditorController, achilles.View);

EditorController.prototype.templateSync = require("../views/editor.mustache");

EditorController.prototype.updateFont = function(e) {
	document.execCommand("fontName", false, e.target.value);
};

EditorController.prototype.updateFormat = function(e) {
	document.execCommand(e.target.value);
	e.target.classList.toggle("active");
	e.preventDefault();
};

EditorController.prototype.subviews = function() {
	if(this.open_tab === "preview" && this.model.type === EditorModes.RichTextEditor) {
		MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.el.querySelector(".preview")]);
	}
};

EditorController.prototype.reconfigure = function() {
	["bold", "underline", "italic", "insertOrderedList", "insertUnorderedList"].forEach((function(option) {
		if(document.queryCommandState(option)) {
			this.find("[value=\"" + option + "\"]").addClass("active");
		} else {
			this.find("[value=\"" + option + "\"]").removeClass("active");
		}
	}).bind(this));
};

EditorController.prototype.openTab = function(e) {
	this.open_tab = e.target.value;
};

module.exports = EditorController;
