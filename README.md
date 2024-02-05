## Overview

Tanaw: (tagalog) a vista or a view

The separation between styles, markup, and code has been the status quo in web development for a while now. However, as CSS, HTML, and JS, we've reached a point where those traditional boundaries might need reconsidering. As CSS, HTML, and JS evolve, those traditional concerns have started to blur into one another.

It's possible to embed so much into vanilla CSS (for example) that it could have been written in JS. There are so many JS-based view frameworks today that it's hard to distinguish from the concern of HTML and JS.

Many of the frameworks today are built on the premise that CSS, HTML, and JS are fundamentally separate. While this assumption made sense early on, we should reconsider those boundaries. This is where Tanaw comes in.

Tanaw is one aspect of a larger framework (Alon.js). With Tanaw, you can express CSS in pure JS using objects, arrays, and strings.

For example:

```javascript
Tanaw.style({
  ":root": { "--max-width": "768px" },
  ".grid-container": {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "10px",
    ".nested-item": { color: "red" },
  },
  "@media screen and (max-width: var(--max-width))": {
    ".grid-container": {
      "grid-template-columns": "repeat(1,1fr)",
    },
  },
});
```

Results in

```javascript
":root{--max-width:768px;}.grid-container{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;}.grid-container .nested-item{color:red;}@media screen and (max-width: var(--max-width)){.grid-container{grid-template-columns:repeat(1,1fr);}}";
```

This can then be injected into the HTML body.

Alternatively, you can express bare styles like so:

```javascript
Tanaw.style({
  border: "1px,solid,black",
  color: "white",
});
```

Resulting in

```javascript
"border:1px solid black;color:white;";
```

Which can be used to inline styles in HTML

## Breaking Traditional Boundaries

As mentioned, Tanaw breaks traditional boundaries by removing the line between CSS, HTML, and JS. For example, we can construct highly dynamic CSS with JS.

```javascript
function generateStyles(numDots) {
  const colors = () =>
    ["red", "orange", "yellow", "green", "violet", "indigo", "blue"][
      Math.floor(Math.random() * 7)
    ];
  const sizes = () => `${Math.floor(Math.random() * 29 + 22)}px`;

  const dotStyles = {};
  for (let i = 0; i < numDots; i++) {
    dotStyles[`.dot-${i}`] = {
      color: colors(),
      fontSize: sizes(),
    };
  }

  return {
    "#container": {
      margin: "0 auto",
      display: "table",
      width: "1024px",
    },
    "#dots": {
      ...dotStyles, // Spread the dotStyles object here
      height: "130px", // Ensure the 'height' property is an array of arrays
    },
  };
}
```

This can then be injected into the DOM:

```javascript
function injectCSS(css) {
  let styleElement = document.querySelector("head style");

  if (!styleElement) {
    styleElement = document.createElement("style");
    document.head.appendChild(styleElement);
  }

  styleElement.innerHTML = css;
}

injectCSS(Tanaw.style(generateStyles(1000)));
```

To see the working example, check out dist/sample.js in the repo. This is just one example; I'm sure you can all think of more creative ways to leverage this.

## Sample Usage

In this sample, we generate a base HSL color and then create an analogous palette by adjusting the hue by ±30 degrees. This gives us a set of three colors that are harmonious and pleasing to the eye. When the "Change Style" button is clicked, applyNewStyles is called, which generates a new set of styles based on the color palette and injects them into the page. (found in dist/rotate.html)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Tanaw</title>
    <style id="dynamic-styles"></style>
  </head>
  <body>
    <header id="header">
      <h1>Welcome to Tanaw</h1>
      <p>Dynamic Styling with JavaScript</p>
    </header>
    <main id="main-content">
      <button id="change-style-button">Change Style</button>
    </main>

    <!-- Include Tanaw library here -->
    <script src="../dist/tanaw.bundle.js"></script>
    <script>
      // Function to generate an HSL color with a random hue and fixed saturation and lightness
      function generateBaseHSL() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 70; // Percentage
        const lightness = 50; // Percentage
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      }

      // Function to generate an analogous color palette
      function generateAnalogousPalette(baseHue, offset) {
        const analogousPalette = [];
        for (let i = -1; i <= 1; i++) {
          const hue = (baseHue + i * offset + 360) % 360;
          analogousPalette.push(`hsl(${hue}, 70%, 50%)`);
        }
        return analogousPalette;
      }

      // Function to generate new Tanaw styles with an analogous color scheme
      function generateAnalogousColorScheme() {
        const baseColor = generateBaseHSL();
        const baseHue = parseInt(baseColor.match(/hsl\((\d+),/)[1], 10);
        const colorPalette = generateAnalogousPalette(baseHue, 30); // 30 degrees offset for analogous colors

        return {
          body: {
            backgroundColor: colorPalette[0],
            color: colorPalette[1],
            transition: `background-color(0.3s ease, color 0.3s ease)`,
          },
          "#header h1": { color: colorPalette[2] },
          button: {
            backgroundColor: colorPalette[1],
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            color: colorPalette[0],
            transition: "background-color 0.3s ease",
          },
          "button:hover": { backgroundColor: colorPalette[2] },
        };
      } // Function to apply new styles to the page
      function applyNewStyles() {
        const newStyles = generateAnalogousColorScheme();
        const compiledCSS = Tanaw.style(newStyles);
        injectCSS(compiledCSS);
      }

      // Function to inject compiled CSS into the page
      function injectCSS(css) {
        let styleElement = document.getElementById("dynamic-styles");

        if (!styleElement) {
          styleElement = document.createElement("style");
          document.head.appendChild(styleElement);
        }

        styleElement.innerHTML = css;
      }

      // Event listener for the button
      document.addEventListener("DOMContentLoaded", () => {
        const changeStyleButton = document.getElementById(
          "change-style-button"
        );
        changeStyleButton.addEventListener("click", applyNewStyles);
      });

      applyNewStyles();
    </script>
  </body>
</html>
```
