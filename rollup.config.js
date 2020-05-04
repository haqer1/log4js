import commonjs from "@rollup/plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";
import nodeBuiltins from "rollup-plugin-node-builtins";
import replace from 'rollup-plugin-re';
//import externalGlobals from "rollup-plugin-external-globals";
//import ignoreImport from 'rollup-plugin-ignore-import';

const ARTIFACT_NAME = "log4js";
const JS_EXT = ".js";
const INDEX_JS = "src/main/js/index" +JS_EXT;
const FOR_BROWSERS_SUFFIX = "-for-browsers";
const MIN_JS_EXT = ".min" +JS_EXT;
export default [
{
    input: INDEX_JS,
    output: [
      {
        file: "dist/" + ARTIFACT_NAME + JS_EXT,
        format: "umd",
        name: ARTIFACT_NAME
      },
      {
        file: "dist/" + ARTIFACT_NAME + MIN_JS_EXT,
        format: "umd",
        name: ARTIFACT_NAME,
        plugins: [uglify()]
      }
    ],
    plugins: [commonjs(), nodeBuiltins()]
},
{
    input: INDEX_JS,
    output: [
      {
        file: "dist/" + ARTIFACT_NAME + FOR_BROWSERS_SUFFIX + JS_EXT,
        format: "umd",
        name: ARTIFACT_NAME
      },
      {
        file: "dist/" + ARTIFACT_NAME + FOR_BROWSERS_SUFFIX + MIN_JS_EXT,
        format: "umd",
        name: ARTIFACT_NAME,
        plugins: [uglify()]
      }
    ],
    plugins: [
//        commonjs(), 
        replace({ // seems better than auto-generating a couple of files, etc.
            replaces: {
//                "import {format} from \"util\";": "//deleted"
            },
            patterns:[
                {
                    include: "src/main/js/com/adazes/util/log4js/Logger.js",
                    test: /import \{ ?format ?\} from ["']util["'];/g,
                    replace: "// not using Node.js util module for browsers"
                }
            ]
        })
    ]
}
/* Works partially: leaves util.format while util is not defined (only function is imported, & importing everything would be wasteful)
,{
    input: "src/main/js/index.js",
    output: [
      {
        file: "dist/" +ARTIFACT_NAME+ "-for-browsers.2.js",
        format: "umd",
        name: ARTIFACT_NAME
      },
      {
        file: "dist/" +ARTIFACT_NAME+ "-for-browsers.2.min.js",
        format: "umd",
        name: ARTIFACT_NAME
        plugins: [uglify()]
      }
    ],
    plugins: [externalGlobals({util:"util"})]
}
*/
]
;
