function style(tnss) {
  if (isBlank(tnss)) return tnss;
  return compile(process({ tnss }));
}

const NO_SELECTOR = '__*__'
function process({ tnss, parent, css = {}, nested }) {

  if (Array.isArray(tnss)) {
    const [propName, value] = tnss;
    const prop = `${camelToKababCase(propName)}:${value};`;
    const target = nested ? (css[nested] = css[nested] || {}) : css;
    const key = camelToKababCase(parent || NO_SELECTOR);

    target[key] = (target[key] || '') + prop;
  } else {
    for (let key of Object.keys(tnss)) {
      if (key.startsWith('@')) {
        process({
          tnss: tnss[key],
          parent,
          css,
          nested: key
        });
      } else if (typeof tnss[key] === 'string') {
        process({
          tnss: [key, tnss[key]],
          parent,
          css,
          nested
        });
      } else {
        process({
          tnss: tnss[key],
          parent: sel(parent, key),
          css,
          nested: nested
        });
      }
    }
  }

  return css;
}

function camelToKababCase(str) {
  return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}


function sel(parent, selector) {
  if (!parent) return selector;
  return parent + (selector.startsWith(':') ? '' : ' ') + selector;
}


function compile(tnss) {
  if (typeof tnss !== 'object' || Array.isArray(tnss) || isBlank(tnss)) {
    return tnss;
  }

  return Object.entries(tnss).map(([key, value]) =>
    key === NO_SELECTOR ? compile(value) : `${key}{${compile(value)}}`
  ).join('');
}

function isBlank(o) {
  return !o || o.length === 0 || Object.keys(o).length === 0;
}

module.exports = {
  style
}