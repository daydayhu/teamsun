import httpData from '@/request/dataService/index.js'

// 获取登陆信息
export function userInfo(type,params) {
  return httpData(type, `/v1/api/users/info`, {
    queryParams: params,
  })
}
// 保存登陆用户信息
export function saveUserInfo(type,params) {
  return httpData(type, `/v1/api/users/info`, {
    queryParams: params,
    contentType:'application/json;charset=utf-8'
  })
}

// 通过个人信息修改密码
export function changePwd(type, params) {
  return httpData(type, `/v1/api/users/info/change_pwd`, {
    queryParams: params,
    contentType:'application/json;charset=utf-8'
  })
}
