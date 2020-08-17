import Vue from 'vue'
import Vuex from 'vuex'

import global from './modules/global/index.js'
import menu from './modules/menu/index.js'
import persistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
    // strict: 'dev', // 官方不建议在生产模式下开启strict模式
    modules: {
        global,
        menu
    },
    // plugins: [persistedState({ storage: window.sessionStorage })]
})
