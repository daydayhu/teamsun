import httpData from '../dataService/index.js'
const dashboardApi = {
    getView(params) {
        return httpData('post', '/order/get_sysb_list', {
            queryParams: params
        })
    },
    getUserInfo(type) {
      return httpData(type, '/v1/api/user/user_role/current_role')
    }
}
export default dashboardApi;
