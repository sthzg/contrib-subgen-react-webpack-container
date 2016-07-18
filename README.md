# contrib-subgen-react-webpack-container

[![Build Status](https://travis-ci.org/sthzg/contrib-subgen-react-webpack-container.svg?branch=develop)](https://travis-ci.org/sthzg/contrib-subgen-react-webpack-container)

This is a sub generator for creating _container_ components with
[Generator React Webpack v4](https://github.com/newtriks/generator-react-webpack). 
It is based on V4 of the generator (currently in beta). To inject 
the sub generator into Generator React Webpack, see the experimental 
[generator-subgenext](https://github.com/sthzg/generator-subgenext).


## What it does

```sh
yo react-webpack:container foo
# Creates src/components/FooContainer.js

yo react-webpack:container foo --component
# Creates src/components/Foo.js and src/components/FooContainer.js. FooContainer.js renders <Foo />
```

The core generator's support for creating namespaced components 
as well as component options (e.g. `--stateless`, `--nostyle`) 
are supported when creating a `--component` along with the container.
