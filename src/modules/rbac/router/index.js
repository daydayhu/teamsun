import Vue from 'vue';
import Store from '../vuex/index';
import Router from 'vue-router';
import httpData from '../../../request/dataService';

Vue.use(Router);

let routes = [];

// 自动导入路由
const files = require.context('./', false, /router\.js$/);
files.keys().forEach(key => {
  routes = routes.concat(files(key).default);
});

let router = new Router({
  mode: process.env.ROUTER_MODE,
  // base: getAbsolutePath(),
  routes,
});

const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};
router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    from.name ? next({
      name: from.name,
      /**
       * 如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
       */
    }) : next('/login');
  } else {
    /**
     * 如果匹配到正确跳转
     */
    let len = to.meta.title.length;
      if (len === 1 && to.path.indexOf('dashboard') !== -1 || to.path.indexOf('login') !== -1) {
        document.title = '云管理平台';
      } else {
        document.title = to.meta.title[len - 1];
      }
      _proxyPage(to, from, next);
    }
});

function _proxyPage(to, from, next) {
  httpData('get', '/v1/api/auth', {
    queryParams: {
      auth_id: to.meta.id,
    },
  }).then(res => {
    if (res.code === 200) {
      let authId = res.data.auth_id;
      Store.commit('global/setAuth', authId);
    }
    if (res.is_login) {
      if (to.path === '/login') {
        next('/dashboard');
      } else {
        next();
      }
    }else {
      if (to.path === '/login') {
        next()
      }else if(to.path === '/forgetPass'){
        next()
      }else if(to.path === '/modifySuccess'){
        next()
      }else {
        next('/login');
      }
    }
  }).catch(err => {
    if (to.path === '/login') {
      next()
    }else {
      next('/login');
    }
  });
}

function getAbsolutePath() {
  let path = location.pathname;
  return path.substring(0, path.lastIndexOf('/') + 1);
}

export default router;
