const LayoutEmpty = r =>
  require(["@/commonPages/layout/components/LayoutEmpty"], r);
const dashboard = r => require(["../../pages/applicationCenter/dashboard"], r);
//********************************************应用系统**************************************************
//主页
const applicationSystem = r =>
  require(["../../pages/applicationCenter/applicationSystem"], r);
//新建应用系统layout
const addSystem = r =>
  require(["../../pages/applicationCenter/applicationSystem/addSystem"], r);
//新建应用系统第一步-基本信息
const addSystemFirst = r =>
  require([
    "../../pages/applicationCenter/applicationSystem/addSystem/addSystemFirst"
  ], r);
//新建应用系统-第二步-成员管理
const addSystemSecond = r =>
  require([
    "../../pages/applicationCenter/applicationSystem/addSystem/addSystemSecond"
  ], r);
//应用系统详情
const systemDetail = r =>
  require(["../../pages/applicationCenter/applicationSystem/systemDetail"], r);
//应用系统-订单详情
const systemOrderDetail = r =>
  require(["../../pages/applicationCenter/myOrder/orderDetail"], r);
//创建/编辑订单layout
const addOrder = r =>
  require(["../../pages/applicationCenter/applicationSystem/addOrder"], r);
//创建/编辑订单第一步-基本信息
const addOrderFirst = r =>
  require([
    "../../pages/applicationCenter/applicationSystem/addOrder/addOrderFirst"
  ], r);
//创建/编辑订单第二步-部署视图
const addOrderSecond = r =>
  require([
    "../../pages/applicationCenter/applicationSystem/addOrder/addOrderSecond"
  ], r);
//addOrderSecondQuick
//申请服务第二步-部署视图
const addOrderSecondQuick = r =>
  require([
    "../../pages/applicationCenter/serviceCatalog/applyService/applyServiceFirst"
  ], r);
//创建/编辑订单第三步-交付计划
const addOrderThird = r =>
  require([
    "../../pages/applicationCenter/applicationSystem/addOrder/addOrderThird"
  ], r);
// //应用系统订单详情
// const systemOrderDetail = r =>
//   require([
//     "../../pages/applicationCenter/applicationSystem/systemDetail/systemOrderDetail"
//   ], r);

//************************************888*****报告单独页******************************************

//************************************888*****我的订单******************************************
//主页
const myOrder = r => require(["../../pages/applicationCenter/myOrder"], r);
//订单详情
const orderDetail = r =>
  require(["../../pages/applicationCenter/myOrder/orderDetail"], r);
//订单详情tab页文件详情
const orderDetailFileList = r =>
  require(["../../pages/applicationCenter/myOrder/orderDetail/fileList"], r);
//订单详情tab页审批历史
const orderDetailDeliverPlan = r =>
  require(["../../pages/applicationCenter/myOrder/orderDetail/deliverPlan"], r);
//订单详情tab部署视图
const orderDetailBCanvas = r =>
  require(["../../pages/applicationCenter/myOrder/orderDetail/bsCanvas"], r);
//订单详情tab交付计划
const orderDetailJCanvas = r =>
  require(["../../pages/applicationCenter/myOrder/orderDetail/newPlan"], r);
//订单详情tab部署任务
const developTask = r =>
  require(["../../pages/applicationCenter/myOrder/orderDetail/developTask"], r);
  //订单详情tab流程记录
  const flowRecord = r =>
    require(["../../pages/applicationCenter/myOrder/orderDetail/flowRecord"], r);
//订单处理
const orderSecond = r =>
  require(["../../pages/applicationCenter/myOrder/orderSecond"], r);
//********************************************我的任务*******************************************
//主页
const myTask = r => require(["../../pages/applicationCenter/myTask"], r);
//********************************************部署任务*******************************************
//主页
const deploymentTask = r => require(["../../pages/applicationCenter/deploymentTask"], r);
//********************************************我的审批********************************************
//主页
const myApproval = r =>
  require(["../../pages/applicationCenter/myApproval"], r);
//审批详情
const approvalDetail = r =>
  require(["../../pages/applicationCenter/myApproval/approvalDetail"], r);
//********************************************我的消息********************************************
const myNews = r => require(["../../pages/applicationCenter/myMessage"], r);
//消息详情
const newsDetail = r =>
  require(["../../pages/applicationCenter/myMessage/messageDetail"], r);
//********************************************模板管理*********************************************
const templateManagement = r =>
  require(["../../pages/applicationCenter/templateManagement"], r);
//*********************************************服务目录*********************************************
//主页
const serviceCatalog = r =>
  require(["../../pages/applicationCenter/serviceCatalog"], r);
