import httpData from "@/request/dataService/index.js";
// 标签管理 获取标签key下拉列表
export function getTagKey(type,params) {
  return httpData(type, `/v1/api/tags/tag_keys`, {
    queryParams: params,
    contentType: 'application/json;charset=utf-8'
  })
}
// 标签管理 根据指定标签key获取标签value下拉列表
export function getTagValue(type,params) {
  return httpData(type, `/v1/api/tags/tag_values`, {
    queryParams: params,
    contentType: 'application/json;charset=utf-8'
  })
}
// 标签管理 获取 标签级联
export function getTagCascader(type,params) {
  return httpData(type, `/v1/api/tags/tag_cascade`, {
    queryParams: params,
    contentType: 'application/json;charset=utf-8'
  })
}
// 批量添加标签与对象关联关系
export function linkObjTag(type,params) {
  return httpData(type, `/v1/api/tags/tag_instances`, {
    queryParams: params,
    contentType: 'application/json;charset=utf-8'
  })
}
// 批量添加标签与对象关联关系
export function removeObjTag(type,params) {
  return httpData(type, `/v1/api/tags/tag_instances`, {
    queryParams: params,
    contentType: 'application/json;charset=utf-8'
  })
}
