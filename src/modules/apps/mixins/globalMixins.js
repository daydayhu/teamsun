import Vue from 'vue'
import authMixin from './authMixin.js'
Vue.prototype.global = authMixin
Vue.mixin(authMixin)
