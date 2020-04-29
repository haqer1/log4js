import commonjs from "@rollup/plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";

const ARTIFACT_NAME = "log4js";
export default {
    input: "src/main/js/index.js",
    output: [
      {
        file: "dist/" +ARTIFACT_NAME+ ".js",
        format: "umd",
        name: ARTIFACT_NAME
      },
      {
        file: "dist/" +ARTIFACT_NAME+ ".min.js",
        format: "umd",
        name: ARTIFACT_NAME,
        plugins: [uglify()]
      }
    ],
    plugins: [commonjs()]
};
