<template>
  <!------------------ 发送邮箱 ------------------->
  <div class="forgetPass_find">
    <div class="content">
      <div class="title">
        <span>密码找回</span>
      </div>
      <div class="logo">
        <img :src="imgUrl" />
      </div>
      <div class="form">
        <div class="info">
          <span>修改密码链接已发送至您的邮箱，请注意查收</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as requestMethod from "@/request/api/forgetPass/forgetPass.js";
import validate from "@/utils/validate";
export default {
  name: "forgetPass_find",
  props: {
    //头部标题
    title: String
    //有无返回按钮和面包屑
  },
  data() {
    return {
      imgUrl: require("@/commons/images/g_pwd_sendEmail.svg"),
    };
  },
  methods: {

  }
};
</script>
<style lang="less" scoped>
.forgetPass_find {
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
        width: 60%;
      }
      //margin-bottom: 45px;
    }
    .form {
      height: 20%;
      .info {
        height: 20%;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
      }
    }
  }
}
</style>
