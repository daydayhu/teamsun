<template>
    <div>
        <el-dialog
            :visible.sync="showDialog"
            :title="'模板导入'"
            width="500px"
            @closed="close">
            <div class="ts-drawer__content">
                <el-form label-width="80px">
                    <el-form-item label="导入源">
                        <el-radio-group v-model="form.is_file">
                            <el-radio :label="false">应用模板</el-radio>
                            <el-radio :label="true">本地文件</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="form.is_file==false">
                        <el-select v-model="form.app_template_id" style="width: 240px">
                            <el-option v-for="(item,index) in templateList"
                                :key="index"
                                :value="item.template_id"
                                :label="item.template_name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="form.is_file==true">
                        <el-upload
                            ref="uploadFile"
                            style="width:270px"
                            class="upload-demo"
                            action=""
                            :file-list="fileList"
                            :show-file-list="false"
                            :auto-upload="false"
                            :on-change="fileChange"
                            :limit="1">
                            <el-input
                                v-model="fileName"
                                placeholder="请选择模板文件"
                                suffix-icon="el-icon-more"
                                :readonly="true"
                                id="ops_uploadImageFileDrawer_image_name_input">
                            </el-input>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="addJsonToCanvas">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import * as requestMethod from '@/modules/apps/api/applicationCenter/addOrder/addOrderSecond.js';
export default {
    props:{
        dialogVisible:{
            type:Boolean,
            default: false
        },
        orderInfo:{
            type:Object
        },
        // from:"",
        // operation:"",
        // ticket_num:""
    },
    watch:{
        dialogVisible:{
            handler(newVal,oldVal) {
                this.showDialog = newVal
            }
        }
    },
    data() {
        return {
            form:{
                app_id: 29,
                ticket_id: 126,
                is_file: false,
                app_template_id: "",
            },
            templateList: [],
            showDialog: false,
            fileName:"",
            fileList:[]
        }
    },
    created(){
        console.log(this.orderInfo)
    },
    methods: {
        async addJsonToCanvas() {
            this.$router.push({
                path:"/applicationCenter/serviceMatch",
                query:{
                    app_id:this.orderInfo.app_id,
                    ticket_id:this.orderInfo.ticket_id,
                    is_file:this.form.is_file,
                    app_template_id:this.form.app_template_id,
                    step:this.orderInfo.step,
                    bus_id:this.orderInfo.bus_id,
                    instance_id:this.orderInfo.instance_id,
                    operation:this.operation,
                    step_id:this.orderInfo.step_id,
                    ticket_type:this.orderInfo.ticket_type,
                    fileName:this.fileName
                }
            })
        },
        close() {
            this.showDialog = false
            this.$emit("closeTemplateExport")
        },
        async getTemplates() {
            let res = await requestMethod.getPublishedAppTemplate("get")
            if(res.code === 200) {
                this.templateList = res.data
            } else {
                this.$message.error(res.message)
            }
        },
        fileChange(file){
          console.log(file)
            this.fileName = file.name
            let fileFormData = new FormData()

            let reader = new FileReader();
            let res = null
            reader.readAsDataURL(file.raw);
            reader.onload = function(){
                res = reader.result;
                sessionStorage.setItem("moduleFile",res)
            };
            // fileFormData.append("app_template_file",file.raw)
        }
    },
    mounted() {
        this.getTemplates()
    }
}
</script>
<style lang="less" scoped>

</style>
