import httpData from '@/request/dataService/index.js'

const menuApi = {
    //菜单查询get    菜单编辑put    菜单添加post   菜单删除delete
    getMenu(type, params) {
        return httpData(type, '/v1/api/menus', {
            queryParams: params
        })
    },
    //菜单移动
    changeMenu(type, params) {
        return httpData(type, '/v1/api/menus/menu_order', {
            queryParams: params
        })
    },
    //提交本地菜单（服务菜单定义页面）初始化菜单
    postMenu(type, params) {
        return httpData(type, '/v1/api/menus/load_menu', {
            queryParams: params
        })
    },
    //菜单启用/关闭
    switchMenu(type, params) {
        return httpData(type, '/v1/api/menus/on_off', {
            queryParams: params
        })
    },
    //菜单置顶、置底
    settingMenu(type, params) {
        return httpData(type, '/v1/api/menus/menu_up_down', {
            queryParams: params
        })
    },
    //用户菜单获取
    getUserMenu(type, params) {
        return httpData(type, '/v1/api/user_menus', {
            queryParams: params
        })
    },
    //用户菜单收藏
    collectUserMenu(type, params) {
        return httpData(type, '/v1/api/user_menus', {
            queryParams: params
        })
    },
    //用户菜单取消收藏
    confirmUserMenu(type, params) {
        return httpData(type, '/v1/api/user_menus', {
            queryParams: params
        })
    }




}
export default menuApi;
