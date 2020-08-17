import httpData from '@/request/dataService/index.js'

// 获取rbac基础数据
export function getRbacBaseData(type,params) {
    return httpData(type, `/v1/api/search_settings`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}

// 获取计算可用域
export function getAvailableZones(type,params) {
    return httpData(type, `/v1/api/openstack/available_zones`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}

// 获取镜像列表
export function getImageList(type,image_type,node_id,os_version) {
    return httpData(type, `/v1/api/openstack/images/openstack_service_get_images?image_type=${image_type}&node_id=${node_id}&os_version=${os_version}`, {
        queryParams: "",
        contentType:'application/json;charset=utf-8'
    })
}


// 获取金属裸机
export function getBaremetals(type,pool_id) {
    return httpData(type, `/v1/api/openstack/resource_pools/type_resource?pool_id=${pool_id}&obj_type=IronicNodes`, {
        queryParams: "",
        contentType:'application/json;charset=utf-8'
    })
}
//获取操作系统
export function getOsList(params) {
    return httpData('get', `/v1/api/search_settings`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//获取特定业务组下的资源池列表
export function getSourcePoolList(id) {
    return httpData('get', `/v1/api/oc/bus_group_pool/${id}/pools`, {
        //queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//资源池下宿主机/存储池的获取
export function getListOfZYC(params) {
    return httpData('get', `/v1/api/vmware/source_pools/resource_lists`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}


export function getResourcePools(type,bus_group_id,pool_type) {
    return httpData(type, `/v1/api/oc/bus_group_app/${bus_group_id}/bus_group_pools?pool_type=${pool_type}`, {
        queryParams: "",
        contentType:'application/json;charset=utf-8'
    })
}

// 创建裸机表单
export function createIronicTicket(type,params) {
    return httpData(type, `/v1/api/app/ironic/ironic_ticket`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}

// 编辑裸机表单
export function editIronicTicket(type,params) {
    return httpData(type, `/v1/api/app/ironic/ironic_ticket`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}

// 获取裸机表单信息
export function getIronicTicket(type,node_canvas_uuid) {
    return httpData(type, `/v1/api/app/ironic/ironic_ticket?node_canvas_uuid=${node_canvas_uuid}`, {
        queryParams: "",
        contentType:'application/json;charset=utf-8'
    })
}

// 删除裸机表单信息
export function deleteIronicTicket(type,id) {
    return httpData(type, `/v1/api/app/ironic/ironic_ticket?ironic_id=${id}`, {
        queryParams: "",
        contentType:'application/json;charset=utf-8'
    })
}

// 获取正在使用的了裸机信息
export function getUsingIronic(type) {
    return httpData(type, `/v1/api/app/ironic/using_ironics`, {
        queryParams: "",
        contentType:'application/json;charset=utf-8'
    })
}

// 创建服务实例
export function createServiceInstance(type,params) {
    return httpData(type, `/v1/api/app/systems/service_instance`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}

// 创建服务节点
export function createServiceNode(type,params) {
    return httpData(type, `/v1/api/app/ironic/service_node`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}

//获取基础服务详情
export function getBaseServiceDetails(type,service_id) {
    return httpData(type, `/v1/api/oc/products/component/${service_id}`,{
        queryParams: "",
        contentType:'application/json;charset=utf-8'
    })
}

//创建订单
export function createTicket(type,params) {
    return httpData(type, `/v1/api/app/systems/tickets`,{
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}

//获取指定节点对应的网段
export function getNodeCidrs(type, app_id, ticket_id, canvas_uuid, ticket_obj_id) {
    return httpData(type, `/v1/api/app/networks/get_cidrs?app_id=${app_id}&ticket_id=${ticket_id}&canvas_uuid=${canvas_uuid}&ticket_obj_id=${ticket_obj_id}`, {
        queryParams: "",
        contentType:'application/json;charset=utf-8'
    })
}

//获取指定网段下的IP列表
export function getCidrsIP(type,cidr_id) {
    return httpData(type, `/v1/api/app/networks/get_cidr_ips?cidr_id=${cidr_id}`, {
        queryParams: "",
        contentType:'application/json;charset=utf-8'
    })
}

//锁定或解锁指定的IP
export function lockOrUnlockIP(type,params) {
    return httpData(type, `/v1/api/app/networks/locked_or_unlocked_ip`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}

//获取指定IP及NAT信息
export function getIPAndNATMsg(type,ticket_ip_id) {
    return httpData(type, `/v1/api/app/networks/get_ip_data?ticket_ip_id=${ticket_ip_id}`, {
        queryParams: "",
        contentType:'application/json;charset=utf-8'
    })
}

//编辑指定IP及NAT信息
export function editIPAndNATMsg(type,params) {
    return httpData(type, `/v1/api/app/networks/edit_ip_data`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}

//获取资源池列表
export function getResourcePoolData(type,bus_group_id,pool_type) {
    return httpData(type, `/v1/api/oc/bus_group_app/${bus_group_id}/bus_group_pools?pool_type=${pool_type}`, {
        queryParams: "",
        contentType:'application/json;charset=utf-8'
    })
}

//获取NAT策略
export function getNAT(type,config_type) {
    return httpData(type, `/v1/api/search_settings?config_type=${config_type}`, {
        queryParams: "",
        contentType:'application/json;charset=utf-8'
    })
}

//获取公共镜像列表
export function getPublicImageList(type,os_version) {
    return httpData(type, `/v1/api/file_storage/public_image/platform_type_get_images?platform_type=openstack&os_version=${os_version}`, {
        queryParams: "",
        contentType:'application/json;charset=utf-8'
    })
}

//判断网段是否可用
export function opsJudgeCidrUserAble(type,pool_id,cidr_id) {
    return httpData(type, `/v1/api/openstack/resource_pools/resource_match_cidr?pool_id=${pool_id}&cidr_ids=${cidr_id}&resource_type=neutron`, {
        queryParams: "",
        contentType:'application/json;charset=utf-8'
    })
}

//判断网段是否可用
export function vmJudgeCidrUserAble(type,pool_id,cidr_id) {
    return httpData(type, `/v1/api/vmware/port_groups/cidr_is_exist?cidr_ids=${cidr_id}&pool_id=${pool_id}`, {
        queryParams: "",
        contentType:'application/json;charset=utf-8'
    })
}

//获取指定节点绑定IP信息
export function getNodeIpData(type,app_id,ticket_id,canvas_uuid) {
  return httpData(type, `/v1/api/app/networks/get_node_ip_data?app_id=${app_id}&ticket_id=${ticket_id}&canvas_uuid=${canvas_uuid}`, {
      queryParams: "",
      contentType:'application/json;charset=utf-8'
  })
}

//获取端口聚合弹窗端口数据
export function getPortData(type,node_uuid) {
  return httpData(type, `/v1/api/openstack/baremetals/${node_uuid}/port`, {
      queryParams: "",
      contentType:'application/json;charset=utf-8'
  })
}

//获取端口聚合弹窗端口组数据
export function getPortGroupData(type,node_uuid) {
  return httpData(type, `/v1/api/openstack/baremetals/${node_uuid}/port_group`, {
      queryParams: "",
      contentType:'application/json;charset=utf-8'
  })
}
