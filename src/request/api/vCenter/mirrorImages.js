import httpData from '../../dataService/index.js'

// 获取镜像信息
export function imagesInfo(type,params) {
  return httpData(type, `/v1/api/vmware/images`, {
    queryParams: params,
  })
}

// 获取指定镜像的基本信息
export function imagesItemBase(type,params) {
  return httpData(type, `/v1/api/vmware/images/${params.image_id}`)
}

// 获取指定镜像的详细信息
export function imagesItemDetails(type,params) {
  return httpData(type, `/v1/api/vmware/images/${params.image_id}/details`)
}

// 获取指定镜像的云控制器信息
export function imagesControllers(type,params) {
  return httpData(type, `/v1/api/vmware/images/${params.image_id}/controllers`)
}

// 上传镜像
export function imagesUpload(type,params) {
  return httpData(type, `/v1/api/vmware/images/{image_id}/actions/upload`, {
    queryParams: params,
  })
}
