Stop Verbosity - MaxLength for Textarea
=========================================

Description: 
-------------
Limit the amount of text that is permitted in a textarea by replicating the maxlength attribute on textarea. A line of text counts characters used or remaining when text is entered into the textarea. Once the limit is reached, there is no more text input from typing, pasting or drag and drop. [Online Demo](http://jsbin.com/iticir/6/edit)

Default Options:
-------------
```bash
<script>
	$(document).ready(function () {
	  $('textarea.restrict').stopVerbosity({
	  limit: 300,
      indicatorPosition: 'after',
      indicatorId: 'countdown-indicator',
      indicatorElementType: 'p',
      indicatorPhrase: ['Used', '[countup]', 'of', '[limit]', 'characters.',
        '[countdown]', 'characters remaining.', 'The maximum is','[limit]',
        'characters.', '</br>','Permits multiple counts up:', '[countup]', 
        'and counts down:','[countdown]', '.', 'This indicator is customizable.'
      ],
      existingIndicator: '',
      generateIndicator: true,
      showIndicator: true,
      useNativeMaxlength: true
	  });
	})
</script>
```

Usage/Options Details:
-------------
###limit (number)
    The number of characters that are allowed in the textarea.

###indicatorPosition (string)
    Could be 'before' or 'after'. 
    'before' inserts the indicator before the textarea.
    'after' inserts the indicator after the textarea.
	
###indicatorId (string)	
    Optional id if you wish to quickly refer to the indicator for styling.

###indicatorElementType (string)
    Should be either a 'p' or 'span' tag since the indicator is text.

###indicatorPhrase (array of strings)
    Specify your custom text with quotes for an item in the array. 
    '[countup]', '[countdown]', and '[limit]' are the only reserved variable strings, meaning these will change on textarea input. 

###existingIndicator (string)
    Supply an indicator element that is already on the page. 
    Should be in the jQuery selector format. ex: '#my-paragraph-id'

###generateIndicator (boolean)
    By default, the indicator will be set to true for auto generation. 
	
###showIndicator (boolean)	
    The indicator will be shown, unless this is set to false.
	
###useNativeMaxlength (boolean)	
    Uses the browser's maxlength if supported when set to true, but setting to false will use the plugin's implementation of maxlength. Should only set to false for testing purposes.

Notes:
------
Tested on Opera >= 12.10, Ie>=6 but 7, Firefox 22, Chrome 28 with jQuery 1.10.2. 

Attention has been made to the plugin to implement a maxlength that replicates the default maxlength behavior in a textarea. Text overflow is not allowed and text truncation is calculated. Simple substring operations are not done. The maxlength follows the maxlength that are in present in recent versions of Firefox, Ie, and Chrome.

This plugin will use the browser's native maxlength and will fallback to the plugin's implementation when lacking maxlength support or with only partial maxlength support.

Since Ie9 has faulty support for maxlength, this plugin will monitor the textarea for exceeding the limit and impose the plugins's maxlength. However, this will also override Opera 12 maxlength implementation.

To normalize behaviors of browsers, the textarea is cleared upon page refresh and tab key press is prevented when text is highlighted with the mouse. 

This plugin is mainly a theoretical exercise because most of the newer major browsers do have full support for maxlength (IE >= 10, Firefox >= 4, Opera >= 11, Chrome >= 6). Older browsers version that do not support maxlength in textarea, tend not to be supported by Jquery. This plugin is intended for use with Ie 6-9.

Information of form support from [here](http://www.wufoo.com/html5/).

Since browsers do not have an undo or redo event in textareas, this plugin will not support undos or redos in the textarea.

ChangeLog:
------
v1.12.1

* Fix readme
* Proper commit

v1.12.0

* ADD
* Full support for Ie9.
* Allow multiple countup, countdown, and limit
* Choose to use native maxlength or plugin's maxlength

* FIX
* Highlighting and pasting of text when exceeding limit in Ie6-8 causes errors
* Highlighting with ctrl shift and arrows keys would not allow paste

v1.11

* Add full support for Ie6 and Ie8.

v1.10

* Use native maxlength when supported.
* Ability to show or hide indicator.
* Drag and drop restriction.

ToDo:
------
* Punctuation before and after string variables
* Slow indicator down on update.
