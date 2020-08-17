<template>
  <div class="theme_default login">
    <!-- <div class="login_header">
      <div class="right">
        <span>帮助中心</span>
      </div>
    </div>-->
    <div class="login_content">
      <div class="login_form">
        <div class="form_left">
          <img src="../../commons/images/login_left_2.0.svg" />
        </div>
        <div class="form_right">
          <div class="title">
            <div class="title_1">
              <img src="../../commons/images/login_logo_2.0.svg" />
            </div>
            <div class="title_2">欢迎登录天成云管理平台</div>
          </div>
          <div class="content_wrap">
            <div class="content">
              <div class="form_item">
                <div class="label">用户名</div>
                <el-input
                  v-model="username"
                  size="medium"
                  placeholder="请输入用户名"
                  @keyup.enter.native="submit"
                  id="login_username"
                ></el-input>
                <div class="tip" v-if="noName">用户名不能为空</div>
              </div>
              <div class="form_item password">
                <div class="label">密码</div>
                <el-input
                  size="medium"
                  v-model="password"
                  :type="isShow?'':'password'"
                  placeholder="请输入密码"
                  @keyup.enter.native="submit"
                  id="login_password"
                ></el-input>
                <div class="tip" v-if="noPwd">密码不能为空</div>
              </div>
              <div class="forget" @click="toForgetPass" id="login_forget_pass">
                <span>忘记密码 ?</span>
              </div>
              <div class="button">
                <el-button
                  type="primary"
                  :loading="loading"
                  @click="submit"
                  id="login_submit"
                >{{loading?'登录中':'登录'}}</el-button>
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
<style src="./index.less" lang="less" scoped>
</style>
