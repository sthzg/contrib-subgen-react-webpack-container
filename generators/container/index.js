/**
 * @module Container
 */

'use strict';

const acorn                       = require('acorn-jsx');
const escodegen                   = require('escodegen-wallaby');
const esformatter                 = require('esformatter');
const fs                          = require('fs');
const generators                  = require('yeoman-generator');
const gulpfilter                  = require('gulp-filter');
const lodash                      = require('lodash');
const path                        = require('path');

const containerTest               = require('./containerTest');
const transformCnt                = require('./transform');


class ContainerGenerator extends generators.Base {

  constructor(...args) {
    super(...args);
  }

  static _hasCntPostfix(cntName) {
    const regex = new RegExp('[c|C]ontainer$');
    return regex.exec(cntName) !== null;
  }

  initializing() {

    this.argument(
      'cntName', {
        type: String,
        required: true
      });

    this.option(
      'component', {
        desc: 'Create a Root Component and render it from the Container'
      }
    );

    if (!ContainerGenerator._hasCntPostfix(this.cntName)) {
      this.cntName = this.cntName + 'Container';
    }

    this.cntName = lodash.upperFirst(this.cntName);
    this.cmpName = this.cntName.replace(/(c|C)ontainer$/, '');

    this.composeWith('react-webpack:component', {
      options: Object.assign({}, this.options, { nostyle: true }),
      args: this.args
    });

    this.composeWith('react-webpack:component', {
      options: Object.assign({}, this.options),
      args: [this.cmpName]
    });

  }

  writing() {

    // Swap the test file  for the container with our customized template
    const tstFilter = gulpfilter(['**/*ContainerTest.js'], { restore: true });
    this.registerTransformStream([
      tstFilter,
      containerTest(this.cntName, this.cmpName, this.fs.read(this.templatePath('ContainerTest.js.ejs'))),
      tstFilter.restore
    ]);

    if (this.options.component) {
      const cntFilter = gulpfilter(['**/*Container.js'], { restore: true });
      this.registerTransformStream([
        cntFilter,
        transformCnt(this.cntName, this.cmpName),
        cntFilter.restore
      ]);
    }
  }

}

module.exports = ContainerGenerator;
