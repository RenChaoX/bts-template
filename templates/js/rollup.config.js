import fs from 'fs-extra'
import path from 'path'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import nodeResolve from '@rollup/plugin-node-resolve'
import filesize from 'rollup-plugin-filesize'
import babel from '@rollup/plugin-babel'

const pkg = JSON.parse(
  fs.readFileSync(new URL('./package.json', import.meta.url))
),
  banner = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} @${pkg.author.name}.
 * update ${new Date().toLocaleString()}
 */`,
  inputDir = path.join('./src'),
  input = {}

const files = fs.readdirSync(inputDir, {
  encoding: 'utf8'
}) || []

for (const file of files) {
  if(/\.spec\./.test(file)) continue

  input[file.replace('.js', '')] = path.resolve(inputDir, file)
}

const common = {
  banner,
  globals: {
    wx: "wx",
    my: 'my'
  },
  plugins: [

  ]
}

export default {
  input,
  output: [
    {
      entryFileNames: '[name].js',
      dir: 'dist',
      format: "es",
      ...common
    },
    {
      entryFileNames: '[name].cjs.js',
      dir: 'dist',
      format: "cjs",
      ...common
    }
  ],
  plugins: [
    commonjs(),
    nodeResolve(),
    json(),
    filesize(),
    terser(),
    // babel({ babelHelpers: 'bundled' }),
  ]
}
