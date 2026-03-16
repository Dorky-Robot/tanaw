## Overview

**Tanaw** (tagalog: a vista or a view) is a lightweight (~1.3K minified) CSS-in-JS engine. It does one thing: **convert JavaScript objects into CSS strings**. It has no dependencies, creates no DOM elements, and handles no markup or behavior — just styles.

```
JS object  →  Tanaw.style()  →  CSS string  →  inject into <style> tag
```

### Part of the Habiscript Ecosystem

Tanaw is the **styling layer** for [Habiscript](https://github.com/Dorky-Robot/habiscript), which handles the other two concerns — markup and behavior. Together they form a unified approach to web UI:

| Library | Concern | Input | Output |
|---------|---------|-------|--------|
| **Tanaw** | CSS only | JS objects describing styles | CSS strings |
| **Habiscript** | HTML + JS (structure & behavior) | JS arrays describing DOM trees | DOM elements |

Habiscript depends on Tanaw (`"tanaw": "^0.6.0"`) and calls `Tanaw.style()` internally whenever it processes style objects. You can also use Tanaw standalone — it works anywhere you need dynamic CSS without a view layer.

### Why CSS-in-JS?

CSS has grown powerful enough that complex styling logic increasingly resembles programming. Rather than maintaining a separate language for styles, Tanaw lets you use JavaScript directly — with loops, variables, spreads, and conditionals — to generate CSS. The result is still plain CSS injected into the page; the authoring just happens in JS.

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

## Dynamic CSS Generation

Because your styles are just JavaScript, you get the full power of the language — loops, randomization, spreads, conditionals — to generate CSS programmatically.

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

To see working examples, check out the `samples/` directory in the repo.

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