//申请服务layout
const applyService = r =>
  require(["../../pages/applicationCenter/serviceCatalog/applyService"], r);

//申请服务第一步-基本信息
// const applyServicePrev = r =>
//   require([
//     "../../pages/applicationCenter/serviceCatalog/applyService/applyServicePrev"
//   ], r);
//申请服务第二步-部署视图
const applyServiceFirst = r =>
  require([
    "../../pages/applicationCenter/serviceCatalog/applyService/applyServiceFirst"
  ], r);

//模板导入index
const templateImportIndex = r =>
  require([
    "../../pages/applicationCenter/serviceCatalog/components/templateImportIndex"
  ], r);

//模板导入第一步--服务匹配
const serviceMatch = r =>
  require([
    "../../pages/applicationCenter/serviceCatalog/components/serviceMatch"
  ], r);

//模板导入第二步--资源匹配
const resourceMatch = r =>
  require([
    "../../pages/applicationCenter/serviceCatalog/components/resourceMatch"
  ], r);
//申请服务第三步-交付计划
// const applyServiceSecond = r =>
//   require([
//     "../../pages/applicationCenter/serviceCatalog/applyService/applyServiceSecond"
//   ], r);

// const serviceDirectory = r =>
//   require(["../../pages/applicationCenter/serviceDirectory"], r);
// const applicationServices = r =>
// require(["../../pages/applicationCenter/serviceDirectory/components/applicationServices.vue"], r);
// const serviceCatalog = r =>
//   require(["../../pages/applicationCenter/serviceCatalog"], r);
//   const applyPage=r =>
//   require(["../../pages/applicationCenter/serviceCatalog/applyPage"], r);
/*标签管理*/
const tagManagement = r =>
  require([
    "../../pages/applicationCenter/tagManagement/index"
  ], r);
