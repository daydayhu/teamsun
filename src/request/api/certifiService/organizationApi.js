import httpData from '../../dataService/index.js'



// 组织列表(order为移动节点参数)
export function certOrganApi(type, params, order) {
    let url = '/v1/api/departments';
    if (order == 'order') {
        url = '/v1/api/departments/order'
    }else if(order == 'getDetails'){
        url = '/v1/api/departments/'+params
    }
    return httpData(type, url, {
        queryParams: params
    })
}

// 获取组织部门列表
export function userDepartmentApi(type, params) {
    let url = '/v1/api/departments/get_deps';

    return httpData(type, url, {
        queryParams: params
    })
}

// 组织（部门） 用户列表&已添加用户列表
export function departmentUsers(type, params, obj) {

    let url = `/v1/api/departments/${obj.id}/${obj.type}`

    return httpData(type, url, {
        queryParams: params
    })
}
// user_dep 组织（部门）详情 ->用户操作接口
export function departmentUsersOperating(type, params, obj) {

    let url = `/v1/api/user_departments`

    if(type == 'delete') {
        url = `/v1/api/user_departments/remove_users`
    }

    return httpData(type, url, {
        queryParams: params
    })
}


