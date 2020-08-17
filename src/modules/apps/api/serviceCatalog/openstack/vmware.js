import httpData from '@/request/dataService/index.js'
//获取存储池详情
export function detailStoresPool(id) {
    return httpData('get', `/v1/api/vmware/data_stores/${id}`, {
        //queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//创建VMWARE表单
export function addVmwareTicket(params) {
    return httpData('post', '/v1/api/app/vmwares/vmware_ticket', {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//编辑VMWARE表单
export function editVmwareTicket(params) {
    return httpData('put', `/v1/api/app/vmwares/quick_vmware_ticket`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//获取VMWARE表单详情
export function deatilVmwareTicket(params) {
    return httpData('get', `/v1/api/app/vmwares/quick_vmware_ticket`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//删除指定VMWARE表单
export function deleteVmwareTicket(params) {
    return httpData('delete', `/v1/api/app/vmwares/quick_vmware_ticket`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//根据业务组ID获取资源池的列表   31314
export function getSourcePoolByBusId(bus_group_id,params){
    return httpData('get', `/v1/api/oc/bus_group_app/${bus_group_id}/bus_group_pools`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//根据资源池ID获取宿主机的列表   31312
export function getHostListBySourceId(params){
    return httpData('get', `/v1/api/vmware/source_pools/type_resource`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//根据宿主机的ID获取虚拟目录的列表 31312
export function getVirtualDirectoryByHostId(host_id){
    return httpData('get', `/v1/api/vmware/calcs/hosts/${host_id}/folders`, {
        contentType:'application/json;charset=utf-8'
    })
}
//根据资源池镜像目标存储的列表 31312 也是附加云硬盘的存储也是这个
export function getMirrorStoragePoolBySourceId(params){
    return httpData('get', `/v1/api/vmware/source_pools/type_resource`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//获取操作系统及其版本号
export function getRbacBaseData(params) {
    return httpData('get', `/v1/api/search_settings`, {
      queryParams: params,
      contentType: 'application/json;charset=utf-8'
    })
}
//根据宿主机，操作系统及其版本获取镜像的下拉列表
export function getImgListByHostId(params) {
    return httpData('get', `/v1/api/vmware/images/app_get_images`, {
      queryParams: params,
      contentType: 'application/json;charset=utf-8'
    })
}
//获取公共镜像列表
export function getPublicImageList(os_version) {
    return httpData('get', `/v1/api/file_storage/public_image/platform_type_get_images?platform_type=vcenter&os_version=${os_version}`, {
        queryParams: "",
        contentType:'application/json;charset=utf-8'
    })
}

//虚机配值信息
export function hostSetsList(params) {
    return httpData('get', `/v1/api/app/vmwares/get_vmware_config_info`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}

//vmware 获取指定vmware虚机表单 基本信息
export function requireBaseInfos(params) {
    return httpData('get', `/v1/api/app/vmwares/get_vmware_base_info`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//vmware 获取指定vmware虚机表单 配值信息
export function requireConfigInfos(params) {
    return httpData('get', `/v1/api/app/vmwares/get_vmware_config_info`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//vmware 编辑指定vmware虚机表单 基本信息
export function editBaseInfos(params) {
    return httpData('put', `/v1/api/app/vmwares/edit_vmware_base_info`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//vmware 编辑指定vmware虚机表单 配值信息
export function editconfigInfos(params) {
    return httpData('put', `/v1/api/app/vmwares/edit_vmware_config_info`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//vmware 校验名称是否冲突
export function checkVmwareName(params) {
    return httpData('get', `/v1/api/app/vmwares/ticket_vmware_check_name`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//获取公共镜像是否上传
export function checkMirrorIsUpload(image_id,source_pool_id) {
    return httpData('get', `/v1/api/vmware/images/${image_id}/public_image/${source_pool_id}`, {
        contentType:'application/json;charset=utf-8'
    })
}
//获取虚机最大数
export function VmwareNum(params) {
    return httpData('get', `/v1/api/search_settings`, {
        queryParams: params,
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

//获取vm调整大小表单
export function getVmChangSizeList(type,app_id,ticket_id,canvas_uuid) {
  return httpData(type, `/v1/api/app/vmwares/get_vmware_resize_info?app_id=${app_id}&ticket_id=${ticket_id}&node_canvas_uuid=${canvas_uuid}`, {
      queryParams: "",
      contentType:'application/json;charset=utf-8'
  })
}

//修改vm调整大小表单
export function editVmChangSizeList(type,params) {
  return httpData(type, `/v1/api/app/vmwares/edit_vmware_resize_info`, {
      queryParams: params,
      contentType:'application/json;charset=utf-8'
  })
}

//获取附加硬盘数据
export function getAddDiskList(type,app_id,ticket_id,canvas_uuid) {
  return httpData(type, `/v1/api/app/vmwares/get_vmware_add_disk_info?app_id=${app_id}&ticket_id=${ticket_id}&node_canvas_uuid=${canvas_uuid}`, {
      queryParams: "",
      contentType:'application/json;charset=utf-8'
  })
}

//编辑附加硬盘数据
export function editAddDiskList(type,params) {
  return httpData(type, `/v1/api/app/vmwares/edit_vmware_add_disk_info`, {
      queryParams: params,
      contentType:'application/json;charset=utf-8'
  })
}
