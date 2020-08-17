<template>
    <section>
        <el-collapse style="padding:15px 20px;">
            <el-form label-width="10%" ref="form" :model="form" :rules="rules">
                <el-tabs v-model="activeName">
                    <el-tab-pane
                        v-for="(item,index) in collapseList"
                        :name="index+''"
                        :key="index+item.node_canvas_uuid"
                        :label="item.name">
                        <el-form-item>
                            <el-table
                                size="mini"
                                :data="item.volume"
                                style="width: 100%">
                                <el-table-column
                                  prop="data_store_name"
                                  label="存储池">
                                  <template slot-scope="scope">
                                      <span>{{scope.row.data_store_name.split(",")[0]}}</span>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                    v-for="(tableColItem,tableColIndex) in tableHeader"
                                    :key="tableColIndex"
                                    :prop="tableColItem.key"
                                    :label="tableColItem.label">
                                </el-table-column>
                                <el-table-column
                                    prop="operation"
                                    label="操作">
                                    <template slot-scope="scope">
                                        <i  class="el-icon-edit" @click="detailCloudDisk(scope.$index,scope.row,item)"></i>
                                        <i
                                            class="el-icon-delete"
                                            @click="deleteCloudDisk(scope.$index,scope.row.disk_name,item)">
                                        </i>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="createLine"></div>
                            <div class="createBox" @click="addCloudDisk(item)">
                                <i class="el-icon-plus"></i>添加
                            </div>
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-collapse>
        <attachCloudDisk
            ref="attachCloudDisk"
            :config="attachConfig"
            :isShow="isShow"
            @updataCloudDiskData="getAddDiskData"
            @closeDrawer="closeDrawer">
        </attachCloudDisk>
    </section>
</template>
<script>
import * as requestMethod from '@/modules/apps/api/serviceCatalog/openstack/vmware.js'
import { errorMessage } from '../../serviceCatalog/utils/message'
// import infoTag from "../formComponents/compontents/infoTag"
import attachCloudDisk from "./compontents/attachCloudDisk"
import { successMessage } from '../../../../../ops/pages/operationsCenter/warehouseManage/publicImage/utils/message'

export default {
    name:"quickApplyOpenstack",
    components: {
        // infoTag,
        attachCloudDisk
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
            isShow:false,
            activeName: "0",
            collapseList:[],
            props: {
                multiple: false,
                expandTrigger: 'hover',
            },
            form: {
                capacity_gb: 0,
                data_store_name: "",
                description: "",
                disk_name: "",
                disk_type_name: "",
                scsi_name: "",
            },
            isAllSave:false,
            ticket_obj_id: null,
            tableHeader:[
                {
                    key:    "disk_name",
                    label:  "云硬盘名称"
                },
                {
                    key:    "scsi_name",
                    label:  "SCSI号"
                },
                {
                    key:    "disk_type_name",
                    label:  "磁盘格式"
                },
                {
                    key:    "capacity_gb",
                    label:  "大小(GB)"
                },
                {
                    key:    "description",
                    label:  "备注"
                },
            ],
            rules:{},
            attachConfig:{}
        }
    },
    methods: {
        //关闭抽屉
        closeDrawer() {
          this.isShow = false
        },
        //保存数据
        holdData(item){
            return this.editData(item)
        },
        // 实时保存
        SaveOperationSet() {
            this.isAllSave=true
            return this.holdData()
            // this.$refs["networkCard"].SaveOperationSet();
        },
        //编辑逻辑表单
        async editData() {
            let params = {
                ticket_obj_id:this.ticket_obj_id,
                resize_cpu:this.form.vcpu,
                resize_memory:this.form.memory_gb,
                description:this.form.description
            }
            return await requestMethod.editVmChangSizeList("put",params).then(res=>{
                // successMessage(res.message,this)
                if(!(res.code === 200)) {
                    errorMessage(res.message,this)
                }
                return this.alertMess(res)
            })
        },
        //  添加云硬盘
        addCloudDisk(item) {
            if(!this.isEditable) {
                return
            }
            this.attachConfig = {}
            this.attachConfig.thetitle = "添加云硬盘"
            this.attachConfig.cloudServiceName = item.name
            this.attachConfig.thelengList = item.volume.length + 1
            this.attachConfig.pool_id = item.resource_pool_id
            this.attachConfig.ticket_obj_id = item.ticket_obj_id
            this.attachConfig.volume = item.volume
            this.isShow = true

            this.$nextTick(function() {
                this.$refs.attachCloudDisk.thedetail(null, item.volume, false, item.scsi_name_list);
            });
        },
        //查看附加云硬盘细节
        detailCloudDisk(index,obj,item) {
            if(!this.isEditable) {
                return
            }
            this.isShow = true;
            this.attachConfig = {}
            this.attachConfig.thetitle = "编辑云硬盘"
            this.attachConfig.ticket_obj_id = item.ticket_obj_id
            this.attachConfig.volume = item.volume
            this.attachConfig.volumeIndex = index
            this.attachConfig.pool_id = item.resource_pool_id

            this.$nextTick(function() {
                this.$refs.attachCloudDisk.thedetail(obj, item.volume, true, item.scsi_name_list);
            });
        },
        //删除附加云硬盘
        deleteCloudDisk(index,name,item) {
          if(!this.isEditable) {
              return
          }
          this.$confirm(`确定删除${name}吗？该操作不可恢复`, "提示", {
              type: "warning"
          }).then(async () => {
              item.volume.splice(index, 1);
              let params = {
                  ticket_obj_id:  item.ticket_obj_id,
                  volume: item.volume
              }
              let res = await requestMethod.editAddDiskList("put",params)
              if(!res.code == 200) {
                  this.$message.error(res.message)
              }
              this.getAddDiskData()
          }).catch(() => {});
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
                } else {
                }
            }
        },
         //获取附加云硬盘数据
        getAddDiskData(){
            requestMethod.getAddDiskList("get",this.canvasObj.app_id,this.canvasObj.ticket_id,this.canvasObj.service_uuid).then(res=>{
                if(res.code == 200) {
                    this.collapseList = res.data
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
        this.getAddDiskData()
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
.createBox {
    cursor: pointer;
    color: rgb(64, 158, 255);
    font-size: 12px;
    border: 1px dashed #ccc;
    text-align: center;
    height: 32px;
    line-height: 32px;
    margin-bottom: 10px;
    margin-top: 20px;
}
.createLine {
    height: 1px;
    background: #ccc;
    margin-top: 20px;
}
/deep/ .el-form-item__content {
    margin-right: 10%;
}
</style>
