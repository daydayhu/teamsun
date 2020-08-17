<template>
  <el-drawer
    :title="thetitle"
    :visible.sync="isVisible"
    :append-to-body="false"
    :modal-append-to-body="false"
    :before-close="cancelFn"
    size="35%"
    direction="rtl"
    custom-class="add-user-drawer"
    ref="drawer"
  >
    <div style='width:90%;margin:0 auto;'>
      <el-form
        ref="theform"
        :model="theform"
        :rules="ruleForm"
        :label-position="labelPosition">
        <el-form-item :label-width="formLabelWidth" class="ts-form-label ts-mt36" label="存储池" style="position:relative;" prop='data_store'>
            <el-select placeholder="请选择存储池" v-model="theform.data_store" @change="sourcePoolChange()">
                  <el-option style="font-size:12px" v-for="list in poolList" :key="list.id"
                    :label="list.name"
                    :value="list.id">
                  </el-option>
            </el-select>
        </el-form-item>
        <!-- <el-table :data="tableData" style="width: 100%;margin-bottom:15px">
          <el-table-column prop="cloudName" label="云控制器" show-overflow-tooltip>
            <template slot-scope="scope">
              <img src="@/commons/images/vSphere.png" class="user-icon" style="width:16px;vertical-align: sub;"/>
              {{ scope.row.cloudName }}
            </template>
          </el-table-column>
           <el-table-column prop="dataCenter" label="数据中心">
            <template slot-scope="scope">
              <svg-icon icon-class='datacenter' class='iconCss'></svg-icon>
              {{scope.row.dataCenter}}
            </template>
          </el-table-column>
          <el-table-column prop="dsName" show-overflow-tooltip label="存储池"></el-table-column>
          <el-table-column prop="dsType" label="存储类型">
                    <template slot-scope="scope">
                        <svg-icon v-if="scope.row.dsType.type==0" icon-class='ts-vm-share'></svg-icon>
                        <svg-icon v-else icon-class='ts-vm-local'></svg-icon>
                        <span style="margin-left: 4px">{{ scope.row.dsType.value}}</span>
                    </template>
                </el-table-column>
          <el-table-column prop="freeSpace" label="容量"></el-table-column>
          <el-table-column prop="sumSpace" label="可用容量"></el-table-column>
        </el-table> -->
        <!-- <div style="margin-left: 100px;margin-bottom: 15px;" v-if="tableData.length!=0">容量<span style="color:rgb(254,145,35)">{{tableData[0].sumSpace}}GB,</span>已置备<span style="color:rgb(254,145,35)">{{tableData[0].provisionSpace}}GB,</span>可用容量<span style="color:rgb(137,205,41)">{{tableData[0].freeSpace}}GB</span>,类型<span style="rgb(112,195,0)">{{tableData[0].dsType.value}}</span></div> -->
        <el-form-item :label-width="formLabelWidth"
        prop="disk_name" class="ts-form-label ts-mt36" label="云硬盘名称">
            <el-input v-model="theform.disk_name"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth"
        prop='scsi_name' class="ts-form-label ts-mt36" label="SCSI号">
            <el-select v-model="theform.scsi_name" :disabled='isSelect' placeholder="请选择SCSI号">
               <el-option
                    v-for="list in scsiArr"
                    :key="list.id"
                    :label="list.id"
                    :disabled="list.disabled"
                    :value="list.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="disk_type" class="ts-form-label ts-mt36" label="磁盘格式" >
            <el-select
                    placeholder="请选择磁盘格式"
                    v-model="theform.disk_type"
                    @change="diskChange"
                  >
                  <el-option
                    v-for="list in diskList"
                    :key="list.id"
                    :label="list.name"
                    :value="list.id">
                  </el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth"  prop="capacity_gb" class="ts-form-label ts-mt36" label="大小">
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
            isShow: {
              type: Boolean
            },
            thetitle:{
              type:String
            },
            cloudServiceName:{
              type:String
            },
            thelengList:{
              type:Number
            },
            storageList:{
              type:Array
            },
            merrSize:{
              type:null
            }
        },
        created() {

        },
        data() {
            return {
                unitBox:['GB','TB'],
                isSelect:false,
                isVisible: this.isShow,
                formLabelWidth: '100px',
                labelPosition: 'right',
                submitLoading: false,
                poolList:[],
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
                  /* data_store:12,
                  data_store_name:"12", */
                  scsi_name:'',
                  is_boot:false,
                  disk_type:null,
                  disk_type_name:'',
                  capacity_gb:0,
                  disk_unit:'GB',
                  description:''
                },
                scsiArr:[],
                flag:false,
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
                tableData:[]
            }
        },
        watch:{

        },
        mounted(){
          this.poolList=[];
          this.storageList.forEach(item=>{
            var name=`${item.name},容量${item.sum_space}GB,已置备${item.provision_space}GB,可用容量${item.free_space}GB,类型${item.ds_type.value}`;
            var id=item.id;
            var obj={name:name,id:id};
            this.poolList.push(obj)
          })
          this.theform.disk_name=`${this.cloudServiceName}__hard_disk${this.thelengList}`
        },
        methods:{
          diskChange(){
            this.diskList.forEach(item=>{
                if(item.id === this.theform.disk_type) {
                    this.theform.disk_type_name = item.name
                }
            })
          },
          choiceUnit(list){
            this.theform.disk_unit=list;
          },
          sourcePoolChange(){
            this.storageList.forEach(item=>{
                if(item.id === this.theform.data_store) {
                    this.theform.data_store_name = item.name
                }
            })
            /* requestMethodVMWARE.detailStoresPool(this.theform.data_store).then(res=>{
                if(res.code === 200) {
                  var sj=res.data.data_store;
                  this.tableData=[];
                   var obj={
                     cloudName:sj.cloud_controller.cloud_name,
                     dataCenter:sj.data_center.dc_name,
                     dsName:sj.ds_name,
                     dsType:sj.ds_type,
                     freeSpace:sj.free_space,
                     sumSpace:sj.sum_space,
                    provisionSpace:sj.provision_space
                   }
                   this.tableData.push(obj)
                }
            }) */
          },
          thedetail(val,data,flag){
            if(val!=null){
              this.theform=val;
            }
            if(data.length==0 || (val!=null && val.scsi_name=="scsi(0:0)")){
              this.theform.scsi_name="scsi(0:0)";
              this.isSelect=true;
              this.theform.is_boot=true
            }else{
              this.isSelect=false
              this.theform.is_boot=false;
            }
            this.flag=flag;
            var arr=[];
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
                if(arr.indexOf(id)>-1){
                  var obj={id:`${id}`,
                  disabled: true}
                }else{
                  var obj={id:`${id}`}
                }
                this.scsiArr.push(obj)
              }
            }
            if(this.theform.data_store){
              this.sourcePoolChange()
            }

          },
          onSubmit(formName){
            if(this.thelengList==1&&this.merrSize){
              if(this.theform.disk_unit=='TB'){
                if(parseFloat(this.merrSize) >= parseFloat(this.theform.capacity_gb)*1000){
                    this.$notify.warning({
                      title: '警告',
                      message: `系统盘不能小于镜像的大小`,
                      position: 'bottom-right',
                      duration:3000
                    });
                    return
                }
              }else{
                if(parseFloat(this.merrSize) >=parseFloat(this.theform.capacity_gb)){
                  this.$notify.warning({
                      title: '警告',
                      message: `系统盘不能小于镜像的大小`,
                      position: 'bottom-right',
                    duration:3000
                });
                return
              }
            }
            }
            this.$refs[formName].validate((valid) => {
              if (valid) {
                //if(this.flag==false){
                 this.$emit('addCloudDiskData',this.theform);
                //}
                this.$emit('closeDialog');
              } else {
                return false;
              }
            });
          },
          cancelFn() {
              this.$emit('closeDialog');
              /* this.theform={
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
              }; */
              this.editId=''
          },

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
