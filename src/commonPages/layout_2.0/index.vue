<template>
    <div class="layout-container g-font-color-c" @click="closeDetailMenu">
        <div class="layout-c-left g_menu">
            <div class="main-menu">
              <!--<el-tooltip class="item" effect="dark" content="回到首页" placement="right-start"></el-tooltip>-->
                <div class="logo-c g_menu_border">
                    <img src="@/commons/images/menu_logo_icon@2x.png" alt="" @click="toDashboard">
                </div>
                <div class="menu-btn-c g_menu_border btn-c">
                    <button :class="{'active': currentActiveBtn === menuBtnSet.detailMenu}" @click.stop="toggleDetailMenu(menuBtnSet.detailMenu)">
                        <img src="@/commons/images/menu_list_icon@2x.png" alt />
                        <img class="arrow" src="@/commons/images/menu_list_icon_left@2x.png" alt="" v-show="detailMenuFlag">
                        <img class="arrow" src="@/commons/images/menu_list_icon_right@2x.png" alt="" v-show="!detailMenuFlag">
                    </button>
                </div>
                <div class="console-btn-c g_menu_border btn-c" v-if="false">
                    <button  :class="{'active': currentActiveBtn === menuBtnSet.console}">
                        <img src="@/commons/images/console_icon@2x.png" alt />
                    </button>
                </div>
                <div class="collect-c btn-c" v-if="false"></div>
                <div class="search-c btn-c">
                    <button :class="{'active': currentActiveBtn === menuBtnSet.search}" v-if="false">
                        <img src="@/commons/images/menu_search_icon@2x.png" alt />
                    </button>
                </div>
                <div class="message-c btn-c">
                    <el-popover
                        popper-class="message-popper"
                        placement="right"
                        width="400"
                        trigger="click"
                        :visible-arrow="true"
                        style="width: 100%;height: 100%">
                        <msgNotify :title="'平台消息通知'"></msgNotify>
                        <button slot="reference" :class="{'active': currentActiveBtn === menuBtnSet.message}"   @click="toggleMessage(menuBtnSet.message)">
                            <el-badge :hidden="messageNums === 0" :value="messageNums">
                                <img src="@/commons/images/menu_message_icon@2x.png" alt />
                            </el-badge>
                        </button>
                    </el-popover>
                </div>
                <div class="user-c btn-c">
                    <el-popover
                        popper-class="user-popper"
                        placement="right"
                        trigger="click"
                        style="width: 100%;height: 100%"
                        v-model="userVisibleFlag">
                        <div>
                            <el-button @click.native="baseInfo" type="text">基本信息</el-button>
                            <div class="line"></div>
                            <el-button @click.native="modifyPass" v-if="source_type == 0" type="text">修改密码</el-button>
                            <div class="line"></div>
                            <el-button @click.native="logout" type="text">退出登录</el-button>
                        </div>
                        <button slot="reference" :class="{'active': currentActiveBtn === menuBtnSet.user}" @click="toggleUserInfo(menuBtnSet.user)">
                            <img src="@/commons/images/menu_user_icon@2x.png" alt />
                        </button>
                    </el-popover>
                </div>
                <div class="menu-toggle-c btn-c">
                    <button v-show="$route.path !== '/dashboard'" :class="{'active': currentActiveBtn === menuBtnSet.subMenu}" @click="toggleSubMenu(menuBtnSet.subMenu)">
                        <img src="@/commons/images/menu_open_icon@2x.png" v-show="!subMenuFlag" alt />
                        <img src="@/commons/images/menu_close_icon@2x.png" v-show="subMenuFlag" alt />
                    </button>
                </div>
                <ThemeChange v-show="false"></ThemeChange>
            </div>
            <SubMenu v-if="subMenuFlag"
                     :currentService="currentService"
                     :currentIndexMenu="currentIndexMenu"
            ></SubMenu>
            <DetailMenu v-if="detailMenuFlag"
                        :requestList="requestMenu"
                        :menuList="subMenuList"
                        :serviceList="serviceList"
                        @closeDetailMenu="closeDetailMenu"
            ></DetailMenu>
        </div>
        <div class="layout-c-right">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"
                         :serviceList="$route.path === '/dashboard' ? serviceList : null"
                         :requestList="$route.path === '/dashboard' ? requestMenu : null" ></router-view>
        </div>
    </div>
</template>
<style src="./index.less" lang="less" scoped></style>
