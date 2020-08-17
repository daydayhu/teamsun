//import menuList from './menuList.js'
let menus = [{
    menu_url: '/dashboard',
    name: 'dashboard',
    menu_name: '控制台',
    is_enable: true,
    menu_class: 'el-icon-menu',
    children: []
}, {
    menu_url: '/serviceList',
    name: 'serviceList',
    menu_name: '服务列表',
    //isCollect: true,
    is_enable: true,
    menu_class: 'el-icon-film',
    children: []
}]

//menus = menus.concat(menuList)
export default menus
