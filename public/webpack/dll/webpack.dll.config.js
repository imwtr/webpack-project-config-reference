let path = require('path');
let webpack = require('webpack');

module.exports = {
    entry: {
        // 需要预配置动态链接的库
        vendor: [
            'babel-polyfill',
            // 'echarts'
            'react',
            // 'redux',
            // 'react-redux',
            'react-dom',
            // 'react-router'
        ]
    },

    // 启用sourceMap
    // devtool: 'cheap-module-source-map',

    output: {
        path: path.resolve(__dirname, './'),
        filename: '[name].js',
        library: '[name]_library_wcr'
    },

    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, './', '[name].manifest.json'),
            name: '[name]_library_wcr'
        })
    ]
}
