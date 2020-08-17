import httpData from '../../dataService/index.js'
const loginApi = {
    //用户登录
    login(params) {
        return httpData('post', '/v1/api/login/', {
            queryParams: params
        })
    },
    signout(params) {
        return httpData('post', '/v1/api/signout/', {
            queryParams: params
        })
    }
}
export default loginApi;
