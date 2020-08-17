const menuConfig = r => require(['../../pages/systemConfig/menuConfig'], r)
const operationLog = r => require(['../../pages/systemConfig/operationLog'], r)

let routes = [{
  path: 'systemconfig/menuconfig',
  name: 'menuConfig',
  component: menuConfig,
  meta: {
    'title': ['系统配置', '服务菜单定义'],
    'id': 'rbac_front_auth_menu'
  },
  children: []
},
  {
    path: 'systemconfig/operationlog',
    name: 'operationLog',
    component: operationLog,
    meta: {
      'title': ['系统配置', '操作日志'],
      'id': 'rbac_front_auth_menu'
    },
    children: []
  }]

export default routes
