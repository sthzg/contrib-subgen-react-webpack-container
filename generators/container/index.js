'use strict';

const generators                  = require('yeoman-generator');


class Generator extends generators.Base {

  constructor(...args) {
    super(...args);
  }

  _hasCntPostfix(cntName) {
    const regex = new RegExp('[c|C]ontainer$');
    return regex.exec(cntName) !== null;
  }

  initializing() {

    this.argument(
      'cntName', {
        type: String,
        required: true
      });

    if (!this._hasCntPostfix(this.cntName)) {
      this.cntName = this.cntName + 'Container';
    }

    this.composeWith('react-webpack:component', {
      options: Object.assign({}, this.options, { nostyle: true }),
      args: this.args
    });
  }

  writing(foo) {
  }

}

module.exports = Generator;
