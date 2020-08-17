<template>
  <div class="content">
    <el-collapse v-model="activeNames" style="padding:15px 20px;">
      <el-form
        :model="theForm"
        :rules="rules"
        ref="theForm"
        label-width="30%"
        class="demo-ruleForm"
      >
        <el-collapse-item name="1" v-if="(baseInfo.indexOf(phaseState)>-1)">
          <template slot="title">
            <div class="formTit">
              基本信息
              <div class="line"></div>
            </div>
          </template>
          <div class="formBody">
            <el-form-item label="虚拟机前缀" prop="prefix_name">
              <el-input
                placeholder="请输入内容"
                style="width:440px" 
                v-model="theForm.prefix_name"
                clearable
                @change="keepInRealTime"
              ></el-input>
            </el-form-item>
            <el-form-item label="虚拟机台数" prop="vmware_num">
              <el-input
                placeholder="请输入内容"
                style="width:440px" 
                v-model="theForm.vmware_num"
                @change="keepInRealTime"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="用途说明">
              <el-input
                placeholder="请输入内容"
                @change="keepInRealTime"
                style="width:440px" 
                v-model="theForm.description"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="操作系统及版本"  prop="os_version">

                  <div style="width:440px">
                        <el-col :span="11">
              <el-select 
                placeholder="请选择操作系统"
                v-model="osVersion"
                 @change="selectOsVersion">
                <el-option
                  v-for="item in osList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
           </el-col>
                <el-col :span="1" style="text-align: center;">
                  <span>-</span>
                </el-col>
                <el-col :span="11">
            <el-select v-model="osVersionNumber" 
            placeholder="版本" @change="changeVersionNumber">
              <el-option
                v-for="item in os_version_list"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          </div> 
            </el-form-item>
            <el-form-item label="资源池" prop="resource_pool_id">
              <el-select
                placeholder="请选择资源池"
                v-model="theForm.resource_pool_id"
                @change="sourcePoolChange"
                style="width:440px" 
              >
                <el-option
                  v-for="list in soucepoolList"
                  :key="list.pool_id"
                  :label="list.pool_name"
                  :value="list.pool_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="vCPU数量">
              <el-input-number
                :min="1"
                v-model="theForm.vcpu"
                @change="keepInRealTime"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="内存（GB)">
              <el-input-number
                :min="1"
                v-model="theForm.memory_gb"
                @change="keepInRealTime"
              ></el-input-number>
            </el-form-item>
            <div class="tableCon">
              <div class="thetit">
                <span>*</span>存储（GB）
              </div>
              <div class="inbox formBodyC">
                <table>
                  <thead>
                    <tr>
                      <th>系统盘空间</th>
                      <th>数据存储空间</th>
                      <th>备份存储空间</th>
                      <th>应用存储空间</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div class="inputBox">
                          <input
                            type="text"
                            v-model.number="inputOne"
                            @change="keepInRealTime"
                          />
                        </div>
                      </td>
                      <td>
                        <div class="inputBox">
                          <input
                            type="text"
                            v-model.number="inputTwo"
                            @change="keepInRealTime"
                          />
                        </div>
                      </td>
                      <td>
                        <div class="inputBox">
                          <input
                            type="text"
                            v-model.number="inputThree"
                            @change="keepInRealTime"
                          />
                        </div>
                      </td>
                      <td>
                        <div class="inputBox">
                          <input
                            type="text"
                            v-model.number="inputFour"
                            @change="keepInRealTime"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item name="2" v-if="(netInfo.indexOf(phaseState)>-1)">
          <template slot="title">
            <div class="formTit">
              网络信息
              <div class="line"></div>
            </div>
          </template>
          <div class="formBody theBorder">
            <el-form-item label="虚拟机名称">
              <el-input
                placeholder="请输入内容"
                style="width:440px" 
                v-model="theForm.name"
                clearable
                @change="keepInRealTime"
              ></el-input>
            </el-form-item>
            <el-form-item label="OS主机名(hostname)">
              <el-input
                placeholder="请输入内容"
                style="width:440px" 
                v-model="theForm.hostname"
                @change="keepInRealTime"
                clearable
              ></el-input>
            </el-form-item>
            <networkCard ref="networkCard" :phaseState='phaseState' :canvasObj='canvasObj' :pool_id="Number(theForm.resource_pool_id)"></networkCard>
          </div>
        </el-collapse-item>
        <el-collapse-item name="3" v-if="(deployTarget.indexOf(phaseState)>-1)">
          <template slot="title">
            <div class="formTit">
              部署目标
              <div class="line"></div>
            </div>
          </template>
          <div class="formBody">
            <el-form-item label="宿主机" prop="host_id">
              <el-select
                placeholder="请选择宿主机"
                style="width:440px" 
                v-model="theForm.host_id"
                @change="changeHostId"
              >
                <el-option
                  v-for="list in hostList"
                  :key="list.id"
                  :label="list.name"
                  :value="list.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="虚拟机目录" prop="vm_folder_name" style="position:relative">
              <div v-clickoutside="handleClose" style="width:440px">
                  <el-input  @focus="isBox=true"
                      v-model="theForm.vm_folder_name"
                      style="width:440px" 
                  ></el-input>
                  <div v-if="isBox" class="downTree" >
                    <el-tree :data="VDlist" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                  </div>
              </div>
            </el-form-item>
            <el-form-item label="镜像" prop="image_id">
            <div style="width:440px">
                 <el-col :span="11">
                  <el-select
                    placeholder="请选择镜像类型"
                    v-model="theForm.image_type"
                    style="width:100%"
                    @change="selectImageType"
                  >
                    <el-option
                      v-for="image in imageTypeList"
                      :label="image.label"
                      :value="image.value"
                      :key="image.value"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="1" style="text-align: center;">
                  <span>-</span>
                </el-col>
                <el-col :span="11">
                  <el-select
                    placeholder="请选择镜像"
                    v-model="theForm.image_id"
                    style="width:100%"
                    @change="selectImageID"
                  >
                    <el-option
                      v-for="(image) in imageList"
                      :label="image.image_name"
                      :value="image.image_id"
                      :key="image.image_id"
                    ></el-option>
                  </el-select>
                </el-col>
             </div> 
            </el-form-item>
            <el-form-item label="镜像目标存储" prop="image_data_store" v-if="theForm.image_type=='public'">
              <el-select
                placeholder="请选择资源池下的存储"
                v-model="theForm.image_data_store"
                style="width:440px" 
                @change="keepInRealTime"
              >
                <el-option
                  v-for="list in mirrorStorageList"
                  :key="list.id"
                  :label="list.name"
                  :value="list.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="CPU插槽数">
              <el-input-number
                :min="1"
                v-model="theForm.cpu_cores"
                @change="keepInRealTime"
              ></el-input-number>
            </el-form-item>
            <div class="tableCon">
              <div class="thetit">
                <span>*</span>云硬盘
              </div>
              <div class="inbox formBodyC">
                <table>
                  <thead>
                    <tr>
                      <th>排序</th>
                      <th>云硬盘名称</th>
                      <th>存储池</th>
                      <th>SCSI号</th>
                      <th>磁盘格式</th>
                      <th>大小</th>
                      <th>备注</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody style="border-bottom:1px solid rgba(25, 34, 59, 0.03);">
                    <tr v-for="(list,index) in thedata" :key="index">
                      <td>
                        <div class="inputBoxYp" style="font-size:16px;position:relative;">
                          <i
                            class="el-icon-sort-down"
                            style="color:#409eff;cursor:pointer"
                            @click="alterItem(index,index+1)"
                            v-if="theleng!=index && index!=0"
                          ></i>
                          <i
                            class="el-icon-sort-down"
                            style="color:#ccc;cursor:not-allowed"
                            v-if="theleng==index||index==0"
                          ></i>
                          <i
                            class="el-icon-sort-up"
                            style="color:#409eff;cursor:pointer"
                            @click="alterItem(index,index-1)"
                            v-if="index!=0 && index!=1"
                          ></i>
                          <i
                            class="el-icon-sort-up"
                            style="color:#ccc;cursor:not-allowed"
                            v-if="index==0||index==1"
                          ></i>
                          <el-tooltip class="item" effect="dark" content="系统盘" placement="top">
                            <i
                              style="position: absolute;right: 3px;top: 8px;color: #306fbb;"
                              v-if="list.is_boot==1"
                              class="el-icon-s-flag"
                            ></i>
                          </el-tooltip>
                        </div>
                      </td>
                      <td>
                        <div class="inputBoxYp">{{list.disk_name}}</div>
                      </td>
                      <td>
                        <div class="inputBoxYp">{{list.data_store_name}}</div>
                      </td>
                      <td>
                        <div class="inputBoxYp">{{list.scsi_name}}</div>
                      </td>
                      <td>
                        <div class="inputBoxYp">{{list.disk_type_name}}</div>
                      </td>
                      <td>
                        <div class="inputBoxYp">{{list.capacity_gb}}{{list.disk_unit}}</div>
                      </td>
                      <td>
                        <div class="inputBoxYp">{{list.description}}</div>
                      </td>
                      <td> 
                        <div class="inputBoxYp" style="color:#409eff;font-size:16px;cursor:pointer">
                          <i class="el-icon-edit" @click="detailCloudDisk(list)"></i>
                          <i
                            class="el-icon-delete"
                            @click="deleteCloudDisk(index,list.disk_name)"
                            v-if="index!=0"
                          ></i>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="createLine"></div>
            <div @click="creatFom" class="createBox">
              <i class="el-icon-plus"></i>添加
            </div>
          </div>
        </el-collapse-item>
      </el-form>
    </el-collapse>
    <addCloudDisk
      ref="addCloud"
      v-if="isShow"
      :thetitle="thetitle"
      :is-show="isShow"
      @closeDialog="closeDialog"
      @addCloudDiskData="addCloudDiskData"
      :storageList="mirrorStorageList"
      :cloudServiceName="theForm.name"
      :thelengList='thelengList'
    ></addCloudDisk>
  </div>
