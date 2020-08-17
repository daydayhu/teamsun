<template>
    <section>
        <el-dialog title="审批"
            :visible.sync="dialogTableVisible"
            v-if="dialogTableVisible"
            :before-close="handleCloseDialog"
            width="800px">
            <el-row style="overflow: auto;max-height: 330px;">
                <el-col :span="4">
                    <el-menu
                        default-active="baseInfo"
                        @select="selectedMenu"
                        @open="handleOpen"
                        style="height: 270px;">
                        <el-menu-item index="baseInfo">
                            <span slot="title">基本信息</span>
                        </el-menu-item>
                        <el-menu-item index="record">
                            <span slot="title">处理过程记录</span>
                        </el-menu-item>
                        <el-menu-item index="flow">
                            <span slot="title">流程图</span>
                        </el-menu-item>
                    </el-menu>
                </el-col>
                <el-col :span="20" style="margin-top: 3px;">
                    <section style="margin-left: 25px;">
                        <div v-if="stepActive === 'baseInfo'">
                            <el-form label-width="70px" label-position="left">
                                <el-form-item label="流程名称" >
                                    <p>{{instance_name}}</p>
                                </el-form-item>
                                <el-form-item label="备注" >
                                    <p>{{remarkds}}</p>
                                </el-form-item>
                                <el-form-item label="当前节点" >
                                    <p>{{instance_step_name}}</p>
                                </el-form-item>
                                <el-form-item label="审批结果" >
                                    <el-button-group>
                                        <el-button
                                            :type="form.approval_comment === 1 ? 'primary' : ''"
                                            style="width:100px"
                                            @click="argeeAble(1)">
                                            同意
                                        </el-button>
                                        <el-button
                                            :type="form.approval_comment === 0 ? 'primary' : ''"
                                            style="width:100px"
                                            @click="argeeAble(0)">
                                            不同意
                                        </el-button>
                                    </el-button-group>
                                </el-form-item>
                                <el-form-item label="审批意见" >
                                    <el-input maxlength="200" v-model="form.suggestion" type="textarea"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div v-if="stepActive === 'record'">
                            <el-row class="approval">
                                <approvalHistory
                                    :instance_id="instance_id"
                                ></approvalHistory>
                            </el-row>
                        </div>
                        <div v-show="stepActive === 'flow'" >
                            <el-form label-width="70px">
                                <el-form-item label="流程名称">
                                    <p>{{instance_name}}</p>
                                </el-form-item>
                            </el-form>
                            <approvalFlowChart
                                :instance_id="instance_id">
                            </approvalFlowChart>
                        </div>
                    </section>
                </el-col>
            </el-row>
            <span slot="footer">
                <el-button type="primary"  @click="submit"
                    :loading="submitLoading"
                     :disabled="flag"
                    >{{ submitLoading ? "提交中 ..." : "提 交" }}</el-button>
                <el-button @click="cancel()">取消</el-button>
            </span>
        </el-dialog>
    </section>
</template>
<script>
import * as requestMethods from '@/modules/apps/api/applicationCenter/flowApproval.js'
import approvalHistory from "@/modules/apps/pages/applicationCenter/myApproval/approvalDetail/approvalHistory"
import approvalFlowChart from "@/modules/apps/pages/applicationCenter/myApproval/approvalDetail/approvalFlowChart"

export default {
    components:{
        approvalHistory,
        approvalFlowChart
    },
    props:{
        dialogTableVisible:{
            type:Boolean,
            default:false
        },
        instance_id:{
            type:Number,
            default:1
        },
        ticket_id:{
            type:Number,
            default:1
        },
        operation:{
            type:String,
            default:'edit'
        },
        app_id:{
            type:Number,
            default:1
        },
        from:{
            type:String
        }
    },
    watch: {
        "dialogTableVisible":{
            handler: function(val, oldVal) {
                if(val){
                    this.init()
                }
            },
            deep:true,
            immediate:true
        }
    },
    data() {
        return {
            stepActive:"baseInfo",
            dialogVisible:this.dialogTableVisible,
            reverse: false,
            activities: [],
            flow:[],
            instance_name: '',
            remarkds: null,
            instance_step_name: '',
            form:{
                instance_id: null,
                ticket_id: null,
                instance_step_id: null,
                approval_comment:1,
                suggestion:null,
            },
            activity:0,
            height:"",
            approvalList:[],
            flag:false,
            submitLoading: false,
            create_user_name: "",
            create_time: "",
            approvalDetailData:{
                create_user_name: "",
                create_time: "",
            },
        }
    },
    methods:{
        handleOpen() {

        },
        handleCloseDialog() {
            this.$emit("approveCancel")
        },
        selectedMenu(index) {
            this.stepActive = index
        },
        //同意
        argeeAble(value) {
            this.form.approval_comment = Number(value)
        },
        submit() {
            this.submitLoading = true;
            requestMethods.postFlowApproval("post",this.form).then(res=>{
                this.submitLoading = false;
                if(res.code == 200){
                    this.$message.success(res.message);
                    this.submitLoading = false;
                    window.history.back()
                    // if( this.from === "app") {
                    //     this.$router.push({
                    //         path: '/applicationCenter/applicationSystem/systemDetail',
                    //         query: {
                    //             app_id:this.app_id,
                    //             selectedTab:'list',
                    //             operation:'edit'
                    //         }
                    //     });
                    // } else if(this.from === "approve") {
                    //     this.$emit('updateData');
                    // }else if(this.from === "order") {
                    //     this.$router.push({
                    //         path: '/applicationCenter/myOrder?menu_id=1044',
                    //     });
                    // }
                }else if(res.code == 400){
                    this.$message.error(res.message);
                }else if(res.code == 500){
                    this.$message.error(res.message);
                }
                this.$emit('approveCancel');
            })
        },
        //获取流程基础信息
        getFlowBaseInfo() {
            requestMethods.getFlowApprovalBase("get",this.instance_id,this.ticket_id).then(res=>{  // instance_id,ticket_id
                let data = res.data.flow
                if(res.code === 200) {
                    this.form.instance_id = data.instance_id
                    this.form.ticket_id = data.ticket_id
                    this.form.instance_step_id = data.instance_step_id
                    this.instance_name = data.instance_name
                    this.instance_step_name = data.instance_step_name
                    this.remarkds = data.remarkds
                }else if(res.code === 400){
                    this.$message.error("您没有审批此节点权限");
                    // this.$emit("approveCancel")
                    this.flag = true;
                }
            })
        },
        cancel(){
            this.$emit('approveCancel')
        },
        init() {
            this.form.instance_id = this.instance_id;
            this.form.ticket_id = this.ticket_id
            this.getFlowBaseInfo()
            this.stepActive = "baseInfo"
        }
    },
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
.approval {
    margin: 20px;
    .title {
      display: flex;
      justify-content: space-between;
    }
    .content {
      margin-top: 10px;
      font-size: 12px;
      color: #4f4f4f;
    }
  }
</style>
