import Vue from 'vue'
import SvgIcon from '@/components/iconSvg/index.vue' // svg组件
import Badge from '@/components/badge/index.vue' // badge 徽标

// register globally
Vue.component('svg-icon', SvgIcon);
Vue.component('z-badge', Badge);


const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
