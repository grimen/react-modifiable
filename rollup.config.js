
/* =========================================
      IMPORTS
-------------------------------------- */

import babel from 'rollup-plugin-babel'
// import { eslint } from 'rollup-plugin-eslint'

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

import pkg from './package.json'


/* =========================================
      CONFIG
-------------------------------------- */

const config = {
    input: 'src/index.js',
    output: {
        name: pkg.name,
        file: pkg.module,
        format: 'esm',
        // format: 'iife',
    },
    sourcemap: true,
    plugins: [
        resolve({
            jsnext: true,
            browser: true,
            main: true,
        }),
        // eslint(),
        commonjs({
            include: 'node_modules/**',
        }),
        babel({
            exclude: 'node_modules/**',
        }),
    ],
    external: [
        'debug',
        'classnames',
        'react',
        'react-dom',
    ],
}


/* =========================================
      EXPORTS
-------------------------------------- */

export default config
