import httpData from '../../dataService/index.js'

// 获取云控制器的列表
export function controllerList(type,params) {
  return httpData(type, `/v1/api/vmware/controllers`, {
    queryParams: params,

  })
}
// 新建编辑云控制器
export function saveController(type, params) {
  return httpData(type, `/v1/api/vmware/controllers`, {
    queryParams: params,
    contentType:'application/json;charset=utf-8'

  })
}

// 删除
export function deleteController(type,params) {
  return httpData(type, `/v1/api/vmware/controllers/${params.cloud_id}`)
}

// 获取指定的云控制器信息
export function detailController(type,params) {
  return httpData(type, `/v1/api/vmware/controllers/${params.cloud_id}`)
}

// 获取/编辑指定的云控制器的同步策略信息
export function syncControllerStrategy(type,params) {
  return httpData(type, `/v1/api/vmware/controllers/${params.cloud_id}/plans`, {
    queryParams: params.plan,
    contentType: 'application/json;charset=utf-8'

  })
}

// 获取指定的云控制器的同步记录信息
export function syncControllerRecord(type,params) {
  return httpData(type, `/v1/api/vmware/controllers/${params.cloud_id}/syncs`)
}

// 验证环境
export function verification(type,params) {
  return httpData(type, `/v1/api/vmware/controllers/verification_controller`,{
    queryParams:params,
    contentType:'application/json;charset=utf-8'

  })
}

// 数据同步 开始
export function cloudDataSync(type,params) {
    return httpData(type, `/v1/api/vmware/controllers/cloud_data_sync`,{
        queryParams:params,
        contentType:'application/json;charset=utf-8'
    })
}
// 数据同步 进度
export function cloudDataSyncProgress(type,params) {
    return httpData(type, `/v1/api/vmware/controllers/cloud_data_sync_progress`,{
        queryParams:params,
        contentType:'application/json;charset=utf-8'
    })
}

