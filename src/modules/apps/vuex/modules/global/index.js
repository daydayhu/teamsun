import mutations from './mutations.js'
import actions from './actions.js'
const state = {
    userId: '',
    routerMode: false,
    currentModule: 'apps',
    entryModule: 'rbac',
    modulesList: ['rbac', 'vmware', 'openstack', 'images', 'ops', 'apps', 'appflows'],
    routerBase: '/bocsys/home/',
    auth:[]
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}
