import httpData from "@/request/dataService/index.js";
export const tableHeader = [{
    label: '键-key',
    key: 'tag_key',
  }, {
    label: '值-Value',
    key: 'value',
  }, {
    label: '类型',
    key: 'tag_type',
  }, {
    label: '最近更新人',
    key: 'update_user',
  }, {
    label: '最近更新时间',
    key: 'update_time',
  }, {
    label: '引用',
    key: 'use_count',
  }];

// 标签管理 获取对应微服务下标签列表
export function getTagList(type,params) {
  return httpData(type, `/v1/api/tags/search_tags`, {
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
