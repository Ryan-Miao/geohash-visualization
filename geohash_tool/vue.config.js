const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// vue.config.js
module.exports = {
    // 选项...
    // 部署应用包时的基本 URL
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    // 输出文件目录。默认dist
    outputDir: 'dist',
    // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
    assetsDir: '',
    // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径
    // indexPath: 'index.html',
    // 生成的静态资源在它们的文件名中包含 hash 以便更好的控制缓存
    // filenameHashing: true,
    // multi-page 模式下构建应用.多页面时配置
    // pages: {},
    // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码. 可选值：boolean | 'warning' | 'default' | 'error'
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    // 是否使用包含运行时编译器的 Vue 构建版本.为true时增加10kb
    runtimeCompiler: false,
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    // 修改webpack配置
    configureWebpack: (config) => {
        if (process.env.NODE_ENV == 'production') {
            config.mode = 'production'
        } else {
            config.mode = 'development'
        }
        // 不进行打包的模块
        config['externals'] = {
            'AMap': 'AMap',
            // 'Loca': 'Loca',
            // 'AMapUI': 'AMapUI',
            // 'wx': 'wx'
        }
        config['plugins'].push(new BundleAnalyzerPlugin({ analyzerPort: 8919 }))
    },
    // 修改webpack配置
    // chainWebpack: (config) => {
    // },
    // 参考webpack-dev-serve
    devServer: {
        port: 9003
    }
}