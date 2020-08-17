import httpData from '@/request/dataService/index.js'

// 应用中心  订单第二步：获取业务组下服务列表
export function getPaletteList(type,params) {
  return httpData(type, `/v1/api/oc/bus_group_app/${params.bus_id}/server_catalog`, {})
}

// 应用中心  获取组件服务画布Json
export function getComponentCanvasJson(type,params) {
  return httpData(type, `/v1/api/oc/products/component/${params.component_id}/canvas`, {
    queryParams: params,
  })
}

// 保存基础服务图元数据
export function saveBaseServiceData(type,params) {
  return httpData(type, `/v1/api/app/systems/base_node`, {
    queryParams: params,
  })
}

// 保证组件服务图元数据
export function saveComponentServiceData(type,params) {
  return httpData(type, `/v1/api/app/systems/group_nodes`, {
    queryParams: params,
  })
}

// 删除图元数据
export function deleteNodeFromCanvas(type,params) {
  return httpData(type, `/v1/api/app/systems/del_node_data`, {
    queryParams: params,
  })
}

// 保存画布json
export function saveCanvasData(type,params) {
  return httpData(type, `/v1/api/app/systems/canvas`, {
    queryParams: params,
  })
}

// 获取画布json
export function getCanvasData(type,params) {
  return httpData(type, `/v1/api/app/systems/canvas`, {
    queryParams: params,
  })
}

// 保存画布全部关联关系
export function saveCanvasRelation(type,params) {
  return httpData(type, `/v1/api/app/systems/ticket_canvas_relation`, {
    queryParams: params,
  })
}

// 获取原始基础服务操作集
export function getOriginServiceOperationList(type,params) {
  return httpData(type, `/v1/api/app/systems/oc_service_sets/${params.service_id}`,{
    queryParams: params,
  })
}

// 获取节点操作集列表
export function getNodeServiceOperationList(type,params) {
  return httpData(type, `/v1/api/app/systems/dialog_service_sets`, {
    queryParams: params,
  })
}

// 添加基础服务操作集
export function addServiceOperationList(type,params) {
  return httpData(type, `/v1/api/app/systems/service_sets`, {
    queryParams: params,
  })
}

// 编辑基础服务操作集
export function editServiceOperationList(type,params) {
  return httpData(type, `/v1/api/app/systems/service_sets`, {
    queryParams: params,
  })
}

// 编辑基础服务基础信息(名称、交付顺序等)
export function editServiceBaseInfo(type,params) {
  return httpData(type, `/v1/api/app/systems/service_node_msg`, {
    queryParams: params,
  })
}

// 获取应用系统列表
export function getAppsList(type,params) {
  return httpData(type, `/v1/api/app/appinfo`, {
    queryParams: params,
  })
}

// 获取应用系统下基础服务列表
export function getBaseServiceListFormApps(type,params) {
  return httpData(type, `/v1/api/app/apps/${params.app_uuid}/nodes`)
}

// 获取基础服务所关联附加产品列表
export function getAffiliateListFormApps(type,params) {
  return httpData(type, `/v1/api/app/apps/nodes/${params.node_uuid}/children`, {
    queryParams: params,
  })
}

// 复制应用系统下基础服务
export function copyBaseServiceFromApps(type,params) {
  return httpData(type, `/v1/api/app/systems/service/clone`, {
    queryParams: params,
  })
}

// 获取部署单元列表
export function getDeployUnitList(type,params) {
  return httpData(type, `/v1/api/app/systems/deployment_unit`, {
    queryParams: params,
  })
}

// 新增部署单元
export function addDeployUnit(type,params) {
  return httpData(type, `/v1/api/app/systems/deployment_unit/create`, {
    queryParams: params,
  })
}

// 获取云主机列表
export function getCloudList(type,params) {
  return httpData(type, `/v1/api/app/cloud_host/${params.app_id}/${params.ticket_id}`)
}

// 变更订单创建服务节点对应的操作集
export function changeServiceOperationList(type,params) {
  return httpData(type, `/v1/api/app/systems/reset/service_sets`, {
    queryParams: params,
  })
}

// 获取应用系统已发布模板
export function getPublishedAppTemplate(type,params) {
  return httpData(type, `/v1/api/app/template/published_app_templates`, {
    queryParams: "",
  })
}

// 导入模板匹配
export function releasePublishedAppTemplate(type,params) {
  return httpData(type, `/v1/api/app/template/template_match_pro`, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  })
}

// 导入模板
export function importTemplate(type,params) {
  return httpData(type, `/v1/api/app/template/import_template`, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  })
}
//集中配置下发-模板列表
export function getConfigTpl(type,ticket_id) {
  return httpData(type, `/v1/api/app/systems/tickets/${ticket_id}/form_tpl`, {
    contentType: "application/json;charset=utf-8"
  })
}
//集中配置下发-模板下载
export function configTplDowmload(type,params) {
  return httpData(type, `/v1/api/app/systems/tickets/${params.ticket_id}/form_tpl_download`, {
    queryParams: params,
  })
}
//集中配置下发-模板校验
export function configTplVerify(type,params) {
  return httpData(type, `/v1/api/app/systems/tickets/verify_tpl`, {
    queryParams: params,
  })
}
//集中配置下发-模板导入
export function configTplImport(type,ticket_id,params) {
  return httpData(type, `/v1/api/app/systems/tickets/${ticket_id}/export_tpl`, {
    queryParams: params,
    contentType: "multipart/form-data;charset=utf-8"
  })
}
//应用系统-基础服务操作集校验
export function checkServiceSet(params) {
  return httpData('get', `/v1/api/app/validation/service_set`, {
    queryParams: params,
  })
}
//应用系统-必填项校验
export function checkValidation(params) {
  return httpData('get', `/v1/api/app/validation`, {
    queryParams: params,
  })
}
