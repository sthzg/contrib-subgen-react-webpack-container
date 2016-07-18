/**
 * @module Container
 */

'use strict';

const generators                  = require('yeoman-generator');
const gulpfilter                  = require('gulp-filter');
const lodash                      = require('lodash');

const createCntTest               = require('./transforms').createContainerTest;
const formatCode                  = require('./transforms').formatCode;
const transformCnt                = require('./transforms').transformContainer;


class ContainerGenerator extends generators.Base {

  constructor(...args) {
    super(...args);
  }

  static hasCntPostfix(cntName) {
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

    if (!ContainerGenerator.hasCntPostfix(this.cntName)) {
      this.cntName = this.cntName + 'Container';
    }

    this.cntName = lodash.upperFirst(this.cntName);
    this.cmpName = this.cntName.replace(/(c|C)ontainer$/, '');

    this.composeWith('react-webpack:component', {
      options: Object.assign({}, this.options, { nostyle: true }),
      args: this.args
    });

    if (this.options.component) {
      this.composeWith('react-webpack:component', {
        options: Object.assign({}, this.options),
        args: [this.cmpName]
      });
    }

  }

  writing() {

    if (this.options.component) {

      // Register transformation chain to swap the test file  for the container with our customized template
      const tstFilter = gulpfilter(['**/*ContainerTest.js'], { restore: true });
      this.registerTransformStream([
        tstFilter,
        createCntTest(this.cntName, this.cmpName, this.fs.read(this.templatePath('ContainerTest.js.ejs'))),
        tstFilter.restore
      ]);

      // Register transformation chain to modify the generated container to include our component.
      const cntFilter = gulpfilter(['**/*Container.js'], { restore: true });
      this.registerTransformStream([
        cntFilter,
        transformCnt(this.cmpName),
        formatCode(),
        cntFilter.restore
      ]);
    }
  }

}

module.exports = ContainerGenerator;
