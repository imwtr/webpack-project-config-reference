let path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin'),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    WebpackBuildNotifierPlugin = require('webpack-build-notifier'),
    AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin'),
    StyleLintPlugin = require('stylelint-webpack-plugin'),
    TimeFixPlugin = require('time-fix-plugin'),
    BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,

    configs = require('./webpack.config.js'),

    // 是否生产环境
    isProduction = process.env.NODE_ENV === 'production',

    // 并行执行loader
    HappyPack = require('happypack'),

    os = require('os'),

    happyThreadPool = HappyPack.ThreadPool({
        size: os.cpus().length
    }),

    processEntity = `${configs.versionControl || 'branch'}--${configs.name || 'anonymous'}--[${process.env.NODE_ENV}]`,

    // 当前目录相对于JS输出模块的路径，因大部分资源的生成路径相对于JS输出模块路径
    cwdRalativeOutputPath = path.relative(path.resolve(__dirname, '../', configs.outputPath), __dirname);

process.title = processEntity;

console.log(processEntity, '\n');

// failOnError使用起来不方便
configs.lint.css.failOnError = false;
configs.lint.js.failOnError = false;

/**
 * 基础公共Webpack打包配置
 * @type {Object}
 */
let commonConfig = {
    // 上下文位置
    context: path.resolve(__dirname, '../'),

    mode: process.env.NODE_ENV,

    // 启用sourceMap
    devtool: 'cheap-module-source-map',

    // 文件入口配置
    entry: configs.entry,

    // 文件输出配置
    output: {
        // 输出所在目录
        path: path.resolve(__dirname, '../', configs.outputPath),
        // 开发环境使用热更新，方便编译，可以直接不用hash
        filename: '[name].js' + (isProduction ? '?[chunkhash:8]' : ''),
        jsonpFunction: `${configs.name || 'anonymous'}JF`
    },

    // 模块使用外部定义
    externals: {
        jquery: 'window.$'
    },

    // 性能相关配置
    performance: {
        maxAssetSize: 760 * 1024,
        maxEntrypointSize: 500 * 1024
    },

    // 合并优化方式
    optimization: {
        runtimeChunk: {
            name: 'common'
        },
        concatenateModules: true,
        // 设为true会导致lint的检查输出不到文件中
        noEmitOnErrors: false,
        splitChunks: {
            chunks(chunk) {
                // 不需要提取公共代码的模块
                return !(configs.commonChunkExcludes || []).includes(chunk.name);
            },
            name: 'common',
            minChunks: 2,
            cacheGroups: {
                default: false,
                styles: {
                    name: 'common',
                    test: /\.scss|css$/,
                    chunks: 'initial',
                    // 不生成公共样式文件
                    minChunks: 999999,
                    enforce: true
                }
            }
        }
    },

    // 处理相关文件的检索及引用方式
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        modules: ['node_modules']
    },

    // 模块的处理配置，匹配规则对应文件，使用相应loader配置成可识别的模块
    module: {
        rules: [{
            test: /\.css$/,
            // 提取CSS文件
            loaders: [
                // 如果配置成不提取，则此类文件使用style-loader插入到<head>标签中
                isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                'happypack/loader?id=css'
            ]
        }, {
            test: /\.scss$/,
            // 编译Sass文件 提取CSS文件
            loaders: [
                // 如果配置成不提取，则此类文件使用style-loader插入到<head>标签中
                isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                'happypack/loader?id=scss'
            ]
        }, {
            test: /\.jsx?$/,
            // 编译js或jsx文件，使用babel-loader转换es6为es5
            exclude: /node_modules/,
            loader: 'happypack/loader?id=js'
        }, {
            test: /\.html$/,
            loader: 'happypack/loader?id=html'
        }]
    },

    // 插件配置
    plugins: [
        new TimeFixPlugin(),
        new WebpackBuildNotifierPlugin({
            title: processEntity,
            suppressSuccess: false,
            suppressCompileStart: false,
            suppressWarning: false,
            activateTerminalOnError: true
        }),
        new MiniCssExtractPlugin({
            filename: '../css/[name].css?[contenthash:8]'
        }),
        new HappyPack({
            id: 'css',
            loaders: [{
                loader: 'css-loader',
                options: {
                    // url: false,
                    minimize: true
                }
            }, {
                'loader': 'sprite-loader'
            }]
        }),
        new HappyPack({
            id: 'scss',
            loaders: [{
                loader: 'css-loader',
                options: {
                    // url: false,
                    minimize: true
                }
            }, {
                'loader': 'sprite-loader'
            }, {
                loader: 'sass-loader',
                options: {
                    sourceMap: true,
                    // sprite-loader需要通过注释检测是否开启sprite合并, 这里不压缩防止注释被去掉
                    // outputStyle: 'compressed'
                }
            }]
        }),
        new HappyPack({
            id: 'js',
            use: configs.lint.js.open ? [{
                loader: 'babel-loader',
                options: {
                    // cacheDirectory: true
                }
            }, {
                enforce: 'pre',
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    fix: configs.lint.js.autoFix,
                    cache: true,
                    emitWarning: !configs.lint.js.emitAsError,
                    failOnError: configs.lint.js.failOnError,
                    formatter: require('eslint-friendly-formatter'),
                    outputReport: {
                        filePath: cwdRalativeOutputPath + '/lint/js/[name].xml',
                        formatter: require('eslint-friendly-formatter')
                    }
                }
            }] : [{
                loader: 'babel-loader',
                options: {
                    // cacheDirectory: true
                }
            }]
        }),
        new HappyPack({
            id: 'html',
            use: configs.lint.html.open ? [{
                loader: 'ejs-loader',
                options: {

                }
            }, {
                loader: 'htmlhint-loader',
                enforce: 'pre',
                exclude: /node_modules/,
                options: {
                    configFile: configs.lint.html.configFile,
                    failOnError: configs.lint.html.failOnError,
                    outputReport: {
                        filePath: cwdRalativeOutputPath + '/lint/html/[name].xml'
                    }
                }
            }] : [{
                loader: 'ejs-loader',
                options: {

                }
            }]
        }),

        // 定义变量，此处定义NODE_ENV环境变量，提供给生成的模块内部使用
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        })
    ]
};

