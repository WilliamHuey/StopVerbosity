Textarea Maxlength - Jquery
=========================================

Usage:
-------------
Include the file jquery-1.8.0.min.js and textarea_maxlength.js in the header of your html file:

```bash
<head>
	<script type="text/javascript" src="jquery-1.7.2.js"></script>
	<script type="text/javascript" src="textarea_maxlength.js"></script>
</head>
```

In your script tag:

```bash
<script>
	$(document).ready(function () {
		$('.user_text').truncate({
			limit: 140, //number of characters that are allowed in textarea; the character limit
			indicator: "indicator_id_name" //the name of the id 
		});
	})
</script>
```

Description: 
-------------
Limit the amount of text that is permitted in a textarea. A line of text counts down to tell you how many characters are left. Once the limit is reached, there is no more typing or pasting. 

Notes:
------
The counter updates on keydown because a timer is used.