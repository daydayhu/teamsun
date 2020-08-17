<template>
  <div class="layout-container">
    <div class="layout-box">
      <div class="header-container">
        <div class="header-box">
          <div class="header-left">
            <span class="logo" @click="goDashboard">
                <img src="@/commons/images/cloud_logo@2x.png" alt />
            </span>
            <b>CloudEOS</b>
            <!-- <span @click="clickConsole" class="controlC"  @mouseenter="active=true"  @mouseleave="active=false">
              <svg-icon  icon-class='control' :class="{'acrive-color': active}"></svg-icon>
              <span class="name">控制台</span>
            </span> -->
          </div>
          <div class="header-right">
            <!--<div class="search search-input" :class="{'input-position':searchShow}">-->
                <!--<span class='el-icon-search  iconsize  icon-search' @click="searchHandler"></span>-->
                <!--<span class="search-box"  :class="{'search-show': searchShow}">-->
                    <!--<el-input placeholder="请输入内容进行搜索"-->
                        <!--size='small'  prefix-icon="el-icon-search" v-model="search">-->
                    <!--</el-input>-->
                <!--</span>-->
            <!--</div>-->
            <div class="el-badge-c">
              <el-badge :hidden="messageNums === 0" :value="messageNums">
                <i class="el-icon-bell"  @mouseenter="hoverIcon" @mouseleave="blurIcon"></i>
              </el-badge>
            </div>
            <div class="user-info">
              <el-dropdown trigger="click">
                <div class="el-dropdown-link">
                  <img src="@/commons/images/user.svg" class="user-icon" />
                  <span>{{userName}}</span>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="baseInfo">基本信息</el-dropdown-item>
                  <el-dropdown-item @click.native="modifyPass" v-if="source_type == 0">修改密码</el-dropdown-item>
                  <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
      <div class="app-warpper g_bg_color">
        <div class="sidebar-container">
          <div class="menu-box">
            <!-- 最底层的详细菜单 -->
            <div class="menu-sub" :class="subClass">
              <menu-sub
                :menu-title="menuTitle"
                :menu-list="itemMenu"
                :tag="tag"
                @arrow-sub="getArrowSub"
                ref="menuSub"
              ></menu-sub>
            </div>
            <!-- 第二层的图标 -->
            <div class="menu-icon">
              <ul @mouseenter="menuMouseOverHandler">
                <li v-for="(iconData,iconIndex) in subMenu" :key="'iconIndex'+iconIndex">
                  <svg-icon v-if="iconData.menu_name === '服务列表'" icon-class='service_menu'></svg-icon>
                  <!--<i v-if="iconData.menu_name === '服务列表'" :class="iconData.menu_class ? iconData.menu_class : 'service_menu'" class="iconsize"></i>-->
                </li>
              </ul>
            </div>
            <!-- 第三层hover菜单-->
            <div
              class="menu-list"
              :class="{'menu-list-left': collapseMenuShow}"
              @mouseleave.stop="mouseLeaveHandler"
            >
              <collapse-menu
                @sub-title="getSubTitle"
                :request-menu = 'requestMenu'
                :menu-list="subMenu"
                @search-item="searchItem"
                :service-list="serviceList"
              ></collapse-menu>
            </div>
          </div>
        </div>
        <div class="main-container" :class="{'main-container-left': menuTitle != null && !hideSub}">
          <!-- 需要缓存的页面添加meta.keepAlive=true -->
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
      </div>
    </div>
    <transition name = "messageAnimation">
        <el-card
            style="overflow:auto;z-index:1000"
            @mouseenter.native="hoverIcon"
            @mouseleave.native="blurIcon"
            v-show="messageDrawer"
            class="message-drawer">
            <div slot="header" class="clearfix">
                <span>平台消息通知</span>
                <el-button
                    style="float: right; padding: 3px 0"
                    type="text"
                    @click="checkMore">
                    查看更多
                </el-button>
            </div>
            <el-card v-for="(item,index) in messageList" :key="index+item.title" style="margin-bottom:10px">
                <div style="line-height: 18px;">
                    <strong>{{item.title}}</strong>
                    <p>{{item.message_info}}</p>
                    <time>{{item.create_time[0]}}</time>
                </div>
            </el-card>
        </el-card>
    </transition>
  </div>
</template>
