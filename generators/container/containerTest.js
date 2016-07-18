'use strict';

const ejs                         = require('ejs');
const lodash                      = require('lodash');
const through                     = require('through2');


/**
 * Renders our modified template to create a container test.
 *
 * See `generators/container/templates/ContainerTest.js.ejs` for the template.
 *
 * @param {string} cntName
 * @param {string} cmpName
 * @param {string} testTpl
 */
module.exports = function (cntName, cmpName, testTpl) {
  return through.obj(function (file, encoding, callback) {
    const template = ejs.compile(testTpl);

    file.contents = new Buffer(template({ cntName, cmpName }));

    callback(null, file);
  });
};
