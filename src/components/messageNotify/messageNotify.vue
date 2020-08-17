<template>
    <div class="out-box">
        <div class="user-message-header">
            <span class="title">{{title}}</span>
            <el-button @click="checkMore" class="msg-btn" type="text">查看更多</el-button>
        </div>
        <div class="msg-box">
            <div
                v-for="(item,index) in messageList"
                class="user-message-body"
                :key="index">
                <div class="msg-content">
                    <p @click="checkMore" class="message">{{item.message_info}}</p>
                </div>
                <span class="time">{{item.create_time[0]}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import * as messageRequest from '@/modules/apps/api/applicationCenter/myMessage';
export default {
    props:{
        title:{
            type:String
        }
    },
    data() {
        return {
            messageList:[],
        }
    },
    methods:{
        //获取消息数量展示列
        getShowMessage() {
          messageRequest.getShowMessage('get').then(res => {
              if (res.code === 200) {
                this.messageList = res.data;
              }
          });
        },
        //查看更多
        checkMore() {
            window.location.href = `./apps.html#/applicationCenter/myNews?menu_id=4106`;
        },
    },
    mounted() {
        this.getShowMessage()
    }
}
</script>
<style lang="less" scoped>
.out-box {
    height: calc( 100% );
    overflow: hidden ;
}
.user-message-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 16px 24px 16px 24px;
    .title {
        font-size:16px;
        line-height:24px;
        font-weight:400;
    }
    .msg-btn {
        font-size:12px;
        line-height:20px;
        font-weight:400;
        padding: 0px;
    }
}
.msg-box {
    padding-top: 16px;
    border-top: 1px solid rgba(0,0,0,0.06);;
    overflow-y: scroll;
    height: calc( 100% - 16px );
    padding-bottom: 40px;
    .user-message-body {
        margin: 0px 24px 16px 24px;
        .msg-content {
        margin-bottom: 4px;
        .message::before {
            content: "";
            width: 10px;
            display: inline-block;
            height: 10px;
            border: solid 2px #306bff;
            border-radius: 10px;
            margin-right: 8px;
            position: relative;
            left: 3px;
            top: 3px;
        }
        .message {
            width: 100%;
            font-size: 12px;
            line-height: 20px;
            font-weight: 400;
            height: 20px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
        }
        }
        .time {
        margin-left: 22px;
        font-size:12px;
        font-weight:400;
        font-family:@g-font-family-r;
        line-height:20px;
        opacity: 0.45;
        }
    }
}
//滚动条待处理
// .msg-box::-webkit-scrollbar {
//   width: 16px;
// }
// .msg-box::-webkit-scrollbar-thumb {
//   border: 4px solid transparent;
//   border-radius: 16px;
//   background: #818B99;
//   background-clip: content-box;
// }
</style>
