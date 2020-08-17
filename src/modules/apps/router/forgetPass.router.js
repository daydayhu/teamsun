const forgetPass = r => require(['@/commonPages/forgetPass_2.0/index'], r)
const modifySuccess = r => require(['@/commonPages/forgetPass_2.0/success'], r)


export default [{
  path: '/forgetPass',
  name: 'forgetPass',
  component: forgetPass,
  meta: {
    'title': ['密码找回'],
    // 'id': 'rbac_login'
  },
  children: []
}, {
  path: '/modifySuccess',
  name: 'modifySuccess',
  component: modifySuccess,
  meta: {
    'title': ['密码找回'],
    // 'id': 'rbac_login'
  },
  children: []
}]
