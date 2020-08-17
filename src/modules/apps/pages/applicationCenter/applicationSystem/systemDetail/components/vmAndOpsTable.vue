<template>
    <section class="ts-body-part">
        <el-table
            :data="dataList"
            @selection-change="handleSelectionChange">
             <el-table-column
                type="selection">
            </el-table-column>
            <el-table-column
                v-for="(item,index) in header"
                :key="index+item.key"
                :label="item.label"
                :prop="item.key"
                :filters="(item.filter ? filters[item.key]:null)"
                :filter-method="item.filter ? ((c,r)=>filterTableRow(c,r,item.key)):null">
                <template v-if="item.filter" slot="header">
                    <span>{{item.label}}</span>
                    <svg-icon  icon-class='g_app_detail_filter' style="margin-left:10px"></svg-icon>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                prop="operation">
                <template slot-scope="scope">
                  <el-button type="text" @click="setUserAccount(scope.row)">账号设置</el-button>
                  <el-button type="text" @click="setDeployUnit(scope.row)">部署单元设置</el-button>
                </template>
            </el-table-column>
        </el-table>
        <setAccount
            :dataType="dataType"
            :showDialog="showDialog"
            :config="setAccountConfig"
            @close="showDialog = false">
        </setAccount>
        <deployUnitSet
            :showDialog="showDeployUnitDialog"
            :config="deployUnitConfig"
            @close="showDeployUnitDialog = false">
        </deployUnitSet>
    </section>
</template>
<script>
import { vmAndOpsHeader } from "../../utils/utils"
import setAccount from "./setAccount"
import deployUnitSet from "./deployUnitSet"
import * as requestMethods from '@/modules/apps/api/applicationCenter/applicationSystem.js'
export default {
    props:{
        dataType: {
            type: String
        }
    },
    watch: {
        dataType: {
            handler( newVal, oldVal ) {
                switch (newVal) {
                  case "vm":
                      this.header = this.vmAndOpsHeader.vmHeader
                      this.getVmDataList()
                      break;
                  case "ops":
                      this.header = this.vmAndOpsHeader.opsHeader
                      this.getOpsDataList()
                      break;
                }
            },
            immediate: true,
            deep: true
        }
    },
    data() {
        return {
            vmAndOpsHeader,
            header:[],
            showDialog: false,
            showDeployUnitDialog: false,
            deployUnitConfig:{},
            setAccountConfig: {
                node_ids:[],
                vm_uuids:[]
            },
            dataList:[],
            filters:{
                "vm_name":[],
                "vm_os":[],
                "deployment_unit_name":[],
                "ironic_name":[],
                "os":[],
            }
        }
    },
    components: {
        setAccount,
        deployUnitSet
    },
    methods: {
        //  获取虚机表单
        async getVmDataList() {
            let res = await requestMethods.getDetailVmData("get",this.$route.query.app_id)
            this.handleRes(res)
        },
        //  获取裸机表单
        async getOpsDataList() {
            let res = await requestMethods.getDetailOpsData("get",this.$route.query.app_id)
            this.handleRes(res)
        },
        //  处理请求结果
        handleRes(res) {
            if(res.code == 200) {
                this.dataList = res.data.items
                let keys = Object.keys(this.filters)
                Array.isArray(this.dataList) && this.dataList.forEach(item => {
                    keys.forEach( keyItem => {
                        if( keyItem in item && this.judgeJsonValue(this.filters[keyItem],item[keyItem])) {
                            this.filters[keyItem].push({
                                text:item[keyItem],
                                value:item[keyItem]
                            })
                        }
                    })
                })
                console.log(this.filters)
            } else {
                this.$message.error(res.message);
            }
        },
        //  判断jsonz中是否存在某个值
        judgeJsonValue(json,value) {
            let status = true
            json.forEach(item=>{
                if(item.value == value) {
                    status = false
                }
            })
            return status
        },
        //  算则表格数据
        handleSelectionChange(selection) {
            // console.log("adasd",selection)
            let config = {}
            config.obj_ids = []
            config.node_ids = []
            config.vm_uuids = []
            selection.forEach(item=>{
                config.obj_ids.push(item.vm_id || item.node_id)
                config.obj_type = item.obj_type
                config.node_ids.push(item.node_id)
                config.vm_uuids.push(item.vm_uuid)
            })
            this.$emit("setConfig",config)
        },
        //  设置部署单元
        setDeployUnit(row) {
            this.showDeployUnitDialog = true
            let obj_ids = []
            obj_ids.push(row.vm_id || row.node_id)
            this.deployUnitConfig.obj_ids = obj_ids
            this.deployUnitConfig.obj_type = row.obj_type
        },
        //  设置账号
        setUserAccount(row) {
            this.showDialog = true
            this.setAccountConfig.node_ids = []
            this.setAccountConfig.vm_uuids = []
            this.setAccountConfig.node_ids.push(row.node_id)
            this.setAccountConfig.obj_type = row.obj_type
            this.setAccountConfig.vm_uuids.push(row.vm_uuid)
        },
        filterTableRow(value, row, key) {
            if(row[key] == value) {
                return true
            } else {
                return false
            }
        },
    },
}
</script>
<style lang="less" scoped>
 .ts-body-part {
     @ts-body-label-part();
    .ts-page-block {
      @ts-pagination-reset-base();
    }
    .el-table {
      // TODO: 下面样式自定义
      .item-cell {
        @flex();
        .icon-c {
          width: 16px;
          height: 16px;
          margin-right: 8px;
          & > img {
            width: 100%;
            height: 100%;
          }
        }
        .el-button {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
        }
      }
      /deep/ .el-table__column-filter-trigger i {
          display: none;
      }
    }
  }
</style>
