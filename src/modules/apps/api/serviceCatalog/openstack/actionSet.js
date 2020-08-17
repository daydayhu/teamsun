import httpData from '@/request/dataService/index.js'
//获取操作集列表
export function getActionSetList(params) {
    return httpData('get', `/v1/api/app/sets`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//创建节点操作集
export function addActionSet(params) {
    return httpData('post', '/v1/api/app/sets/service_sets', {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//获取操作集列表 ???
export function getActionSetLists(node_set_uuid) {
    return httpData('get', `/v1/api/app/sets/${node_set_uuid}/tables`, {
        contentType:'application/json;charset=utf-8'
    })
}
//创建节点操作集 ???
export function addActionSets(params) {
    return httpData('post', '/v1/api/app/sets/service_set_tables', {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//获取操作集表单参数列表
export function getActionSetParaList(node_set_uuid,table_uuid) {
    return httpData('get', `/v1/api/app/sets/${node_set_uuid}/tables/${table_uuid}/paras`, {
        contentType:'application/json;charset=utf-8'
    })
}
//创建操作集参数
export function addActionSetPara(params) {
    return httpData('post', '/v1/api/app/sets/service_set_key', {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//根据UUID获取操作集
export function requireSetsByUUID(params){
    return httpData('get', `/v1/api/app/sets`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//根据操作集获取表单参数列表
export function requireParasBySet(node_set_id){
    return httpData('get', `/v1/api/app/${node_set_id}/tables`, {
        //queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}



//获取服务节点选中操作集-para
export function requireParasByUUID(params){
    return httpData('get', `/v1/api/app/forms`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//自定义表单获取更多参数
export function requireMoreParasList(node_set_uuid) {
    return httpData('get', `/v1/api/app/forms/more_paras/${node_set_uuid}`, {
        contentType:'application/json;charset=utf-8'
    })
}
//自定义表单-更多参数保存
export function SaveMoreParas(params) {
    return httpData('post', `/v1/api/app/forms/more_paras`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//自定义表单-保存单个表数据
export function SaveSingleForm(params) {
    return httpData('post', `/v1/api/app/forms/tables/paras`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//自定义表单-删除上传文件
export function DeleteFileOfForm(path) {
    return httpData('delete', `/v1/api/file_storage/file_store/file?del_path=${path}`, {
        contentType:'application/json;charset=utf-8'
    })
}
//自定义表单的操作集保存
export function SaveAntoFormsSets(params){
    return httpData('post', `/v1/api/app/forms/tables/all`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
export function enumSearech(type, params,theurl) {
    return httpData(type, theurl, {
        queryParams: params,
        contentType: 'application/json;charset=utf-8'
    })
}
export function crossForm(params){
    return httpData('get',`/v1/api/app/forms/key_of_cross_table`,{
        queryParams: params,
        contentType: 'application/json;charset=utf-8'
    })
}