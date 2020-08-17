<template>
  <div class="theme_default fogert_psw">
    <div class="login_content">
      <div class="login_form">
        <div class="wrap">
          <div class="content">
            <div class="title">
              <span>修改密码</span>
            </div>
            <div class="logo">
              <img :src="imgUrl" />
            </div>
            <div class="form">
              <div class="info">
                <span>恭喜您，修改密码成功</span>
              </div>
              <div class="button">
                <el-button type="text" @click="toLogin">返回登陆</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="login_footer">
        <div class="login_brand">版权所有 © 华胜天成软件技术有限公司及其关联公司 2020 保留一切权利</div>
      </div>
    </div>
  </div>
</template>
<script>
import * as requestMethod from "@/request/api/forgetPass/forgetPass.js";
import { btoaPassword, getQueryVariable } from "@/utils/utils";
import validate from "@/utils/validate";
import find from "./components/find.vue";
import email from "./components/email.vue";
import modify from "./components/modify.vue";
export default {
  components: {
    find,
    email,
    modify
  },
  data() {
    return {
      imgUrl: require("@/commons/images/g_pwd_success.svg")
    };
  },
  methods: {
    toLogin() {
      this.$router.push("/login");
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
  background: url("../../commons/images/login_bg_2.0.svg") no-repeat;
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
      .wrap {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .content {
          width: 45%;
          height: 80%;
          text-align: center;
          // display: flex;
          // flex-flow: column;
          // justify-content: center;
          // align-items: center;
          .title {
            height: 20%;
            font-size: 24px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            //color: rgba(51, 42, 124, 1);
          }
          .logo {
            height: 60%;
            img {
              width: 50%;
            }
            //margin-bottom: 45px;
          }
          .form {
            height: 20%;
            .info {
              height: 50%;
              font-size: 16px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
            }
            .button {
              height: 50%;
            }
          }
        }
      }
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

