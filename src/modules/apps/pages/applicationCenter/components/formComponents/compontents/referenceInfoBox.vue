<template>
    <div class="thedialog">
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="date" label="修改日期" width="180"></el-table-column>
            <el-table-column prop="jd" label="阶段" width="100"></el-table-column>
            <el-table-column prop="xgr" label="修改人" width="80"></el-table-column>
            <el-table-column label="当前值">
                <template>
                    <span>{{messDialog}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import * as requestMethodVMWARE from '@/modules/apps/api/serviceCatalog/openstack/vmware.js'
    export default {
        props:{
            theleft:{
                type:Number
            },
            messDialog:{
                type:null
            }
        },
        mounted() {   
        },
        data() {
            return {
                tableData:[{
                    date:'2018-20-11 12:00:12',
                    jd:'需求规划',
                    xgr:'admin',
                    dqz:'名称'
                }]
            }
        },
        watch:{
          
        },
        methods:{
        }
    }
</script>

<style lang="less" scoped>
 .thedialog{
     position: fixed;
     top:0px;
     left:0px;
     z-index:999;
     width:500px;
     height:100px;
     /deep/.el-table tr{
         height:45px
     }
     /deep/.el-table tr th {
         height:45px;
         padding:4px 0px
     }
 }
</style>
