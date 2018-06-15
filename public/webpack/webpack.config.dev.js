let path = require('path'),
    webpack = require('webpack'),
    merge = require('webpack-merge'),

    commonConfig = require('./webpack.config.common.js'),

    configs = require('./webpack.config.js'),

    WDS_SCHEME = process.env.WDS_SCHEME || 'http',

    getFreePort = require('./getFreePortSync'),

    freePort = getFreePort();

/**
 * 开发环境Webpack打包配置，整合公共部分
 * @type {[type]}
 */
module.exports = merge(commonConfig, {
    // devtool: 'inline-source-map',

    // 开发环境设置本地服务器，实现热更新
    devServer: {
        contentBase: path.resolve(__dirname, '../'),
        // 提供给外部访问
        host: '0.0.0.0',
        port: freePort,
        // 允许开发服务器访问本地服务器的包JSON文件，防止跨域
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        // 设置热替换
        hot: true,
        // 设置页面引入
        inline: true,
        disableHostCheck: true
    },

    // 文件输出配置
    output: {
        // 设置路径，防止访问本地服务器相关资源时，被开发服务器认为是相对其的路径
        publicPath: WDS_SCHEME + '://localhost:' + freePort + '/dist/js/',
    },

    // 模块的处理配置，匹配规则对应文件，使用相应loader配置成可识别的模块
    module: {
        rules: [{
            test: /\.(png|gif|jpg)$/,
            // 处理图片，当大小在范围之内时，图片转换成Base64编码，否则将使用file-loader引入
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8192
                }
            }]
        }, {
            test: /\.(eot|svg|ttf|otf|woff|woff2)\w*/,
            // 引入文件
            use: 'file-loader'
        }]
    },

    // 插件配置
    plugins: [
        // 热更新替换
        new webpack.HotModuleReplacementPlugin()
    ]
});
