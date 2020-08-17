<template>
  <el-drawer
    :title="config.thetitle"
    :visible.sync="isVisible"
    :append-to-body="false"
    :modal-append-to-body="false"
    :before-close="cancelFn"
    size="35%"
    direction="rtl">
    <div style='width:90%;margin:0 auto;'>
      <el-form
        ref="theform"
        :model="theform"
        :rules="ruleForm"
        :label-position="labelPosition">
        <el-form-item
            :label-width="formLabelWidth"
            class="ts-form-label ts-mt36"
            label="存储池" style="position:relative;"
            prop='data_store'>
            <el-select placeholder="请选择存储池" v-model="theform.data_store" @change="sourcePoolChange()">
                <el-option v-for="list in storageList" :key="list.id"
                    :label="list.name"
                    :value="list.id">
                </el-option>
            </el-select>
        </el-form-item>
        <div style="margin-left: 100px;margin-bottom: 15px;" v-if="tableData.length!=0">容量<span style="color:rgb(254,145,35)">{{tableData[0].sumSpace}}GB,</span>已置备<span style="color:rgb(254,145,35)">{{tableData[0].provisionSpace}}GB,</span>可用容量<span style="color:rgb(137,205,41)">{{tableData[0].freeSpace}}GB</span>,类型<span style="rgb(112,195,0)">{{tableData[0].dsType.value}}</span></div>
        <el-form-item
            :label-width="formLabelWidth"
            prop="disk_name"
            class="ts-form-label ts-mt36"
            label="云硬盘名称">
            <el-input v-model="theform.disk_name"></el-input>
        </el-form-item>
        <el-form-item
            :label-width="formLabelWidth"
            prop='scsi_name'
            class="ts-form-label ts-mt36"
            label="SCSI号">
            <el-select v-model="theform.scsi_name" placeholder="请选择SCSI号">
               <el-option
                    v-for="list in scsiArr"
                    :key="list.id"
                    :label="list.id"
                    :disabled="list.disabled"
                    :value="list.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item
            :label-width="formLabelWidth"
            prop="disk_type"
            class="ts-form-label ts-mt36"
            label="磁盘格式" >
            <el-select
                placeholder="请选择磁盘格式"
                v-model="theform.disk_type"
                @change="diskChange">
                <el-option
                    v-for="list in diskList"
                    :key="list.id"
                    :label="list.name"
                    :value="list.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item
            :label-width="formLabelWidth"
            prop="capacity_gb"
            class="ts-form-label ts-mt36"
            label="大小">
            <el-input v-model.number="theform.capacity_gb">
                <div class="unitBox" slot="append">
                    <span v-for="(list,index) in unitBox" :key='index' @click="choiceUnit(list)" :class="{ active: list==theform.disk_unit}">{{list}}</span>
                </div>
            </el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" class="ts-form-label ts-mt36" label="备注">
            <el-input v-model="theform.description" type="textarea"></el-input>
        </el-form-item>
      </el-form>

    </div>
    <div class="drawer_footer">
        <el-button type="primary" @click="onSubmit('theform')" :loading="submitLoading">{{ submitLoading ? '提交中 ...' : '确 定' }}</el-button>
        <el-button @click="cancelFn()">取 消</el-button>
    </div>
  </el-drawer>
