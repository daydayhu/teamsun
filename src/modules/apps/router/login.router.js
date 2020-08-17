// const login = r => require(['@/commonPages/login/index'], r)
const login = r => require(['@/commonPages/login_2.0/index'], r)
const report = r => require(['@/modules/apps/pages/applicationCenter/report/index'], r)
export default [{
    path: '/login',
    name: 'login',
    component: login,
    meta: {
        'title': ['首页'],
        'id': 'rbac_login'
    },
    children: []
},
{
  path: "/applicationCenter/report",
  name: "report",
  component: report,
  meta: {
    title: ["应用中心", "报告"],
    id: "rbac_front_auth_action_view"
  }
},]


