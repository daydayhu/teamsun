<template>
    <section>
        <div :style="'height: ' + height + ';margin-left:76px;margin-top: 10px;'">
            <el-steps direction="vertical">
                <el-step
                    title="开始"
                    icon="iconfont icon-playcircle"
                    :status="flow.length >= 1 ? 'success' : 'finish'">
                </el-step>
                <el-step
                    v-for="(step,index) in flow"
                    :key="index"
                    :title="step.name"
                    icon="el-icon-edit-outline"
                    :status="step.status === 2 ? 'success' : step.status === 3 ? 'error':'finish'">
                    <div slot="description">
                        <p>{{step.strategy}}</p>
                        <!-- <p>{{step.status}}</p> -->
                        <p v-for="(user,index) in step.approval" :key="user+index">{{user}}</p>
                    </div>
                </el-step>
                <el-step status="process" title="结束" icon="iconfont icon-stopcircle"></el-step>
            </el-steps>
        </div>
    </section>    
</template>
<script>
import * as requestFlow from "@/modules/apps/api/applicationCenter/flowApproval.js"
export default {
    name:"approvalFlowChart",
    props:{
        instance_id:{
            type:Number
        }
    },
    data() {
        return {
            flow: [],
            height: "",
        }
    },
    mounted() {
        this.getApprovalFlow()
    },
    methods:{
        getApprovalFlow() {
            requestFlow.getFlowApprovalChart("get",this.instance_id).then(res=>{
                if(res.code === 200) {
                    this.height = (2 + res.data.flow_chart.instance_steps.length)*90 + "px"
                    res.data.flow_chart.instance_steps.forEach(item=>{
                        let params = {}
                        params.approval=[]
                        params.name = item.instance_step_name
                        params.strategy = item.flow_node_type === 1 ? "节点策略：全部":"节点策略：任意"
                        params.status = item.step_status.step_status_key
                        item.instance_step_users.forEach(user=>{
                            if(item.step_status.step_status_key === 2 || item.step_status.step_status_key === 3) {
                                if(user.approval_comment.approval_comment_key === 1) {
                                    params.approval.push("审批人：" + user.user_name + " " + user.approval_comment.approval_comment_value)
                                }
                                if(user.approval_comment.approval_comment_key === 0) {
                                    params.approval.push("审批人：" + user.user_name + " " + user.approval_comment.approval_comment_value)
                                }
                            } else {
                                params.approval.push("审批人：" + user.user_name + " " + user.approval_status.approval_status_value)
                            }

                        })
                        this.flow.push(params)
                    })
                }
            })
        },
    }
}
</script>
<style lang="less" scoped>
/deep/ .iconfont {
    font-size: 32px;
}
/deep/.el-step .el-step__head .el-step__icon .el-step__icon-inner {
    font-size: 32px;
}
/deep/ .el-step.is-vertical .el-step__line{
    top: 32px;
    bottom: 10px;
}
/deep/ .el-step__line-inner {
  border: 0px;
}
</style>