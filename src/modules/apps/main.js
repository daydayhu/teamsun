import Vue from "vue";
import App from "./app.vue";
import store from "./vuex/index.js";
import router from "./router";
import ElementUI from "element-ui";
import http from "@/request/dataService/index";
import api from "@/request/api/index";
import "element-ui/lib/theme-chalk/index.css";
import "normalize.css/normalize.css";
import "@/commons/css/base.less";
import "@/commons/css/basePage.less";
import "@/commons/css/element-covering.less";
import "@/commons/icons/index.js";
import "./asset/icon/iconfont.css";
import axios from "axios";
import "./mixins/globalMixins.js";
import websocket from "./mixins/websocket";
import Steps from "@/components/steps/index.vue";
import VueClipboard from "vue-clipboard2";
//解析excel
import {
  FileSaver
} from 'file-saver';
import XLSX from 'xlsx';
// 空页面
import EmptyInTable from "@/components/emptyLayout/emptyInTable";
Vue.component('EmptyInTable', EmptyInTable);
Vue.use(VueClipboard);
Vue.config.productionTip = false;
Vue.component("Steps", Steps);
Vue.component("Steps", Steps);
Vue.use(ElementUI, {
  size: "small"
});
Vue.use(http);

Vue.prototype.$api = api;
axios
  .get("./static/project.config.json")
  .then(res => {
    if (typeof res.data === "object") {
      Vue.prototype.baseConfig = res.data;
    } else {
      Vue.prototype.baseConfig = JSON.parse(res.data);
    }
    new Vue({
      el: "#app",
      store,
      router,
      template: "<App/>",
      components: {
        App
      },
      mixins: [websocket]
    });
  })
  .catch(err => {
    new Vue({
      el: "#app",
      store,
      router,
      template: "<App/>",
      components: {
        App
      },
      mixins: [websocket]
    });
    console.log("get baseConfig error..." + err);
  });
