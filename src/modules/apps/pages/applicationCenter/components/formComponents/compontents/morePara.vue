<template>
 <el-dialog title="高级参数设置" :before-close="cancelFn" :visible.sync="isVisible" width="40%">
      <div class="content">
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item v-for="(item,index) in paraArr" :key="index" :name="index" :title="item.table_name">
                    <el-table ref="multipleTable" :data="item.para_infos" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" :selectable='selectable'></el-table-column>
                        <el-table-column prop="pro_para_name" label="参数名"></el-table-column>
                        <el-table-column prop="pro_default_value" label="默认值"></el-table-column>
                    </el-table>
            </el-collapse-item>
        </el-collapse>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn()">取 消</el-button>
        <el-button type="primary" @click="toSure">确 定</el-button>
      </span>
 </el-dialog>
</template>
<script>
import * as requestMethod from '@/modules/apps/api/serviceCatalog/openstack/actionSet.js'
    export default {
        props: {
            isShow: {
                type: Boolean
            },
            nodeSetUUid: {
                type: Number
            }
        },
        data() {
            return {
                activeNames: [],
                isVisible:this.isShow,
                paraArr:[],
                choiceObj:{

                },
                theindex:0
            }
        },
        watch:{
          
        },
        mounted(){
            this.getMoreParasList(this.nodeSetUUid)
        },
        methods:{ 
            selectable(row,index){
                return row.is_selected === 0?  true : false;  
            },
            getMoreParasList(node_set_uuid) {
                requestMethod.requireMoreParasList(node_set_uuid).then(res => {
                    if (res.code === 200) {
                        this.paraArr=res.data.table;
                        this.choiceObj=JSON.parse(JSON.stringify(res.data.table))
                        /* for(var i =0;i<this.paraArr.length;i++){
                            this.paraArr[i].multipleSelection=[];
                            for(var j=0;j<this.paraArr[i].para_infos.length;j++){
                                this.paraArr[i].para_infos[j]
                                if(this.paraArr[i].para_infos[j].is_selected==1){
                                    this.paraArr[i].multipleSelection.push(this.paraArr[i].para_infos[j])
                                }
                            } 
                        } */
                    }
                });
            },
            handleSelectionChange(val) {
                this.choiceObj[this.theindex].para_infos = [];
                val.map(item => {
                    var obj={
                        set_key_id: item.set_key_id,
                        //pro_para_key: item.para_key,
                        //pro_para_name: item.para_name,
                       // pro_default_value: item.default_value,
                        //asc_order: item.asc_order,
                        //value: item.value,
                        is_selected: 1
                    }
                    this.choiceObj[this.theindex].para_infos.push(obj);
                });
                console.log(this.choiceObj)
            },
            cancelFn() {
              this.$emit('closeDialog');
            },
            handleChange(val) {
             if(val.length>0){
                this.theindex=val[val.length-1]
             }else{
                this.theindex=0
             }
            },
            toSure(){
                this.isVisible = false;
                this.$emit('seniorPara',this.choiceObj);
            }
        }
    }
</script>

<style lang="less" scoped>
.content{
    height:500px;
    overflow:auto;
    position: relative;
    /deep/ .el-collapse-item__arrow {
        position: absolute;
        left: 12px;
    }   
}

</style>
