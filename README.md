# shangdong

这是山东项目前端项目框架，采用 vue+elementUI 构建

各组件依赖项及版本号，请查看 package.json 文件

>

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```



# 项目目录结构

build config文件夹是webpack打包有关的文件，其中config文件中可配置前端代理

commons 是公用的静态资源文件,包含一些css、js、images

componments 可放封装的一些公共组件

pages 是视图文件

router  是路由有关配置文件

request  是统一api管理文件，其中api文件下为分模块管理api


# svg图标使用

阿里图标库使用

使用symbol的方式
   a. 将svg文件拷贝到  src/commons/icons/svg   文件夹下面
   b. 将svg 名称直接传入组件中进行使用：
       example:
      <svg-icon icon-class='zhixiang'  class='myicon'></svg-icon>
      其中 icon-class 的值为svg文件名称；myicon 为自定义的类名，可以修改图标的大小、颜色等样式




