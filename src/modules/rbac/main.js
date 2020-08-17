import Vue from 'vue'
import App from './app.vue'
import store from './vuex/index.js'
import router from './router'
import ElementUI from 'element-ui'
import http from '@/request/dataService/index'
import api from '@/request/api/index'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'
import '@/commons/css/base.less'
import '@/commons/css/basePage.less'
import '@/commons/icons/index.js'
import './mixins/globalMixins.js'
import Steps from "@/components/steps/index.vue"
// 空页面
import EmptyInTable from "@/components/emptyLayout/emptyInTable";
Vue.component('EmptyInTable', EmptyInTable);
Vue.config.productionTip = false;
Vue.component('Steps', Steps);
Vue.use(ElementUI, {
  size: 'small'
})
Vue.use(http)
Vue.prototype.$api = api

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
