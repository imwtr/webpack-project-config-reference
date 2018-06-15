/**
 * Webpack配置数据
 * @type {Object}
 */
module.exports = {
    // 项目的svn|git版本分类，仅用于标识进程以快速区分窗口  master（主干）trunk（主干）或 branch（分支）
    versionControl: 'branch',
    // 项目的标识符名称，请使用英文
    name: 'webpack-config-ref',
    // 项目代码检查设置  一般不改动
    lint: {
        // HtmlHint
        html: {
            open: false,
            // 配置文件 ，路径相对于当前根目录 /webpack
            configFile: '../.htmlhintrc'
        },
        // StyleLint
        css: {
            // 开启检查
            open: false,
            // 自动修复出错
            autoFix: false,
            // 是否以错误形式显示检查结果
            emitAsError: true
        },
        // ESLint
        js: {
            open: false,
            autoFix: false,
            emitAsError: true
        }
    },
    // JS模块输出路径，提取的css，img目录将与该路径同级，相对于当前根目录 /webpack
    outputPath: './static/dist/js',
    // 编译到页面HTML中的相关模块路径，建议使用绝对路径，或者置入CDN
    outputPublicPath: '/public/static/dist/js/',
    // 开启动态链接库配置 需要先执行 npm run build:dll，生成动态链接库再进行 npm run build:dev(prod)进行编译
    vendorDllOpen: true,
    // 动态库插入的页面 vendorDllOpen为false时忽略， all 为全部，一般配置为父页面即可，相对于JS模块输出路径
    vendorDllInsertFiles: 'all',
    // 项目中不需要提取公共部分的模块（模块名）
    commonChunkExcludes: [],
    // 项目入口模块及对应的文件（模块名：路径），路径相对于当前根目录 /webpack
    entry: {
        // 主页
        home: './static/src/js/home',
        // 详情页
        detail: './static/src/js/detail'
    },
    // 项目中模块注入到页面的映射关系
    // template源 相对于 当前根目录 /webpack
    // filename目标 相对于 JS模块输出路径
    htmlWebpackPlugin: [
    {
        // 模版源文件
        template: '../views/home/home_tpl.html',
        // 编译后的目标文件
        filename: '../../../../views/home/home.html',
        // 要处理的模块文件
        chunks: ['common', 'home']
    },
    {
        // 模版源文件
        template: '../views/detail/detail_tpl.html',
        // 编译后的目标文件
        filename: '../../../../views/detail/detail.html',
        // 要处理的模块文件
        chunks: ['common', 'detail']
    }
]};
