const certOverview = r => require(['../../pages/certifiService/certOverview'], r)
const certOrgan = r => require(['../../pages/certifiService/certOrgan'], r)
const user = r => require(['../../pages/certifiService/user'], r)
const userGroup = r => require(['../../pages/certifiService/userGroup'], r)
const userGroupDetails = r => require(['../../pages/certifiService/userGroup/components/userGroupDetails'], r)
const roleManage = r => require(['../../pages/certifiService/roleManage'], r)
const roleDetails = r => require(['../../pages/certifiService/roleManage/components/roleDetails'], r)
const addRole = r => require(['../../pages/certifiService/roleManage/components/addRole'], r)

const securitySetting = r => require(['../../pages/certifiService/systemManage/securitySetting'], r)
const ldapRegist = r => require(['../../pages/certifiService/ldapRegist'], r)
const licenseManage = r => require(['../../pages/certifiService/systemManage/licenseManage'], r)
const userDetails = r => require(['../../pages/certifiService/user/components/userDetails'], r)
const certOrganDetails = r => require(['../../pages/certifiService/certOrgan/components/certOrganDetails'], r)
const baseInfo = r => require(['../../pages/certifiService/myInfo/baseInfo'], r)
const modifyPass = r => require(['../../pages/certifiService/myInfo/modifyPass'], r)
const LayoutEmpty = r => require(['@/commonPages/layout/components/LayoutEmpty'], r)

let routes = [{
  path: 'certifiservice/certoverview',
  name: 'certOverview',
  component: certOverview,
  meta: {
    'title': ['访问控制', '概览'],
    'id': 'rbac_front_auth_action_view'
  },
  children: []
},
  {
    path: 'certifiservice',
    component: LayoutEmpty,
    redirect: 'certifiservice/certorgan',
    meta: {
      'title': ['访问控制', '组织'],
      "id": 'rbac_front_auth_action_dep'
    },
    children: [{
      path: 'certorgan',
      name: 'certOrgan',
      component: certOrgan,
      meta: {
        'title': ['访问控制', '组织'],
        "id": 'rbac_front_auth_action_dep'
      },
      children: []
    },
      {
        path: 'certorgandetails',
        name: 'certOrganDetails',
        component: certOrganDetails,
        meta: {
          'title': ['组织', '组织详情首页'],
          "id": 'rbac_front_auth_action_dep_detail'
        },
        children: []
      },
    ]
  },
  {
    path: 'certifiservice',
    component: LayoutEmpty,
    redirect: 'certifiservice/user',
    meta: {
      'title': ['访问控制', '用户'],
      "id": 'rbac_front_auth_action_user'
    },
    children: [{
      path: 'user',
      name: 'user',
      component: user,
      meta: {
        'title': ['访问控制', '用户'],
        "id": 'rbac_front_auth_action_user_manage'
      },
      children: []
    },
      {
        path: 'userdetails',
        name: 'userDetails',
        component: userDetails,
        meta: {
          'title': ['用户详情首页'],
          "id": 'rbac_front_auth_action_user_detail'
        },
        children: []
      },
    ]
  },
  {
    path: 'certifiservice',
    meta: {
      'title': ['访问控制', '用户组'],
      "id": 'rbac_front_auth_action_group'
    },
    component: LayoutEmpty,
    redirect: 'certifiservice/usergroup',
    children: [{
      path: 'usergroup',
      name: 'userGroup',
      component: userGroup,
      meta: {
        'title': ['访问控制', '用户组'],
        'id': 'rbac_front_auth_action_group_manage'
      },
    },
      {
        path: 'usergroupdetails',
        name: 'userGroupDetails',
        component: userGroupDetails,
        meta: {
          'title': ['用户组详情页'],
          'id': 'rbac_front_auth_action_group_detail'
        },
      }
    ]
  },
  {
    path: 'certifiservice',
    component: LayoutEmpty,
    redirect: 'certifiservice/rolemanage',
    children: [{
      path: 'rolemanage',
      name: 'roleManage',
      component: roleManage,
      meta: {
        'title': ['访问控制', '角色管理'],
        'id': 'rbac_front_auth_action_role'
      },
    },
      {
        path: 'addrole',
        name: 'addRole',
        component: addRole,
        meta: {
          'title': ['新建角色'],
          'id': 'rbac_front_auth_action_role_add'
        },
      },
      {
        path: 'roledetails',
        name: 'roleDetails',
        component: roleDetails,
        meta: {
          'title': ['角色详情页'],
          'id': 'rbac_front_auth_action_role_detail'
        },
      }
    ]
  },
  {
    path: 'certifiservice/securitysetting',
    name: 'securitySetting',
    component: securitySetting,
    meta: {
      'title': ['应用中心', '系统管理', '密码安全设置'],
      'id': 'rbac_front_auth_action_sys_pwd'
    },
    children: []
  },
  {
    path: 'certifiservice/ldapRegist',
    name: 'ldapRegist',
    component: ldapRegist,
    meta: {
      'title': ['应用中心', '系统管理', 'LDAP注册'],
      'id': 'rbac_front_auth_ldap'
    },
    children: []
  },
  {
    path: 'certifiservice/licensemanage',
    name: 'licenseManage',
    component: licenseManage,
    meta: {
      'title': ['应用中心', '系统管理', 'License管理'],
      'id': 'rbac_front_auth_action_sys_license'
    },
    children: []
  },
  {
    path: 'certifiservice/myInfo/baseInfo',
    name: 'baseInfo',
    component: baseInfo,
    meta: {
      'title': ['我的信息'],
      'id': 'rbac_front_auth_action_my_baseInfo'
    },
    children: []
  },
  {
    path: 'certifiservice/myInfo/modifyPass',
    name: 'modifyPass',
    component: modifyPass,
    meta: {
      'title': ['修改密码'],
      'id': 'rbac_front_auth_action_my_modifyPass'
    },
    children: []
  },
]

export default routes
