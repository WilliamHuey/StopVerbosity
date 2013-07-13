Stop Verbosity - MaxLength for Textarea
=========================================

Description: 
-------------
Limit the amount of text that is permitted in a textarea. A line of text counts characters used or remaining. Once the limit is reached, there is no more typing or pasting. [Online Demo](http://jsbin.com/iticir/1/edit)

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
    The number of characters that are allowed in the textarea

###indicatorPosition (string)
    Could be 'before' or 'after'. 
    'before' inserts the indicator before the textarea.
    'after' inserts the indicator after the textarea.

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

Notes:
------
Tested on Opera 12.16, Chrome 28, Ie10, Firefox 22.

To normalize behaviors of browsers, the textarea is cleared upon page refresh and tab key press is prevented when text is highlighted with the mouse. 

Only recent versions of Opera (>= 12.10) supports the 'paste' event, which means that this plugin will not work properly on versions prior 12.10 with highlighting and pasting repeatedly. 
