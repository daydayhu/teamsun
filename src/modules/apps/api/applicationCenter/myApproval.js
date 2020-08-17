import httpData from '@/request/dataService/index.js'

//获取我的审批列表
export function getMyApprovalList(type, params) {
    return httpData(type, '/v1/api/app/flow_instance', {
      queryParams: params,
      contentType: "application/json;charset=utf-8"
    });
}

//获取单条数据详情
export function getFlowDetail(type, instance_user_id) {
    return httpData(type, `/v1/api/app/flow_instance/${instance_user_id}`, {
      queryParams: "",
      contentType: "application/json;charset=utf-8"
    });
}