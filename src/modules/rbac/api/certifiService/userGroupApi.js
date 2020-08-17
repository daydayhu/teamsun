import httpData from '@/request/dataService/index.js'

// 用户组列表
export function userGroupList(type, params) {
    return httpData(type, '/v1/api/groups', {
        queryParams: params
    })
}

// 新增用户组
export function addUserGroup(type, params) {
    return httpData(type, '/v1/api/groups', {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}

// 用户组详情
export function groupInfo(type, params) {
    return httpData(type, `/v1/api/groups/${params.group_id}`, {
    })
}

// 用户组详情对应角色信息
export function groupRoleInfo(type, params) {
    if(type === 'get'){
        return httpData(type, `/v1/api/groups/group_role/${params.group_id}`, {
            // queryParams: params,
            // contentType:'application/json;charset=utf-8'

        })
    }else{
        return httpData(type, '/v1/api/groups/group_role', {
            queryParams: params,
            contentType:'application/json;charset=utf-8'

        })
    }

}

// 用户组角色列表
export function groupRolesList(type, params) {
    return httpData(type, '/v1/api/groups/group_roles', {
        queryParams: params,
    })
}

// 删除用户组角色
export function deleteGroupRole(type, params) {
    return httpData(type, '/v1/api/groups/group_role', {
        queryParams: params,
    })
}

//用户组详情tab用户列表
export function users(type, params) {
    return httpData(type, `/v1/api/groups/${params.group_id}/users`, {})
}
export function ncgUsers(type, params) {
    return httpData(type, `/v1/api/groups/${params.group_id}/ncg_users`, {})
}

// 添加指定用户下用户组
export function userGroup(type, params) {
    return httpData(type, `/v1/api/groups/group_user`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
// 角色=> 添加授权对象弹框 获取非当前角色用户组接口
export function getNotObjectsUserGroupApi(type, role_id) {
  let url = `/v1/api/roles/${role_id}/ncr_groups`
  return httpData(type, url, {
    queryParams: ''
  })
}

