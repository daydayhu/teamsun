import Vue from 'vue'
const Bus = new Vue();
const canvasEvent = {
  'network_event_1': 'updateNetworkNodeData', // 事件： 网络表单修改网络数据
  'networkStrategy_event_1': '',
  'vmware_event_1': 'updateEdgeIpData', // 事件： VMware表单修改ip
  'vmware_event_2': 'updateVirtualData', // 事件： VMware表单虚机台数
  'openstack_event_1': 'updateEdgeIpData', // 事件： openstack表单修改ip
  'formDiagMess':'showMessDiag',
  'form_event_back': 'backLastNodeData' // 事件：切换图元，走取消事件，返回上一个图元
};
export {Bus, canvasEvent}
