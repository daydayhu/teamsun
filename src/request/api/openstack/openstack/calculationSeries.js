import httpData from "../../../dataService/index.js";

// 注册裸机列表页查询
export function computedBareMetalList(type, params) {
  return httpData(type, `/v1/api/openstack/baremetals`, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
// 用户列表
export function userApi(type, params, userId) {
  let url = `/v1/api/users`;
  if (userId) {
    url = `/v1/api/users/` + userId;
  }
  return httpData(type, url, {
    queryParams: params
  });
}
//注册裸机获取注册信息
export function getbaremetal_register(type, params) {
  return httpData(type, "/v1/api/openstack/baremetals/baremetal_register", {
    queryParams: params
  });
}
//操作更多下拉点击按钮操作
export function baremetal_operate_button(type, params) {
  return httpData(type, "/v1/api/openstack/baremetals/action", {
    queryParams: params
  });
}
//获取裸机节点详情
export function baremetal_details(type, id) {
  return httpData(
    type,
    "/v1/api/openstack/baremetals/baremetal?baremetal_id=" + id, {}
  );
}
//根据云控制器获取对应的计算可用域和云区域
export function get_cloud_region_and_az(type, id) {
  return httpData(
    type,
    "/v1/api/openstack/baremetals/baremetal_register/get_cloud_region_and_az/" +
    id, {}
  );
}
//轮询获取最新状态
export function get_update_state(type, params) {
  return httpData(
    type,
    "/v1/api/openstack/baremetals/sync?baremetal_ids=" + params, {}
  );
}
//裸机编辑提交
export function edit_baremetal_details(type, params, node_id) {
  let url = "";
  if (node_id) {
    url = "/v1/api/openstack/baremetals/baremetal_register/" + node_id;
  } else {
    url = "/v1/api/openstack/baremetals/baremetal_register";
  }
  return httpData(type, url, {
    queryParams: params
  });
}
//裸机编辑信息获取
export function get_edit_data(type, node_id) {
  return httpData(
    type,
    "/v1/api/openstack/baremetals/baremetal_edit/" + node_id, {}
  );
}