// 打包模块分析
if (process.argv.includes('--analysis')) {
    commonConfig.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: require('./getFreePortSync')(),
        reportFilename: 'report.html',
        defaultSizes: 'parsed',
        openAnalyzer: true,
        generateStatsFile: false,
        statsFilename: 'stats.json',
        statsOptions: null,
        logLevel: 'info'
    }));
}

// stylelint检查
if (configs.lint.css.open) {
    commonConfig.plugins.push(new StyleLintPlugin({
        fix: configs.lint.css.autoFix,
        emitErrors: configs.lint.css.emitAsError,
        failOnError: configs.lint.css.failOnError,
        formatter: require('stylelint-formatter-pretty')
    }));
}

// 设置编译文件页面文件资源模块的引入
(configs.htmlWebpackPlugin || []).forEach(html => {
    Object.assign(html, {
        inject: false,
        alwaysWriteToDisk: true
    });

    commonConfig.plugins.push(new HtmlWebpackPlugin(html));
});

commonConfig.plugins.push(new HtmlWebpackHarddiskPlugin());

// 动态链接库引用配置
if (configs.vendorDllOpen) {
    let addAssetHtmlPluginOption = {
        filepath: require.resolve('./dll/vendor.js'),
        includeSourcemap: false,
        hash: true
    };

    if (configs.vendorDllInsertFiles !== 'all') {
        Object.assign(addAssetHtmlPluginOption, {
            files: configs.vendorDllInsertFiles
        });
    }

    commonConfig.plugins.push(
        new webpack.DllReferencePlugin({
            manifest: require(path.join(__dirname, './dll/', 'vendor.manifest.json')),
        }),
        new AddAssetHtmlPlugin(addAssetHtmlPluginOption)
    );
}

module.exports = commonConfig;
