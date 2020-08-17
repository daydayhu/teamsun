import template from './index.vue';
import './index.less';
import DetailMenu from './components/detailMenu';
import msgNotify from "../../components/messageNotify/messageNotify.vue"

export default {
  ...template,
  name: 'dashboard',
  props: {
    serviceList: { // 服务列表
      type: Array
    },
    requestList: { // 最近访问服务列表
      type: Array
    }
  },
  components: {
    DetailMenu,
    msgNotify
  },
  data() {
    return {
      userInfo: {
        name: '',
        role: '',
        lastLoginTime: '',
        is_logo: false,
        logo_url: '',
      },
      messageList:[],
      defaultLogoUrl: require('@/commons/images/user_logo_icon@2x.png'),
    };
  },
  created() {
    this.getUserInfo();
    // this.getShowMessage();
  },
  methods: {
    getUserInfo() {
      this.$api.dashboardApi.getUserInfo('get').then(res => {
        if (res.code === 200) {
          this.userInfo.name = res.data.user.alias_name;
          this.userInfo.lastLoginTime = res.data.user.last_login_time;
          this.userInfo.is_logo = res.data.user.is_logo;
          this.userInfo.logo_url = res.data.user.logo_url;
          if (res.data.items && res.data.items.length) {
            let str = '';
            res.data.items.forEach(item => {
              if (!str) {
                str = item.role_alias
              }else {
                str += `，${item.role_alias}`
              }
            });
            this.userInfo.role = str;
          }
        } else {
          this.$message({
            message: res.message,
            type: 'error',
          });
        }
      });
    },
  }
};
