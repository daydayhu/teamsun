<template>
    <section>
        <el-collapse style="padding:15px 20px;" >
            <el-form label-width="30%" ref="form" :model="form" :rules="rules">
                <el-tabs v-model="activeName" v-if="((base_info.indexOf(phaseState)>-1) || phaseState==2 || phaseState==4)">
                    <el-tab-pane
                        v-for="(item,index) in collapseList"
                        :name="index+''"
                        :key="index+item.node_canvas_uuid"
                        :label="item.name">
                        <el-form-item label="CPU数(个)" prop="vcpu">
                            <el-input
                                placeholder="请填写CPU数"
                                style="width:440px"
                                v-model="item.resize_cpu"
                                @blur="holdData(item)"
                                @input="((val)=>changeVcpu(val,item.vcpu,item))"
                                :disabled="!isEditable">
                            </el-input>
                            <!-- <infoTag :theMess='form.hostname'></infoTag> -->
                        </el-form-item>
                        <el-form-item label="内存(GB)" prop="memory_gb">
                            <el-input
                                placeholder="请填写内存"
                                style="width:440px"
                                v-model="item.resize_memory"
                                @blur="holdData(item)"
                                @input="((val)=>changeRam(val,item.memory_gb,item))"
                                :disabled="!isEditable">
                            </el-input>
                            <!-- <infoTag :theMess='form.name'></infoTag> -->
                        </el-form-item>
                        <p class="tips">
                          注意：若超出动态可调整最大值范围，将导致云服务器调整大小不生效。
                        </p>
                        <p class="tips">
                          注意：若cpu和内存热插拔未开启，调整大小会先关机，调整完成后，再开机。
                        </p>
                        <p class="tips-p">
                          1.原来内存是1-3G，允许动态调整到的最大值为3G。
                        </p>
                        <p class="tips-p">
                          2.原来内存是4-64G，允许动态调整到到最大值为64G
                        </p>
                        <p class="tips-p">
                          3.原来内存是65G-1T,允许动态调整到的最大值为1T
                        </p>
                        <p class="tips-p">
                          4.CPU调小时会重启，调大最大不超过48
                        </p>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-collapse>
    </section>
</template>
<script>
import * as requestMethod from '@/modules/apps/api/serviceCatalog/openstack/vmware.js'
import { errorMessage } from '../../serviceCatalog/utils/message'
// import infoTag from "../formComponents/compontents/infoTag"

import { successMessage } from '../../../../../ops/pages/operationsCenter/warehouseManage/publicImage/utils/message'

