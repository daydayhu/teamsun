<template>
    <div class="order-transfer">
        <el-dialog title="转单处理" 
            :before-close="cancel"
            :visible.sync="dialogVisible">
            <el-form :model="transfer_form" :rules="form_rules" ref="transfer_form">
                <el-form-item label="产品" :label-width="formLabelWidth">
                    <span>{{dataInfo.product}}</span>
                </el-form-item>
                <el-form-item label="操作" :label-width="formLabelWidth">
                    <span>{{dataInfo.opertation}}</span>
                </el-form-item>
                <el-form-item :label="flabel" :label-width="formLabelWidth" prop="deliver">
                    <el-select v-model="transfer_form.deliver" placeholder="请选择转单人">
                        <el-option
                            v-for="(item,index) in groupUserList"
                            :key="index"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel()">取 消</el-button>
                <el-button type="primary" @click="orderTransferSubmit('transfer_form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import * as requestMethod from '@/modules/apps/api/applicationCenter/applicationSystem.js';
    import productVue from './formComponents/product.vue';
    export default {
        name:'orderTransfer',
        props:{
            dialogFormVisible:{
                type:Boolean
            },
            dataInfo:{
                type:Object
            },
        },
        data() {
            return {
                dialogVisible: this.dialogFormVisible,
                transfer_form:{
                    product_name: null,
                    operation: null,
                    deliver: null,
                },
                formLabelWidth: '100px',
                product:'',
                operation:'',
                transfer_to:'',
                groupUserList:[],
                flabel:'',
                form_rules: {
                    deliver: [
                        { required: true, message: "请选择转单人！", trigger: "change" }
                    ],
                },
            };

        },
        created(){
            this.getUserList();
            this.flabel = this.dataInfo.trans_type === 1? '交付负责人':'复核人';
        },
        mounted(){
        },
        methods: {
            cancel(){
               this.$emit('childClose')
            },

            //转单提交操作
            orderTransferSubmit(form){
                this.$refs[form].validate(valid => {
                    if (valid) {
                        let params = this.dataInfo;
                        params.body.transfer_to = this.transfer_form.deliver
                        requestMethod.orderTransfer('put',params).then(res => {
                            if(res.code == 200){
                                this.$message.success(res.message); 
                                this.$emit('getServiceInstances')
                            }else {
                                this.$message.error(res.message);
                            }
                            this.$emit('childClose')
                        })
                    }else{
                        this.$message.warn('请选择转单人！');
                    }
                })
 
            },
            // 获取所属用户组下的所有用户
            getUserList(){
                let group_id = this.dataInfo.group_id
                requestMethod.getUserList('get',group_id).then(res => {
                    if(res.code == 200){
                        this.groupUserList = res.data.items[0].users
                    }else {
                        this.$message.error(res.message);
                    }
                })
            }
        },

    }; 
</script>
<style lang="less" scoped>
    .order-transfer {
        /deep/ .el-select{
                width: 316px;
        }

    }
</style>