<template>
  <div class="theme_default fogert_psw">
    <div class="login_content">
      <div class="login_form">
        <find v-if="tag === null"></find>
        <email v-if="tag === 'find'"></email>
        <modify v-if="tag === 'modifyPass'"></modify>
      </div>
      <div class="login_footer">
        <div class="login_brand">版权所有 © 华胜天成软件技术有限公司及其关联公司 2020 保留一切权利</div>
      </div>
    </div>
  </div>
</template>
<script>
  import * as requestMethod from '@/request/api/forgetPass/forgetPass.js';
  import { btoaPassword,getQueryVariable } from "@/utils/utils";
  import validate from "@/utils/validate"
  import find from "./components/find.vue"
  import email from "./components/email.vue"
  import modify from "./components/modify.vue"
  export default {
    components: {
      find,
      email,
      modify
    },
    data() {
      return {
        //路由参数
        tag:null,
        //
        emailTip:false,
        form: {
          email:''
        },
        email_key:null,
        passForm:{
          new_pwd:'',
          sure_pwd:'',
        },
        emailRules:{
          email: [
            {
              required: true,
              message: '邮箱是必填项！',
              trigger: 'blur'
            },
            {
              validator: function(rule, value, callback) {
                if (validate.email.test(value) == false) {
                  callback(new Error("邮箱格式错误"));
                } else {
                  callback();
                }
              },
              trigger: "blur"
            }
          ],

        },
        rules: {
          new_pwd: [
            {
              required: true,
              message: '密码是必填项！',
              trigger: 'blur'
            },
            {
              validator: function(rule, value, callback) {
                if (validate.password.test(value) == false) {
                  callback(new Error("密码格式错误"));
                } else {
                  callback();
                }
              },
              trigger: "blur"
            }
          ],
          sure_pwd: [
            {
              required: true,
              message: '再次确认密码是必填项！',
              trigger: 'blur'
            },
          ],
        },
      };
    },
    async mounted() {
      const {tag} = getQueryVariable('tag');
      const {email_key} = getQueryVariable('email_key');
      this.tag = tag ? tag : null;
      this.email_key = email_key;
    },
    methods: {
      onSubmit(){
        this.$refs['form'].validate(async valid => {
          if (valid) {
            const email = await this.getCheckedEmail();
            if(email.code == 200){
              const res = await requestMethod.saveSendMail('post', {email:this.form.email});
              if(res.code === 200){
                this.emailTip = false;
                this.$message.success(res.message || '邮箱发送成功');
                this.tag = 'find';
              }else{
                this.emailTip = true;
                this.$message.error(res.message || '邮箱发送失败');
              }
            }else{
              this.emailTip = true;
              this.$message.error(email.message || '验证邮箱失败');
            }


          }
        })
      },
      modifyPass(){
        this.$refs['passForm'].validate(async valid => {
        if (valid) {
          const {sure_pwd, new_pwd} = this.form;
          if(sure_pwd !== new_pwd){
            this.$message.error('确认密码输入不正确');
          }else{
            this.submitLoading = true;
            const new_pwd = btoaPassword(this.passForm.new_pwd);
            const res = await requestMethod.modifyEmailPass('patch',{email_key:this.email_key,new_pwd});
            if(res.code === 200){
              this.$message.success(res.message || '密码修改成功');
                this.$router.push('/modifySuccess');
            }else{
              this.$message.error(res.message || '密码修改失败');
            }
            this.submitLoading = false;
          }

        }

        })
      },
      async getCheckedEmail(){
        const res = await requestMethod.checkedEmail('get',{email:this.form.email});
        return  res;

      }
    }
  };
</script>
<style  lang="less" scoped>
.fogert_psw {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  //background-color: #f5f6fa;
  background: url('../../commons/images/login_bg_2.0.svg') no-repeat;
  background-size: cover;
  background-attachment: fixed;

  .login_content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    .login_form {
      width: 67.3%;
      height: 73%;
      margin-top: 11.4%;
      margin-bottom: 15.6%;
      // height: 560px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 25px 40px 0px rgba(24, 31, 71, 0.15);
      border-radius: 6px;
      // display: flex;
      // justify-content: center;

    }
  }

  .login_footer {
    //height: 60px;
    text-align: center;
    width: 100%;
    position: fixed;
    bottom: 32px;

    .login_brand {
      font-family: "PingFangSC-Regular,PingFang SC";
      color: #7b7b7b;
      font-size: 12px;
    }
  }
}

</style>

