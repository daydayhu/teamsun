const dashboard = r => require(['@/commonPages/dashboard/index'], r)

let routes = [{
  name: 'dashboard',
  path: 'dashboard',
  component: dashboard,
  meta: {
    'title': ['云管理平台'],
    'id': 'rbac_front_auth_config_dashboard'
  }
}]

export default routes
