<template>
    <div class="custom-list-dialog">
        <el-dialog title="自定义列表项" :visible.sync="customVisible"  @close="close">
            <template slot="title">
                <div class="dialog-title">自定义列表项</div>
            </template>
            <div class="custom-list-content">
                <div class="custom-list-header">
                    <i class="el-icon-warning icon-warm"></i>
                    <span>请选择您想显示的列表详细信息。</span>
                </div>
                <div class="custom-list-checkbox">
                    <el-checkbox-group v-model="checkList" @change="handleOnchange">
                        <el-checkbox
                            v-for="(item, index) in checkboxListOptions"
                            :key="index"
                            :label="item.label"
                            id="rbac_customList_checkbox"
                        >
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save" id="rbac_customList_submit">确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>
<script>
export default {
    props:{
        customListVisible:{
            type:Boolean
        },

        tableHeader:{
            type:Array
        }
    },
    data() {
        return {
            customVisible: this.customListVisible,
            changeData:[],
            checkboxListOptions:[
                {
                    'label': '用户组名',
                }, {
                    'label': '描述',
                }, {
                    'label': '创建时间',
                }
            ],
            checkList: ['用户组名'] //默认选中
        }
    },
    watch:{
        tableHeader:{
            handler(newVal){
               if(newVal.length > 0){
                   this.checkList = newVal.map(item=>item.label);
               }
            },
            immediate: true
        }
    },
    mounted(){

    },
    methods:{
        handleOnchange(val){
            this.changeData = val;
        },
        save() {
            this.$emit('close-custom-list',this.changeData);
        },
        close() {
            this.$emit("close-custom-list")
        }
    }
}
</script>

<style lang="less" scoped>
.custom-list-dialog {
    .dialog-title {
        position: relative;
        font-size: 18px;
        &:before {
        content: "";
        display: block;
        width: 4px;
        height: 20px;
        background-color: #20a0ff;
        position: absolute;
        bottom: 0px;
        left: -20px;
        }
    }

    .el-dialog__body{
        padding: 10px 20px;
    }

    .custom-list-content{
        .custom-list-header{
            line-height: 40px;
            color: #499DF2;
            background-color: rgba(245, 250, 255, 1);
            box-sizing: border-box;
            border-width: 1px;
            border-style: solid;
            border-color: rgba(51, 153, 255, 1);
            padding-left:20px;
        }

        .custom-list-checkbox{
            margin-top:10px;
            line-height:40px;
        }
    }



}
</style>
