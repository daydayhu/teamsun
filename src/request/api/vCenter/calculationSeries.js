import httpData from '../../dataService/index.js'

// 计算资源池列表
export function computeResourcePool(type, params) {
    return httpData(type, `/v1/api/vmware/calcs/clusters`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
// 计算资源池详情列表
export function computeResourcePoolDetails(type, params, cluster_id) {
    return httpData(type, `/v1/api/vmware/calcs/clusters/${cluster_id}`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
// 计算资源池 获取指定资源池主机信息
export function computeResourcePoolDetailsHosts(type, params, cluster_id) {
    return httpData(type, `/v1/api/vmware/calcs/clusters/${cluster_id}/hosts`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
// 宿主机列表
export function hostMachine(type, params) {
    return httpData(type, `/v1/api/vmware/calcs/hosts`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
// 宿主机详情列表
export function hostMachineDetails(type, params, host_id) {
    return httpData(type, `/v1/api/vmware/calcs/hosts/${host_id}`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
// 宿主机详情-> 存储资源
export function hostMachineDatastores(type, params, host_id) {
    return httpData(type, `/v1/api/vmware/calcs/hosts/${host_id}/datastores`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
// 宿主机详情-> 存储资源
export function hostMachineNetworks(type, params, host_id) {
    return httpData(type, `/v1/api/vmware/calcs/hosts/${host_id}/networks`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
// 虚拟机列表
export function virtualMachine(type, params) {
    return httpData(type, `/v1/api/vmware/calcs/vms`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
// 虚拟机详情->基本信息列表
export function virtualMachineDetails(type, params, vm_id) {
    return httpData(type, `/v1/api/vmware/calcs/vms/${vm_id}`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
// 虚拟机详情->获取指定虚拟网卡组信息
export function virtualMachineDetailsPorts(type, params, vm_id) {
    return httpData(type, `/v1/api/vmware/calcs/vms/${vm_id}/ports`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
// 虚拟机详情->获取指定虚拟网卡组信息
export function virtualMachineDetailsDisks(type, params, vm_id) {
    return httpData(type, `/v1/api/vmware/calcs/vms/${vm_id}/disks`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
// 存储资源池列表 
export function storagePool(type, params) {
    return httpData(type, `/v1/api/vmware/data_stores`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
// 存储资源池详情
export function storagePoolDetails(type, params, ds_id) {
    return httpData(type, `/v1/api/vmware/data_stores/${ds_id}`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
// 存储资源池详情 获取主机
export function storagePoolDetailsHosts(type, params, ds_id) {
    return httpData(type, `/v1/api/vmware/data_stores/${ds_id}/hosts`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}


