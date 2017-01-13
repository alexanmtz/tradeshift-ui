/**
 * Spirit of the API table.
 * @using {gui.Type} Type
 * @using {gui.Object} GuiObject
 * @using {ts.ui.Markdown} Markdown
 */
ts.dox.ApiTableSpirit = (function using(Type, GuiObject, GuiArray, Markdown) {
	/**
	 * Parse strings for markdown content and
	 * support at least the `code` syntax....
	 */
	function minimalmarkdown(object) {
		GuiObject.each(object, function(key, value) {
			return parsemarkdown(object, key, value);
		}).forEach(function(nestedobject) {
			minimalmarkdown(nestedobject);
		});
		return object;
	}

	/**
	 * Fix markdown and return any complex objects
	 * so that we can fix those recursively 4 ever.
	 */
	function parsemarkdown(object, key, value) {
		var code = /`(.*)`/g;
		if (Type.isComplex(value)) {
			return value;
		} else {
			if (key === 'desc') {
				object[key] = Markdown.parse(value);
			} else if (Type.isString(value)) {
				object[key] = value.replace(code, '<code>$1</code>');
			}
		}
	}

	return ts.ui.Spirit.extend({

		/**
		 * This gets converted from inline script to some kind of attribute by the
		 * Grunt task called "processor.js" because another subtask, the beautifier,
		 * would destroy formatting of the JSON string. What's more, the string will
		 * be autoconverted to an object because {gui.ConfigPlugin} can see that
		 * the string looks like encoded JSON.
		 * @type {object}
		 */
		code: null,

		/**
		 * Load the script.
		 */
		onconfigure: function() {
			this.super.onconfigure();
			if (this.code) {
				this.script.load(ts.dox.ApiTableSpirit.edbml);
				this.script.run(minimalmarkdown(this.code));
			}
		}

	});
}(gui.Type, gui.Object, gui.Array, ts.ui.Markdown));
