Stop Verbosity - MaxLength for Textarea
=========================================

Description: 
-------------
Limit the amount of text that is permitted in a textarea by replicating the maxlength. A line of text counts characters used or remaining when text is entered into the textarea. Once the limit is reached, there is no more text input from typing, pasting or drag and drop. [Online Demo](http://jsbin.com/iticir/3/edit)

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
	      '[countdown]', 'characters remaining.'
	    ],
	    customIndicator: '',
	    generateIndicator: true
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
    '[countup]', '[countdown]', and '[limit]' are the only reserved variable strings. 
    These variable strings can only be used once (need to change this in the future). 

###customIndicator (string)
    Supply an indicator element that is already on the page. 
    Should be in the jQuery selector format. ex: '#my-paragraph-id'

###generateIndicator (boolean)
    By default, the indicator will be set to true for auto generation. 
	
###showIndicator (boolean)	
   The indicator will be shown, unless this is set to false.
   
ChangeLog:
------
v1.11
Add full support for Ie6 and Ie8

v1.10
Use native maxlength when supported.

Ability to show or hide indicator.

Drag and drop restriction.

ToDo:
------
Add Ie9 support for proper detection of deletion of text.

Indicator phrase with multiple repeated variables (multiple indexOf).

Slow indicator down on update.

Notes:
------
Tested on Opera >= 12.10, Ie10, Ie8, Ie6, Firefox 22, Chrome 28 with jQuery 1.10.2. Did not test with Ie7.

This plugin will use the browser's native maxlength and will fallback to the plugin's implementation when lacking maxlength support.

Since Ie9 has faulty support for maxlength, this plugin will monitor the textarea for exceeding the limit and impose the plugins's maxlength. However, this will also override Opera 12 maxlength implementation.

To normalize behaviors of browsers, the textarea is cleared upon page refresh and tab key press is prevented when text is highlighted with the mouse. 

This plugin is mainly a theoretical exercise because most of the newer major browsers do support maxlength (IE = 10, Firefox >= 4, Opera >= 11, Chrome >= 6). Older browsers version that do not support maxlength in textarea, tend not to be supported by Jquery. 

Information of form support from [here](http://www.wufoo.com/html5/).

This plugin is intended for use with Ie 6-9, but work still need to be done to properly complete the implementation for Ie9.

Since browsers do not have an undo or redo event in textareas, this plugin will not support undos or redos in the textarea.
