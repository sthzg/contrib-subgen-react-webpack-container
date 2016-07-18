const esDefaultOpts               = require('esformatter/lib/preset/default.json');

const esOpts = Object.assign({}, esDefaultOpts, {
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
    "formatJSX": false,
    "attrsOnSameLineAsTag": false,
    "maxAttrsOnTag": 3,
    "firstAttributeOnSameLine": false,
    "formatJSXExpressions": false,
    "JSXExpressionsSingleLine": true,
    "alignWithFirstAttribute": false,
    "spaceInJSXExpressionContainers": " ",
    "removeSpaceBeforeClosingJSX": false,
    "htmlOptions": {}
  }
});

module.exports = {
  esOpts
};
