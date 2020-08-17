const menuList = [{
        label: '云应用',
        ident: '服务分类',
        id: 1,
        isCheck: false,
        isFold: false,
        children: [{
            path: '/appCenter/appOverview',
            name: 'appCenter',
            label: '应用中心',
            ident: '服务',
            id: 11,
            isCheck: false,
            isCollect: true,
            isFold: false,
            icon: 'el-icon-menu',
            children: [{
                    path: '/appCenter/appOverview',
                    name: 'appOverview',
                    label: '概览',
                    ident: '菜单',
                    id: 111,
                    isCheck: false,
                    children: []
                },
                {
                    path: '/appCenter/orderManage',
                    name: 'orderManage',
                    ident: '菜单',
                    label: '订单管理',
                    id: 112,
                    isCheck: false,
                    children: []
                },
                {
                    label: '应用管理',
                    name: 'appManage',
                    ident: '菜单',
                    id: 113,
                    isCheck: false,
                    isFold: false,
                    children: [{
                            path: '/appCenter/appSystem',
                            name: 'appSystem',
                            label: '应用系统',
                            ident: '菜单',
                            id: 1131,
                            isCheck: false,
                            children: []
                        },
                        {
                            path: '/appCenter/demandCollect',
                            name: 'demandCollect',
                            label: '需求收集',
                            ident: '菜单',
                            id: 1132,
                            isCheck: false,
                            children: []
                        },
                        {
                            path: '/appCenter/resourcePlan',
                            name: 'resourcePlan',
                            label: '资源规划',
                            ident: '菜单',
                            id: 1133,
                            isCheck: false,
                            children: []
                        },
                        {
                            path: '/appCenter/resourceDeploy',
                            name: 'resourceDeploy',
                            label: '资源部署',
                            ident: '菜单',
                            id: 1134,
                            isCheck: false,
                            children: []
                        },
                    ]
                }
            ]
        }]

    },
    // {
    //     label: '云运营',
    //     ident: '服务分类',
    //     children: [{
    //             path: '/serviceOpera',
    //             name: 'serviceOpera',
    //             label: '服务运营',
    //             ident: '服务',
    //             isCollect: false,
    //             icon: 'el-icon-s-data',
    //             children: [{
    //                     path: '/serviceOpera/serviceOverview',
    //                     name: 'serviceOverview',
    //                     label: '概览',
    //                     children: []
    //                 },
    //                 {

    //                     label: '服务',
    //                     name: 'service',
    //                     children: [{
    //                             path: '/serviceOpera/serviceDir',
    //                             name: 'serviceDir',
    //                             label: '服务目录',
    //                             children: []
    //                         },
    //                         {
    //                             path: '/serviceOpera/componentService',
    //                             name: 'componentService',
    //                             label: '组件服务',
    //                             children: []
    //                         },
    //                         {
    //                             path: '/serviceOpera/baseService',
    //                             name: 'baseService',
    //                             label: '基础服务',
    //                             children: []
    //                         },
    //                         {
    //                             path: '/serviceOpera/scriptLib',
    //                             name: 'scriptLib',
    //                             label: '脚本库',
    //                             children: []
    //                         },
    //                     ]
    //                 },
    //                 {
    //                     path: '/serviceOpera/formDesign',
    //                     name: 'formDesign',
    //                     label: '表单设计',
    //                     children: []
    //                 },
    //                 {

    //                     label: '系统管理',
    //                     name: 'sysManage',
    //                     children: [{
    //                             path: '/serviceOpera/baseData',
    //                             name: 'baseData',
    //                             label: '基础数据',
    //                             children: []
    //                         },
    //                         {
    //                             path: '/serviceOpera/labelManage',
    //                             name: 'labelManage',
    //                             label: '标签管理',
    //                             children: []
    //                         }
    //                     ]
    //                 }

    //             ]
    //         },
    //         {
    //             path: '/serviceOpera',
    //             name: 'serviceOpera',
    //             label: '仓库管理',
    //             ident: '服务',
    //             isCollect: false,
    //             icon: 'el-icon-s-data',
    //             children: [{
    //                     path: '/serviceOpera/serviceOverview',
    //                     name: 'serviceOverview',
    //                     label: '概览1',
    //                     children: []
    //                 },
    //                 {

    //                     label: '服务1',
    //                     name: 'service',
    //                     children: [{
    //                             path: '/serviceOpera/serviceDir',
    //                             name: 'serviceDir',
    //                             label: '服务目录1',
    //                             children: []
    //                         },
    //                         {
    //                             path: '/serviceOpera/componentService',
    //                             name: 'componentService',
    //                             label: '组件服务1',
    //                             children: []
    //                         },
    //                         {
    //                             path: '/serviceOpera/baseService',
    //                             name: 'baseService',
    //                             label: '基础服务1',
    //                             children: []
    //                         },
    //                         {
    //                             path: '/serviceOpera/scriptLib',
    //                             name: 'scriptLib',
    //                             label: '脚本库1',
    //                             children: []
    //                         },
    //                     ]
    //                 },
    //                 {
    //                     path: '/serviceOpera/formDesign',
    //                     name: 'formDesign',
    //                     label: '表单设计1',
    //                     children: []
    //                 },
    //                 {

    //                     label: '系统管理1',
    //                     name: 'sysManage',
    //                     children: [{
    //                             path: '/serviceOpera/baseData',
    //                             name: 'baseData',
    //                             label: '基础数据1',
    //                             children: []
    //                         },
    //                         {
    //                             path: '/serviceOpera/labelManage',
    //                             name: 'labelManage',
    //                             label: '标签管理1',
    //                             children: []
    //                         }
    //                     ]
    //                 }

    //             ]
    //         },
    //     ]
    // },
    {
        label: '认证与服务',
        ident: '服务分类',
        id: 2,
        isCheck: true,
        isFold: false,
        children: [{
                path: '/certifiService/certOverview',
                name: 'certifiService',
                label: '访问控制',
                ident: '服务',
                id: 21,
                isCheck: true,
                isCollect: true,
                isFold: false,
                icon: 'el-icon-menu',
                children: [{
                        path: '/certifiService/certOverview',
                        name: 'certOverview',
                        label: '概览',
                        id: 211,
                        isCheck: true,
                        ident: '菜单',
                        children: []
                    },
                    {
                        path: '/certifiService/certOrgan',
                        name: 'certOrgan',
                        ident: '菜单',
                        id: 212,
                        isCheck: true,
                        label: '组织',
                        children: []
                    },
                    {
                        path: '/certifiService/user',
                        name: 'user',
                        ident: '菜单',
                        isCheck: true,
                        id: 213,
                        label: '用户',
                        children: []
                    },
                    {
                        path: '/certifiService/userGroup',
                        name: 'userGroup',
                        ident: '菜单',
                        label: '用户组',
                        id: 214,
                        isCheck: true,
                        children: []
                    },
                    {
                        path: '/certifiService/roleManage',
                        name: 'roleManage',
                        ident: '菜单',
                        label: '角色管理',
                        id: 215,
                        isCheck: true,
                        children: []
                    },
                    {
                        label: '系统管理',
                        id: 216,
                        ident: '菜单',
                        isCheck: true,
                        name: 'systemManage',
                        isFold: false,
                        children: [{
                                path: '/certifiService/securitySetting',
                                name: 'securitySetting',
                                label: '密码安全设置',
                                id: 2161,
                                isCheck: true,
                                ident: '菜单',
                                children: []
                            },
                            {
                                path: '/certifiService/LDAPRegist',
                                name: 'LDAPRegist',
                                label: 'LDAP注册',
                                id: 2162,
                                isCheck: true,
                                ident: '菜单',
                                children: []
                            },
                            {
                                path: '/certifiService/licenseManage',
                                name: 'resourcePlan',
                                label: 'License管理',
                                id: 2163,
                                isCheck: true,
                                ident: '菜单',
                                children: []
                            }
                        ]
                    }
                ]

            },
            {
                path: '/systemConfig/menuConfig',
                name: 'systemConfig',
                label: '系统配置',
                ident: '服务',
                id: 22,
                isCheck: true,
                isCollect: true,
                isFold: false,
                icon: 'el-icon-menu',
                children: [{
                    path: '/systemConfig/menuConfig',
                    name: 'menuConfig',
                    id: 221,
                    label: '服务菜单定义',
                    ident: '菜单',
                    isCheck: true,
                    children: []
                }, ]

            },

        ]

    }

]
export default menuList