</template>
<script>
import * as requestMethodVMWARE from '@/modules/apps/api/serviceCatalog/openstack/vmware.js'
    export default {
        props:{
            isShow:{
                type:Boolean
            },
            config:{
                type: Object
            }
        },
        watch: {
            isShow:{
                handler(newVal,oldVdal){
                    this.isVisible = newVal
                    this.getSourceData()
                    if(newVal && this.$refs.theform) {
                        this.$refs.theform.clearValidate()
                    }
                },
                deep:true,
                immediate:true
            },
            config:{
                deep:true,
                immediate:true,
                handler:function(newVal,oldVal) {

                },
            }
        },
        mounted() {

        },
        data() {
            return {
                unitBox:['GB','TB'],
                isSelect:false,
                isVisible: false,
                formLabelWidth: '100px',
                labelPosition: 'right',
                submitLoading: false,
                ruleForm:{
                  disk_name: [
                    { required: true, message: '请输入云硬盘名称', trigger: 'blur' },
                  ],
                  data_store: [
                     { required: true, message: '请选择存储池', trigger: 'change' }
                  ],
                  scsi_name: [
                     { required: true, message: '请选择SCSI号', trigger: 'change' }
                  ],
                  disk_type: [
                     { required: true, message: '请选择磁盘格式', trigger: 'change' }
                  ],
                  capacity_gb: [
                     { required: true, message: '请输入磁盘大小', trigger: 'blur' }
                  ],
                },
                theform: {
                  asc_order:0,
                  disk_name:'',
                  data_store:null,
                  data_store_name:"",
                  scsi_name:'',
                  is_boot:false,
                  disk_type:null,
                  disk_type_name:'',
                  capacity_gb:0,
                  disk_unit:'GB',
                  description:''
                },
                scsiArr:[],
                flag:false, //true 编辑  false  创建
                diskList:[{
                  id:'thin',
                  name:'Thin Provision'
                },{
                  id:"eagerZeroedThick",
                  name:'厚置备置零'
                },{
                  id:"preallocated",
                  name:'厚置备延迟置零'
                }],
                tableData:[],
                storageList:[]
            }
        },
        methods:{
            //磁盘格式改变
            diskChange(){
              this.diskList.forEach(item=>{
                  if(item.id === this.theform.disk_type) {
                      this.theform.disk_type_name = item.name
                  }
              })
            },
            //改变大小
            choiceUnit(list){
              this.theform.disk_unit=list;
            },
            //存储池改变
            sourcePoolChange(){
              this.storageList.forEach(item=>{
                  if(item.id === this.theform.data_store) {
                      this.theform.data_store_name = item.name
                  }
              })
              // requestMethodVMWARE.detailStoresPool(this.theform.data_store).then(res=>{
              //     if(res.code === 200) {
              //       let sj=res.data.data_store;
              //       this.tableData=[];
              //           let obj={
              //               cloudName:sj.cloud_controller.cloud_name,
              //               dataCenter:sj.data_center.dc_name,
              //               dsName:sj.ds_name,
              //               dsType:sj.ds_type,
              //               freeSpace:sj.free_space,
              //               sumSpace:sj.sum_space,
              //               provisionSpace:sj.provision_space
              //           }
              //       this.tableData.push(obj)
              //     }
              // })
            },
            //父组件调用接口,用于计算SCSI号
            thedetail(val,data,flag,selectedArr){
              if(val!=null){
                this.theform=val;
              }
              if(data.length==0 || (val!=null && val.scsi_name=="scsi(0:0)")){
                this.isSelect=true;
                this.theform.is_boot=true
              }else{
                this.isSelect=false
                this.theform.is_boot=false;
              }
              this.flag=flag;
              let arr=[];
              for(let z=0;z<data.length;z++){
                arr.push(data[z].scsi_name)
              }
              this.scsiArr=[];
              for(let i=0;i<=3;i++){
                for(let j=0;j<=15;j++){
                  if (j == 7) {
                    continue;
                  }
                  let id=`scsi(${i}:${j})`
                  let obj
                  if(arr.indexOf(id)>-1){
                    obj={id:`${id}`,
                    disabled: true}
                  }else{
                    obj={id:`${id}`}
                  }
                  this.scsiArr.push(obj)
                }
              }
              this.scsiArr.forEach(item=>{
                  if(selectedArr.indexOf(item.id) !== -1) {
                      item.disabled = true
                  }
              })
              if(this.theform.data_store){
                this.sourcePoolChange()
              }
              let that = this
              if(this.flag){
                  return
              }
              this.$nextTick(()=>{
                  this.theform.disk_name=`${that.config.cloudServiceName}__hard_disk${that.config.thelengList}`
              })
            },
            //提交
            onSubmit(formName){
              this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let params = {
                        ticket_obj_id:this.config.ticket_obj_id,
                        volume: this.config.volume
                    }
                    if(this.flag) {
                        params.volume.splice(this.config.volumeIndex,1,this.theform)
                    } else {
                        params.volume.push(this.theform)
                    }
                    let res = await requestMethodVMWARE.editAddDiskList("put",params)
                    if(res.code == 200) {
                        this.$emit('updataCloudDiskData');
                    } else {
                        this.$message.error(res.message)
                    }
                    this.isVisible = false
                    this.cancelFn()
                } else {
                    return false;
                }
              });
            },
            //取消
            cancelFn() {
                this.isVisible = false
                this.theform= {
                  asc_order:0,
                  disk_name:'',
                  data_store:null,
                  data_store_name:"",
                  scsi_name:'',
                  is_boot:false,
                  disk_type:null,
                  disk_type_name:'',
                  capacity_gb:0,
                  disk_unit:'GB',
                  description:''
                },
                this.$refs.theform.clearValidate()
                this.$emit("closeDrawer")
            },

            //获取存储资源池
            async getSourceData() {
                let params = {
                    pool_id: this.config.pool_id,
                    resource_type:  'data_store'
                };
                let res = await requestMethodVMWARE.getMirrorStoragePoolBySourceId(params)
                if( res.code == 200 ) {
                    this.storageList = []
                    res.data.items.forEach(item=>{
                        let name=`${item.name},容量${item.sum_space}GB,已置备${item.provision_space}GB,可用容量${item.free_space}GB,类型${item.ds_type.value}`;
                        let id=item.id;
                        let obj={name:name,id:id};
                        this.storageList.push(obj)
                    })
                } else {
                    this.$message.error(res.message)
                }
            }
        }
    }
</script>

<style lang="less" scoped>
  // 可公共form底部操作按钮
  .unitBox{
    height:30px;
    line-height: 30px;
    span{
      padding:2px;
      color:#999;
      font-size:12px;
      cursor:pointer
    }
    .active{
      color:#306bff;
      border:1px solid #306bff;
      border-radius: 3px;
    }
  }
  /deep/.el-input-group__append{
    background-color: none;
    color: #909399;
    display: table-cell;
    position: relative;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    border-left: 0px;
    padding: 0px 5px;
    width: 1px;
    white-space: nowrap;
  }
  /deep/.el-table th，/deep/.el-table tr{
    height:38px;
  }
</style>
