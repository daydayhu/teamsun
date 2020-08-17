import httpData from '@/request/dataService/index.js'

// 标签管理 获取所有标签信息
export function getTagList(type,params) {
  return httpData(type, `/v1/api/tags`, {
    queryParams: params,
    contentType: 'application/json;charset=utf-8'
  })
}
// 标签管理 根据类型 添加对应标签信息
export function addTag(type,params) {
  return httpData(type, `/v1/api/tags`, {
    queryParams: params,
    contentType: 'application/json;charset=utf-8'
  })
}
// 标签管理 根据类型 获取 指定标签信息
export function tagDetails(type,params) {
  return httpData(type, `/v1/api/tags/tag`, {
    queryParams: params,
    contentType: 'application/json;charset=utf-8'
  })
}
// 标签管理 根据类型 编辑对应标签信息
export function editTag(type,params) {
  return httpData(type, `/v1/api/tags`, {
    queryParams: params,
    contentType: 'application/json;charset=utf-8'
  })
}
// 标签管理 删除对应标签信息
export function deleteTag(type,params) {
  return httpData(type, `/v1/api/tags`, {
    queryParams: params,
    contentType: 'application/json;charset=utf-8'
  })
}
