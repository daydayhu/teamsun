import httpData from '@/request/dataService/index.js'

// 角色列表
export function roleList(type, params) {
    return httpData(type, '/v1/api/roles', {
        queryParams: params,
        contentType:'application/json;charset=utf-8'

    })
}

//角色详情
export function roleDetail(type, params) {
    return httpData(type, `/v1/api/roles/${params.role_id}`, {})
}

// 角色管理 获取指定角色是否关联用户与用户组绑定
export function isBind(type, params) {
    return httpData(type, `/v1/api/roles/${params.role_id}/is_bind`, {})
}

// 编辑角色
export function editRole(type, params) {
    let url;
    if(type === 'put'){
        url = `/v1/api/roles/${params.role_id}`;
    }else{
        url = `/v1/api/roles`;
    }
    return httpData(type, url, {
        queryParams: params.role_info,
        contentType:'application/json;charset=utf-8'

    })
}
// 删除角色信息
export function deleteRole(type, params) {
    return httpData(type, `/v1/api/roles/${params.role_id}`, {})
}


//角色管理用户用户组列表
export function authObjectsList(type, params) {
    return httpData(type, `/v1/api/roles/${params.role_id}/authorize_objects`, {})
}
//角色关联用户用户组
export function authObjects(type, params) {
    return httpData(type, `/v1/api/roles/${params.role_id}/authorize_objects`, {
        queryParams: params.role_info,
        contentType:'application/json;charset=utf-8'

    })
}

// 获取服务
export function servicesList(type, params) {
    return httpData(type, `/v1/api/menus/get_services`, {})
}

// 获取服务菜单列表
export function serviceMenusList(type, params) {
    const {role_id} = params;
    let id = '';
    if(role_id){
        id = `?role_id=${role_id}`
    }
    return httpData(type, `/v1/api/menus/get_service_menus/${params.menu_id}${id}`, {})
}

//保存角色菜单
export function saveRoleMenusData(type, params) {
    return httpData(type, `/v1/api/roles/role_menu`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}

// 获取角色菜单列表
export function roleMenusList(type, params) {
    return httpData(type, `/v1/api/roles/role_menu/${params.role_id}`, {
    })
}

//删除角色菜单

export function deleteRoleMenus(type, params) {
    return httpData(type, `/v1/api/roles/role_menu`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}