export default {
    name:"quickApplyOpenstack",
    components: {
        // infoTag,
    },
    props:{
        phaseState:{
            type:String,
            default:"1"
        },
        canvasObj:{
            type:Object
        },
        isEditData:{
            type:Object
        },
        isEditable:{
            type:Boolean
        }
    },
    computed:{
        disabled(){
            let status = (this.phaseState == '2' || this.phaseState == '3' || this.phaseState == '4' )
            return status
        }
    },
    data() {
        return {
            activeName: "0",
            collapseList:[],
            props: {
                multiple: false,
                expandTrigger: 'hover',
            },
            form: {
                vcpu:null,
                memory_gb:null,
            },
            cpu:null,
            memory_gb:null,
            rules:{
                // vcpu: [
                //     { required: true, message: '请输入cpu个数', trigger: 'blur' }
                // ],
                // memory_gb: [
                //     { required: true, message: '请输入内存大小', trigger: 'blur' }
                // ],
            },
            isAllSave:false,
            ticket_obj_id: null,
            base_info:[]
        }
    },
    methods: {
        //改变cpu
        changeVcpu(value,cpu,item) {
            if(value > 48) {
                item.resize_cpu = 48
                this.$message.error("内存调大，最大不得超过48个")
            }
            if( value < cpu ) {
                item.resize_cpu = cpu
                this.$message.warning("CPU不可调小")
            }
        },
        //改变内存
        changeRam(value,ram,item) {
            if( value < ram ){
                item.resize_memory = ram
                this.$message.warning("内存不可调小")
                return
            }
            if (ram <=3) {
                if( value > 3 ) {
                    item.resize_memory = 3
                    this.$message.error("内存范围小于3G，允许动态调整的最大值为3G")
                }
            } else if (ram >=4 && ram <=64) {
                if( value < 3 ) {
                    item.resize_memory = 4
                    this.$message.error("内存范围为4-64G，允许动态调整的最小值为4G")
                } else if( value > 64 ) {
                    item.resize_memory = 64
                    this.$message.error("内存范围为4-64G，允许动态调整的最大值为64G")
                }
            } else if(ram >=65 && ram <=1024) {
                if( value < 65 ) {
                    item.resize_memory = 65
                    this.$message.error("内存范围为65G-1T，允许动态调整的最小值为65G")
                } else if( value > 1024 ) {
                    item.resize_memory = 1024
                    this.$message.error("内存范围为65G-1T，允许动态调整的最大值为1T")
                }
            } else if (ram > 1024) {
                item.resize_memory = 1024
                this.$message.error("内存不得超过1T")
            }
        },
        //保存数据
        holdData(item){
            return this.editData(item)
        },
        // 实时保存
        // SaveOperationSet() {
        //     this.isAllSave=true
        //     return this.holdData()
        //     // this.$refs["networkCard"].SaveOperationSet();
        // },
        //编辑逻辑表单
        async editData(item) {
            let params = {
                ticket_obj_id:  item.ticket_obj_id,
                resize_cpu:     item.resize_cpu,
                resize_memory:  item.resize_memory,
            }
            return await requestMethod.editVmChangSizeList("put",params).then(res=>{
                // successMessage(res.message,this)
                if(!(res.code === 200)) {
                    errorMessage(res.message,this)
                }
                return this.alertMess(res)
            })
        },
        //提示消息
        alertMess(res){
            let sj = {
                flag:true,
                mess:""
            }
            if( this.isAllSave===true ){
                if( res.code == 200 ) {
                    sj.flag = true;
                    sj.mess = res.message
                } else {
                    sj.flag = false;
                    sj.mess = res.message
                }
                this.isAllSave = false;

                return sj
            }else{
                if ( res.code == 200 ) {
                    // this.$notify.success({
                    //     title: '成功',
                    //     message: `${res.message}`,
                    //     position: 'bottom-right',
                    //     duration:3000
                    // });
                } else {
                    // this.$notify.error({
                    //     title: '成功',
                    //     message: `${res.message}`,
                    //     position: 'bottom-right',
                    //     duration:3000
                    // });
                }
            }
        },
         //获取vm调整大小数据数据
        getVmChangSizeData(){
            requestMethod.getVmChangSizeList("get",this.canvasObj.app_id,this.canvasObj.ticket_id,this.canvasObj.service_uuid).then(res=>{
                if(res.code == 200) {
                    this.collapseList = res.data
                    this.collapseList.forEach(item => {
                        item.resize_cpu =  item.resize_cpu || item.vcpu
                        item.resize_memory = item.resize_memory || item.memory_gb
                    });
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        //验证表单
        forComponentContent(){
            let obj = { flag:true,mess:'带*号的为必填项' }
            this.$refs.form.validate((valid)=>{
                if (valid) {
                    obj.flag = true;
                } else {
                    obj.flag = false;
                }
            })
            return obj
        },
    },
    mounted() {
        //获取表单数据
        this.getVmChangSizeData()

        if (typeof this.isEditData != 'object') {
            var thedata=JSON.parse(this.isEditData)
        }else{
            var thedata=this.isEditData
        }
        if(JSON.stringify(thedata) == "{}"){
            thedata.base_info=[1,3,5];
        }
        this.base_info=thedata.base_info.map(String);
    }
}
</script>
<style lang="less" scoped>
    .collapse-title {
        padding-left: 60px;
        padding-right: 20px;
        font-size: 14px;
        width: 100%;
    }

    /deep/ .el-collapse-item {
        border: 0px !important;
    }

    /deep/ .el-collapse-item__header {
        flex: 1 0 auto;
        order: -1;
        background: #fff !important;
        border-bottom: 1px solid #e7edf3;
    }

    /deep/ .el-collapse-item__arrow {
        position: absolute;
        left: 60px;
    }
    /deep/ .el-collapse-item__content {
        margin-top: 5px;
        margin-left: 35px;
    }

    .slot-btn {
        float: right;
        margin-right: 20px;
        margin-top: 9px;
    }
    /deep/ .el-cascader .el-input{
        width: 100%;
    }

    .tips{
      color: red;
      margin-left: 62px;
      font-size: 14px;
      line-height: 26px;
    }
    .tips-p{
      margin-left: 62px;
      font-size: 14px;
      line-height: 26px;
    }
</style>
