<template>
    <el-drawer
        :title="title"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose"
        size="46%">
        <el-input
            type="textarea"
            style="padding:0px 24px"
            rows="8"
            v-model="lic_data">

        </el-input>
        <div class="drawer_footer">
            <el-button
                @click="cancel"
                id="ops_createSoftwareDrawer_cancel_btn">
                取消
            </el-button>
            <el-button
                type="primary"
                @click="submit"
                id="ops_createSoftwareDrawer_submit_btn">
                确定
            </el-button>

        </div>
    </el-drawer>
</template>
<script>
import * as requestMethod from "@/modules/rbac/api/console/license"
import { getSession,setSession } from '@/commons/js/searchFresh.js';

export default {
    data() {
        return {
            title:"更新许可证",
            direction: "rtl",
            fileList:[],
            lic_data:""
        }
    },
    props: {
        drawer: {
            type: Boolean,
            default: false
        },
    },
    methods: {
        //页面关闭
        handleClose(){
            this.$emit('closeDrawer',false)
        },
        //提交按钮
        async submit(){
            let params = {
              lic_data:this.lic_data
            }
            let res = await requestMethod.submitLicenseInfo("post",params)
            if(res.code === 200) {
                this.$message({
                  message: res.message,
                  type: 'success'
                });
               // this.handleClose()
                this.$router.push('/dashboard');
            } else {
                this.$message({
                  message: res.message,
                  type: 'error'
                });
            }
        },
        //取消按钮
        cancel(){
            this.handleClose()
        },
    },
}
</script>

<style lang="less" scoped>
.el-form {
    margin-bottom: 100px;

    .el-form-item {
        margin-bottom: 30px;
        margin-left: 40px;
    }
}

/deep/ .el-upload {
    display: block;
    .el-input__inner {
        cursor: pointer;
    }
}

/deep/ .el-drawer {
    overflow-y: scroll;
}

.upload-file {
    height: 64px;
}

.upload_license {
    width: 103%;
    background-color: #E4E7ED;
    margin-right: 0px;
    display: flex;
    align-items: center;
    padding-right: 8px;
    border-radius: 0px 14px 14px 0px;
    color: #606266;
}
</style>
