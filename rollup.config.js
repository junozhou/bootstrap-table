import glob from 'glob'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import minify from 'rollup-plugin-babel-minify'
import inject from 'rollup-plugin-inject'
import multiEntry from 'rollup-plugin-multi-entry'

const files = glob.sync('src/**/*.js', {
  ignore: ['src/constants/**', 'src/utils/**', 'src/virtual-scroll/**']
})
const external = ['jquery']
const globals = {
  jquery: 'jQuery'
}
const config = []
const plugins = [
  inject({
    include: '**/*.js',
    exclude: 'node_modules/**',
    $: 'jquery'
  }),
  resolve(),
  commonjs(),
  babel({
    exclude: 'node_modules/**'
  })
]

if (process.env.NODE_ENV === 'production') {
  plugins.push(minify({
    comments: false
  }))
}

for (const file of files) {
  let out = `dist/${file.replace('src/', '')}`
  if (process.env.NODE_ENV === 'production') {
    out = out.replace(/.js$/, '.min.js')
  }
  config.push({
    input: file,
    output: {
      name: 'BootstrapTable',
      file: out,
      format: 'umd',
      globals
    },
    external,
    plugins
  })
}

let out = 'dist/bootstrap-table-locale-all.js'
if (process.env.NODE_ENV === 'production') {
  out = out.replace(/.js$/, '.min.js')
}
config.push({
  input: 'src/locale/**/*.js',
  output: {
    name: 'BootstrapTable',
    file: out,
    format: 'umd',
    globals
  },
  external,
  plugins: [
    multiEntry(),
    ...plugins
  ]
})

export default config