let routes = [
  ////*****************************报告单独页面******************************
  // {
  //   path: "applicationCenter/report",
  //   name: "report",
  //   component: report,
  //   meta: {
  //     title: ["应用中心", "报告"],
  //     id: "rbac_front_auth_action_view"
  //   }
  // },
  //***********************应用系统*********************
  {
    name: "applicationDashboard",
    path: "applicationCenter/dashboard",
    component: dashboard,
    meta: {
      title: ["概览"],
      id: "front_app_dashboard"
    }
  },
  {
    path: "applicationCenter/applicationSystem",
    name: "applicationSystem",
    component: applicationSystem,
    meta: {
      title: ["应用中心", "应用系统"],
      id: "front_app_center_system"
    }
  },
  {
    path: "applicationCenter/applicationSystem/addSystem",
    name: "addSystem",
    component: addSystem,
    meta: {
      title: ["应用中心", "新建应用系统"],
      id: "front_app_center_system_create"
    },
    children: [{
        path: "addSystemFirst",
        name: "addSystemFirst",
        component: addSystemFirst,
        meta: {
          title: ["应用中心", "新建应用系统"],
          id: "front_app_center_system_first"
        }
      },
      {
        path: "addSystemSecond",
        name: "addSystemSecond",
        component: addSystemSecond,
        meta: {
          title: ["应用中心", "新建应用系统"],
          id: "front_app_center_system_second"
        }
      }
    ]
  },
  {
    path: "applicationCenter/applicationSystem/systemDetail",
    name: "systemDetail",
    component: systemDetail,
    meta: {
      title: ["应用中心", "应用系统详情"],
      id: "front_app_center_system_detail"
    },
    children: []
  },
  // {
  //   path: "applicationCenter/applicationSystem/systemOrderDetail",
  //   name: "systemOrderDetail",
  //   component: systemOrderDetail,
  //   meta: {
  //     title: ["应用中心", "应用系统订单详情"],
  //     id: "front_app_center_system_orderDetail"
  //   },
  //   children: []
  // },
  {
    path: "applicationCenter/applicationSystem/systemOrderDetail",
    name: "systemOrderDetail",
    component: systemOrderDetail,
    meta: {
      title: ["应用中心", "订单详情"],
      id: "front_app_center_system_orderDetail"
    },
    children: [{
        path: "fileList",
        name: "sysOrderDetailFileList",
        component: orderDetailFileList,
        meta: {
          title: ["订单详情", "附件"],
           id: "front_app_center_system_orderDetail_fileList"
        }
      },
      {
        path: "approval",
        name: "sysOrderDetailDeliverPlan",
        component: orderDetailDeliverPlan,
        meta: {
          title: ["订单详情", "审批历史"],
           id: "front_app_center_system_orderDetail_approval"
        }
      },
      {
        path: "deplomentView",
        name: "sysOrderDetailBCanvas",
        component: orderDetailBCanvas,
        meta: {
          title: ["订单详情", "部署视图"],
           id: "front_app_center_system_orderDetail_deplomentView"
        }
      },
      {
        path: "deliverPlan",
        name: "sysOrderDetailJCanvas",
        component: orderDetailJCanvas,
        meta: {
          title: ["订单详情", "交付计划"],
           id: "front_app_center_system_orderDetail_deliverPlan"
        }
      },
      {
        path: "developTask",
        name: "sysDevelopTask",
        component: developTask,
        meta: {
          title: ["订单详情", "部署任务"],
           id: "front_app_center_system_orderDetail_developTask"
        }
      }, {
        path: "flowRecord",
        name: "sysFlowRecord",
        component: flowRecord,
        meta: {
          title: ["订单详情", "流程记录"],
          id: "front_app_center_system_orderDetail_flowRecord" //flowRecord
        }
      }
    ]
  },
  ////*****************************创建订单******************************
  {
    path: "applicationCenter/applicationSystem/addOrder",
    name: "addOrder",
    component: addOrder,
    meta: {
      title: ["应用中心", "创建订单"],
       id: "front_app_addOrder"
    },
    children: [{
        path: "addOrderFirst",
        name: "addOrderFirst",
        component: addOrderFirst,
        meta: {
          title: ["应用中心", "创建订单"],
          id: "front_app_addOrder_first"
        }
      },
      {
        path: "addOrderSecond",
        name: "addOrderSecond",
        component: addOrderSecond,
        meta: {
          title: ["应用中心", "创建订单"],
          id: "front_app_addOrder_second"
        }
      },
      {
        path: "addOrderSecondQuick",
        name: "addOrderSecondQuick",
        component: addOrderSecondQuick,
        meta: {
          title: ["应用中心", "创建订单"],
          id: "front_app_addOrder_secondQuick"
        }
      },
      {
        path: "addOrderThird",
        name: "addOrderThird",
        component: addOrderThird,
        meta: {
          title: ["应用中心", "创建订单"],
          id: "front_app_addOrder_third"
        }
      }
    ]
  },
  ////*****************************我的订单******************************
  {
    path: "applicationCenter/myOrder",
    redirect: "applicationCenter/myOrder",
    component: LayoutEmpty,
    children: [{
        path: "",
        name: "myOrder",
        component: myOrder,
        meta: {
          title: ["我的订单"],
          'id': 'front_app_myOrder'
        }
      },
      {
        path: "orderSecond",
        name: "orderSecond",
        component: orderSecond,
        meta: {
          title: ["我的订单", "交付计划"]
          // 'id':'bus_center_busgroup_detail'
        }
      }
    ]
  },
  {
    path: "/applicationCenter/myOrder/orderDetail",
    name: "orderDetail",
    component: orderDetail,
    meta: {
      title: ["应用中心", "订单详情"],
      id: "front_app_myOrder_orderDetail"
    },
    children: [{
        path: "fileList",
        name: "orderDetailFileList",
        component: orderDetailFileList,
        meta: {
          title: ["订单详情", "附件"],
           id: "front_app_myOrder_orderDetail_fileList"
        }
      },
      {
        path: "approval",
        name: "orderDetailDeliverPlan",
        component: orderDetailDeliverPlan,
        meta: {
          title: ["订单详情", "审批历史"],
           id: "front_app_myOrder_orderDetail_approval"
        }
      },
      {
        path: "deplomentView",
        name: "orderDetailBCanvas",
        component: orderDetailBCanvas,
        meta: {
          title: ["订单详情", "部署视图"],
           id: "front_app_myOrder_orderDetail_deplomentView"
        }
      },
      {
        path: "deliverPlan",
        name: "orderDetailJCanvas",
        component: orderDetailJCanvas,
        meta: {
          title: ["订单详情", "交付计划"],
           id: "front_app_myOrder_orderDetail_deliverPlan"
        }
      },
      {
        path: "developTask",
        name: "developTask",
        component: developTask,
        meta: {
          title: ["订单详情", "部署任务"],
           id: "front_app_myOrder_orderDetail_deployTask" //flowRecord
        }
      }, {
        path: "flowRecord",
        name: "flowRecord",
        component: flowRecord,
        meta: {
          title: ["订单详情", "流程记录"],
          id: "front_app_myOrder_orderDetail_flowRecord" //flowRecord
        }
      }
    ]
  },
  ////*****************************我的任务******************************
  {
    path: "applicationCenter/myTask",
    name: "myTask",
    component: myTask,
    meta: {
      title: ["应用中心", "规划任务"],
      id: "front_app_myTask"
    },
    children: []
  },
  ////*****************************部署任务******************************
  {
    path: "applicationCenter/deploymentTask",
    name: "deploymentTask",
    component: deploymentTask,
    meta: {
      title: ["应用中心", "部署任务"],
      id: "front_app_deployment_task"
    },
    children: []
  },
  ////*****************************我的审批******************************
  {
    path: "applicationCenter/myApproval",
    name: "myApproval",
    component: myApproval,
    meta: {
      title: ["应用中心", "我的审批"],
      id: "front_app_myApproval"
    },
    children: []
  },
  {
    path: "applicationCenter/myApproval/approvalDetail",
    name: "approvalDetail",
    component: approvalDetail,
    meta: {
      title: ["应用中心", "审批详情"],
      id: "front_app_myApproval_detail"
    },
    children: []
  },
  ////*****************************我的消息******************************
  {
    path: "applicationCenter/myNews",
    name: "myNews",
    component: myNews,
    meta: {
      title: ["应用中心", "我的消息"],
      id: "front_app_myMessage"
    },
    children: []
  },
  {
    path: "applicationCenter/myNews/newsDetail",
    name: "newsDetail",
    component: newsDetail,
    meta: {
      title: ["应用中心", "消息详情"],
      id: "rbac_front_auth_action_view"
    },
    children: []
  },
  ////*****************************模板管理******************************
  {
    path: "applicationCenter/templateManagement",
    name: "templateManagement",
    component: templateManagement,
    meta: {
      title: ["应用中心", "模板管理"],
      id: "front_app_templateManagement"
    },
    children: []
  },
  ////*****************************服务目录******************************
  {
    path: "applicationCenter/serviceCatalog",
    name: "serviceCatalog",
    component: serviceCatalog,
    meta: {
      title: ["应用中心", "服务申请"],
      id: "front_app_service"
    }
  },
  {
    path: "applicationCenter/serviceCatalog/applyService",
    name: "applyService",
    component: applyService,
    meta: {
      title: ["应用中心", "申请服务"],
      id: "rbac_front_auth_action_view"
    },
    children: [
      //   {
      //   path: "applyServicePrev",
      //   name: "applyServicePrev",
      //   component: applyServicePrev,
      //   meta: {
      //     title: ["应用中心", "申请服务"],
      //     id: "rbac_front_auth_action_view"
      //   }
      // },
      {
        path: "applyServiceFirst",
        name: "applyServiceFirst",
        component: applyServiceFirst,
        meta: {
          title: ["应用中心", "申请服务"],
          id: "rbac_front_auth_action_view"
        }
      },
      // {
      //   path: "applyServiceSecond",
      //   name: "applyServiceSecond",
      //   component: applyServiceSecond,
      //   meta: {
      //     title: ["应用中心", "申请服务"],
      //     id: "rbac_front_auth_action_view"
      //   }
      // }
    ]
  },

  {
    path: "applicationCenter/serviceMatch",
    name: "serviceMatch",
    component: serviceMatch,
    meta: {
      title: ["应用中心", "服务匹配"],
      id: "rbac_front_auth_service_match"
    },
    // children:[
    //   //服务匹配
    //   {
    //     path: "serviceMatch",
    //     name: "serviceMatch",
    //     component: serviceMatch,
    //     meta: {
    //       title: ["应用中心", "服务匹配"],
    //       id: "rbac_front_auth_service_match"
    //     }
    //   },
    //   //资源匹配
    //   {
    //     path: "resourceMatch",
    //     name: "resourceMatch",
    //     component: resourceMatch,
    //     meta: {
    //       title: ["应用中心", "资源匹配"],
    //       id: "rbac_front_auth_resource_match"
    //     }
    //   },
    // ]
  },

  //
  // {
  //   name: "applicationServices",
  //   path: "applicationCenter/applicationServices",
  //   component: applicationServices,
  //   meta: {
  //     title: ["应用中心", "申请服务"],
  //     id: "rbac_front_auth_config_dashboard"
  //   },
  //   path: "applicationCenter/serviceCatalog",
  //   name: "serviceCatalog",
  //   component: serviceCatalog,
  //   meta: {
  //     title: ["应用中心", "服务目录"],
  //     id: "rbac_front_auth_action_view"
  //   },
  //   children: []
  // },
  // {
  //   path: "applicationCenter/applyPage",
  //   name: "applyPage",
  //   component: applyPage,
  //   meta: {
  //     title: ["服务目录",'申请页面'],
  //     id: "rbac_front_auth_action_view"
  //   },
  //   children: []
  // },

  {
    path: "applicationCenter/tagManagement",
    name: "tagManagement",
    component: tagManagement,
    meta: {
      title: ["应用中心", "标签管理"],
      id: "front_app_tags"
    }
  },
];

export default routes;
