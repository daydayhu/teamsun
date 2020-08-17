<template>
  <div class="layout-container">
    <div class="layout-box">
      <div class="modify-pass">
          <div class="title">
            <span>{{tag === null ? '密码找回' : '修改密码'}}</span>
          </div>
          <div class="modify-content">
            <div style="padding-top:120px" v-if="tag === null">
              <el-form :label-position="labelPosition"  ref="form" :model="form" :rules="emailRules" >
                <span style="display: flex;justify-content: center;padding-bottom: 24px">请输入您需要找回登陆密码的邮箱账户</span>
                <el-row type="flex" justify="center" align="middle">
                  <el-col :span="12" >
                    <el-form-item prop="email">
                      <el-input v-model.trim="form.email" autocomplete="off" id="rbac_forgetPass_email" placeholder="请输入邮箱"></el-input>
                      <span style="color: #FF0003" v-if="emailTip">此邮箱不存在，请确认后输入或与管理员联系</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div style="display: flex;justify-content: center;margin-top: 42px;"><el-button type="primary" @click="onSubmit" id="rbac_forgetPass_onSubmit">立即找回</el-button></div>
            </div>
            <div style="padding-top: 120px" v-else-if="tag=== 'find'">
              <div style="display: flex;justify-content: center;">
                <img :src="imgUrl" alt="">
              </div>
              <p class="tips">修改密码链接已发送至您的邮箱，请注意查收</p>
            </div>
            <div style="padding-top:120px" v-if="tag === 'modifyPass'">
              <el-form :label-position="labelPosition" :label-width="formLabelWidth" ref="passForm" :model="passForm" :rules="rules">
                <el-row type="flex" justify="center" align="middle">
                  <el-col :span="12" >
                    <el-form-item prop="new_pwd" label="新密码">
                      <el-input v-model.trim="passForm.new_pwd" autocomplete="off" placeholder="请输入新密码" id="rbac_forgetPass_new_pwd" type="password"></el-input>
                      <span>说明：必须包含大写字母，小写字母和数字，8-16个字符</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row type="flex" justify="center" align="middle">
                  <el-col :span="12" >
                    <el-form-item prop="sure_pwd" label="再次确认">
                      <el-input v-model.trim="passForm.sure_pwd" autocomplete="off" placeholder="请再次输入新密码" id="rbac_forgetPass_sure_pwd" type="password"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div style="display: flex;justify-content: center"><el-button type="primary" id="rbac_forgetPass_modifyPass" @click="modifyPass">确定</el-button></div>
            </div>
          </div>
      </div>
      <div class="footer"><p>版权所有 © 华胜天成软件技术有限公司及其关联公司 2020 保留一切权利</p></div>
    </div>
  </div>
</template>
<script>
  import * as requestMethod from '@/request/api/forgetPass/forgetPass.js';
  import { btoaPassword,getQueryVariable } from "@/utils/utils";
  import validate from "@/utils/validate"


  export default {
    props: {
    },
    data() {
      return {
        arrowDir: "right",
        activePath: "",
        labelPosition: 'right',
        formLabelWidth: '100px',
        imgUrl:require('@/commons/images/success.png'),
        tag:null,
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
  .layout-container {
    width: 100%;
    height: 100vh;
    font-family: @g-font-family-r;
    color: @g-font-color-c;
    .layout-box {
      width: 100%;
      height: 100%;
      .header-container {
        width: 100%;
        height: 50px;
        background-color: #181F47;
        color: #bbbbbb;
        z-index: 50;
        .header-box {
          overflow: hidden;
          display: flex;
          align-items: center;
          height: 100%;
          .header-left {
            height: 100%;
            display: flex;
            align-items: center;
            .logo {
              margin-left: 16px;
              cursor: pointer;
              & > img {
                width: 39px;
                height: 24px;
              }
            }
            b {
              margin-left: 8px;
              font-size: 18px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: rgba(255, 255, 255, 1);
            }
            .controlC {
              height: 24px;
              margin-left: 16px;
              padding-left: 16px;
              border-left: 1px solid rgba(255, 255, 255, 0.25);;
              transition: color 0.3s ease;
              display: flex;
              align-items: center;
              color: rgba(255, 255, 255, 0.7);
              .svg-icon {
                width: 13px;
                height: 13px;
                vertical-align: center;
              }
              .svg-icon.active-color {
                color: #20A0FF;
              }
              .name {
                margin-left: 6px;
                font-size: 12px;
              }
              &:hover {
                cursor: pointer;
                color: #20A0FF;
              }
            }
          }
          .header-right {
            height: 100%;
            display: flex;
            align-items: center;
            margin: 0 26px 0 auto;
            .el-badge-c {
              i {
                font-size: 18px;
              }
              .el-badge__content {
                height: 16px;
                width: 16px;
                line-height: 16px;
                border-radius: 100%;
                border: 0;
                padding: 0;
              }
            }
          }
        }
      }
      .modify-pass{
        /deep/ .el-button--primary{
          padding: 9px 60px;
        }
        .title{
          font-size:24px;
          font-family:PingFangSC-Medium,PingFang SC;
          font-weight:500;
          color:rgba(25,34,59,1);
          line-height:24px;
          text-align: center;
          span{display: inline-block;padding: 40px 0 40px 0}
        }
        .tips{
          display: flex;
          justify-content: center;
          padding-top: 40px;
          font-size:16px;
          font-family:PingFangSC-Medium,PingFang SC;
          font-weight:500;
          color:rgba(25,34,59,1);
        }
        .modify-content{
          height: 400px;
          width: 886px;
          background: #FFFFFF;
          margin: 0 auto;
        }

      }
      .footer{
        padding-bottom: 32px;
        text-align: center;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        span{
          font-size:12px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(25,34,59,1);
        }
      }
    }

  }


</style>

