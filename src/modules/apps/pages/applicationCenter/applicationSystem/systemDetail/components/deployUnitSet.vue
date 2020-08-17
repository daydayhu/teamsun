<template>
    <section>
        <el-dialog
            title="部署单元设置"
            :visible.sync="dialogVisible"
            width="30%"
            :destroy-on-close="true">
            <el-form
                label-position="right"
                label-width="100px"
                ref="form"
                :model="form"
                :rules="rules">
                <el-form-item label="部署单元" prop="os_hostname">
                    <el-col :span="12">
                        <!-- <el-input v-model="form.deployUnit"></el-input> -->
                        <el-select v-model="form.deployment_unit_id">
                            <el-option
                                v-for="(item,index) in deployment_unit_list"
                                :key="item.deployment_unit_id+index"
                                :value="item.deployment_unit_id"
                                :label="item.name">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button v-if="buildAble" type="text" icon="el-icon-plus" @click="newBuild">新建</el-button>
                    <el-col v-else >
                      <el-input style="width:200px" v-model="deploy_unit_name"></el-input>
                      <el-button size="mini" type="text">
                          <i style="font-size:16px" class="el-icon-check" @click="addDeployUnit"></i>
                      </el-button>
                      <el-button size="mini" type="text" @click="buildAble = true">
                          <i style="font-size:16px;color: #306BFF" class="el-icon-close"></i>
                      </el-button>
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
        showDialog: {
            type: Boolean
        },
        config: {
            type: Object
        }
    },
    watch: {
        showDialog:{
            handler(newVal,oldVal) {
                this.dialogVisible = newVal
                if(newVal) {
                    this.getDeployUnitData()
                }
            }
        }
    },
    data() {
        return {
            form: {
                deployment_unit_id: "",
                app_id: this.$route.query.app_id,
                obj_type: "",
                obj_ids: []
            },
            deploy_unit_name:"",
            dialogVisible: false,
            confirmStatus: false,
            buildAble: true,
            deployment_unit_list:[],
            rules:{},
        }
    },
    methods: {
        //  取消提交
        cancel() {
            this.$emit("close")
        },
        //  点击提交
        async submitSetHost() {
            this.form.obj_type = this.config.obj_type
            this.form.obj_ids = this.config.obj_ids
            let res = await requestMethods.relationDeployUnit("post",this.form)
            if(res.code == 200) {
                this.form.deployment_unit_id = ""
                this.$message.success(res.message)
            } else {
                this.form.deployment_unit_id = ""
                this.$message.error(res.message)
            }
            this.$emit("close")
        },
        //  新建部署单元
        newBuild() {
            this.buildAble = false
        },
        //  获取部署单元列表
        async getDeployUnitData() {
            let res = await requestMethods.getDployUnitList("get",this.$route.query.app_id)
            if(res.code == 200) {
                this.deployment_unit_list = res.data
            }
        },
        //  添加部署单元
        async addDeployUnit() {
            let params = {
                app_id: this.$route.query.app_id,
                name: this.deploy_unit_name
            }
            let res = await requestMethods.newBuildDeployUnit("post",params)
            if(res.code == 200) {
                this.buildAble = true
                this.deploy_unit_name = ""
                this.$message.success(res.message)
                this.getDeployUnitData()
            } else {
                this.buildAble = true
                this.deploy_unit_name = ""
                this.$message.error(res.message)
            }
        }
    }
}
</script>
<style lang="less" scoped>

</style>

