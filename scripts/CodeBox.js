var achilles = require("achilles");
var util = require("util");

var saveSelection, restoreSelection;

if (window.getSelection && document.createRange) {
    saveSelection = function(containerEl) {
		var range = window.getSelection().getRangeAt(0);
		var preSelectionRange = range.cloneRange();
		preSelectionRange.selectNodeContents(containerEl);
		preSelectionRange.setEnd(range.startContainer, range.startOffset);
		var start = preSelectionRange.toString().length;

		return {
			start: start,
			end: start + range.toString().length
		};
    };

    restoreSelection = function(containerEl, savedSel) {
		var charIndex = 0, range = document.createRange();
		range.setStart(containerEl, 0);
		range.collapse(true);
		var nodeStack = [containerEl], node, foundStart = false, stop = false;

		while (!stop && (node = nodeStack.pop())) {
			if (node.nodeType === 3) {
				var nextCharIndex = charIndex + node.length;
				if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
					range.setStart(node, savedSel.start - charIndex);
					foundStart = true;
				}
				if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
					range.setEnd(node, savedSel.end - charIndex);
					stop = true;
				}
				charIndex = nextCharIndex;
			} else {
				var i = node.childNodes.length;
				while (i--) {
					nodeStack.push(node.childNodes[i]);
				}
			}
		}

		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
    };
} else if (document.selection) {
    saveSelection = function(containerEl) {
		var selectedTextRange = document.selection.createRange();
		var preSelectionTextRange = document.body.createTextRange();
		preSelectionTextRange.moveToElementText(containerEl);
		preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
		var start = preSelectionTextRange.text.length;

		return {
			start: start,
			end: start + selectedTextRange.text.length
		};
    };

    restoreSelection = function(containerEl, savedSel) {
		var textRange = document.body.createTextRange();
		textRange.moveToElementText(containerEl);
		textRange.collapse(true);
		textRange.moveEnd("character", savedSel.end);
		textRange.moveStart("character", savedSel.start);
		textRange.select();
    };
}

/*
  CodeBox is a Backbone.Controller for any element which contiains code be it a <p>, or <code> or, <div>.
  It even works with text editors such as <div contenteditable="true">.
*/

var CodeBox = function(mode, value) {
	achilles.View.call(this);
	this.define("value", String);

	this.value = value || "";
	this.mode = mode;

	this.on("keyup", this.update.bind(this));
	this.on("keydown", this.indent.bind(this));
	this.on("change:value", this.render.bind(this));

	this.on("change:el", this.disableSpellcheck.bind(this));
	console.log(this.value);
	
	this.on("change:el", function() {
		console.log(this.el);
	});
};

util.inherits(CodeBox, achilles.View);

CodeBox.prototype.className = "codebox";

CodeBox.prototype.indent = function(e) {
	console.log("wow");
	if(e.keyCode === 9) { // Checks whether tab was pressed
		document.execCommand("indent");
		e.preventDefault();
	}
};

CodeBox.prototype.update = function(e) {
	console.log("hello");
	if(e.keyCode !== 13) {
		var data = this.el.innerHTML.replace(/<\/div>(?!$)/g, "\n");
		data = data.replace(/<\/?[^>]+(>|$)/g, "");
		console.log(data);
		this.value = data;
		console.log("hi");
	}
};

CodeBox.prototype.template = function(context, cb) {
	var d;
	if(this.el === document.activeElement) {
		d = saveSelection(this.el);
	}
	var data = this.value;

	["keyword", "string", "parameter", "comment"].forEach(function(token) {
		if(this.mode[token]) {
			this.mode[token].forEach(function(regex) {
				regex = new RegExp("(" + regex.source + ")" + /(?![^<>]*>)/.source, "g"); // This ensures text inside tags isn't matches
				data =  data.replace(regex, function(match) {
					return "<span class=\"" + token + "\">" + match + "</span>";
				});
			});
		}
	}.bind(this));

	data = data.replace(/\n/g, "</div><div>");
	data = data.replace(/\t/g + "     ");
	data = "<div>" + data + "</div>";
	data = data.replace(/<div><\/div>/g, "<div><br></div>");

	cb(null, data);
	if(this.el === document.activeElement) {
		restoreSelection(this.el, d);
	}
};

CodeBox.prototype.disableSpellcheck = function() {
	this.el.spellcheck = false;
};

CodeBox.Modes = {};

CodeBox.Modes.JavaScript = {
	string: [/"([a-zA-Z0-9]|\s|\}|\{|\(|\)|\s)*(")?/g, /'([^\\'\n]|\\.)*/g],
	keyword: [/\b(class)/g, /\b(function)/g, /\b(var)/g, /\b(new)/g],
	comment: [/\/\/.*$/g]
};

CodeBox.Modes.LaTeX = {
	string: [/\\[a-zA-Z]+/g],
	parameter: [/\\[a-zA-Z]+\{([a-zA-Z]+)\}/g]
};

module.exports = CodeBox;
