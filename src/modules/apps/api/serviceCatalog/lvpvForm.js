import httpData from "@/request/dataService/index.js";

// 获取lvpv表单数据
export function getInitData(type, params) {
  return httpData(type, `/v1/api/app/vglv/quick_vglv_ticket`, {
    queryParams: params
  });
}
//创建编辑lvpv表单数据
export function post_put_lvdata(type, params) {
  return httpData(type, `/v1/api/app/vglv/lv_ticket`, {
    queryParams: params
  });
}
//创建编辑lvpv表单数据
export function post_put_vgdata(type, params) {
  return httpData(type, `/v1/api/app/vglv/vg_ticket`, {
    queryParams: params
  });
}
//删除lvpv表单数据
export function delete_vgdata(type, params) {
  return httpData(
    type,
    `/v1/api/app/vglv/quick_vg_ticket?api_vg_id=` + params.api_vg_id,
    {
      queryParams: params
    }
  );
}
//删除lvpv表单数据
export function delete_lvdata(type, params) {
  return httpData(
    type,
    `/v1/api/app/vglv/quick_lv_ticket?api_lv_id=` + params.api_lv_id
  );
}
//获取vg名称列表
export function get_vgname_list(type, params) {
  return httpData(type, `/v1/api/app/vglv/quick_vg_name`, {
    queryParams: params
  });
}
//获取用户属主/属组相关信息
export function get_user_usergroup(type, params) {
  return httpData(type, `/v1/api/app/vglv/quick_vg_usergroup`, {
    queryParams: params
  });
}
