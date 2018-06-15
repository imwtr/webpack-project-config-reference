# webpack-project-config-reference
A common configuration reference for webpack(4) project, extends from [webpack3](https://github.com/imwtr/webpack-demo)

Some basic features

- simple project demo
- basic support for SASS/ES6/React
- extract css files in production mode
- hot module replacement
- support dynamic link library for vendor chunks
- extract common files around chunks
- jquery plugins usage
- insert stylesheets and scripts to html file
- html, css/scss, js/jsx code style quality check
- build performance improving (ths for v4)

# More detail
[v3 introduction](http://www.cnblogs.com/imwtr/p/7786204.html)

[v4 introduction](http://www.cnblogs.com/imwtr/p/7786204.html)


# Usage
1. Make sure that you have `Python2.7` `NodeJS` `NPM` installed and environment variables are correctly set
2. Clone or just download this project locally, and walk into the project
3. Open the server with `node server`
4. Walk into the public directory with `cd public`, install the packages we need by `npm i`
5. Building the project with `npm run build:prod`, full commands list
6. Visit `http://localhost:8088/views/home/home.html` with your favorite browser
7. Adjust configuration in `/public/webpack/webpack.config.js`, now enjoy yourself

# Commands list
Reference by `package.json`, commands are for windows system and scheme is http by default

Adjust it to whatever you like

| Name               | Description          |
| --------------     | -------------        |
| npm run build:dll  | build dll library first, if you have never built it   |
| npm run build:dev  | build with environment mode in windows system, using HMR  |
| npm run build:prod  | build with production mode in unix(linux,os) system  |
| npm run build:unix:dev  | build with environment mode in windows system, using HMR  |
| npm run build:unix:prod  | build with production mode in unix system   |
| npm run build:dev:https  | build with environment mode in windows system, using https and HMR |
| npm run build:prod:https  | build with production mode in unix(linux,os) system, using https  |
| npm run build:unix:dev:https  | build with environment mode in windows system, using https and HMR  |
| npm run build:unix:prod:https  | build with production mode in unix system, using https   |



