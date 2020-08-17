import httpData from '@/request/dataService/index.js'
//获取应用系统消息列表-
export function getMessageList(type, params) {
  return httpData(type, '/v1/api/app/messages', {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
//获取应用系统消息详情
export function getMessageDetail(type, message_id) {
  return httpData(type, '/v1/api/app/messages/' + message_id, {
    contentType: "application/json;charset=utf-8"
  });
}
//应用消息-操作已读或删除
export function setMessage(type, params) {
  return httpData(type, '/v1/api/app/messages/set', {
    queryParams: params,
    contentType: "application/json;charset=utf-8"
  });
}
//应用消息-全部标记为已读
export function setMessageAllRead(type) {
  return httpData(type, '/v1/api/app/messages/set/all_read', {
    contentType: "application/json;charset=utf-8"
  });
}
//应用消息-消息标记
export function getMessageFlag(type, params) {
  return httpData(type, `/v1/api/app/messages/${params.message_id}/is_flag`, {
    queryParams: params.body,
    contentType: "application/json;charset=utf-8"
  });
}

//应用消息-获取消息数量
export function getMessageNum(type) {
  return httpData(type, `/v1/api/app/messages/count_message`, {
    queryParams: "",
    contentType: "application/json;charset=utf-8"
  });
}

//应用消息-获取消息数量展示列
export function getShowMessage(type) {
  return httpData(type, `/v1/api/app/messages/count_message_list`, {
    queryParams: "",
    contentType: "application/json;charset=utf-8"
  });
}
