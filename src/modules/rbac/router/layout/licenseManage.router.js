const licenseManage = r => require(['../../pages/console/licenseManage'], r);

let routes = [
  {
    name: 'licenseManageC',
    path: 'console/licenseManage',
    component: licenseManage,
    meta: {
      'title': ['许可证管理', '许可证管理'],
      'id': 'rbac_front_auth_menu',
    },
    children: [],
  },
];

export default routes;
