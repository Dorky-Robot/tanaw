import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/tanaw.js",  // Assuming the entry file is src/tanaw.js
  output: [
    {
      file: "dist/tanaw.bundle.js",
      format: "umd",
      name: "Tanaw",  // The global variable name for UMD build
    },
    {
      file: "dist/tanaw.bundle.min.js",
      format: "umd",
      name: "Tanaw",  // The global variable name for UMD build
      plugins: [
        terser({}),
      ],
    },
  ],
  plugins: [resolve(), commonjs()],
};
