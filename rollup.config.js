import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import { uglify } from 'rollup-plugin-uglify'

import babel from 'rollup-plugin-babel'
// import ts from 'rollup-plugin-typescript'

import pkg from './package.json'

const extensions = [
  '.ts', '.tsx',
]

export default {
  input: './src/Subscriber',

  external: [
    'pouchdb-adapter-memory',
    'pouchdb-adapter-idb',
    'pouchdb-adapter-http',
    'rxdb',
    'rxjs',
    'mobx',
    '@babel/**',
    '@babel/runtime/helpers/objectSpread',
    '@babel/runtime/helpers/defineProperty',
    '@babel/runtime/helpers/asyncToGenerator',
    '@babel/runtime/helpers/applyDecoratedDescriptor',
    '@babel/runtime/helpers/initializerWarningHelper',
    '@babel/runtime/regenerator',
    '@babel/runtime/helpers/toConsumableArray',
    '@babel/runtime/helpers/classCallCheck',
    '@babel/runtime/helpers/createClass'
  ],

  plugins: [
    globals(),

    // Allows node_modules resolution
    resolve({
      modulesOnly: true,
      extensions,
      preferBuiltins: false
    }),

    commonjs({
      include: ['node_modules/**/*'],
      ignore: ["conditional-runtime-dependency"],
      namedExports:  {}
    }),
    babel({ extensions, externalHelpers: true, runtimeHelpers: true }),
    builtins(),
    uglify()
  ],

  output: {
    file: pkg.main,
    format: 'cjs'
  }
}
