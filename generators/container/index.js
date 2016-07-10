/**
 * @module Container
 */

'use strict';

const acorn                       = require('acorn-jsx');
const escodegen                   = require('escodegen-wallaby');
const esformatter                 = require('esformatter');
const esDefaultOpts               = require('esformatter/lib/preset/default.json');
const fs                          = require('fs');
const generators                  = require('yeoman-generator');
const gulpfilter                  = require('gulp-filter');
const gulpif                      = require('gulp-if');
const jp                          = require('jsonpath');
const lodash                      = require('lodash');
const path                        = require('path');

const transformCnt                = require('./transform');

esformatter.register(require('esformatter-jsx'));


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

  }

  writing() {

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
