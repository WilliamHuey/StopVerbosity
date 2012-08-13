(function ($) {
	$.fn.truncate = function (options) {
		var defaults = {
			limit: 140,
			indicator: 'characters_remaining'
		};
		var options = $.extend(defaults, options);
		return this.each(function () {
			//get the tag off the element
			var tag = $(this).get(0).tagName.toLowerCase();
			//get the id or class from the element
			function getIdOrClass(element) {
				function determineClassOrId(attrId) {
					element_id = element.attr(attrId);
					elementVariation.push(element_id);
					element_id = '[' + attrId + '=' + element_id;
					elementVariation.push(element_id);
				}
				var attrId = "id";
				var attrClass = "class";
				//use the id if both the class and id are present or if id is only present
				var elementVariation = []
				var idPresent = typeof (element.attr("id")) != "undefined";
				var classPresent = typeof (element.attr("class")) != "undefined";
				if (classPresent && idPresent || idPresent) {
					determineClassOrId(attrId);
					var attrType = attrId;
				} else {
					//getting the class name
					if (typeof (element.attr(attrClass)) != "undefined") {
						determineClassOrId(attrClass);
						var attrType = attrClass;
					}
				}
				elementVariation.push(attrType);
				return elementVariation;
			}
			//clear out the textarea after a refresh of the page
			$(this).val('');
			var textarea_id = getIdOrClass($(this));
			var options_limit = options.limit;
			var indicator = options.indicator;
			//insert the indicator under the textarea
			$("textarea[" + textarea_id[2] + "=" + textarea_id[0] + "]").after("<p id=" + indicator + ">" + options_limit + " characters left.</p>");
			//selection detect		
			var fieldSelection = {
				getSelection: function () {
					var e = (this.jquery) ? this[0] : this;
					return ( /* mozilla / dom 3.0 */ ('selectionStart' in e && function () {
						var l = e.selectionEnd - e.selectionStart;
						return {
							start: e.selectionStart,
							end: e.selectionEnd,
							length: l,
							text: e.value.substr(e.selectionStart, l)
						};
					}) || /* exploder */ (document.selection && function () {
						e.focus();
						var r = document.selection.createRange();
						if (r === null) {
							return {
								start: 0,
								end: e.value.length,
								length: 0
							}
						}
						var re = e.createTextRange();
						var rc = re.duplicate();
						re.moveToBookmark(r.getBookmark());
						rc.setEndPoint('EndToStart', re);
						return {
							start: rc.text.length,
							end: rc.text.length + r.text.length,
							length: r.text.length,
							text: r.text
						};
					}) || /* browser not supported */
					function () {
						return null;
					})();
				}
			};
			jQuery.each(fieldSelection, function (i) {
				jQuery.fn[i] = this;
			});
			var limit = options_limit;
			function textAreaLength() {
				var user_text_count = $(textarea_id[1] + "]").val().length;
				if (limit - user_text_count <= 1) {
					var determineCharacters = "character";
				} else {
					determineCharacters = "characters";
				}
				$("p[id=" + indicator + "]").html(limit - user_text_count + " " + determineCharacters + " left.");
			}
			function textCleanup() {
				setTimeout(function () {
					if ($(textarea_id[1] + "]").val().length > limit) {
						trimmed = $(textarea_id[1] + "]").val().substr(0, limit);
						$(textarea_id[1] + "]").val(trimmed);
					}
				}, 10);
				setTimeout(function () {
					textAreaLength();
				}, 20);
			}
			function keyDetect(element, event) {
				if ($(textarea_id[1] + "]").getSelection().text == "" && $(textarea_id[1] + "]").val().length >= limit) {
					//textarea is full; no more ctrl v
					if ((event.which === 86 || event.which == 118) && event.ctrlKey) {
						event.preventDefault();
					} else {
						//preserve some keys after textarea is full; f5, arrows, backspace
						if (event.which == 116 || event.which == 0 || event.which == 33 || event.which == 34 || event.which == 35 || event.which == 36 || event.which == 37 || event.which == 38 || event.which == 39 || event.which == 40 || event.which == 8) {
							event
						} else {
							//single key presses are forbidden when textarea is full
							if ((event.ctrlKey) == false) {
								event.preventDefault();
							}
						}
					}
				}
				textCleanup();
			}
			//For all browsers but is needed for detecting Opera's context menu paste; does not prevent pasting when limit is reached when text is selected or not. Only in other browsers is it different.
			$(textarea_id[1] + "]").bind('input propertychange', function (event) {
				keyDetect(textarea_id[1], event);
			})
			//Keypress is used for Opera; ok for Firefox too
			//pasting is allowed when text was previously selected							
			$(textarea_id[1] + "]").bind("keypress keydown", function (event) {
				keyDetect(textarea_id[1], event);
			})
			//For IE, Chrome, and Firefox
			$(textarea_id[1] + "]").on('paste', function (event) {
				if ($(textarea_id[1] + "]").getSelection().text == "" && $(textarea_id[1] + "]").val().length >= limit) {
					event.preventDefault();
				}
				textCleanup();
			});
		});
	};
})(jQuery);