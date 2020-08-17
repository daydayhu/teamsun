import httpData from "@/request/dataService/index.js";
//获取应用系统列表-待接入
export function getSystemList(type, params) {
  return httpData(type, "/v1/api/app/apps", {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}

//获取应用系统列表-无分页
export function getAllSystems(type, params) {
  let the_url = `/v1/api/app/systems`;
  if(params){
   the_url = `/v1/api/app/systems?bus_ids=${params}`
  }
  return httpData(type, the_url, {
    contentType: "application/json;charset=utf-8"
  });
}

//删除应用系统
export function deleteAppSystem(type, app_id) {
  return httpData(type, `/v1/api/app/apps/${app_id}`, {
    contentType: "application/json;charset=utf-8"
  });
}

//根据app_id获取应用系统详情-待接入
export function getSystemDetail(type, app_id) {
  return httpData(type, `/v1/api/app/apps/${app_id}/system`, {
    contentType: "application/json;charset=utf-8"
  });
}
//应用系统详情中-获取订单列表
export function getSystemOrderList(type, app_id) {
  return httpData(type, `/v1/api/app/systems/tickets/${app_id}`, {
    contentType: "application/json;charset=utf-8"
  });
}
//订单删除
export function orderDelete(type, ticket_id) {
  return httpData(type, `/v1/api/app/systems/ticket/del/${ticket_id}`, {
    //queryParams:ticket_id,
  });
}
//订单撤销
export function orderCancel(type, params) {
  return httpData(type, `/v1/api/app/systems/ticket/cancel`, {
    queryParams: params,
  })
}
//获取订单详情
export function getOrderDetail(type, ticket_id) {
  return httpData(type, `/v1/api/app/systems/tickets/detail/${ticket_id}`, {
    contentType: "application/json;charset=utf-8"
  });
}
// 基础数据 根据类型获取对应数据信息-
export function getDataBase(type, params) {
  return httpData(type, `/v1/api/search_settings`, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
//获取业务组列表-（
export function getBusGroup(type, params) {
  return httpData(type, "/v1/api/oc/bus_group_app", {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}

//获取组织用户列表-
export function getUser(type, params) {
  return httpData(
    type,
    `/v1/api/actions/get_all_users_in_org`, {
      queryParams: params,
      contentType: "application/json;charset=utf-8"
    }
  );
}
//用户详情 获取指定用户的关联角色
export function getRoleByUserId(type, params) {
  return httpData(type, `/v1/api/user/user_role/${params.user_id}`, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
//新建应用系统-第一步
export function addSystemFirst(type, params) {
  return httpData(type, `/v1/api/app/apps`, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
//编辑应用系统
export function editSystem(type, params) {
  return httpData(type, `/v1/api/app/apps/system/${params.app_id}`, {
    queryParams: params.body,
    contentType: "application/json;charset=utf-8"
  });
}
//根据app_id获取成员列表
export function getMemberList(type, app_id) {
  return httpData(type, `/v1/api/app/members/${app_id}/users`, {
    contentType: "application/json;charset=utf-8"
  });
}
//添加成员
export function addMember(type, params) {
  return httpData(type, `/v1/api/app/members`, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
//删除成员
export function deleteMember(type, app_user_id) {
  return httpData(type, `/v1/api/app/members/${app_user_id}`, {
    contentType: "application/json;charset=utf-8"
  });
}
//批量删除成员
export function mulDeleteMember(type, params) {
  return httpData(type, `/v1/api/app/members/users`, {
    contentType: "application/json;charset=utf-8",
    queryParams: params,
  });
}
//获取应用架构图数据
export function getAppsArch(type, params) {
  return httpData(type, "/v1/api/app/apps/" + params.app_id + "/arch", {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
// 获取canvas data
export function getCanvasDataJg(type, params) {
  return httpData(type, `/v1/api/app/systems/canvas`, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
// 获取canvas data
export function getCanvasData(type, params) {
  return httpData(type, `/v1/api/app/deployments/` + params.app_id, {
    contentType: "application/json;charset=utf-8"
  });
}
// 获取组件服务画布 {component_id}/
export function componentsCanvas(type, params) {
  return httpData(
    type,
    "/v1/api/oc/products/component/" + params.component_id + "/canvas", {
      queryParams: params,
      contentType: "application/json;charset=utf-8"
    }
  );
}
// 应用系统 交付计划获取服务实例列表
export function getServiceInstances(type, params) {
  return httpData(
    type,
    `/v1/api/app/systems/apps/${params.app_id}/tickets/${params.ticket_id}/instances?step_type=${params.step_type}`
  );
}
//部署视图回显创建节点操作集
export function quick_base_services(type, params) {
  return httpData(type, `/v1/api/app/systems/quick_base_services`, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
//部署视图回显创建组操作集
export function quick_group_services(type, params) {
  return httpData(type, `/v1/api/app/systems/quick_group_services`, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}

// 蓝图定义创建订单
export function createTicket(type, params) {
  return httpData(type, `/v1/api/app/systems/bp/tickets`, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}

// 快速服务创建订单
export function quickCreateTicket(type, params) {
  return httpData(type, `/v1/api/app/systems/tickets`, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
// 编辑订单
export function editTicket(type, params) {
  return httpData(type, `/v1/api/app/systems/ticket/edit/${params.ticket_id}`, {
    queryParams: params.body,
    contentType: "application/json;charset=utf-8"
  });
}
// 交付计划获取交付负责人，复核人
export function getGroupUser(type) {
  return httpData(type, `/v1/api/groups/group_user`);
}

// 交付计划获某一用户组下的所有用户
export function getUserList(type, group_id) {
  return httpData(type, `/v1/api/groups/group_user?group_id=${group_id}`);
}

// 交付计划第三步指定操作的----接单
export function orderTake(type, params) {
  return httpData(
    type,
    `/v1/api/app/systems/apps/${params.app_id}/tickets/${params.ticket_id}/nodes/${params.node_id}/set/${params.set_id}/take`, {
      queryParams: params.body,
      contentType: "application/json;charset=utf-8"
    }
  );
}

// 交付计划第三步指定操作的-----转单
export function orderTransfer(type, params) {
  return httpData(
    type,
    `/v1/api/app/systems/apps/${params.app_id}/tickets/${params.ticket_id}/nodes/${params.node_id}/set/${params.set_id}/transfer`, {
      queryParams: params.body,
      contentType: "application/json;charset=utf-8"
    }
  );
}

// 交付计划第三步指定操作的-----提交确认
export function orderSubmit(type, params) {
  return httpData(
    type,
    `/v1​/api​/app​/systems​/apps​/${params.app_id}​/tickets​/${params.ticket_id}​/instances​/${params.set_id}​/confirm`, {
      queryParams: params,
      contentType: "application/json;charset=utf-8"
    }
  );
}

//交付计划第五步操作集
export function operateSet(type, params) {
  return httpData(type, `/v1/api/app/actions/exec_state_operate`, {
    queryParams: params
  });
}
//交付计划第五步 查看部署日志，任务日志
export function viewLog(type, params) {
  return httpData(type, `/v1/api/app/systems/log`, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}

//交付计划获取初始化画布
export function getDeliveryView(type, params) {
  return httpData(type, `/v1/api/app/systems/${params.app_id}/delivery_view`, {
    queryParams: {
      ticket_id: params.ticket_id
    }
  });
}

// 交付计划获取保存之后的画布
export function getSystemsCanvas(type, params) {
  return httpData(
    type,
    `/v1/api/app/systems/canvas?app_id=${params.app_id}&ticket_id=${params.ticket_id}&is_app_canvas=${params.is_app_canvas}&canvas_type=${params.canvas_type}`, {}
  );
}

// 交付计划保存画布
export function saveSystemsCanvas(type, params) {
  return httpData(type, `/v1/api/app/systems/canvas `, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
// 获取附件列表
export function getFileList(type, params) {
  return httpData(type, "/v1/api/app/systems/" + params.ticket_id + "/files", {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
//订单相关 快速服务 获取画布
export function getCanvasIsLive(type, params) {
  return httpData(
    type,
    "/v1/api/app/systems/" +
    params.ticket_id +
    "/quick_component/" +
    params.component_id, {
      queryParams: params,
      contentType: "application/json;charset=utf-8"
    }
  );
}

//获取订单交付计划
export function getTicketDeliverPlan(type, params) {
  return httpData(
    type,
    `/v1/api/app/systems/apps/${params.app_id}/tickets/${params.ticket_id}/delivery?step_type=${params.step_type}`
  );
}

// 应用系统 交付计划编辑 一期
export function editServiceInstances(type, params) {
  return httpData(
    type,
    `/v1/api/app/systems/apps/${params.app_id}/tickets/${params.ticket_id}/instances`, {
      queryParams: params.body,
      contentType: "application/json;charset=utf-8"
    }
  );
}

// 应用系统 交付计划编辑 二期
export function editTicketDeliverPlan(type, params) {
  return httpData(
    type,
    `/v1/api/app/systems/apps/${params.app_id}/tickets/${params.ticket_id}/delivery`, {
      queryParams: params.body,
      contentType: "application/json;charset=utf-8"
    }
  );
}

//资源规划提交 获取网络策略审核状态
export function get_net_strategy_review_status(type, params) {
  return httpData(
    type,
    `/v1/api/app/external/get_net_strategy_review_status?app_id=${params.app_id}&ticket_id=${params.ticket_id}`
  );
}
// 获取 已绑定关联关系的标签
export function getBatchTagList(type, params) {
  return httpData(type, `/v1/api/tags/search_instance_tags`, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}

// 第五步指定操作的----接单
export function passOrder(type, params) {
  return httpData(
    type,
    `/v1/api/app/actions/res_deploy_accept_order`, {
      queryParams: params,
      contentType: "application/json;charset=utf-8"
    }
  );
}

// 应用系统详情虚机表单
export function getDetailVmData(type, app_id) {
  return httpData(
    type,
    `/v1/api/app/vm_host/${app_id}`, {
      queryParams: "",
      contentType: "application/json;charset=utf-8"
    }
  );
}

// 应用系统详情裸机表单
export function getDetailOpsData(type, app_id) {
  return httpData(
    type,
    `/v1/api/app/ironic_hosts/${app_id}`, {
      queryParams: "",
      contentType: "application/json;charset=utf-8"
    }
  );
}

// 获取裸机部署单元下拉列表
export function getDployUnitList(type, app_id) {
  return httpData(
    type,
    `/v1/api/app/systems/deployment_unit?app_id=${app_id}`, {
      queryParams: "",
      contentType: "application/json;charset=utf-8"
    }
  );
}

// 新建裸机部署单元
export function newBuildDeployUnit(type, params) {
  return httpData(
    type,
    `/v1/api/app/systems/deployment_unit/create`, {
      queryParams: params,
      contentType: "application/json;charset=utf-8"
    }
  );
}

// 关联裸机部署单元
export function relationDeployUnit(type, params) {
  return httpData(
    type,
    `/v1/api/app/systems/deployment_unit/relation`, {
      queryParams: params,
      contentType: "application/json;charset=utf-8"
    }
  );
}

// 裸机账号设置
export function opsSetAccount(type, params) {
  return httpData(
    type,
    `/v1/api/openstack/baremetals/set_user`, {
      queryParams: params,
      contentType: "application/json;charset=utf-8"
    }
  );
}

// 虚机账号设置
export function vmSetAccount(type, params) {
  return httpData(
    type,
    `/v1/api/vmware/vms/vm_pwd`, {
      queryParams: params,
      contentType: "application/json;charset=utf-8"
    }
  );
}

// 获取应用系统部署视图
export function getAppDeploymentView(type, params) {
  return httpData(
    type,
    `/v1/api/app/systems/${params.app_id}/deployment_view`, {
      queryParams: params,
      contentType: "application/json;charset=utf-8"
    }
  );
}

export function saveAppDeploymentView(type, params) {
  return httpData(
    type,
    `/v1/api/app/systems/app_canvas`, {
      queryParams: params,
      contentType: "application/json;charset=utf-8"
    }
  );
}

