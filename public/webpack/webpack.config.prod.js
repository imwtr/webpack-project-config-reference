let path = require('path'),
    webpack = require('webpack'),
    merge = require('webpack-merge'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),

    commonConfig = require('./webpack.config.common.js'),

    configs = require('./webpack.config.js');

/**
 * 生产环境Webpack打包配置，整合公共部分
 * @type {[type]}
 */
module.exports = merge(commonConfig, {
    // 生产环境不开启sourceMap
    devtool: false,

    // 文件输出配置
    output: {
        // 设置文件引用主路径
        publicPath: configs.outputPublicPath
    },

    // 模块的处理配置，匹配规则对应文件，使用相应loader配置成可识别的模块
    module: {
        rules: [{
            test: /\.(png|gif|jpg)$/,
            use: [{
                loader: 'url-loader',
                // 处理图片，当大小在范围之内时，图片转换成Base64编码，否则将使用file-loader引入
                options: {
                    limit: 8192,
                    // 设置生成图片的路径名字信息 [path]相对context，outputPath输出的路径，publicPath相应引用的路径
                    name: '[path][name].[ext]?[hash:8]',
                    outputPath: '../',
                    publicPath: configs.outputPublicPath + '../',
                }
            }]
        }, {
            test: /\.(eot|svg|ttf|otf|woff|woff2)\w*/,
            use: [{
                loader: 'file-loader',
                options: {
                    // 设置生成字体文件的路径名字信息 [path]相对context，outputPath输出的路径，publicPath相应引用的主路径
                    name: '[path][name].[ext]?[hash:8]',
                    outputPath: '../',
                    publicPath: configs.outputPublicPath + '../',
                }
            }],
        }]
    },

    // 插件配置
    plugins: [
        // 清理生成的文件目录
        new CleanWebpackPlugin([path.resolve(__dirname, '../', configs.outputPath, '../')]),

        new webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 10
        })
    ]
});
