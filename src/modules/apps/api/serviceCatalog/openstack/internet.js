import httpData from "@/request/dataService/index.js";
// 基础数据 根据类型获取对应数据信息-
export function getDataBase(type, params) {
  return httpData(type, "/v1/api/search_settings", {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
// 获取指定网段列表-
export function getDataNetList(type, params) {
  return httpData(type, "/v1/api/ip/cidrs", {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
// 获取指定网段列表-国军
export function getDataNetListg(type, params) {
  return httpData(type, "/v1/api/app/networks/get_bus_cidrs", {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
//保存网络表单
export function net_work_get_post(type, params) {
  return httpData(type, "/v1/api/app/networks/network_ticket", {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
//获取资源池pool_id
export function get_resource_poolid(type, params) {
  return httpData(
    type,
    "/v1/api/oc/bus_group_pool/" + params.bus_group_id + "/pools",
    {
      queryParams: params,
      contentType: "application/json;charset=utf-8"
    }
  );
}
//获取关联网段
export function get_ips_relate(type, params) {
  return httpData(type, "/v1/api/vmware/port_groups/get_vmware_cidrs", {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
