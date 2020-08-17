import httpData from '@/request/dataService/index.js'

// 获取许可证信息
export function getLicenseInfo(type) {
  return httpData(type, `/v1/api/lic/license`, {
		queryParams:"",
		contentType:'application/json;charset=utf-8'
	})
}

// 获取许可证信息
export function submitLicenseInfo(type,params) {
  return httpData(type, `/v1/api/lic/license`, {
		queryParams:params,
		contentType:'application/json;charset=utf-8'
	})
}
// 许可证有效性
export function checkLicenseInfo(type) {
  return httpData(type, `/v1/api/lic/license/available`, {
		contentType:'application/json;charset=utf-8'
	})
}
