import httpData from '@/request/dataService/index.js'
//获取画布
export function getDeliveryView(type, params) {
  return httpData(type, `/v1/api/app/systems/${params.app_id}/delivery_view`, {
    queryParams: {ticket_id:params.ticket_id},
  })
}
//获取订单列表
export function getOrderList(type, params) {
  return httpData(type, `/v1/api/app/systems/ticket`, {
    queryParams:params,
  })
}
//订单删除
export function orderDelete(type, ticket_id) {
  return httpData(type, `/v1/api/app/systems/ticket/del/${ticket_id}`, {
    //queryParams:ticket_id,
  })
}
//订单撤销
export function orderCancel(type, params) {
  return httpData(type, `/v1/api/app/systems/ticket/cancel`, {
    queryParams: params,
  })
}
//订单生成模板
export function orderTemplate(type, params) {
  return httpData(type, `/v1/api/app/template/generate_template`, {
    queryParams: params,
  })
}
// 获取保存之后的画布
export function getSystemsCanvas(type, params) {
  return httpData(type, `/v1/api/app/systems/canvas `, {
    queryParams:params,
  })
}

// 保存画布
export function saveSystemsCanvas(type, params) {
  return httpData(type, `/v1/api/app/systems/canvas `, {
    queryParams:params,
    contentType: "application/json;charset=utf-8"
  })
}

//获取订单审批历史
export function getOrderDetailHistory(type,ticket_id) {
    return httpData(type,`/v1/api/app/flow_instance/ticket_instance_list/${ticket_id}`, {
        queryParams:"",
        contentType: "application/json;charset=utf-8"
    })
}

//获取订单详情中部署任务
export function getDeployTaskList(type, params) {
  return httpData(type, `/v1/api/app/systems/ticket/${params.ticket_id}/deploy_task`, {
    queryParams:params.body,
  })
}
//获取订单详情交付计划
export function getOrderDetailPlan(type,app_id,ticket_id,step_type) {
  return httpData(type,`/v1/api/app/systems/apps/${app_id}/tickets/${ticket_id}/delivery?step_type=${step_type}`, {
      queryParams:"",
      contentType: "application/json;charset=utf-8"
  })
}
//获取订单详情流程
export function getOrderFlowRecord(type,param) {
  return httpData(type,`/v1/api/app/systems/step_record`, {
      queryParams:param,
      contentType: "application/json;charset=utf-8"
  })
}
