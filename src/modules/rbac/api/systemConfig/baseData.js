import httpData from '@/request/dataService/index.js'

// 获取基础数据列表
export function getBaseDataList(type,params) {
  return httpData(type, `/v1/api/settings`)
}

// 获取
export function getBaseDataForType(type,params) {
  return httpData(type, `/v1/api/search_settings`, {
    queryParams: params,
  })
}

// 添加网络区域
export function addBaseNode(type,params) {
  return httpData(type, `/v1/api/search_settings`, {
    queryParams: params,
  })
}

// 编辑网络区域
export function editBaseNode(type,params) {
  return httpData(type, `/v1/api/search_settings`, {
    queryParams: params,
  })
}

// 删除网络区域
export function deleteBaseNode(type,params) {
  return httpData(type, `/v1/api/search_settings`, {
    queryParams: params,
  })
}

// 菜单启动关闭
export function baseDataSwitch(type,params) {
  return httpData(type, `/v1/api/settings/on_off`, {
    queryParams: params,
  })
}

// 邮箱配置
export function emailConfig(type, params) {
  return httpData(type, `/v1/api/mali_settings`, {
    queryParams: params,
  })
}

// 添加操作系统
export function addOS(type, params) {
  return httpData(type, `/v1/api/os_versions`, {
    queryParams: params,
  })
}

// 编辑操作系统
export function editOS(type, params) {
  return httpData(type, `/v1/api/os_versions`, {
    queryParams: params,
  })
}

// vmware表单信息配置
