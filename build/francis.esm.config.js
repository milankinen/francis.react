import cjs from "rollup-plugin-commonjs";
import buble from "rollup-plugin-buble";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";

export default {
  input: "src/index.js",
  external: ["react", "francis"],
  output: {
    name: "FrancisReact",
    format: "esm",
    file: "dist/francis.react.esm.js",
    exports: "named",
    globals: {
      react: "React",
      francis: "Francis"
    }
  },
  plugins: [
    replace({
      delimiters: ["", ""],
      values: {
        "process.env.NODE_ENV": JSON.stringify("development"),
        "(__DEVBUILD__)": "(true)",
        "(__DEVELOPER__)": "(false)",
        "global.__FRANCIS_DEV__": "0"
      }
    }),
    cjs(),
    buble({
      transforms: {
        modules: false
      }
    }),
    babel({
      babelrc: false,
      presets: [],
      plugins: ["annotate-pure-calls"],
      exclude: "node_modules/**"
    })
  ]
};
