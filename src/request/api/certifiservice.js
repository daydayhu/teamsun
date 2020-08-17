import httpData from '../dataService/index.js'

// 用户列表
export function userApi(type, params, userId) {
    let url = `/v1/api/users`
    if (userId) {
        url = `/v1/api/users/` + userId
    }
    return httpData(type, url, {
        queryParams: params
    })
}

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
export function certOrganDepartmentApi(type, params, isDep) {
    let url = '/v1/api/departments/get_orgs';

    if (isDep == 'dep') {
        url = '/v1/api/departments/get_org_deps/'+params
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
// 用户详情=>获取组列表
export function userDetailsGroupList(type, params) {
    let url = '/v1/api/groups/user_groups';
    return httpData(type, url, {
        queryParams: params
    })
}
// 用户详情-> 用户加入的组
export function userJoinGroups(type, params, user_id) {
    let url = '/v1/api/user/user_group/'
    if(type == 'get') {
        url = '/v1/api/user/user_group/'+user_id
    }
    return httpData(type, url, {
        queryParams: params
    })
}

// 用户详情  -> 角色列表（指定用户所有非关联角色）
export function userRolesList(type, params, user_id) {
    let url = `/v1/api/user/user_role/${user_id}/no_related_roles`;
    return httpData(type, url, {
        queryParams: params
    })
}
// 用户详情  -> 角色添加移除操作
export function userDetialsRolesOperating(type, params, user_id) {
    let url = type == 'get' ? `/v1/api/user/user_role/` + user_id : `/v1/api/user/user_role/`
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

// 用户修改密码 重置密码
export function userUpdataPassword(type, params, userId) {
    let url = `/v1/api/users/${userId}/actions/change_pwd`
    return httpData(type, url, {
        queryParams: params
    })
}
export function resetPassword(type, params, userId) {
    let url = `/v1/api/users/${userId}/actions/reset_pwd`
    return httpData(type, url, {
        queryParams: params
    })
}
