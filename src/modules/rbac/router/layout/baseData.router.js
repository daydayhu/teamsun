const baseData = r => require(['../../pages/systemConfig/baseData'], r)
// const cloudPlatformType = r => require(['../../pages/systemConfig/baseData/components/cloudPlatformType'], r)
// const mirrorFormat = r => require(['../../pages/systemConfig/baseData/components/mirrorFormat'], r)
// const networkArea = r => require(['../../pages/systemConfig/baseData/components/networkArea'], r)
// const operationSystem = r => require(['../../pages/systemConfig/baseData/components/operationSystem'], r)
// const poolType = r => require(['../../pages/systemConfig/baseData/components/poolType'], r)
// const resourceEnv = r => require(['../../pages/systemConfig/baseData/components/resourceEnv'], r)
// const serviceAddress = r => require(['../../pages/systemConfig/baseData/components/serviceAddress'], r)
// const serviceType = r => require(['../../pages/systemConfig/baseData/components/serviceType'], r)
// const virtualType = r => require(['../../pages/systemConfig/baseData/components/virtualType'], r)
// const cpuType = r => require(['../../pages/systemConfig/baseData/components/cpuType'], r)
// const productClassify = r => require(['../../pages/systemConfig/baseData/components/productClassify'], r)
// const serviceClassify = r => require(['../../pages/systemConfig/baseData/components/serviceClassify'], r)
// const appType = r =>require(['../../pages/systemConfig/baseData/components/appType'], r)
// const businessClassify = r => require(['../../pages/systemConfig/baseData/components/businessClassify'], r)
// const disasterLevel = r => require(['../../pages/systemConfig/baseData/components/disasterLevel'], r)
// const tableClassify = r =>require(['../../pages/systemConfig/baseData/components/tableClassify'], r)
// const natRule = r => require(['../../pages/systemConfig/baseData/components/natRule'], r)
// const networkType = r => require(['../../pages/systemConfig/baseData/components/networkType'], r)
// const servicePath = r => require(['../../pages/systemConfig/baseData/components/servicePath'], r)
// const msgType = r => require(['../../pages/systemConfig/baseData/components/msgType'], r)
// const bareComputer = r => require(['../../pages/systemConfig/baseData/components/bareComputer'], r)
// const emailConfig = r => require(['../../pages/systemConfig/baseData/components/emailConfig'], r)

let routes = [{
  path: 'systemconfig/baseData',
  name: 'baseData',
  component: baseData,
  meta: {
    'title': ['系统配置', '基础数据'],
    'id': 'rbac_front_auth_action_sys_base'
  },
  children: []
  // children: [
  //   {
  //     path: 'cloudPlatformType',
  //     name: 'cloudPlatformType',
  //     component: cloudPlatformType,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'mirrorFormat',
  //     name: 'mirrorFormat',
  //     component: mirrorFormat,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'networkArea',
  //     name: 'networkArea',
  //     component: networkArea,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'operationSystem',
  //     name: 'operationSystem',
  //     component: operationSystem,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'poolType',
  //     name: 'poolType',
  //     component: poolType,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'resourceEnv',
  //     name: 'resourceEnv',
  //     component: resourceEnv,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'serviceAddress',
  //     name: 'serviceAddress',
  //     component: serviceAddress,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'serviceType',
  //     name: 'serviceType',
  //     component: serviceType,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'virtualType',
  //     name: 'virtualType',
  //     component: virtualType,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'cpuType',
  //     name: 'cpuType',
  //     component: cpuType,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'productClassify',
  //     name: 'productClassify',
  //     component: productClassify,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'serviceClassify',
  //     name: 'serviceClassify',
  //     component: serviceClassify,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'appType',
  //     name: 'appType',
  //     component: appType,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'businessClassify',
  //     name: 'businessClassify',
  //     component: businessClassify,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'disasterLevel',
  //     name: 'disasterLevel',
  //     component: disasterLevel,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'tableClassify',
  //     name: 'tableClassify',
  //     component: tableClassify,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'natRule',
  //     name: 'natRule',
  //     component: natRule,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'networkType',
  //     name: 'networkType',
  //     component: networkType,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'servicePath',
  //     name: 'servicePath',
  //     component: servicePath,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'msgType',
  //     name: 'msgType',
  //     component: msgType,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'bareComputer',
  //     name: 'bareComputer',
  //     component: bareComputer,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   },
  //   {
  //     path: 'emailConfig',
  //     name: 'emailConfig',
  //     component: emailConfig,
  //     meta: {
  //       'title': ['系统配置', '基础数据'],
  //       "id": 'rbac_front_auth_action_sys_base'
  //     }
  //   }
  // ]
}];

export default routes
