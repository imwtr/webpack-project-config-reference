/**
 * 自定义的ESLint配置项
 * 规则中文 @see http://eslint.cn/docs/user-guide/configuring
 * 规则英文 @see https://eslint.org/docs/user-guide/configuring
 *
 * 使用注释自定义规则 @see https://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments
 */

module.exports = {
    // 以此规则集为基础
    extends: [
        // 规则解释 @see https://alloyteam.github.io/eslint-config-alloy/
        // 默认规则 @see https://github.com/AlloyTeam/eslint-config-alloy/blob/master/index.js
        'eslint-config-alloy',
        // 默认规则 @see https://github.com/AlloyTeam/eslint-config-alloy/blob/master/react.js
        'eslint-config-alloy/react'
    ],
    // 检查html文件（或tpl文件）中的JS
    plugins: [
        'html'
    ],
    settings: {
        'html/html-extensions': ['.html', '.tpl'],
        // 'html/indent': '+4'
    },
    // 定义一些初始的全局可用变量
    globals: {
        jQuery: false,
        $: false,
        layer: false,
        Handlebars: false,
        Bloodhound: false
    },
    // parserOptions: {
    //     ecmaFeatures: {
    //         jsx: true
    //     }
    // },
    // 自定义的规则
    rules: {
        // 必须使用 === 或 !==，禁止使用 == 或 !=，与 null 比较时除外
        // @warn 在异步接口返回时不确定参数是数值还是字符串，有时可利用这个类型转换
        'eqeqeq': 'warn',
        // 禁止在 if 代码块内出现函数声明
        // @off 在for循环中会经常使用定义var  for(var i = 0; i < 10; ++i)
        'no-inner-declarations': 'off',
        // switch 的 case 内有变量定义的时候，必须使用大括号将 case 内变成一个代码块
        // @off 太严格
        'no-case-declarations': 'off',
        // 禁止使用 !! ~ 等难以理解的运算符
        // @off 有些时候会用到 if (!!abc)   '' + 100   +new Date() 等
        'no-implicit-coercion': 'off',
        // 禁止在全局作用域下定义变量或申明函数
        // @off 太严格
        'no-implicit-globals': 'off',
        // 禁止使用没必要的 {} 作为代码块
        // @off 有时候需要用代码块做逻辑区分
        'no-lone-blocks': 'off',
        // 禁止出现 location.href = 'javascript:void(0)';
        // @off 有时候需要用便捷的 javascript:;
        'no-script-url': 'off',
        // 对象字面量只有一行时，大括号内的首尾必须有空格
        // @off 没有必要限制
        'object-curly-spacing': 'off',
        // 禁止对函数的参数重新赋值
        // @warn 警示即可
        'no-param-reassign': 'warn',
        // 文件最后一行必须有一个空行
        // @error 应该在文件末尾保持一个换行
        'eol-last': 'error',
        // 代码块嵌套的深度禁止超过 10 层
        // @warn 有些特殊情况会出现  警示即可
        'max-depth': [
            'warn',
            10
        ],
        // 禁止函数的循环复杂度超过 100
        // @error 最大值可以宽松点
        'complexity': [
            'error',
            {
                max: 100
            }
        ],
        // 定义过的变量必须使用
        // @warn 多文件互相引用时 偶尔会出现无引用的情况
        'no-unused-vars': [
            'warn',
            {
                vars: 'all',
                args: 'none',
                caughtErrors: 'none',
                ignoreRestSiblings: true
            }
        ],
        // 在ES5中需使用var
        // @off 没有必要限制
        'no-var': 'off',
        // 禁止使用未定义的变量  建议将相关变量在上方 globals 配置项中配置
        // @warn 警示即可
        'no-undef': 'warn',
        // 函数的参数禁止超过10个
        // @warn 警示即可
        'max-params': ['warn', 10],
        // 回调函数嵌套禁止超过 5 层
        // @warn 警示即可
        'max-nested-callbacks': ['warn', 5],
        // 循环内的函数中不能出现循环体条件语句中定义的变量
        // @warn 警示即可
        'no-loop-func': 'warn',
        // Promise 的 reject 中必须传入 Error 对象
        // @off 不需要限制
        'prefer-promise-reject-errors': 'off',
        // 变量声明时尽量使用一个var声明连续的多个
        // @warn 警示即可
        'one-var': [
            'error',
            'consecutive'
        ],
        // 变量申明必须每行一个
        // @error 赋值时保证处于一行即可
        'one-var-declaration-per-line': [
            'error',
            'initializations'
        ],

        // 禁止使用已废弃的 api
        // @off 不需要限制
        'react/no-deprecated': 'off',
        // 禁止使用字符串 ref
        // @warn 警告即可
        'react/no-string-refs': 'warn',
        // 必须使用 Class 的形式创建组件
        // @warn 警告即可
        'react/prefer-es6-class': [
            'warn',
            'always'
        ],
        // 禁止在 componentDidUpdate 里面使用 setState
        // @warn 警告即可
        'react/no-did-update-set-state': 'warn',
        // 组件内方法必须按照一定规则排序
        // @off 不需要限制
        'react/sort-comp': 'off',

        // jsx 的 props 缩进必须为四个空格
        // @off 不需要限制
        // 'react/jsx-indent-props': 'off',
    }
};
