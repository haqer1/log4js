import commonjs from "@rollup/plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";
import nodeBuiltins from "rollup-plugin-node-builtins";
import replace from 'rollup-plugin-re';
//import externalGlobals from "rollup-plugin-external-globals";
//import ignoreImport from 'rollup-plugin-ignore-import';

const ARTIFACT_NAME = "log4js";
export default [
{
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
    plugins: [commonjs(), nodeBuiltins()]
},
{
    input: "src/main/js/index.js",
    output: [
      {
        file: "dist/" +ARTIFACT_NAME+ "-for-browsers.js",
        format: "umd",
        name: ARTIFACT_NAME
      },
      {
        file: "dist/" +ARTIFACT_NAME+ "-for-browsers.min.js",
        format: "umd",
        name: ARTIFACT_NAME,
        plugins: [uglify()]
      }
    ],
    plugins: [
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
{
    input: "src/main/js/index.js",
    output: [
      {
        file: "dist/" +ARTIFACT_NAME+ "-for-browsers.2.js",
        format: "umd",
        name: ARTIFACT_NAME
      }
    ],
    plugins: [externalGlobals({util:"util"})]
},
{
    input: "src/main/js/index.js",
    output: [
      {
        file: "dist/" +ARTIFACT_NAME+ "-for-browsers.2.min.js",
        format: "umd",
        name: ARTIFACT_NAME
      }
    ],
    plugins: [externalGlobals({util:"util"}),uglify()]
}*/
]
;
