import commonjs from "@rollup/plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";
import nodeBuiltins from "rollup-plugin-node-builtins";

const ARTIFACT_NAME = "log4js";
export default {
    input: "src/main/js/index.js",
    external: ["console"],
    output: [
      {
        globals: { "util": "util" },
        file: "dist/" +ARTIFACT_NAME+ ".js",
        format: "umd",
        name: ARTIFACT_NAME
      },
      {
        globals: { "util": "util" },
        file: "dist/" +ARTIFACT_NAME+ ".min.js",
        format: "umd",
        name: ARTIFACT_NAME,
        plugins: [uglify()]
      }
    ],
    plugins: [commonjs(), nodeBuiltins()]
};
