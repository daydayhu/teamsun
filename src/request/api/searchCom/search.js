import httpData from '@/request/dataService/index.js'

//获取搜索的筛选数据
export function enumSearech(type, params,theurl) {
    return httpData(type, theurl, {
        queryParams: params,
        contentType: 'application/json;charset=utf-8'
    })
}