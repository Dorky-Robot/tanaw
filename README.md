Tired of switching between CSS and Javascript, well good news! Now you don't have to.

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
