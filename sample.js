var one = jscss({
  '#footer .stuff': {
    color: 'orange',
    width: '33px'}
});

console.log("one: " + one);


var two = jscss({
  '#footer .stuff': {
    color: 'orange',
    width: '33px'},
  '#header': {
    color: 'red',
    width: '232px'}
});

console.log("two: " + two);

var nested = jscss({
  '#footer': {
    ' .stuff': {
      color: 'orange',
      width: '33px'},
    color: 'blue',
    '.crap' : {
      color: 'red'
    }}
});

console.log("nested: " + nested);


var complex = jscss({

'#header': {
  color: 'red',
  width: '232px'},
'#main':{
  ' .blue': {
    color: '#0BB5FF',
    '.stuff' : { width: '232px' },
    width: '34px'}},
    '.stuff': { width: '34px'},
  ' .purple': { color: '#5D478B' },
'#footer .stuff': { color: 'orange' }

});

console.log("complex: " + complex);