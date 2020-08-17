<template>
    <section class="approvalHistory">
        <el-timeline>
            <el-timeline-item
                placement="top"
                icon="el-icon-check"
                type="sucess"
                color="#0bbd87"
                size="large">
                <el-card>
                    <div class="outbox">
                        <div class="titleHeader">
                            <div class="user_name">
                                <b>{{defaultProps.create_user_name}}</b>
                            </div>
                            <div class="create_time">
                                <p>{{defaultProps.create_time}}</p>
                            </div>
                            <div class="approval_state" style="color:#0bbd87">
                                <b style="float:right">{{"已发起"}}</b>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-timeline-item>
            <el-timeline-item
                placement="top"
                v-for="(item, index) in approvalInfo"
                :key="index"
                :icon="item.icon"
                :type="item.type"
                :color="item.color"
                :size="item.size"
                :timestamp="item.timestamp">
                <el-card>
                    <div
                        v-for="(info,index) in item.info"
                        :key="info.name + info.time +index"
                        class="outbox">
                        <div class="titleHeader">
                            <div class="user_name">
                                <p>{{info.name}}</p>
                            </div>
                            <div class="create_time">
                                <p>{{info.time}}</p>
                            </div>
                            <div class="approval_state" :style="'color:'+item.color" >
                                <p style="float:right">{{info.state}}</p>
                            </div>
                        </div>
                        <div class="approval_res">{{info.content}}</div>
                        <div class="approval_suggest">{{info.suggestion}}</div>
                    </div>
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </section>
</template>
<script>
import * as requestFlow from "@/modules/apps/api/applicationCenter/flowApproval.js"
export default {
    props:{
        instance_id:{
            type:Number
        }
    },
    data() {
        return {
            defaultProps:{
                create_user_name:"",
                create_time:""
            },
            approvalInfo:[],
        }
    },
    mounted(){
        this.getApprovalHistory()
    },
    methods:{
        getApprovalHistory() {
            this.approvalInfo = []
            requestFlow.getFlowApprovalRecord("get",this.instance_id).then(res=>{
                if(res.code === 200) {
                    let approvalDataList = res.data.instance_steps
                    this.defaultProps.create_user_name = res.data.create_user_name
                    this.defaultProps.create_time = res.data.create_time
                    //审批历史获取
                    approvalDataList.forEach(items=>{
                        let approvalItem = {}
                        approvalItem.info = []
                        approvalItem.size = "large"
                        items.instance_step_users.forEach(userItem => {
                            let info = {}
                            //获取审批人，审批意见，审批时间，以及是否审批
                            if(items.step_status.step_status_key === 2 || items.step_status.step_status_key === 3) {
                                if(userItem.approval_comment.approval_comment_key === 1) {
                                    info.name = userItem.user_name
                                    info.time = userItem.update_time
                                    info.state = userItem.approval_status.approval_status_value
                                    info.content = userItem.approval_comment.approval_comment_value
                                    info.suggestion = userItem.suggestion
                                    approvalItem.info.push(info)
                                }
                                if(userItem.approval_comment.approval_comment_key === 0) {
                                    info.name = userItem.user_name
                                    info.time = userItem.update_time
                                    info.state = userItem.approval_status.approval_status_value
                                    info.content = userItem.approval_comment.approval_comment_value
                                    info.suggestion = userItem.suggestion
                                    approvalItem.info.push(info)
                                }
                            } else {
                                info.name = userItem.user_name
                                info.time = userItem.update_time
                                info.state = userItem.approval_status.approval_status_value
                                info.content = userItem.approval_comment.approval_comment_value
                                info.suggestion = userItem.suggestion
                                approvalItem.info.push(info)
                            }
                        })
                        //根据阶段不同，使用不同的变迁和颜色
                        if(items.step_status.step_status_key === 2) {
                            approvalItem.icon = "el-icon-check"
                            approvalItem.color = "#0bbd87"
                        } else if(items.step_status.step_status_key === 1) {
                            approvalItem.icon = "el-icon-minus"
                            approvalItem.color = "#E6A23C"
                        } else if(items.step_status.step_status_key === 3) {
                            approvalItem.icon = "el-icon-close"
                            approvalItem.color = "#F56C6C"
                        } else {
                            approvalItem.icon = "el-icon-plus"
                            approvalItem.color = "#409EFF"
                        }
                        this.approvalInfo.push(approvalItem)
                    })
                }
            })
        },
    }
}
</script>
<style lang="less" scoped>
.approvalHistory {
    width: 500px;
    .outbox{
        margin: 16px;
        .titleHeader {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
        .user_name {
            width:115px;
            height:22px;
            font-size:14px;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:500;
            color:rgba(25,34,59,1);
            line-height:22px;
        };
        .create_time {
            width:50%;
            height:20px;
            font-size:12px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(25,34,59,1);
            line-height:20px;
            width: calc( 100% - 157px );

        };
        .approval_state {
            width:42px;
            height:22px;
            font-size:14px;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:500;
            line-height:22px;
        }

    };
    }
    .approval_res {
        height:20px;
        font-size:12px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(25,34,59,1);
        line-height:20px;
        padding-left: 115px;
    }
    .approval_suggest {
        font-size:12px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(25,34,59,1);
        line-height:20px;
        padding-left: 115px;
    }
}
/deep/ .el-card__body {
    padding: 0px;
}
</style>