import template from './index.vue';
import './index.less';
// import cookie from 'vue-cookie';

const CODETYPE = {
  success: 457,
  repeat: 455
};
export default {
  ...template,
  data() {
    return {
      username: '',
      password: '',
      isShow: false,
    };
  },
  methods: {
    eyeClick() {
      this.isShow = !this.isShow;
    },
    toForgetPass(){
      this.$router.push('/forgetPass');
    },
    submit() {
      if (this.username && this.password) {
        let pwd = window.btoa(this.password);
        if (pwd.length > 4) {
          let arr = Array.from(pwd);
          arr.splice(5, 0, Math.floor(Math.random() * 10));
          pwd = arr.join('');
        }
        let params = {
          'user_name': this.username,
          'pwd': pwd,
        };
        this.$api.loginApi.login(params).then((res) => {
          if (res.code === CODETYPE.success) {
            localStorage.setItem('eos_id',res.data.eos_id )
            localStorage.setItem('loginName', res.data.user_name);
            localStorage.setItem('source_type', res.data.source_type);//用户来源：0、来源frontend系统；1、来源oauth；2、来源LDAP  只有0的可以修改密码
            this.$router.push('/dashboard');
          } else {
            if (res.code === CODETYPE.repeat) {
              this.$router.push('/dashboard');
            }else {
              this.$message({
                message: res.message,
                type: 'error',
              });
            }
          }
        });

      } else {
        this.$message({
          message: '用户名或者密码不能为空',
          type: 'error',
        });
      }
    }
  }
};
