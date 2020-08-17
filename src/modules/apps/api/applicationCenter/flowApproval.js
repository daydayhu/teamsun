import httpData from '@/request/dataService/index.js'

//流程实例 审批提交
export function postFlowApproval(type, params) {
  return httpData(type, '/v1/api/app/flow_instance/approval', {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}

//流程实例 获取审批基本信息
export function getFlowApprovalBase(type, instance_id,ticket_id) {
return httpData(type, `/v1/api/app/flow_instance/approval?instance_id=${instance_id}&ticket_id=${ticket_id}`, {
    queryParams: "",
    contentType: "application/json;charset=utf-8"
  });
}

//流程实例 流转记录
export function getFlowApprovalRecord(type, instance_id) {
  return httpData(type, `/v1/api/app/flow_instance/${instance_id}/record`, {
    queryParams: "",
    contentType: "application/json;charset=utf-8"
  });
}

//流程实例 获取流程图
export function getFlowApprovalChart(type, instance_id) {
  return httpData(type, `/v1/api/app/flow_instance/${instance_id}/flow_chart`, {
    queryParams: "",
    contentType: "application/json;charset=utf-8"
  });
}
