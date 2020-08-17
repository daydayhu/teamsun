// const login = r => require(['@/commonPages/login/index'], r)
const login = r => require(['@/commonPages/login_2.0/index'], r)
export default [{
    path: '/login',
    name: 'login',
    component: login,
    meta: {
        'title': ['首页'],
        // 'id': 'rbac_login'
    },
    children: []
}]


