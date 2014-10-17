## Overview
CSS + Javascript = JSCSS.

## Why

CSS is a great tool for creating the looks and feel that an HTML
page requires. And CSS3 introduced a lot of new features which made
CSS an even more powerful tool.

However, in the world of dynamic client-side application, CSS still
lacks the ability to react to changes to Javascript variables present
on the page. It also does not have the idea of loops and if conditions
many features that languages such as Javascript provides.

This is why I created JSCSS.

With JSCSS you can compile Javascript data structures into CSS.

``` javascript

var one = jscss.compile({
  '#footer .stuff': {
    color: 'orange',
    width: '33px'}
});

;=> #footer .stuff{color:orange;width:33px}

Here is an even more complex example.

``` javascript
jscss.compile({
'#header':{
    color: 'red',
    width: '232px',
  ' #main':{
    ' .blue': {
      color: '#0BB5FF',
      '.stuff' : { width: '232px' },
      width: '34px'}
  },
  '.stuff': { width: '34px'},
  ' .purple': { color: '#5D478B' },
},
'#footer .stuff': { color: 'orange' }
});

;=> "#header{color:red;width:232px}#header #main .blue{color:#0BB5FF;width:34px}#header #main .blue.stuff{width:232px}#header.stuff{width:34px}#header .purple{color:#5D478B}#footer .stuff{color:orange}"

```

## More Examples

And since it just requires users to create a parsable data structure, it's possible to 
construct CSS with even more complex behaviors.

[Here is an example.](https://ff-jscss.s3.amazonaws.com/index.html)

## Usage

``` html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>JSCSS</title>
    <script src="jquery-1.11.1.js" type="text/javascript"></script>
    <script src="underscore.js" type="text/javascript"></script>
    <script src="jscss.js" type="text/javascript"></script>
    <script src="sample.js" type="text/javascript"></script>
    <style></style>
  </head>
  <body>
    <div id="container">
      <p>This is styled using JSCSS</p>
    </div>
  </body>
</html>
```

``` javascript

$(function() {
  var style = {'#container': {
    'margin': '0 auto',
    'display': 'table',
    'width': '1024px'}};

  var css = jscss.compile(style);

  $('head style').html(css);
});

```
