import httpData from '@/request/dataService/index.js'
//获取任务列表
export function getTaskList(type, params) {
  return httpData(type, `/v1/api/app/systems/events`, {
    queryParams: params,
  })
}
//任务列表操作集操作接口
export function taskOperate(type, params) {
  return httpData(type, `/v1/api/app/actions/exec_state_operate`, {
    queryParams: params,
  })
}
// 第三步指定操作的----接单
export function taskTake(type, params) {
  return httpData(
    type,
    `/v1/api/app/systems/apps/${params.app_id}/tickets/${params.ticket_id}/nodes/${params.node_id}/set/${params.set_id}/take`,
    {
      queryParams: params.body,
      contentType: "application/json;charset=utf-8"
    }
  );
}
// 第 五步指定操作的----接单
export function passOrder(type, params) {
  return httpData(
    type,
    `/v1/api/app/actions/res_deploy_accept_order`,
    {
      queryParams: params,
      contentType: "application/json;charset=utf-8"
    }
  );
}
//任务列表操作集-指定操作的转单提交-
export function taskTransfer(type, params) {
  return httpData(type, `/v1/api/app/systems/apps/${params.app_id}/tickets/${params.ticket_id}/nodes/${params.node_id}/set/${params.set_id}/transfer`, {
    queryParams: params.body,
  })
}
// 交付计划第三步指定操作的----提交确认
export function taskComfirm(type, params) {
  return httpData(
    type,
    `/v1/api/app/systems/apps/${params.app_id}/tickets/${params.ticket_id}/nodes/${params.node_id}/set/${params.set_id}/confirm`,
    {
      queryParams: params.body,
      contentType: "application/json;charset=utf-8"
    }
  );
}
//任务列表操作集-指定操作的转单-转单人获取
export function taskTransferUsers(type, params) {
  return httpData(type, `/v1/api/groups/group_user`, {
    queryParams: params,
  })
}
//复核提交接口
export function taskReview(type, params) {
  return httpData(type, `/v1/api/app/actions/res_deploy_submit_review`, {
    queryParams: params,
  })
}
//复核意见列表
export function taskReviewComments(type, ticket_step_id, service_set_task_id) {
  return httpData(type, `/v1/api/app/systems/review/${ticket_step_id}?service_set_task_id=${service_set_task_id}`, {})
}
//获取复核输出列表
export function getReviewCommentsOut(type, service_set_task_id) {
  return httpData(type, `/v1/api/app/systems/review/review_data/${service_set_task_id}`, {
    //queryParams: params,
  })
}
//获取云主机列表
export function taskVms(type, params) {
  return httpData(type, `/v1/api/app/systems/vms`, {
    queryParams: params,
  })
}
//查询云主机地址
export function getsshUrl(type, params) {
  return httpData(type, `/v1/api/app/systems/ssh`, {
    queryParams: params,
  })
}
//------------------------------二期新接口---------------------
//获取任务列表​/v1​/api​/app​/systems​/my_tasksticket
export function getTaskListN(type, params) {
  return httpData(type, `/v1/api/app/systems/my_tasks`, {
    queryParams: params,
  })
}
