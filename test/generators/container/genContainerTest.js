'use strict';

const assert                      = require('yeoman-assert');
const chai                        = require('chai').assert;
const fs                          = require('fs-extra');
const helpers                     = require('yeoman-test');
const path                        = require('path');


const genpath = (name) => path.join(__dirname, '../../../generators', name);
const nodemod = (name) => path.join(__dirname, '../../../node_modules', name);


function copyToTmp(dir) {
  fs.copySync(
    path.join(__dirname, '../../_assets/.yo-rc.json'),
    path.join(dir, '.yo-rc.json')
  );
}


describe('hostgen:container', () => {

  describe('hostgen:container FooContainer', function() {
    before(function () {
      return helpers
        .run(genpath('container'))
        .withGenerators([path.join(nodemod('generator-react-webpack'), 'generators', 'component')])
        .withArguments(['FooContainer'])
        .inTmpDir(function (dir) { copyToTmp(dir); })
        .toPromise();
    });

    it('creates FooContainer.js and FooContainerTest.js', function () {
      assert.file(['src/components/FooContainer.js']);
      assert.file(['test/components/FooContainerTest.js']);
    });
  });

  describe('hostgen:container foo', function() {
    before(function () {
      return helpers
        .run(genpath('container'))
        .withGenerators([path.join(nodemod('generator-react-webpack'), 'generators', 'component')])
        .withArguments(['foo'])
        .inTmpDir(function (dir) { copyToTmp(dir); })
        .toPromise();
    });

    it('appends Container to created filenames', function () {
      assert.file(['src/components/FooContainer.js']);
      assert.file(['test/components/FooContainerTest.js']);
    });
  });
});
