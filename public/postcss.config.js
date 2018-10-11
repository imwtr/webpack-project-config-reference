// postcss config

const postcss = require('postcss');

module.exports = {
    plugins: [
        require('postcss-preset-env')()
    ]
};
