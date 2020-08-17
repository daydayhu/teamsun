//const layout = r => require(['@/commonPages/layout/index'], r)
const layout = r => require(['@/commonPages/layout_2.0/index'], r)
//报告
const report = r => require(["../pages/applicationCenter/report"], r);
let childRoutes = [];

// 自动导入路由
const files = require.context('./layout', false, /router\.js$/)
files.keys().forEach(key => {
  childRoutes = childRoutes.concat(files(key).default);
})

export default [
  {
      path: '/',
      component: layout,
      redirect: {
          path: '/dashboard'
      },
      name: 'layout',
      children: childRoutes
  },
  {
      path: '/report',
      component:report,
      meta: {
            title: ["应用中心", "报告"],
            id: "rbac_front_auth_action_view"
      },
      name:"report"
  }
]
