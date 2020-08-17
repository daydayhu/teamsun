import httpData from '@/request/dataService/index.js'

// 获取组件服务列表  类型为12的服务路径
export function getServicePath(type, params) {
  return httpData(type, `/v1/api/search_settings`, {
    queryParams: params
  })
}

// 应用系统 应用系统列表接口
export function appsSystems(type, params) {
  return httpData(type, `/v1/api/app/systems`, {
    queryParams: params
  })
}

// 获取左侧服务目录  数据来源为业务组服务目录
export function busGroupServices(type, params) {
  let service_type = {
    service_type: params.service_type
  };
  return httpData(type, `/v1/api/oc/bus_group_app/${params.bus_group_id}/services`, {
    queryParams: service_type,
    contentType: 'application/json;charset=utf-8'
  })
}
//网络策略添加
export function addNetworkStrategy(type, params) {
  return httpData(type, '/v1/api/app/systems/strategy', {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
//网络策略编辑
export function editNetworkStrategy(type, params) {
  return httpData(type, `/v1/api/app/systems/strategy/${params.strategy_id}`, {
    queryParams: params.body,
    contentType: "application/json;charset=utf-8"
  });
}
//网络策略列表
export function getNetworkStrategy(type, params) {
  return httpData(type, '/v1/api/app/systems/strategy', {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
//网络策略删除
export function delNetworkStrategy(type, strategy_id) {
  return httpData(type, `/v1/api/app/systems/strategy/${strategy_id}`, {
    contentType: "application/json;charset=utf-8"
  });
}
//网络策略获取校验状态
export function getNetworkStrategyCheck(type, params) {
  return httpData(type, `/v1/api/app/external/get_net_strategy_status`, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
//网络策略校验提交
export function subNetworkStrategyCheck(type, params) {
  return httpData(type, `/v1/api/app/external/submit_verify_net_strategy`, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
//网络策略校验获取失败详情
export function getNetworkStrategyCheckDetail(type, params) {
  return httpData(type, `/v1/api/app/external/get_net_strategy_guidance`, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
//网络策略导入
export function networkStrategyLoad(type, params) {
  return httpData(type, `/v1/api/app/systems/strategy/load`, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
// 获取右侧列表(获取服务信息)（新更换接口）
export function getChooseServices(type, params) {
    return httpData(type, `/v1/api/app/services/${params.service_type}`, {
        queryParams: params.param,
        contentType: 'application/json;charset=utf-8'
    })
}
