'use strict';

const acorn                       = require('acorn-jsx');
const escodegen                   = require('escodegen-wallaby');
const esformatter                 = require('esformatter');
const esDefaultOpts               = require('esformatter/lib/preset/default.json');
const fs                          = require('fs');
const jp                          = require('jsonpath');
const lodash                      = require('lodash');
const through                     = require('through2');


function buildCmpImportNode(cmpName) {
  return acorn.parse(`import ${cmpName} from './${cmpName}';`, { sourceType: 'module' }).body[0];
}

function buildCmpRender(cmpName) {
  return acorn.parse(`<${cmpName} />`, { plugins: { jsx: true } });
}


module.exports = function (cntName, cmpName) {
  return through.obj(function (file, encoding, callback) {

    // Parse the content to an AST
    let cntPar = acorn.parse(file.contents.toString(), {
      sourceType: 'module',
      plugins: {
        jsx: true
      }
    });

    // Add an import statement for the root component
    cntPar.body
      .splice(
        lodash.findLastIndex(cntPar.body, n => n.type === 'ImportDeclaration') + 1, 0,
        buildCmpImportNode(cmpName)
      );

    // Modify the Container's render output to render the root component
    jp.value(cntPar, '$..*[?(@.type=="JSXElement")]', buildCmpRender(cmpName).body[0].expression);

    // Get the AST-code as Javascript again
    const jsFromAst = escodegen.generate(cntPar, { format: { indent: { style: '  ' } } });

    // Pretty print the generated code
    // TODO reuse some existing gulp plugin for that or at least provide a separate transform step for it
    const styleOpts = Object.assign({}, esDefaultOpts, {
      "lineBreak": {
        "before": {
          "ClassDeclaration": 2,
          "EndOfFile": 1,
          "ExportAllDeclaration": ">=2",
          "ExportDefaultDeclaration": ">=2",
          "ExportNamedDeclaration": ">=2"
        },
        "after": {
          "ClassClosingBrace": 2
        }
      },
      "jsx": {
        "formatJSX": true,
        "attrsOnSameLineAsTag": false,
        "maxAttrsOnTag": 3,
        "firstAttributeOnSameLine": true,
        "formatJSXExpressions": true,
        "JSXExpressionsSingleLine": true,
        "alignWithFirstAttribute": false,
        "spaceInJSXExpressionContainers": " ",
        "removeSpaceBeforeClosingJSX": false,
        "htmlOptions": {}
      }
    });
    const formatted = esformatter.format('\'use strict\';\n\n' + jsFromAst, styleOpts);

    file.contents = new Buffer(formatted);

    callback(null, file);
  });
};
