function style(stylesObject) {
  if (isEmpty(stylesObject)) return stylesObject;
  return compileStyles(processStyles({ stylesObject }));
}

const NO_SELECTOR = '__*__';

function processStyles({ stylesObject, parentSelector = '', cssObject = {}, nestedSelector = '' }) {
  if (Array.isArray(stylesObject)) {
    const [property, value] = stylesObject;
    const cssProperty = `${camelToKebabCase(property)}:${value};`;
    const targetObject = nestedSelector ? (cssObject[nestedSelector] = cssObject[nestedSelector] || {}) : cssObject;
    const key = camelToKebabCase(parentSelector || NO_SELECTOR);

    targetObject[key] = (targetObject[key] || '') + cssProperty;
  } else {
    Object.keys(stylesObject).forEach(key => {
      const value = stylesObject[key];
      if (key.startsWith('@')) {
        // Inline handling for media queries and nested selectors
        processStyles({
          stylesObject: value,
          cssObject: cssObject,
          nestedSelector: key
        });
      } else if (typeof value !== 'object') {
        // Inline handling for direct property-value pairs
        const cssProperty = `${camelToKebabCase(key)}:${value};`;
        const targetObject = nestedSelector ? (cssObject[nestedSelector] = cssObject[nestedSelector] || {}) : cssObject;
        const combinedKey = camelToKebabCase(parentSelector || NO_SELECTOR);
        targetObject[combinedKey] = (targetObject[combinedKey] || '') + cssProperty;
      } else {
        // Inline handling for nested selectors
        const combinedSelector = combineSelectors(parentSelector, key);
        processStyles({
          stylesObject: value,
          parentSelector: combinedSelector,
          cssObject: cssObject,
          nestedSelector
        });
      }
    });
  }

  return cssObject;
}

function combineSelectors(parent, child) {
  if (!parent) return child;
  const parentSelectors = splitAndTrim(parent);
  const childSelectors = splitAndTrim(child);

  const combined = parentSelectors.map(p =>
    childSelectors.map(c => `${p}${c.startsWith(':') ? '' : ' '}${c}`).join(',')
  ).join(',');

  return combined;
}

function camelToKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function splitAndTrim(str) {
  return str.split(',').map(s => s.trim());
}

function compileStyles(cssObject) {
  if (typeof cssObject !== 'object' || Array.isArray(cssObject) || isEmpty(cssObject)) {
    return cssObject;
  }

  return Object.entries(cssObject).map(([key, value]) =>
    key === NO_SELECTOR ? compileStyles(value) : `${key}{${compileStyles(value)}}`
  ).join('');
}

function isEmpty(obj) {
  return !obj || Object.keys(obj).length === 0;
}

module.exports = {
  style
};
