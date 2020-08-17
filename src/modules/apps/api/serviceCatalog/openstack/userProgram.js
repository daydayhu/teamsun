import httpData from '@/request/dataService/index.js'
//创建组规划表单
export function addGroup(params) {
    return httpData('post', '/v1/api/app/usergroups/group_ticket', {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//编辑组规划表单
export function editGroup(params) {
    return httpData('put', '/v1/api/app/usergroups/group_ticket', {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//创建用户规划表单
export function addUser(params) {
    return httpData('post', '/v1/api/app/usergroups/user_ticket', {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//编辑用户规划表单
export function editUser(params) {
    return httpData('put', '/v1/api/app/usergroups/user_ticket', {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//删除组规划表单
export function deleteGroup(params) {
    return httpData('delete', `/v1/api/app/usergroups/quick_group_ticket?api_group_id=${params}`, {
        contentType:'application/json;charset=utf-8'
    })
}
//删除用户规划表单
export function deleteUser(params) {
    return httpData('delete', `/v1/api/app/usergroups/quick_user_ticket?api_user_id=${params}`, {
        contentType:'application/json;charset=utf-8'
    })
}
//获取用户、用户组规划表单信息
export function requireUserAndGroupList(params) {
    return httpData('get', `/v1/api/app/usergroups/quick_usergroup_ticket`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}