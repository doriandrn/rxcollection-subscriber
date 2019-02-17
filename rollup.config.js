import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins'

import babel from 'rollup-plugin-babel'
import ts from 'rollup-plugin-typescript'

import pkg from './package.json'

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
]

export default {
  input: './src/Subscriber',

  external: [
    'pouchdb-adapter-memory',
    'pouchdb-adapter-idb',
    'pouchdb-adapter-http',
    'rxdb',
    'rxjs',
    'mobx'
  ],

  plugins: [
    // Allows node_modules resolution
    resolve({
      modulesOnly: true,
      extensions,
      preferBuiltins: false
    }),

    ts(),

    commonjs({
      include: ['node_modules/**/*'],
      ignore: ["conditional-runtime-dependency"],
      namedExports:  {}
    }),

    // Compile TypeScript/JavaScript files
    babel({ extensions, include: ['src/**/*'], runtimeHelpers: true }),

    builtins()
  ],

  output: {
    file: pkg.main,
    format: 'cjs'
  }
}
