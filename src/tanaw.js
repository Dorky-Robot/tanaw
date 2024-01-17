function style(tnss) {
  if (isBlank(tnss)) return tnss;
  return compile(process({ tnss }));
}

const NO_SELECTOR = '__*__'
function process({ tnss, parent, css = {}, nested }) {
  if (Array.isArray(tnss) && typeof tnss[0] === 'string') {
    const [propName, ...values] = tnss;
    const prop = `${propName}:${processCssValues(values)};`;
    const target = nested ? (css[nested] = css[nested] || {}) : css;
    const key = parent || NO_SELECTOR;

    target[key] = (target[key] || '') + prop;
  } else if (Array.isArray(tnss)) {
    for (let item of tnss) {
      process({ tnss: item, parent, css, nested });
    }
  } else {
    for (let [key, value] of Object.entries(tnss)) {
      process({
        tnss: value,
        parent: key.startsWith('@') ? parent : sel(parent, key),
        css,
        nested: key.startsWith('@') ? key : nested
      });
    }
  }

  return css;
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

function processCssValues(values) {
  if (typeof values === 'string') {
    return values;
  } else if (values.func) {
    const func = values.func[0];
    const args = values.func.slice(1);

    return `${func}(${args.join(',')})`;
  } else {
    return values.map(processCssValues).join(' ');
  }
}

module.exports = {
  style
}