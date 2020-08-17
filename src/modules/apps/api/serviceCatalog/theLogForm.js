import httpData from "@/request/dataService/index.js";

// 获取日志表格数据
export function get_post_log(type, params) {
  return httpData(type, `/v1/api/app/log/quick_log_ticket`, {
    queryParams: params
  });
}
// 获取日志表格数据
export function get_post_deleteLog(type, params) {
  return httpData(
    type,
    `/v1/api/app/log/quick_log_ticket?api_log_id=` +
      params.api_log_id +
      "&logitem_id=" +
      params.logitem_id,
    {
      queryParams: params
    }
  );
}
//获取主机列表
export function get_ticket_log_vm_name(type, params) {
  return httpData(type, `/v1/api/app/vmwares/get_ticket_log_vm_name`, {
    queryParams: params
  });
}
//提交增加表单
export function post_table_data(type, params) {
  return httpData(type, `/v1/api/app/log/log_ticket`, {
    queryParams: params
  });
}
//监控表单获取文件
export function get_post_file_list(type, params) {
  return httpData(type, `/v1/api/app/forms/monitor`, {
    queryParams: params
  });
}
//监控表单保存文件
export function save_files(type, params) {
  return httpData(type, `/v1/api/app/forms/monitor/upload`, {
    queryParams: params
  });
}
//删除表单保存文件
export function delete_files(type, params) {
  return httpData(type, `/v1/api/app/forms/monitor/` + params.service_file_id, {
    queryParams: params
  });
}
