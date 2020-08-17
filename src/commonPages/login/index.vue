<template>
  <div class="login">

    <div class="login_header">
      <div class="right">

        <span>帮助中心</span>
      </div>
    </div>

    <div class="login_content">
      <div class="login_form">
        <div class="form_left">
          <img src="../../commons/images/new_cloud.svg" />
        </div>
        <div class="form_right">
          <div class="title">
            <div class="title_1">天成云管理平台</div>
            <div class="title_2">欢迎登录</div>
          </div>
          <div class="content">
            <div class="form_item">
              <div class="label">用户名</div>
              <el-input v-model="username" placeholder="请输入用户名" @keyup.enter.native="submit" id="login_username"></el-input>
            </div>
            <div class="form_item password">
              <div class="label">密码</div>
              <el-input
                v-model="password"
                :type="isShow?'':'password'"
                placeholder="请输入密码"
                @keyup.enter.native="submit"
                id="login_password"
              ></el-input>
            </div>
            <div class="forget" @click="toForgetPass" id="login_forget_pass">
              <span>忘记密码</span>
            </div>
            <div class="button">
              <el-button type="primary" @click="submit" id="login_submit">登录</el-button>
            </div>
          </div>
        </div>
      </div>

    <div class="login_footer">
      <div class="login_brand">版权所有 © 华胜天成软件技术有限公司及其关联公司 2020 保留一切权利</div>
    </div>
  </div>

  <!-- <div class="app-login">
    <div class="login-header">
      <div class="left-box">
        <img src="~@/commons/images/cloud.png" alt class="img-size" />
        <span class="img-title">天成云</span>
      </div>
      <div class="right-box">
        <span>首页</span>
        <span>帮助中心</span>
      </div>
    </div>
    <div class=" login-body">
      <div class="login-form">
        <div class="form-right">
          <div class="form-title">云管理平台账号登录</div>
          <div class="form-container">
            <form name="Form1" method>
              <el-input v-model="username" placeholder="请输入用户名" @keyup.enter.native="submit"></el-input>
              <el-input
                v-model="password"
                :type="isShow?'':'password'"
                placeholder="请输入密码"
                @keyup.enter.native="submit"
              >
                <svg-icon
                  slot="suffix"
                  :icon-class="isShow?'show':'hide'"
                  class="eye-icon"
                  @click.native="eyeClick"
                ></svg-icon>
              </el-input>
              <div class="forget">忘记密码？</div>
              <div class="button">
                <el-button type="primary" @click="submit">登录</el-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="login-bottom">
      <div class="login-explain">版权所有 © 华胜天成软件技术有限公司及其关联公司 2020 保留一切权利</div>
    </div>-->
  </div>
</template>
<style src="./index.less" lang="less" scoped>
</style>
