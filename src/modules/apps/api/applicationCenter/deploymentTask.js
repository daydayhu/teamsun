import httpData from '@/request/dataService/index.js'
//获取部署任务列表  is_full是否显示已完成，1是 0否
export function getDeploymentTaskList(type, params) {
  return httpData(type, `v1/api/app/systems/my_deploy_tasks`, {
    queryParams: params,
  })
}