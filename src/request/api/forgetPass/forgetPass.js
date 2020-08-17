import httpData from '../../dataService/index.js'

// 用户列表
export function userApi(type, params, userId) {
  let url = `/v1/api/users`
  if (userId) {
    url = `/v1/api/users/` + userId
  }
  return httpData(type, url, {
    queryParams: params
  })
}

// 查询用户邮箱是否存在
export function checkedEmail(type,params) {
  return httpData(type, `/v1/api/email`, {
    queryParams: params
  })
}

// 发送邮件
export function saveSendMail(type, params) {
  return httpData(type, `/v1/api/sendemail`, {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  })
}

// 通过邮箱修改密码
export function modifyEmailPass(type, params) {
  return httpData(type, `/v1/api/users/info/${params.email_key}`, {
    queryParams: {new_pwd:params.new_pwd},
    contentType: "application/json;charset=utf-8"
  })
}