</template>
<script>
import { clickoutside } from '@/directive/clickoutside.js'
import networkCard from "./compontents/networkCard.vue";
import addCloudDisk from "../formComponents/compontents/addCloudDisk";
import * as requestMethodVMWARE from "@/modules/apps/api/serviceCatalog/openstack/vmware.js";
export default {
  name: "vmware",
  props: {
    phaseState: {
      type: String
    },
    canvasObj:{
      type:Object
    },
    isEditData:{
      type:Object
    },
  },
  data() {
    return {
      baseInfo:[],
      netInfo:[],
      deployTarget:[],
      isBox:false,
      os_version_list:[],
      defaultProps: {
          children: 'children',
          label: 'folder_name'
      },
      theProps:{
        value:'vmfolder_id',
        label:'folder_name',
        children:'children'
      },
      thelengList:0,
      isToEdit:false,
      ip: "",
      natIp: "",
      inputOne: "",
      inputTwo: "",
      inputThree: "",
      inputFour: "",
      thedata: [],
      theleng: -1, //thedata.length-1
      activeNames: ["1", "2", "3"],
      thetitle: "附加云硬盘",
      isShow: false,
      osList: [],
      soucepoolList: [],
      hostList: [],
      imageTypeList: [
        { label: "公共镜像", value: "public" },
        {
          label: "私有镜像",
          value: "private"
        },{label: '共享镜像', value: 'share'}, 
      ],
      imageList: [],
      VDlist:[],
      mirrorStorageList:[],
      os: "",
      osVersionNumber:'',//操作系统版本号 
      osVersion:'',
      theForm: {
        vmware_id:null,
        prefix_name:'', //前缀
        vmware_num:1,
        node_canvas_uuid:null,//画布节点ID
        name: "",
        hostname: "",
        description: "",
        os_version: "",
        resource_pool_id: null,
        resource_pool_description: "", //资源池配值说明
        vcpu: 1,
        memory_gb: 1,
        image_data_store:null,
        storage_gb: [],
        cluster_id: null, //集群ID
        cluster_name: "xxx", //集群名称
        image_type: "", //镜像类型 public（公共）private（私有）shared（共享）
        image_uuid: "xx", 
        image_id: null,
        flavor_id: null, //后期去掉
        flavor_uuid: "", //后期去掉
        host_uuid: "", //后期去掉
        host_id: null,
        vm_folder_id: null,
        vm_folder_uuid: "45674567", //后期去掉
        vm_folder_name: "", //后期去掉
        cpu_cores: 2,
        volume: [], //云硬盘数据
        businessId:'',//业务组ID
      },
      rules: {
        prefix_name: [
          { required: true, message: "请输入虚拟机前缀", trigger: "blur" }
        ],
        vmware_num:[
          { required: true, message: "请输入虚拟机台数", trigger: "blur" }
        ],
        hostname: [
          {
            required: true,
            message: "请输入OS主机名(hostname)",
            trigger: "blur"
          }
        ],
        image_id:[
          { required: true, message: "请选择镜像", trigger: "change" }
        ],
        image_data_store: [
          { required: true, message: "请选择镜像目标下的储存", trigger: "change" }
        ],
        os_version: [
          { required: true, message: "请选择操作系统及版本号", trigger: "change" }
        ],
        resource_pool_id: [
          { required: true, message: "请选择资源池", trigger: "change" }
        ],
        host_id: [
          { required: true, message: "请选择宿主机", trigger: "change" }
        ],
        vm_folder_id: [
          { required: true, message: "请选择虚拟机目录", trigger: "change" }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      },
      menuArr:[],
      isAllSave:false  
    };
  },
  mounted() {
    //双保险
    if (typeof this.isEditData != 'object') {
           var thedata=JSON.parse(this.isEditData)
    }else{
      var thedata=this.isEditData
    }
    if(JSON.stringify(thedata) == "{}"){
      thedata.base_info=[1,3,5];
      thedata.net_info=[3,5];
      //thedata.capacity_info=[1,3,5];
      thedata.deploy_target=[3,5];
    }
    this.baseInfo=thedata.base_info.map(String);
    this.netInfo=thedata.net_info.map(String)
    this.deployTarget=thedata.deploy_target.map(String);

    this.theForm.node_canvas_uuid=this.canvasObj.service_uuid
    //this.businessId=this.$route.query.bus_id;
    this.businessId=this.canvasObj.bus_id;
    //this.toDetailVmwareTicket("5495B661-4100-446F-BE03-CD94B6442FB1");
    this.toDetailVmwareTicket(this.canvasObj.service_uuid)
    this.theleng = this.thedata.length - 1; 
    
  },
  watch: {
  },
  directives: {clickoutside},
  methods: {
    handleClose(e) {
     this.isBox=false;
    },
    changeHostId(){
      this.theForm.vm_folder_id=null;
      this.theForm.vm_folder_name='';
      this.theForm.image_type='';
      this.theForm.image_id=null;
      this.VDlist=[];
      this.imageList=[];
      this.requireListOfVirtualDirectory(this.theForm.host_id);
      this.requireImgListByHostId(this.osVersionNumber,this.osVersion,this.theForm.host_id,this.theForm.image_type);
      this.keepInRealTime();
    },
    selectImageType() {
      this.theForm.image_id=null;
      this.imageList=[];
       if(this.theForm.image_type=='private' || this.theForm.image_type=='share'){
          this.theForm.image_data_store=null;
          this.requireImgListByHostId(this.osVersionNumber,this.osVersion,this.theForm.host_id,this.theForm.image_type);
       }else if(this.theForm.image_type=='public'){
         this.getPublicImage();
       }
    },
   selectImageID() {
      this.keepInRealTime();
    },
    
    requireImgListByHostId(osVersionNumber,osVersion,hostId,isShare){  //isShare(private/share)
      if(osVersionNumber&&osVersion&&hostId&&isShare){
        var params={
         host_id:hostId,
         is_share:isShare,
         os:osVersion,
         os_version:osVersionNumber
      }
      requestMethodVMWARE.getImgListByHostId(params).then(res => {
        if(res.code==200){
          this.imageList=res.data.items
        }
      });
      }
    },
    getPublicImage() { //获取公共镜像 
        if(this.osVersion){
          this.imageList=[]
          requestMethodVMWARE.getPublicImageList(this.osVersion).then(res=>{
                if(res.code === 200) {
                    res.data.forEach( (item,index) => {
                        item.image_id = item.image_file_id;
                        item.image_name = item.name
                        this.imageList.push({
                            image_id:item.image_id,
                            image_name:item.name,
                            index:index,
                        })
                    })
                } 
            })
        } 
    },
    handleNodeClick(data) {
      this.theForm.vm_folder_id=data.folder_id;
      this.theForm.vm_folder_name=data.folder_name;
      this.isBox=false
      this.keepInRealTime()
    },
    spread(menus) {
      for (var i=0; i < menus.length; i++ ) {
                let menu = menus[i]
                if (menu.children) {
                    this.spread(menu.children)
                    delete menu.children
                }
                this.menuArr.push(menu)
      }
    },
    changeVD(val){
      var len=val.length;
      for(var i =0;i<this.menuArr.length;i++){
        if(this.menuArr[i].vmfolder_id==val[len-1]){
          this.theForm.vm_folder_name=this.menuArr[i].folder_name
        }
      }
      this.keepInRealTime()
    },
    forComponentContent() {
      return this.submitForm("theForm");
    },
    submitForm(formName) {
      var obj = { flag: true, mess: "带*号的为必填项" };
      if(this.$refs["networkCard"]!=undefined){
        var  netObj = this.$refs["networkCard"].forComponentContent();
        if(!netObj.flag) {
            obj.mess=netObj.mess;
            return obj
        }
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          obj.flag = true;
        } else {
          obj.flag = false;
        }
      });
      return obj;
    },
    SaveOperationSet(){
      this.isAllSave=true
      return this.keepInRealTime()
    },
    keepInRealTime(){
      if(this.isToEdit==true){ //编辑
        return this.toEditVmwareTicket();
      }else{                   //创建
        return this.toaddVmwareTicket();
      }
    },
    async toaddVmwareTicket(){
      this.theForm.volume = this.thedata.concat();
      this.theForm.storage_gb = [
        this.inputOne,
        this.inputTwo,
        this.inputThree,
        this.inputFour
      ];
      var params = Object.assign({}, this.theForm);
      params.vmware_id = null;
      //params.app_id='40';
      //params.ticket_id='45';
      params.app_id=this.canvasObj.app_id;
      params.ticket_id=this.canvasObj.ticket_id;
      return await requestMethodVMWARE.addVmwareTicket(params).then(res => {
        this.isToEdit=true;   //因为实时保存的缘故，初始进来单字段保存之后都为编辑操作
        return this.alertMess(res)
      });
    },
    alertMess(res){
      var sj={
        flag:true,
        mess:""
      }
        if(this.isAllSave===true){
            if(res.code == 200) {
              sj.flag=true;
              sj.mess=res.message
            }else{
              sj.flag=false;
              sj.mess=res.message
            }
            this.isAllSave=false;
            return sj
        }else{
          /* if (res.code == 200) {
          this.$notify.success({
            title: '成功',
            message: `${res.message}`,
            position: 'bottom-right',
            duration:3000
          });
          } else {
          this.$notify.error({
            title: '成功',
            message: `${res.message}`,
            position: 'bottom-right',
            duration:3000
          });
          } */
          if (res.code!= 200) {
          this.$notify.error({
            title: '失败',
            message: `${res.message}`,
            position: 'bottom-right',
            duration:3000
          });
          }
        }
    },
    async toEditVmwareTicket() {
      this.theForm.volume = this.thedata.concat();
      this.theForm.storage_gb = [
        this.inputOne,
        this.inputTwo,
        this.inputThree,
        this.inputFour
      ];
      var params = Object.assign({}, this.theForm);
      //params.vmware_id = null;
      //params.app_id='40';
      //params.ticket_id='35';
      params.app_id=this.canvasObj.app_id;
      params.ticket_id=this.canvasObj.ticket_id;
      params.vmware_id = null;
      return await requestMethodVMWARE.editVmwareTicket(params).then(res => {
        return this.alertMess(res)
      });
    },
    getValues(key,list){
       for (var i = 0; i < list.length; i++) {
           if (list[i].value == key) {
               this.values.push(list[i].value);
               return true;
           }else{
               if (list[i].children && list[i].children.length > 0) {
                   if (this.getValues(key,list[i].children)) {
                       this.values.push(list[i].value);
                       return true;
                   }
               }
           }
       }
       return false;
   },
    toDetailVmwareTicket(id) {
      var obj = { node_canvas_uuid: id };
      requestMethodVMWARE.deatilVmwareTicket(obj).then(res => {
        if(res.data.is_created==true){   //已创建（编辑）
          this.theForm = res.data;
          this.isToEdit=true;
          this.thedata = res.data.volume.concat();
          let arr = JSON.parse(res.data.storage_gb);
          this.inputOne = arr[0];
          this.inputTwo = arr[1];
          this.inputThree = arr[2];
          this.inputFour = arr[3];
          var versionData=this.theForm.os_version.split("-");
          this.osVersionNumber=versionData[1];
          this.osVersion=versionData[0];
          this.requireImgListByHostId(this.osVersionNumber,this.osVersion,this.theForm.host_id,this.theForm.image_type);
        }else{  //未创建（新增）
          this.isToEdit=false;
        }
        this.requireOsList();
        this.requireSourcePoolList(this.businessId);
        
        if(this.theForm.resource_pool_id!=''){
          this.requireListOfHost(this.theForm.resource_pool_id);
          this.reqiureListOfMirrorStoreagePool(this.theForm.resource_pool_id)
        }
        if(this.theForm.host_id!=''){
          this.requireListOfVirtualDirectory(this.theForm.host_id);
        }
        
      });
    },
    toDeleteVmwareTicket() {
      requestMethodVMWARE.deleteVmwareTicket(obj).then(res => {
        console.log(res);
      });
    },
   
    
    detailCloudDisk(obj) {
      this.isShow = true;
      this.thetitle = "编辑云硬盘";
      this.$nextTick(function() {
        this.$refs.addCloud.thedetail(obj, this.thedata, true);
      });
    },
    deleteCloudDisk(index, name) {
      this.$confirm(`确定删除${name}吗？该操作不可恢复`, "提示", {
        type: "warning"
      })
        .then(() => {
          this.thedata.splice(index, 1);
          this.theleng = this.thedata.length - 1;
          this.keepInRealTime();
        })
        .catch(() => {});
    },
    creatFom() {
      this.thetitle = "创建云硬盘";
      this.isShow = true;
      this.thelengList=this.thedata.length+1;
      this.$nextTick(function() {
        this.$refs.addCloud.thedetail(null, this.thedata, false);
      });
    },
    closeDialog(res, obj) {
      this.isShow = false;
    },
    alterItem(index1, index2) {
      /* if (this.phaseState == "4") {
        return false;
      } */
      this.thedata[index1] = this.thedata.splice(
        index2,
        1,
        this.thedata[index1]
      )[0];
    },
    addCloudDiskData(val) {
      this.thedata.push(val);
      this.theleng = this.thedata.length - 1;
      this.keepInRealTime();
    },
    requireOsList() {
      requestMethodVMWARE.getRbacBaseData({ config_type: "1" }).then(res => {
        if (res.code === 200) {
          let items = res.data.items
          let len = items.length
          for (let i = 1; i < len; i++) {
            let versionItem = {
              value: items[i].config_key,
              label: items[i].config_key,
              children: []
            }
            items[i].config_type.value.version.forEach(version => {
              versionItem.children.push({
                value: version,
                label: version,
              })
            })
            // this.osOptions.push(versionItem)
            this.osList.push(versionItem);
          }
          this.versionNumberList(this.osVersion)
        } else {
          this.$message({
            message: "获取操作系统及版本失败",
            type: 'error'
          });
        }
      });
    },
    versionNumberList(val){
      let version = []
      this.osList.forEach(item => {
        if (item.label == val) {
          version = item.children
        }
      })
      this.os_version_list = version
    },
    selectOsVersion(val) {        //操作系统版本的改变
      this.osVersionNumber = '';
      this.theForm.os_version='';
      this.versionNumberList(val)
    },
    changeVersionNumber(val){    //操作系统版本号的改变
      this.theForm.image_type='';
      this.theForm.image_id=null;
      this.imageList=[];
      this.requireImgListByHostId(val,this.osVersion,this.theForm.host_id,this.theForm.image_type);
      this.theForm.os_version=this.osVersion+'-'+val;
      this.keepInRealTime();
    },
    requireSourcePoolList(val) {
      var obj={
        pool_type:6
      }
      requestMethodVMWARE.getSourcePoolByBusId(val,obj).then(res => {
        if (res.code === 200) {
          this.soucepoolList = res.data.items;
          
        }
      });
    },
    requireListOfHost(val) {
      var params = {
        pool_id:val,
        resource_type: 'host'
      };
      requestMethodVMWARE.getHostListBySourceId(params).then(res => {
        if (res.code === 200) {
          this.hostList = res.data.items;
        }
      });
    },
    requireListOfVirtualDirectory(val){
      requestMethodVMWARE.getVirtualDirectoryByHostId(val).then(res => {
        if (res.code === 200) {
          this.VDlist = res.data.items;
          this.menuArr=[];
          //this.spread(JSON.parse(JSON.stringify(res.data.items)))
        }
      });
    },
    reqiureListOfMirrorStoreagePool(val){
      var params = {
        pool_id:val,
        resource_type: 'data_store'
      };
      requestMethodVMWARE.getMirrorStoragePoolBySourceId(params).then(res => {
        if (res.code === 200) {
          this.mirrorStorageList = res.data.items;
        }
      });
    },
    sourcePoolChange() {
      this.theForm.host_id=null;
      this.VDlist=[];
      this.imageList=[];
      this.requireListOfHost(this.theForm.resource_pool_id);
      this.theForm.vm_folder_id=null;
      this.theForm.vm_folder_name='';
      this.theForm.image_type='';
      this.theForm.image_id=null;
      this.theForm.image_data_store=null;
      this.keepInRealTime();
      this.reqiureListOfMirrorStoreagePool(this.theForm.resource_pool_id)
    },
    
  },
  components: { addCloudDisk,networkCard }
};
</script>
<style lang="less" scoped>
.content {
  position: relative;
  /deep/ .el-collapse-item__arrow {
    position: absolute;
    left: 45px;
  }
  /deep/ .el-collapse-item {
    border: 0px !important;
  }
  /deep/ .el-collapse-item__wrap {
    border-bottom: 0px;
  }
  /deep/ .el-collapse-item__header {
    background: #fff !important;
    border-bottom: 1px solid #e7edf3;
  }
  .formTit {
    padding-left: 60px;
    padding-right: 20px;
    font-size: 14px;
    width: 100%;
    //background: rgba(48, 107, 255, 0.03);
    .line {
      float: right;
      margin-right: 200px;
      height: 1px;
      background: #333;
      margin-top: 25px;
      display: none;
      width: calc(100% - 290px);
    }
  }
  .theBorder {
    border-bottom: 1px dashed #999;
  }
  .formBody {
    margin-top: 25px;
    margin-left: 115px;
    width: 80%;
    .theInfo{
        font-size: 14px;
        color: #306bff;
        margin-left:8px;
        cursor: pointer;
    }
    .downTree{
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);position:absolute;width:440px;max-height:135px;z-index:999;overflow-y:auto;border: 1px solid #ebebeb;border-radius: 3px;
    }
    .createLine {
      height: 1px;
      background: #ccc;
      margin-top: 20px;
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
    .tableCon {
      min-height: 80px;
      overflow: auto;
      padding-top: 10px;
      .thetit {
        float: left;
        width: 150px;
        text-align: right;
        margin-right: 15px;
        position: relative;
      }
      .thetit span {
        color: #f56c6c;
        position: absolute;
        right: -7px;
      }
      .inbox {
        float: left;
        width: 400px;
      }
      .formBodyC {
        font-size: 14px;
        width: 700px;
        table {
          font-size: 14px;
          color: #19223b;
          width: 100%;
          table-layout: fixed;
          border-collapse: collapse;
          border-spacing: 0;
        }

        table thead {
          background: rgba(25, 34, 59, 0.03);
          border-radius: 4px;
          height: 30px;
          line-height: 30px;
        }
        table thead tr th {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #666;
          text-align: center;
          height: 30px;
          border-right: 2px solid #fff;
          line-height: 30px;
        }
        /* table tbody tr {
          padding: 20px 0px;
          border-bottom: 1px solid rgba(216, 222, 233, 1);
        } */
        table tbody tr td {
          text-align: center;
          color: #666;
          font-size: 12px;
          padding: 10px 10px;
        }
        table tbody tr td .inputBox {
          height: 26px;
          line-height: 26px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          border-radius: 4px;
          border: 1px solid #DCDFE6;
          input{
            border:0px;
            outline:none; 
            width:130px;
          }
        }
        table tbody tr td .inputBoxYp{
          height: 32px;
          line-height: 32px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
