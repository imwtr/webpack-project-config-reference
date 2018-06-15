
<img src="https://camo.githubusercontent.com/d18f4a7a64244f703efcb322bf298dcb4ca38856/68747470733a2f2f7765627061636b2e6a732e6f72672f6173736574732f69636f6e2d7371756172652d6269672e737667" width="100px" height="100px">

## webpack-project-config-reference
A common configuration reference for webpack(4) project, extends from [webpack3](https://github.com/imwtr/webpack-demo)

Some basic features

- simple project demo
- basic support for SASS/ES6/React
- extract css files in production mode
- [hot module replacement](https://github.com/webpack/webpack-dev-server), automatically find free port for devServer
- support [dynamic link library](https://webpack.js.org/plugins/dll-plugin/) for vendor chunks
- separate production and development environment config
- extract common files around chunks
- jquery plugins usage
- insert stylesheets and scripts to html file
- html, css/scss, js/jsx code style quality check ([htmlhint](http://htmlhint.com/) [stylelint](https://stylelint.io/) [eslint](https://eslint.org/docs/user-guide/configuring))
- build performance improving (thx for v4)

## More detail
[v3 introduction](http://www.cnblogs.com/imwtr/p/7786204.html)

[v4 introduction](http://www.cnblogs.com/imwtr/p/7786204.html)


## Usage
1. Make sure that you have `Python2.7` `NodeJS` `NPM` installed and environment variables are correctly set
2. Clone or just download this project locally, and walk into the project
3. Open the server with `node server`
4. Walk into the public directory with `cd public`, install the packages we need by `npm i`
5. Building the project with `npm run build:prod`, [full commands list](https://github.com/imwtr/webpack-project-config-reference/blob/master/README.md#commands-list)
6. Visit `http://localhost:8088/views/home/home.html` with your favorite browser
7. Adjust configuration in `/public/webpack/webpack.config.js`, code are well commented by CN, enjoy yourself with source code

## Commands list
Reference by `package.json`, commands are for windows system and scheme is http by default

Add an argument `-- --analysis` after each of commands will enable the [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer), thus you can optimize your build processon further

Adjust it to whatever you like

| Name               | Description          |
| --------------     | -------------        |
| npm run build:dll  | build dll library first, if you have never built it   |
| npm run build:dev  | build with development mode in windows system, using HMR  |
| npm run build:prod  | build with production mode in unix(linux,os) system  |
| npm run build:unix:dev  | build with development mode in windows system, using HMR  |
| npm run build:unix:prod  | build with production mode in unix system   |
| npm run build:dev:https  | build with development mode in windows system, using https and HMR |
| npm run build:prod:https  | build with production mode in unix(linux,os) system, using https  |
| npm run build:unix:dev:https  | build with development mode in windows system, using https and HMR  |
| npm run build:unix:prod:https  | build with production mode in unix system, using https   |



