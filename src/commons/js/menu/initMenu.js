const menuList = [{
            menu_name: '认证与服务',
            menu_type: 5,
            menu_id: 22,
            is_enable: true,
            children: [{
                    menu_url: '/systemconfig/menuconfig',
                    menu_name: '系统配置',
                    menu_type: 6,
                    menu_id: 222,
                    is_enable: true,
                    menu_class: 'el-icon-menu',
                    children: [{
                        menu_url: '/systemconfig/menuconfig',
                        menu_id: 2221,
                        menu_name: '服务菜单定义',
                        menu_type: 1,
                        is_enable: true,
                        children: []
                    }, ]

                },

            ]

        }

    ]
    // 1为url页面；2为json数据请求；3为按钮；4为业务节点；5服务分类；6服务
export default menuList