<template>
    <section>
        <el-dialog
            title="账号设置"
            :visible.sync="dialogVisible"
            width="30%"
            :destroy-on-close="true">
            <el-form
                label-position="right"
                label-width="100px"
                ref="form"
                :model="form"
                :rules="rules">
                <el-form-item label="类型">
                      <el-radio v-model="radio" label="1">SSH</el-radio>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-col :span="12">
                        <el-input v-model="form.user"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="密码">
                    <el-col :span="12">
                        <el-input show-password v-model="form.password"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <div style="float:right">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button
                        type="primary"
                        @click="submitSetHost"
                        :loading="confirmStatus">
                        确 定
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </section>
</template>
<script>
import * as requestMethods from "@/modules/apps/api/applicationCenter/applicationSystem.js"
export default {
    props: {
        showDialog:{
            type:Boolean
        },
        config: {
            type:Object
        },
        dataType:{
            type:String
        }
    },
    watch: {
        showDialog:{
            handler(newVal,oldVal) {
                console.log(this.config)
                this.dialogVisible = newVal
            }
        }
    },
    data() {
        return {
            form: {
                user: "",
                password: "",
            },
            dialogVisible: false,
            confirmStatus:false,
            rules:{},
            radio:"1"
        }
    },
    methods: {
        //  取消设置账号
        cancel() {
            this.form.user = ""
            this.form.password = ""
            this.$emit("close")
        },
        // 设置账号
        async submitSetHost() {

            let res
            switch (this.dataType) {
                case "vm":
                    this.form.vm_uuids = this.config.vm_uuids
                    this.form.vm_root = this.form.user
                    this.form.vm_pwd = this.form.password
                    res = await requestMethods.vmSetAccount("post",this.form)
                break;
                case "ops":
                    this.form.node_ids = this.config.node_ids
                    res = await requestMethods.opsSetAccount("post",this.form)
                break;
            }

            if(res.code == 200) {
                this.$message.success(res.message)
            } else {
                this.$message.error(res.message)
            }
            this.form.user = ""
            this.form.password = ""
            this.$emit("close")
        },
    }
}
</script>
<style lang="less" scoped>

</style>

