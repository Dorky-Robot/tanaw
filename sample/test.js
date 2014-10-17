$(function() {
  console.time('cssify');
  var one = jscss.compile({
    '#footer .stuff': {
      color: 'orange',
      width: '33px'}
  });
  console.timeEnd('cssify');
  console.log("one: " + one);

  console.time('cssify');
  var two = jscss.compile({
    '#footer .stuff': {
      color: 'orange',
      width: '33px'},
      '#header': {
        color: 'red',
        width: '232px'}
  });

  console.timeEnd('cssify');
  console.log("two: " + two);

  console.time('cssify');
  var nested = jscss.compile({
    '#footer': {
      ' .stuff': {
        color: 'orange',
        width: '33px'},
        color: 'blue',
        '.crap' : {
          color: 'red'
        }
    }
  });

  console.timeEnd('cssify');
  console.log("nested: " + nested);

  console.time('cssify');
  var complex = jscss.compile({
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

  console.timeEnd('cssify');
  console.log("complex: " + complex);
});
