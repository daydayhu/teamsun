import httpData from '../../../dataService/index.js'

// 获取云控制器的列表
export function controllerList(type,params) {
  return httpData(type, `/v1/api/openstack/controllers`, {
    queryParams: params,

  })
}

// 获取云控制器详情
export function controllerData(type,params) {
    return httpData(type, `/v1/api/openstack/controllers/${params.cloud_id}`, {
        // queryParams: params,

    })
}
//新建编辑云控制器
export function saveController(type, params) {
  return httpData(type, `/v1/api/openstack/controllers`, {
    queryParams: params,
    contentType:'application/json;charset=utf-8'

  })
}

// 获取云控制器信息
export function getController(type,params) {
    return httpData(type, `/v1/api/openstack/controllers/${params.cloud_id}`)
}
// 删除
export function deleteController(type,params) {
  return httpData(type, `/v1/api/openstack/controllers/${params.cloud_id}`)
}

// 验证环境
export function verification(type,params) {
  return httpData(type, `/v1/api/openstack/controllers/verification_controller`,{
    queryParams:params,
    contentType:'application/json;charset=utf-8'

  })
}

//获取云控制相关接口

export function openstackVersions(type) {
    return httpData(type, `/v1/api/openstack/controllers/openstack_versions`,{})
}

//获取资源环境信息
export function resourceEnvInfo(type) {
    return httpData(type, `/v1/api/openstack/controllers/resource_env_info`,{})
}
