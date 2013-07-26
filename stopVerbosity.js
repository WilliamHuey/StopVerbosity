/*
 *  Project: Restrict Textarea
 *  Description: Limits and counts the characters in a textarea.
 *  Author: William Huey
 *  License: MIT
 *  Version: 1.11
 *
 *  Credits:
 *  Tim Down (getInputSelection, setInputSelection)
 *    http://stackoverflow.com/questions/3549250/highlighting-a-piece-of-string-in-a-textarea
 *  Ben Alpert(isInputSupported)
 *
 *  Todo:
 *  Add Ie9 support for proper detection of deletion of text.
 *  Indicator phrase with multiple repeated variables (multiple indexOf)
 *  Slow indicator down on update
 */

;(function ($, window, document, undefined) {
  'use strict';
  //defaults options
  var pluginName = "stopVerbosity",
    defaults = {
      limit: 300,
      indicatorPosition: 'after',
      indicatorId: 'countdown-indicator',
      indicatorElementType: 'p',
      indicatorPhrase: ['Used', '[countup]', 'of', '[limit]', 'characters.',
        '[countdown]', 'characters remaining.'
      ],
      customIndicator: '',
      generateIndicator: true,
      showIndicator: true
    };
  //initializing main Plugin with options

  function Plugin(element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }
  Plugin.prototype = {
    init: function () {
      var plugProto = Plugin.prototype,
        options = this.options,
        $el = $(this.element),
        limit = options.limit;
      //setupActions is the initialization process
      //e.g., checks for options input, inserts indicator (counter)
      //also add event listeners to the element
      var setupActionData = plugProto.setupActions().init($el, options);
      plugProto.eventsActions($el).init(limit, setupActionData);
    },
    setupActions: function () {
      //the initialization object for the Plugin object
      var Setup = function () {};
      Setup.prototype = {
        init: function ($el, options) {
          //polyfill indexOf, for ie
          if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
              if (this == null) {
                throw new TypeError();
              }
              var t = Object(this);
              var len = t.length >>> 0;
              if (len === 0) {
                return -1;
              }
              var n = 0;
              if (arguments.length > 1) {
                n = Number(arguments[1]);
                if (n != n) { // shortcut for verifying if it's NaN
                  n = 0;
                } else if (n != 0 && n != Infinity && n != -Infinity) {
                  n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
              }
              if (n >= len) {
                return -1;
              }
              var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
              for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                  return k;
                }
              }
              return -1;
            };
          }
          //clear out the textarea upon refresh
          $el.val('');
          //expose options to prototype
          var limit = options.limit,
            indicatorPosition = options.indicatorPosition,
            indicatorId = options.indicatorId,
            indicatorElementType = options.indicatorElementType,
            indicatorPhrase = options.indicatorPhrase,
            customIndicator = options.customIndicator,
            generateIndicator = options.generateIndicator,
            showIndicator = options.showIndicator;
          //quick reference for the plugin prototype
          var setupProto = Setup.prototype;
          //check character limit value in textarea
          setupProto.checkLimitOption(limit);
          //check for clearing of text in textarea
          //setupProto.clearOnRefresh(clearOnRefresh, $el);
          //insert the indicator (character counter) near textarea
          setupProto.setIndicator(limit, indicatorElementType,
            indicatorId, indicatorPosition, indicatorPhrase, $el,
            customIndicator, generateIndicator, showIndicator);
          //after initializing, return phrase info
          return setupProto.setupDataStore;
        },
        checkLimitOption: function (limit) {
          //check the supply word limit
          if (typeof limit !== 'number') {
            throw 'Text limit is not a number.';
          }
        },
        setIndicator: function (limit, indicatorElementType,
          indicatorId, indicatorPosition, indicatorPhrase, $el,
          customIndicator, generateIndicator, showIndicator) {
          //only use an indicator when set to true
          if (!showIndicator) {
            return;
          }
          //get the this reference
          var _this = this;
          //search for variables, strVar, that are defined in the indicator phrase

          function isFound(key, strVar, indicatorPhrase, context) {
            var strVarIndex = indicatorPhrase.indexOf(strVar);
            //set info in datastore for events later
            if (strVarIndex > -1) {
              context.setupDataStore[key].push(strVarIndex);
            }
          }
          isFound('limit', '[limit]', indicatorPhrase, _this);
          isFound('countup', '[countup]', indicatorPhrase, _this);
          isFound('countdown', '[countdown]', indicatorPhrase, _this);
          //set the value of the limit for phrase
          indicatorPhrase[this.setupDataStore.limit] = limit;
          indicatorPhrase[this.setupDataStore.countup] = 0;
          indicatorPhrase[this.setupDataStore.countdown] = limit;
          //also get a copy of the original phrase array
          this.setupDataStore.indicatorPhrase = indicatorPhrase;
          //use an element that is already on the page
          if (Object.prototype.toString.call(customIndicator) === "[object String]") {
            {
              try {
                var $customIndicator = $(customIndicator);
                if ($customIndicator.length) {
                  this.setupDataStore.indicatorElement = $customIndicator;
                  $customIndicator.html(indicatorPhrase.join(' '));
                  generateIndicator = false;
                }
              } catch (error) {
                throw 'Indicator element not found.';
              }
            }
          }
          //generate the indicator if no default element is given
          if (generateIndicator) {
            //check if id is given
            var id;
            if (indicatorId.length > 0) {
              id = ' id=' + indicatorId;
            } else {
              id = '';
            }
            //insert the indicator
            var indicatorElement = [
              '<', indicatorElementType, id, '>',
              indicatorPhrase.join(' '), '</', indicatorElementType, '>'
            ].join(''),
              indicatorError = [
                'Not a valid position for indicator,', 'only accepts ',
                "'before'", ' or ', "'after'"
              ].join('');
            //specify the ordering of the indicator
            if (indicatorPosition === 'after') {
              $el.after(indicatorElement);
              this.setupDataStore.indicatorElement = $el.next();
            } else if (indicatorPosition === 'before') {
              $el.before(indicatorElement);
              this.setupDataStore.indicatorElement = $el.prev();
            } else {
              throw indicatorError;
            }
          }
        },
        setupDataStore: {
          limit: [],
          countup: [],
          countdown: []
        }
      };
      return Setup.prototype;
    },
    eventsActions: function ($el) {
      //the events object for the Plugin object
      var Events = function () {},
        ep = Events.prototype = {
          init: function (limit, setupActionData) {
            //reference the Events prototype
            //var ep = Events.prototype;
            //add event listeners to the textarea
            ep.addListeners(limit, setupActionData);
          },
          addListeners: function (limit, setupActionData) {
            //alias the dataStore;
            var ds = this.dataStore;
            //set commonly accessed items in the datastore
            ds.eP = ep;
            ds.el = $el;
            ds.limit = limit;
            ds.indicator = setupActionData;
            var input = {
              preventFunction: function () {
                //see if keydown prevent is already used
                var keyPrevent = ep.dataStore.eventPrevent.indexOf('keydown');
                //if no keyprevent present
                if (keyPrevent === -1) {
                  //track the prevented events and removed events
                  ep.setDataStore('eventPrevent', 'keydown');
                  ep.removeDataStore('eventPresent', 'keydown');
                  //remove the keydown listener
                  $el.off('keydown');
                  //prevent default on certain keypresses
                  ep.keydownFunction.keydownPrevent();
                  //prevent pasting
                  ep.pastePreventFunction($el, ep);
                }
              },
              allowFunction: function () {
                //see if keydown prevent is already used
                var keyPrevent = ep.dataStore.eventPrevent.indexOf('keydown');
                if (keyPrevent > -1) {
                  //track the prevented events and removed events
                  ep.removeDataStore('eventPrevent', 'keydown');
                  ep.setDataStore('eventPresent', 'keydown');
                  //remove the event prevent on keydown
                  //and prevent paste function
                  $el.off('keydown')
                    .off('paste');
                  //restore the original keydown
                  ep.keydownFunction($el, ep);
                }
              },
              changeText: function (countType) {
                var indicator = ep.dataStore.indicator,
                  countDirection = indicator[countType];
                if (typeof countDirection !== 'undefined') {
                  if (countDirection.length) {
                    var textAmount = null;
                    //the difference of characters for the countdown
                    if (countType === 'countdown') {
                      textAmount = limit - ep.getTextAreaLength($el);
                    } else if (countType === 'countup') {
                      textAmount = ep.getTextAreaLength($el);
                    }
                    //get the index of the countType
                    var prevCountdown = indicator[countType][0];
                    //update items in the phrase
                    indicator.indicatorPhrase[prevCountdown] = textAmount;
                    //new phrase for inserting into the indicator
                    var updatedPhrase = indicator.indicatorPhrase;
                    //overwrite the older text in indicator
                    indicator.indicatorElement.html(updatedPhrase.join(" "));
                  }
                }
              }
            };
            //create a textarea element for detecting support of attributes
            var textareaElement = document.createElement("textarea"),
              checkFirstKeyDown;
            //test for input or propertuchange support in textarea
            if ("oninput" in textareaElement && (!("documentMode" in document) || document.documentMode > 9)) {
              //do not check if input event is supported
              checkFirstKeyDown = false;
            } else if ("onpropertychange" in textareaElement) {
              //only check if supports onpropertychange
              checkFirstKeyDown = true;
            }
            //store check condition in datastore
            ds.checkFirstKeyDown = checkFirstKeyDown;
            //attach the attribute maxlength if supported
            if ( !! ("maxLength" in textareaElement)) {
              $el.attr("maxlength", limit);
            }
            //helper for setInputSelection
            ep.setInputSelection.offsetToRangeCharacterMove = function (el, offset) {
              return offset - (el.value.slice(0, offset).split("\r\n").length - 1);
            };
            //set of initial event listeners
            ep.deselectFunction(input);
            ep.selectFunction(input);
            ep.dropFunction();
            ep.inputFunction(input);
            ep.trackSelectionEventsFunction();
            ep.mousedownFunction();
            ep.clickFunction();
            ep.keydownFunction();
          },
          inputFunction: function (input) {
            var ds = ep.dataStore;
            $el.on('input propertychange', function () {
              //checkFirstKeyDown for Ie8
              ds.checkFirstKeyDown = false;
              if (ep.dataStore.dropOccurred) {
                ep.dataStore.dropOccurred = false;
                return;
              }
              //get the limit
              var limit = ds.limit,
                //see if limit is reached in textarea
                status = ep.checkLimit($el, limit);
              ep.setDataStore('textStatus', status);
              if (status === 'less') {
                //have not reach the limit yet
                //check for eventprevent from reaching the limit
                if (ds.falsePositive) {
                  input.allowFunction();
                }
                input.changeText('countdown');
                input.changeText('countup');
                ep.setDataStore('lengthText', ep.getTextAreaLength($el));
                //have to use a timer because of a Chrome bug
                //http://code.google.com/p/chromium/issues/detail?id=32865
                setTimeout(function () {
                  ep.trackSelectionFunction($el, ep);
                });
              } else if (status === 'equal') {
                if (ds.falsePositive) {
                  input.preventFunction();
                }
                input.changeText('countdown');
                input.changeText('countup');
                ep.setDataStore('lengthText', ep.getTextAreaLength($el));
                setTimeout(function () {
                  ep.trackSelectionFunction($el, ep);
                  if (ds.falsePositive) {
                    //only need to reset the caret when exceeded length from pasting
                    if (typeof ep.dataStore.newCaretPos === 'number') {
                      var newCaretPos = ep.dataStore.newCaretPos;
                      ep.setInputSelection($el, newCaretPos, newCaretPos);
                      ep.dataStore.newCaretPos = null;
                    }
                  }
                });
              } else if (status === 'greater') {
                //in case there is a false positive
                //for maxlength support
                ds.falsePositive = true;
                var newLength = ep.getTextAreaLength($el),
                  oldCaret = ds.caretStatus,
                  oldCaretStart = oldCaret.start,
                  oldCaretEnd = oldCaret.end,
                  oldLength = ds.lengthText,
                  charactersLeft = limit - oldLength,
                  textString = ep.getText($el);
                //for the new phrase
                var frontEnd,
                  backFront,
                  middleFront,
                  middleBack;
                //text was selected before
                if (ep.dataStore.isTextSelected) {
                  frontEnd = oldCaret.end;
                  middleFront = oldCaret.end;
                  middleBack = charactersLeft + oldCaretEnd;
                  backFront = newLength - (oldLength - oldCaretEnd);
                } else {
                  //text was not selected before
                  frontEnd = oldCaretStart;
                  middleFront = oldCaretStart;
                  middleBack = charactersLeft + oldCaretStart;
                  backFront = newLength - (oldLength - oldCaretStart);
                }
                //correct the string when length is exceeded
                var front = textString.slice(0, frontEnd),
                  middle = textString.slice(middleFront, middleBack),
                  back = textString.slice(backFront, newLength),
                  revertString = front + middle + back,
                  newCaretPos = front.length + middle.length;
                //track the new caret postion
                ep.dataStore.newCaretPos = newCaretPos;
                //revert back to text on reaching limit
                $el.val(revertString);
                //force a input event to allow text handling
                $el.trigger('propertychange');
              }
            });
          },
          dropFunction: function () {
            //alias dataStore
            var ds = ep.dataStore;
            $el.on('drop', function () {
              //check to prevent triggering
              //for Ie
              ep.dataStore.dropOccurred = true;
              //using a timer as a way to get
              //caret after drop event
              setTimeout(function () {
                //track the dragged in text
                //text could be selected
                ep.trackSelectionFunction($el, ep);
                var oldCs = ds.caretStatus,
                  start = oldCs.start,
                  end = oldCs.end,
                  finalCaret;
                //set the old caret
                //which is the drop text position
                if (start !== end) {
                  //text was highlighted after drag
                  ds.caretStatus.start = start;
                  ds.caretStatus.end = start;
                  finalCaret = end;
                } else {
                  //text was not selected after drag
                  var oldLen = ds.lengthText,
                    charDiff = $el.val().length - oldLen,
                    adjustStart = start - (charDiff);
                  ds.caretStatus.start = adjustStart;
                  ds.caretStatus.end = adjustStart;
                  finalCaret = start;
                }
                //adjust the new caret as if the text was pasted
                ep.setInputSelection($el, finalCaret, finalCaret);
                //to ensure that input handler will process
                ep.dataStore.dropOccurred = false;
                //input was not prevented from occurring at last
                //now run it
                $el.trigger('input');
              });
            });
          },
          pastePreventFunction: function () {
            $el.on('paste', function (evt) {
              ep.negateEvent(evt);
            });
          },
          deselectFunction: function (input) {
            $el.on('deselect', function () {
              var limit = ep.dataStore.limit,
                status = ep.checkLimit($el, limit);
              if (status === 'equal') {
                //if no keyprevent present
                input.preventFunction();
              }
            });
          },
          selectFunction: function (input) {
            $el.on('select', function () {
              //prevent triggers on dragging of text
              //into textarea, for Opera 12
              if (ep.dataStore.dropOccurred) {
                return;
              }
              ep.trackSelectionFunction($el, ep);
              var caretStatus = ep.dataStore.caretStatus,
                limit = ep.dataStore.limit,
                status = ep.checkLimit($el, limit);
              if (status === 'equal') {
                //check for Opera 12
                if (caretStatus.end === caretStatus.start) {
                  input.preventFunction();
                } else {
                  input.allowFunction();
                }
              }
            });
          },
          trackSelectionEventsFunction: function () {
            $el.on('mouseout focus blur', function () {
              //track if selection is present
              setTimeout(function () {
                ep.trackSelectionFunction($el, ep);
              });
            });
          },
          mousedownFunction: function () {
            $el.on('mousedown', function () {
              //track mousedown event
              ep.setDataStore('isMouseDown', true);
            });
          },
          clickFunction: function () {
            $el.on('click', function () {
              //track if selection is present
              setTimeout(function () {
                ep.trackSelectionFunction($el, ep);
              });
              //track mouse up from click
              ep.setDataStore('isMouseDown', false);
            });
          },
          keydownFunction: function () {
            var ds = ep.dataStore;
            //to correct for Ie8
            //for not triggering on change
            this.keydownFunction.checkFirstKeyDown =
              function (caller) {
                //checks the first keydown
                if (ds.checkFirstKeyDown) {
                  if (ds.continueKeyCheck) {
                    setTimeout(function () {
                      if (ep.getTextAreaLength($el) > 0) {
                        $el.trigger('propertychange');
                      }
                    });
                  }
                }
                //when using backspace to delete
                if (caller === 'keyprevent') {
                  setTimeout(function () {
                    $el.trigger('propertychange');
                  });
                }
            };
            this.keydownFunction.checkTab = function (evt) {
              if (evt.which === 9) {
                //if the mouse is down while tab was pressed
                //prevent it from happening
                //done to normalize behavior across browsers
                if (ep.dataStore.isMouseDown) {
                  ep.negateEvent(evt);
                  return true;
                }
              }
            };
            //the keydown prevent function when limit is reached
            this.keydownFunction.keydownPrevent = function () {
              $el.on('keydown', function (evt) {
                //preserve some keys after textarea is full: f-keys, arrows, backspace etc.
                if (/^(0|8|9|16|17|18|19|20|27|33|34|35|36|37|38|38|40|45|46|112|113|114|115|116|117|118|119|120|121|122|123)$/.test(evt.which)) {
                  ep.keydownFunction.checkTab(evt);
                  ep.keydownFunction.checkFirstKeyDown('keyprevent');
                  ds.falsePositive = true;
                } else if (evt.ctrlKey === false) {
                  //on single key presses
                  //only permit the single key if ctrl was pressed too
                  evt.preventDefault();
                }
                setTimeout(function () {
                  ep.trackSelectionFunction($el, ep);
                });
              });
            };
            $el.on('keydown', function (evt) {
              ep.keydownFunction.checkTab(evt);
              ep.keydownFunction.checkFirstKeyDown();
              setTimeout(function () {
                ep.trackSelectionFunction($el, ep);
              });
            });
          },
          dataStore: {
            newCaretPos: null,
            caretStatus: {
              start: 0,
              end: 0
            },
            dropOccurred: false,
            isMouseDown: false,
            isTextSelected: false,
            isLimitReached: false,
            textStatus: null,
            lengthText: 0,
            keyDownPresent: false,
            click: false,
            //only to track the keydown
            eventPresent: ['keydown'],
            eventPrevent: [],
            falsePositive: false,
            checkFirstKeyDown: false,
            continueKeyCheck: true
          },
          removeDataStore: function (key, value) {
            //only remove in arrays
            var theKey = this.dataStore[key],
              indexOf = theKey.indexOf(value);
            theKey.splice(indexOf, 1);
          },
          setDataStore: function (key, value) {
            if (this.dataStore[key] instanceof Array) {
              this.dataStore[key].push(value);
            } else {
              //not an array value
              this.dataStore[key] = value;
            }
          },
          negateEvent: function (evt) {
            //prevent and stop propagation of event
            evt.preventDefault();
            evt.stopPropagation();
          },
          isTextSelected: function (caretStatus) {
            //a difference indicates a range, which means a selection
            if (Math.abs(caretStatus.start - caretStatus.end) > 0) {
              return true;
            }
          },
          setSelectionStatus: function () {
            //determine if text is actually selected
            //and sets the status
            var ds = this.dataStore;
            ds.caretStatus = ds.eP.getInputSelection(ds.el);
            if (ds.eP.isTextSelected(ds.caretStatus)) {
              this.setDataStore('isTextSelected', true);
            } else {
              this.setDataStore('isTextSelected', false);
            }
          },
          trackSelectionFunction: function ($el, ep) {
            //save the previous state text selection
            var prevSelection = ep.dataStore.isTextSelected;
            //track if selection is present
            ep.setSelectionStatus();
            //get the current state text selection
            var currentSelection = ep.dataStore.isTextSelected;
            //trigger the deselect
            if (prevSelection && currentSelection === false) {
              $el.trigger('deselect');
            }
          },
          getText: function ($el) {
            return $el.val();
          },
          getTextAreaLength: function ($el) {
            return this.getText($el).length;
          },
          checkLimit: function ($el, limit) {
            var charactersLength = this.getTextAreaLength($el);
            if (charactersLength > limit) {
              return 'greater';
            } else if (charactersLength === limit) {
              return 'equal';
            } else if (charactersLength < limit) {
              return 'less';
            }
          },
          setInputSelection: function ($el, startOffset, endOffset) {
            var _this = this.setInputSelection;
            var el = $el[0];
            if (typeof el.selectionStart === "number" && typeof el.selectionEnd === "number") {
              el.selectionStart = startOffset;
              el.selectionEnd = endOffset;
            } else {
              var range = el.createTextRange();
              var startCharMove = _this.offsetToRangeCharacterMove(el, startOffset);
              range.collapse(true);
              if (startOffset === endOffset) {
                range.move("character", startCharMove);
              } else {
                range.moveEnd("character", _this.offsetToRangeCharacterMove(el, endOffset));
                range.moveStart("character", startCharMove);
              }
              range.select();
            }
          },
          getInputSelection: function ($el) {
            var start = 0,
              end = 0,
              normalizedValue,
              range,
              textInputRange,
              len,
              endRange,
              el = $el[0];
            if (typeof el.selectionStart === "number" && typeof el.selectionEnd === "number") {
              start = el.selectionStart;
              end = el.selectionEnd;
            } else {
              range = document.selection.createRange();
              if (range && range.parentElement() === el) {
                len = el.value.length;
                normalizedValue = el.value.replace(/\r\n/g, "\n");
                // Create a working TextRange that lives only in the input
                textInputRange = el.createTextRange();
                textInputRange.moveToBookmark(range.getBookmark());
                // Check if the start and end of the selection are at the very end
                // of the input, since moveStart/moveEnd doesn't return what we want
                // in those cases
                endRange = el.createTextRange();
                endRange.collapse(false);
                if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                  start = end = len;
                } else {
                  start = -textInputRange.moveStart("character", -len);
                  start += normalizedValue.slice(0, start).split("\n").length - 1;
                  if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                  } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                  }
                }
              }
            }
            return {
              start: start,
              end: end
            };
          }
        };
      return Events.prototype;
    }
  };
  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };
})(jQuery, window, document);
