'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')
const webpack = require('webpack')

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
        publicPath: '../../'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  function lessResourceLoader() {
    var loaders = [
      cssLoader,
      'less-loader',
      {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            path.resolve(__dirname, '../src/commons/css/common.less'),
          ]
        }
      }
    ];
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
        publicPath: '../../'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: lessResourceLoader(), // generateLoaders('less')
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

// glob是webpack安装时依赖的一个第三方模块，还模块允许你使用 *等符号, 例如lib/*.js就是获取lib文件夹下的所有js后缀名的文件
const glob = require('glob')

// 页面模板
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin-for-multihtml');

// 用于做相应的merge处理
const merge = require('webpack-merge')

// 设置入口模块
const entryModule = 'rbac';

// 获取所有模块
let moduleList = []
let moduleSrcArray = glob.sync('./src/modules/*');
for(let key in moduleSrcArray){
  moduleList.push(moduleSrcArray[key].split('/')[3])
}
moduleList = ['apps'];

// 检查是否有重复的模块
let checkModule = function () {
  var module = process.env.MODULE_ENV
  var hash = {}
  var repeatList = []
  for(var l = 0;l < moduleList.length; l++){
    if(hash[moduleList[l]]){
      repeatList.push(moduleList[l])
    }
    hash[moduleList[l]] = true
  }
  if(repeatList.length > 0){
    console.log('moduleList 有重复：',repeatList.toString());
    return false
  }
  let result = true
  let illegalParam = ''
  for (let moduleToBuild of module.split(',')) {
    if (moduleList.indexOf(moduleToBuild) === -1) {
      result = false
      illegalParam = moduleToBuild
      break
    }
  }
  if(result === false){
    console.log('允许的参数为：',moduleList.toString());
    console.log('非法参数：',illegalParam)
  }
  return result
}

// 获取当前要打包的模块列表
function getModuleToBuild () {
  let moduleToBuild = []
  if (process.env.NODE_ENV === 'production') {
    if (process.env.MODULE_ENV !== 'undefined') {
      moduleToBuild = process.env.MODULE_ENV.split(',')
    } else {
      moduleToBuild = moduleList
    }
  } else {
    moduleToBuild = moduleList
  }
  return moduleToBuild
}

exports.moduleList = moduleList
exports.checkModule = checkModule
exports.getModuleToBuild = getModuleToBuild


//多入口配置
exports.entries = function () {
  var map = {}
  let moduleToBuild = getModuleToBuild();
  moduleToBuild.forEach(module => {
    map[module] = `./src/modules/${module}/main.js`
  })
  console.log('moduleToBuild', moduleToBuild);
  return map
}

// 多页面输出配置
exports.htmlPlugin = function () {
  let arr = []
  let moduleToBuild = getModuleToBuild();
  moduleToBuild.forEach((module) => {
    let conf = {
      // 名称
      filename: module === entryModule ? 'index.html' : `${module}.html`,
      // 模板来源
      template: `./src/modules/${module}/index.html`,
      // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
      chunks: ['manifest', 'vendor', 'common' ,module],
      // chunks: ['manifest', 'vendor' ,module],
      // 控制静态资源注入位置
      inject: true,
      multihtmlCache: true, //解决多页面热更新的关键
      favicon: './favicon.ico'
    }
    if (process.env.NODE_ENV === 'production') {
      // 判断一下是否为独立打包模式
      if (process.env.MODE_ENV === 'separate' || process.env.MODULE_ENV !== 'undefined') {
        conf.filename = config.build.index
      }
      conf = merge(conf, {
        // 对html文件压缩处理
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        // 代码块排序
        // chunksSortMode: 'dependency', // 按文件的依赖关系来排序。
        // 处理HtmlWebpackPlugin顺序问题
        chunksSortMode: function (chunk1, chunk2) {
          var order1 = conf.chunks.indexOf(chunk1.names[0])
          var order2 = conf.chunks.indexOf(chunk2.names[0])
          return order1 - order2
        },
      })
    }
    arr.push(new HtmlWebpackPlugin(conf))
  })
  return arr
}

// 添加公共代码块
exports.addCommonsChunk = function () {
  let arr = [];
  let htModules = ['ops','apps'];
  let moduleToBuild = getModuleToBuild();
  if (process.env.NODE_ENV === 'production') {
    if (process.env.MODE_ENV === 'undefined' && process.env.MODULE_ENV === 'undefined') {
      arr.push(
        new webpack.optimize.CommonsChunkPlugin({
          name: 'common',
          chunks: moduleList,
          minChunks: 2
        }));

      // TODO: 体积最小方案
      // moduleToBuild.forEach(module => {
      //   arr.push(new webpack.optimize.CommonsChunkPlugin({
      //     name: module,
      //     async: 'vendor-async',
      //     children: true,
      //     minChunks: 2
      //   }))
      // })
      // TODO: 目前综合最优方案
      moduleToBuild.forEach(module => {
        if (htModules.includes(module)) {
          arr.push(new webpack.optimize.CommonsChunkPlugin({
            name: module,
            async: 'vendor-async-ht',
            children: true,
            minChunks(module,count) {
              return (
                module.resource &&
                /\.js$/.test(module.resource) &&
                (module.resource.indexOf('HT') !== -1)
              );
            }
          }))
        }
      });
      moduleToBuild.forEach(module => {
        arr.push(new webpack.optimize.CommonsChunkPlugin({
          name: module,
          async: 'vendor-async-node_modules',
          children: true,
          minChunks(module,count) {
            // any required modules inside node_modules are extracted to vendor
            return (
              module.resource &&
              /\.js$/.test(module.resource) &&
              (module.resource.indexOf('html2canvas') !== -1
                || module.resource.indexOf('quill') !== -1
                || module.resource.indexOf('jspdf') !== -1
                || module.resource.indexOf('codemirror') !== -1
                || module.resource.indexOf('lodash') !== -1
              )
            );
          }
        }))
      })
    }
  }else {
    arr.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        chunks: moduleList,
        minChunks: 2
      }));
    moduleToBuild.forEach(module => {
      if (htModules.includes(module)) {
        arr.push(new webpack.optimize.CommonsChunkPlugin({
          name: module,
          async: 'vendor-async-ht',
          children: true,
          minChunks(module,count) {
            return (
              module.resource &&
              /\.js$/.test(module.resource) &&
              (module.resource.indexOf('HT') !== -1)
            );
          }
        }))
      }
    });
    moduleToBuild.forEach(module => {
      arr.push(new webpack.optimize.CommonsChunkPlugin({
        name: module,
        async: 'vendor-async-node_modules',
        children: true,
        minChunks(module,count) {
          // any required modules inside node_modules are extracted to vendor
          return (
            module.resource &&
            /\.js$/.test(module.resource) &&
            (module.resource.indexOf('html2canvas') !== -1
              || module.resource.indexOf('quill') !== -1
              || module.resource.indexOf('jspdf') !== -1
              || module.resource.indexOf('codemirror') !== -1 )
          );
        }
      }))
    })
  }
  return arr
}


