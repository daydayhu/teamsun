<template>
  <div class="layout-container">
    <div class="layout-box">
      <div class="modify-pass">
        <div class="title">
          <span>修改密码</span>
        </div>
        <div class="modify-content">
          <div style="padding-top: 120px">
            <div style="display: flex;justify-content: center;">
              <img :src="imgUrl" alt="">
            </div>
            <p class="tips">密码修改成功</p>
            <p class="tips"><el-button type="text" @click="toLogin">返回登陆</el-button></p>
          </div>
        </div>
      </div>
      <div class="footer"><p>版权所有 © 华胜天成软件技术有限公司及其关联公司 2020 保留一切权利</p></div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        imgUrl:require('@/commons/images/success.png'),
      };
    },
    methods:{
      toLogin(){
        this.$router.push('/login');
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
      .modify-pass{
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

