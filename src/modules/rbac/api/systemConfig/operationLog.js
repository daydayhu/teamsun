import httpData from '@/request/dataService/index.js'

// 获取基础数据列表
export function getOperationLog(type,params) {
  return httpData(type, `/v1/api/logs`, {
		queryParams:params,
		contentType:'application/json;charset=utf-8'
	})
}
