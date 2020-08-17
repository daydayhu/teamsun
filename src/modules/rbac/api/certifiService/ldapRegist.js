import httpData from '@/request/dataService/index.js'

// 获取基础数据列表
export function getLdapsList(type,params) {
    return httpData(type, `/v1/api/ldaps`, {
        queryParams: params,

    })
}

// 获取组织列表
export function getOrgs(type,params) {
    return httpData(type, `/v1/api/departments/get_orgs`, {
        queryParams: params,

    })
}

// 保存ldap
export function saveLdaps(type,params) {
    const url = params.ldap_id === 0 ? `/v1/api/ldaps` : `/v1/api/ldaps/${params.ldap_id}`;
    return httpData(type, url, {
        queryParams: {ldap_data:params.form},
        contentType:'application/json;charset=utf-8'
    })
}

// 获取LDAP详情
export function getLdapDetail(type,params) {
    return httpData(type, `/v1/api/ldaps/${params.ldap_id}`, {})
}

// 获取指定LDAP的用户列表
export function getLdapUsersList(type,params) {
    return httpData(type, `/v1/api/ldaps/${params.ldap_id}/users`, {})
}

// 导入指定LDAP用户
export function reportUsers(type, params) {
    return httpData(type, `/v1/api/ldaps/${params.ldap_id}/users`,  {
        queryParams: {ldap_users:params.ldap_user},
        contentType:'application/json;charset=utf-8'
    })
}

// 获取cmp平台ladp用户
export function getCmpUsers(type, params) {
    return httpData(type, `/v1/api/ldaps/${params.ldap_id}/cmp_users`,  {})
}

// 删除LDAP
export function deleteLdap(type, params) {
    return httpData(type, `/v1/api/ldaps`,  {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}


