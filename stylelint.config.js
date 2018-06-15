/**
 * 自定义的StyleLint配置项
 * 规则中文 @see http://stylelint.cn/user-guide/rules/
 * 规则英文 @see https://stylelint.io/user-guide/rules/
 *
 * 使用注释自定义规则 @see https://github.com/stylelint/stylelint/blob/master/docs/user-guide/configuration.md#turning-rules-off-from-within-your-css
 */

let NODE_DIR = 'C:/Users/e470/AppData/Roaming/npm/node_modules/';

module.exports = {
    // 以此规则集为基础
    extends: [
        // 默认规则 @see https://github.com/stylelint/stylelint-config-standard/blob/master/index.js
        NODE_DIR + 'stylelint-config-standard'
    ],
    // 检查html文件（或tpl文件）中的CSS
    processors: [
        // NODE_DIR + 'postcss-html',
        // NODE_DIR + 'stylelint-processor-html',
        // NODE_DIR + '@mapbox/stylelint-processor-arbitrary-tags'
    ],
    // 自定义的规则
    rules: {
        // 颜色值避免直接使用颜色名
        'color-named': [
            'never', {
                ignore: ['inside-function']
            }
        ],
        // 使用数字或命名的 (可能的情况下) font-weight 值
        'font-weight-notation': 'numeric',
        // 在函数的逗号之后要求有一个换行符或禁止有空白
        'function-comma-newline-after': null,
        // 在函数的括号内要求有一个换行符或禁止有空白
        'function-parentheses-newline-inside': null,
        // url使用引号
        'function-url-quotes': 'always',
        // 禁止小于 1 的小数的前导 0
        'number-leading-zero': 'never',
        // 字符串使用双引号
        'string-quotes': 'double',
        // 要求选择器列表的逗号之前有一个换行符
        'selector-list-comma-newline-before': 'never-multi-line',
        // 在媒体查询的逗号之前禁止有一换行
        'media-query-list-comma-newline-before': 'never-multi-line',
        // 缩进
        'indentation': 4,
        // 禁止低优先级的选择器出现在高优先级的选择器之后
        'no-descending-specificity': null,
        // 禁止空源
        'no-empty-source': null,
        // 禁止缺少文件末尾的换行符
        'no-missing-end-of-source-newline': null
    }
};
