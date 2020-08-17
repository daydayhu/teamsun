import template from './index.vue';
import './index.less';
import * as requestMethod from "@/modules/rbac/api/console/license"
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
      loading: false,
      isShow: false,
      noName: false,
      noPwd: false,
    };
  },
  methods: {
    eyeClick() {
      this.isShow = !this.isShow;
    },
    toForgetPass() {
      this.$router.push('/forgetPass');
    },
    submit() {
      this.noName = false;
      this.noPwd = false;
      if (this.username && this.password) {
        this.loading = true;
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
          this.loading = false
          if (res.code === CODETYPE.success) {
            localStorage.setItem('eos_id', res.data.eos_id);
            localStorage.setItem('loginName', res.data.user_name);
            localStorage.setItem('source_type', res.data.source_type); //用户来源：0、来源frontend系统；1、来源oauth；2、来源LDAP  只有0的可以修改密码
            //this.$router.push('/dashboard');
            //许可证校验
            this.checkLicense()
          } else {
            if (res.code === CODETYPE.repeat) {
              //this.$router.push('/dashboard');
              this.checkLicense()
            } else {
              this.$message({
                message: res.message,
                type: 'error',
              });
            }
          }
        });
      } else {
        if (!this.username) {
          this.noName = true
        }
        if (!this.password) {
          this.noPwd = true
        }
        // this.$message({
        //   message: '用户名或者密码不能为空',
        //   type: 'error',
        // });
      }
    },
    //许可证校验
    checkLicense() {
      requestMethod.checkLicenseInfo('get').then((res) => {
        if (res.code === 200) {
          this.$router.push('/dashboard');
        } else
        if (res.code === 400) {
          switch (res.data.error) {
            case "is_not_exist":
              this.$message({
                message: res.message,
                type: 'error',
              });
              this.$router.push('/licenseManage');
              break;
            case "is_invalidity":
              this.$message({
                message: res.message,
                type: 'error',
              });
              this.$router.push('/licenseManage');
              break;
            case "is_expired":
              this.$message({
                message: res.message,
                type: 'error',
              });
              break;
            case "is_more_point":
              this.$message({
                message: res.message,
                type: 'error',
              });
              break;
            default:
              break;
          }
        } else {
          this.$message({
            message: res.message,
            type: 'error',
          });
        }
      })
    }
  }
};
