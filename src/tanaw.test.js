const {
  style,
  isCssProperty
} = require('./tanaw');


describe('style function', () => {
  it('handles an empty array', () => {
    const input = [];
    const expected = [];
    expect(style(input)).toStrictEqual(expected);
  });

  it('handles an empty string', () => {
    const input = '';
    const expected = '';
    expect(style(input)).toStrictEqual(expected);
  });

  it('handles an empty string', () => {
    const input = {};
    const expected = {};
    expect(style(input)).toStrictEqual(expected);
  });


  it('handles undefined input', () => {
    const input = undefined;
    const expected = undefined;
    expect(style(input)).toStrictEqual(expected);
  });

  it('handles single CSS property', () => {
    const input = {
      'border': '1px solid black'
    };
    const expected = 'border:1px solid black;';
    expect(style(input)).toBe(expected);
  });

  it('handles multiple CSS properties in nested arrays', () => {
    const input = {
      border: '1px solid black',
      color: 'white'
    };

    const expected = 'border:1px solid black;color:white;';
    expect(style(input)).toBe(expected);
  });

  it('handles CSS class selector with single CSS property', () => {
    const input = {
      '.container': { background: 'red' }
    }
    const expected = '.container{background:red;}';
    expect(style(input)).toBe(expected);
  });


  it('handles multiple CSS properties with CSS class selector', () => {
    const input = {
      '.container': {
        background: 'red',
        color: 'blue'
      }
    };
    const expected = '.container{background:red;color:blue;}';
    expect(style(input)).toBe(expected);
  });

  it('prevents stackoverflow when sytax is not correct', () => {
    const input = {
      '.container': {
        'background': 'red',
        'color': 'blue'
      }
    };
    const expected = '.container{background:red;color:blue;}';
    expect(style(input)).toBe(expected);
  });

  it('handles CSS variables', () => {
    const input = {
      ':root': {
        '--primary-color': '#ff5733',
        '--secondary-color': '#3333ff'
      }
    };
    const expected = ':root{--primary-color:#ff5733;--secondary-color:#3333ff;}';
    expect(style(input)).toBe(expected);
  });




  it('handles CSS variables with subsequent selectors with wrapper', () => {
    const input = {
      ':root': {
        '--primary-color': '#ff5733',
        '--secondary-color': '#3333ff'
      },
      '.container': {
        display: 'grid',
        'grid-template-columns': "repeat(2,1fr)"
      }
    };
    const expected = ':root{--primary-color:#ff5733;--secondary-color:#3333ff;}.container{display:grid;grid-template-columns:repeat(2,1fr);}';
    expect(style(input)).toBe(expected);
  });


  it('handles camelcase', () => {
    const input = {
      ':root': {
        '--primary-color': '#ff5733',
        '--secondary-color': '#3333ff'
      },
      '.container': {
        display: 'grid',
        gridTemplateColumns: "repeat(2,1fr)"
      }
    };
    const expected = ':root{--primary-color:#ff5733;--secondary-color:#3333ff;}.container{display:grid;grid-template-columns:repeat(2,1fr);}';
    expect(style(input)).toBe(expected);
  });



  it('handles CSS variables with subsequent selectors with wrapper', () => {
    const input = {
      '.container': {
        display: 'grid',
        border: '1px solid black',
        gridTemplateColumns: 'repeat(2,1fr)',
        '.something': { color: 'red' }
      }
    };
    const expected = ".container{display:grid;border:1px solid black;grid-template-columns:repeat(2,1fr);}.container .something{color:red;}";
    expect(style(input)).toBe(expected);
  });

  it('handles CSS variables with subsequent selectors without wrapper', () => {
    const input = {
      ':root': {
        '--primary-color': '#ff5733',
        '--secondary-color': '#3333ff'
      },
      '.container': {
        display: 'grid',
        gridTemplateColumns: 'repeat(2,1fr)'
      }
    };
    const expected = ':root{--primary-color:#ff5733;--secondary-color:#3333ff;}.container{display:grid;grid-template-columns:repeat(2,1fr);}';
    expect(style(input)).toBe(expected);
  });

  it('handles CSS class selector with media query and CSS property', () => {
    const input = {
      '@media screen and (max-width: var(--max-width))': {
        '.grid-container': {
          gridTemplateColumns: 'repeat(1,1fr)'
        }
      }
    };

    const expected = '@media screen and (max-width: var(--max-width)){.grid-container{grid-template-columns:repeat(1,1fr);}}';
    expect(style(input)).toBe(expected);
  });



  it('handles complex CSS structure with media query and CSS properties', () => {
    const input = {
      ':root': {
        '--max-width': '768px'
      },
      '.gridContainer': {
        display: 'grid',
        gridTemplateColumns: 'repeat(2,1fr)',
        gap: '10px',
        '.nested-item': { color: 'red' }
      },
      '@media screen and (max-width: var(--max-width))': {
        '.gridContainer': {
          'gridTemplateColumns': 'repeat(1,1fr)'
        }
      }
    };
    const expected = ":root{--max-width:768px;}.grid-container{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;}.grid-container .nested-item{color:red;}@media screen and (max-width: var(--max-width)){.grid-container{grid-template-columns:repeat(1,1fr);}}";
    expect(style(input)).toBe(expected);
  });

  it('handles CSS class selector with pseudo selector', () => {
    const input = {
      '.container': {
        '.nested-item': { color: 'red' },
        ":hover": {
          "color": "blue"
        }
      }
    };
    const expected = ".container .nested-item{color:red;}.container:hover{color:blue;}";
    expect(style(input)).toBe(expected);
  });

  it('handles nested comma separated css selector with nesting', () => {
    const input = {
      '.alert, .warning': {
        'ul, p': {
          'margin-right': 0,
          'margin-left': 0,
          'padding-bottom': 0
        }
      }
    };
    const expected = ".alert ul,.alert p,.warning ul,.warning p{margin-right:0;margin-left:0;padding-bottom:0;}";
    expect(style(input)).toBe(expected);
  });

  it('handles comma separated parent', () => {
    const input = {
      '.alert, .warning': {
        'ul': {
          'margin-right': 0,
          'margin-left': 0,
          'padding-bottom': 0
        }
      }
    };
    const expected = ".alert ul,.warning ul{margin-right:0;margin-left:0;padding-bottom:0;}"
    expect(style(input)).toBe(expected);
  });

  it('handles nested comma separated css children', () => {
    const input = {
      '.alert': {
        'ul, p': {
          'margin-right': 0,
          'margin-left': 0,
          'padding-bottom': 0
        }
      }
    };
    const expected = ".alert ul,.alert p{margin-right:0;margin-left:0;padding-bottom:0;}"
    expect(style(input)).toBe(expected);
  });

  it('handles nested comma separated css selector for pseudo selector', () => {
    const input = {
      '.alert, .warning': {
        ':hover': {
          'margin-right': 0,
          'margin-left': 0,
          'padding-bottom': 0
        }
      }
    };
    const expected = ".alert:hover,.warning:hover{margin-right:0;margin-left:0;padding-bottom:0;}"
    expect(style(input)).toBe(expected);
  });

  it('acid test', () => {
    const input = {
      ':root': {
        '--max-width': '768px'
      },
      '.grid-container': {
        display: 'grid',
        gridTemplateColumns: 'repeat(2,1fr)',
        gap: '10px',
        '.nested-item': {
          'color': 'red'
        },
        ":hover": {
          "color": "blue"
        }
      },
      '@media screen and (max-width: var(--max-width))': {
        '.grid-item': {
          'grid-template-columns': 'repeat(1,1fr)'
        }
      },
      '.alert, .warning': {
        'ul, p': {
          'margin-right': 0,
          'margin-left': 0,
          'padding-bottom': 0
        }
      }
    };

    const expected = ":root{--max-width:768px;}.grid-container{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;}.grid-container .nested-item{color:red;}.grid-container:hover{color:blue;}@media screen and (max-width: var(--max-width)){.grid-item{grid-template-columns:repeat(1,1fr);}}.alert ul,.alert p,.warning ul,.warning p{margin-right:0;margin-left:0;padding-bottom:0;}";
    expect(style(input)).toBe(expected);
  });
});
