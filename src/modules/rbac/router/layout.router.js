// const layout = r => require(['@/commonPages/layout/index'], r)
const layout = r => require(['@/commonPages/layout_2.0/index'], r)

let childRoutes = [];

// 自动导入路由
const files = require.context('./layout', false, /router\.js$/)
files.keys().forEach(key => {
  childRoutes = childRoutes.concat(files(key).default);
})

export default [{
  path: '/',
  component: layout,
  redirect: {
    path: '/dashboard'
  },
  name: 'layout',
  children: childRoutes
}]
