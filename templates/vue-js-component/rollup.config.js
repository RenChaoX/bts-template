import fs from 'fs-extra'
import path from 'path'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import nodeResolve from '@rollup/plugin-node-resolve'
import filesize from 'rollup-plugin-filesize'
import babel from '@rollup/plugin-babel'
import vue from 'rollup-plugin-vue'
import alias from '@rollup/plugin-alias'
import image from '@rollup/plugin-image'
import postcss from 'rollup-plugin-postcss'
import svg from 'rollup-plugin-svg'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import px2rem from 'postcss-plugin-px2rem'
import autoprefixer from 'autoprefixer'

const isDev = process.env.NODE_ENV === 'development',
  pkg = JSON.parse(
    fs.readFileSync(new URL('./package.json', import.meta.url))
  ),
  banner = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} @${pkg.author.name}.
 * update ${new Date().toLocaleString()}
 */`

const common = {
  banner,
  globals: {
    wx: "wx",
    my: 'my',
    vue: 'Vue'
  },
  plugins: [],
  inlineDynamicImports: true
}

const config = {
  input: './src/index.js',
  external: ['vue'],
  output: [
    {
      name: 'AppName',
      entryFileNames: 'index.js',
      dir: 'dist',
      format: "umd",
      ...common
    }
  ],
  plugins: [
    alias({}),
    vue({
      css: true,
      compileTemplate: true
    }),
    commonjs(),
    nodeResolve({
      extensions: ['.vue'], // 无后缀名引用时，需要识别 .vue 文件
      exclude: '**/node_modules/**'  // 排除node_modules
    }),
    json(),
    filesize(),
    babel({  // 排除node_modules
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    image(),
    svg(),
    postcss({
      extract: true,
      minimize: !isDev, // 生产环境开启压缩
      extensions: ['.css', '.scss'], // 识别css和scss文件
      plugins: [
        autoprefixer,
        px2rem({
          rootValue: 50, // 换算基数，1rem相当于10px,值为37.5时,1rem为20px,淘宝的flex默认为1rem为10px
          // unitPrecision: 5, // 允许REM单位增长到的十进制数字。
          //propWhiteList: [],  // 默认值是一个空数组，这意味着禁用白名单并启用所有属性。
          // propBlackList: ['font-size', 'border'], // 黑名单
          exclude: /(node_module)/, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)\/如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
          // selectorBlackList: [], //要忽略并保留为px的选择器
          // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
          // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
          mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
          minPixelValue: 2, //设置要替换的最小像素值(3px会被转rem)。 默认 0
        }),
      ],
    }),
  ]
}

if (isDev) {
  // 开启热更新
  config.plugins.push(livereload(), serve({
    host: 'localhost',
    port: 8099,
    open: true,
    openPage: 'examples',
    verbose: true,
    contentBase: ['examples', 'dist'],
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    onListening: function (server) {
      const address = server.address()
      const host = address.address === '::' ? 'localhost' : address.address
      // by using a bound function, we can access options as `this`
      const protocol = 'http'

      console.log(`Server listening at ${protocol}://${host}:${address.port}/`)
    }
  }))
} else {
  // 压缩丑化
  config.plugins.push(terser())
}

export default config
