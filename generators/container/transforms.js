'use strict';

const acorn                       = require('acorn-jsx');
const ejs                         = require('ejs');
const escodegen                   = require('escodegen-wallaby');
const esformatter                 = require('esformatter');
const fs                          = require('fs');
const jp                          = require('jsonpath');
const lodash                      = require('lodash');
const through                     = require('through2');

const esOpts                      = require('./constants').esOpts;


/**
 * @private Builds an AST Node for an import statement of {@code cmpName}.
 *
 * @param {string} cmpName
 * @returns {Object}
 */
const buildCmpImportNode = (cmpName) =>
  acorn.parse(`import ${cmpName} from './${cmpName}';`, { sourceType: 'module' }).body[0];


/**
 * @private Builds an AST Node for a JSX statement of {@code <cmpName />}.
 *
 * @param {string}cmpName
 * @returns {Object}
 */
const buildCmpRender = (cmpName) =>
  acorn.parse(`<${cmpName} />`, { plugins: { jsx: true } });


/**
 * Transforms the container component that is generated from the core generator to represent a container.
 *
 * @param {string} cmpName
 */
function transformContainer(cmpName) {
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
    jp.value(
      cntPar,
      '$..*[?(@.type=="JSXElement")]',
      buildCmpRender(cmpName).body[0].expression
    );

    file.contents = new Buffer(escodegen.generate(cntPar, { format: { indent: { style: '  ' } } }));

    callback(null, file);
  });
}


/**
 * Transforms the file stream to format the source code.
 */
function formatCode() {
  return through.obj(function (file, encoding, callback) {

    let formatted = esformatter.format(file.contents.toString(), esOpts);

    // With the existing tools I haven't found a way to format <Foo/> as <Foo />. The space before the closing
    // bracket is required for the Airbnb eslint rules to validate the file. The following replace() just adds that
    // in manually. Hopefully this can be replaced with a slution integrated into the above tooling sometime.
    formatted = formatted.replace(/(<[\w]*)(\/>)/g, '$1 $2');

    file.contents = new Buffer(formatted);

    callback(null, file);
  });
}


/**
 * Transforms the file stream of the container test file to build with our custom container template.
 *
 * @param {string} cntName
 * @param {string} cmpName
 * @param {string} testTpl
 */
function createContainerTest(cntName, cmpName, testTpl) {
  return through.obj(function (file, encoding, callback) {

    file.contents = new Buffer(ejs.compile(testTpl)({ cntName, cmpName }));
    callback(null, file);
  });
}


module.exports = {
  formatCode,
  transformContainer,
  createContainerTest
};
