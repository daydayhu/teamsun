const emptyWrap = r =>
  require(["@/commonPages/emptyWrap/index.vue"], r);
const licenseManage = r => require(['../pages/console/licenseManage'], r);
export default [{
  path: '/',
  name: 'license',
  component: emptyWrap,
  meta: {
    'title': ['许可证'],
  },
  children: [{
    path: 'licenseManage',
    name: 'licenseManage',
    component: licenseManage,
    meta: {
      'title': ['许可证'],
    },
  }]
}, ]
