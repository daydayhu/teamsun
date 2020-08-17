import http from './http'

/**
 * 获取服务端数据
 * @param method        请求类型
 * @param name          uri名称
 * @param queryParams   QueryString参数
 * @param contentType   contentType参数
 * @returns {*}
 */
const httpData = (method, name, {
    queryParams = {},
    contentType = ''
} = {}) => {
    let url = ''
    try {
        url = name
    } catch (err) {
        return Promise.reject(err)
    }
    return http.httpFetch(method, url, queryParams, contentType)
}
export default httpData