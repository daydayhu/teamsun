import httpData from '../../dataService/index.js'

// 获取端口组信息
export function portGroupsInfo(type,params) {
  return httpData(type, `/v1/api/vmware/port_groups`, {
    queryParams: params,
  })
}

// 获取端口组详情
export function portGroupsDetails(type,params) {
  return httpData(type, `/v1/api/vmware/port_groups/${params.pg_id}`)
}

// 获取指定端口组的主机信息
export function portGroupsHosts(type,params) {
  return httpData(type, `/v1/api/vmware/port_groups/${params.pg_id}/hosts`)
}
