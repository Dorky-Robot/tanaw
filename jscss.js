var CssSelectors = ['color', 'width'];

function jscss(raw) {
  return cssify(uncompress(raw));
}

function uncompress(compressed, root) {
  var processed = {};
  var root = root || "";

  if (!_.isEmpty(compressed)) {
    _.each(compressed, function(value, key) {
      var styles = _.pick(value, CssSelectors);
      var selector = root + key;

      if (!_.isEmpty(styles)) {
        processed[selector] = styles;
      }
      _.extend(processed, uncompress(_.omit(value, CssSelectors), selector));
    });
  }

  return processed;
}

function cssify(jsStyles) {
  var css = "";
  _.each(jsStyles, function(styles, selector) {
    css += selector + "{" + cssifyStyles(styles) + "}";
  });

  return css;
}

function cssifyStyles(styles) {
  return _.map(styles, function(val, key) {
    return key + ":" + val;
  }).join(";");
}
