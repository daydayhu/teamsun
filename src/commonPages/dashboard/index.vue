<template>
    <div class="dashboardPage">
        <div class="right-c g-border-color">
            <DetailMenu :requestList="requestList"
                        :serviceList="serviceList"
            ></DetailMenu>
        </div>
        <div class="left-c">
            <div class="user-info-c g-border-color">
                <div class="icon-c">
                    <img :src="userInfo.is_logo ? userInfo.logo_url : defaultLogoUrl" alt="">
                </div>
                <div class="info-c">
                    <div class="name">
                        <label>姓名:</label>
                        <div class="val">{{userInfo.name}}</div>
                    </div>
                    <div class="role">
                        <label>角色:</label>
                        <div class="val">{{userInfo.role}}</div>
                    </div>
                    <div class="time">
                        <label>上次登录时间:</label>
                        <div class="val">{{userInfo.lastLoginTime}}</div>
                    </div>
                </div>
            </div>
            <div class="user-message-c g-border-color">
                <msgNotify :title="'我的消息'"></msgNotify>
            </div>
        </div>
    </div>
</template>
