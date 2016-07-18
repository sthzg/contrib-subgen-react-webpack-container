# contrib-subgen-react-webpack-container

[![Build Status](https://travis-ci.org/sthzg/contrib-subgen-react-webpack-container.svg?branch=develop)](https://travis-ci.org/sthzg/contrib-subgen-react-webpack-container)

This is a sub generator for creating _container_ components with
[Generator React Webpack v4](https://github.com/newtriks/generator-react-webpack).

To inject the sub generator into Generator React Webpack, see the experimental [generator-subgenext](https://github.com/sthzg/generator-subgenext).


## What it does

```sh
react-webpack:container foo
# Creates FooContainer.js

react-webpack:container foo --component
# Creates Foo.js and FooContainer.js. FooContainer.js renders <Foo />
```
