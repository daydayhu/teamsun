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
        <el-collapse-item name="1" v-if="(baseInfo.indexOf(phaseState)>-1) || (deployTarget.indexOf(phaseState)>-1) || ((baseInfo.indexOf('1')>-1 || deployTarget.indexOf('1')>-1) && phaseState=='2') || (phaseState=='4' && (baseInfo.indexOf('1')>-1 || baseInfo.indexOf('3')>-1 || deployTarget.indexOf('1')>-1 || deployTarget.indexOf('3')>-1)) ">
          <template slot="title">
            <div class="formTit">
              基本信息
              <div class="line"></div>
            </div> 
          </template>
          <div class="formBody">
            <el-form-item label="虚拟机前缀" prop="prefix_name" v-if="(baseInfo.indexOf(phaseState)>-1) || (phaseState=='2' && baseInfo.indexOf('1')>-1) || (phaseState=='4' && baseInfo.indexOf('3')>-1)">
              <el-input
                placeholder="请输入内容"
                style="width:440px" 
                v-model="theForm.prefix_name"
                maxlength="60"
                show-word-limit
                clearable
                @change="hostChangeName()"
                :disabled="(phaseState==2 || phaseState==4 ||isEditable==false)"
              ></el-input>
            </el-form-item>
            <el-form-item label="虚拟机台数" prop="vmware_num" v-if="(baseInfo.indexOf(phaseState)>-1) || (phaseState=='2' && baseInfo.indexOf('1')>-1) || (phaseState=='4' && baseInfo.indexOf('3')>-1)">
              <el-input-number  
                style="width:440px" 
                :max="vmMaxNum"
                v-model="theForm.vmware_num"
                :disabled="(phaseState==2 || phaseState==4  || isEditable==false) || !this.theForm.prefix_name"
                @change="hostChangeNum" :min="1"  label="描述文字"></el-input-number>
            </el-form-item>
            <el-form-item label="用途说明" v-if="(baseInfo.indexOf(phaseState)>-1) || (phaseState=='2' && baseInfo.indexOf('1')>-1)|| (phaseState=='4' && baseInfo.indexOf('3')>-1)">
              <el-input
                placeholder="请输入内容"
                @change="keepInRealTime"
                style="width:440px" 
                :disabled="(phaseState==2 || phaseState==4 || isEditable==false)"
                v-model="theForm.description"
                maxlength="200"
                show-word-limit
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="操作系统及版本"  prop="os_version" v-if="(baseInfo.indexOf(phaseState)>-1) || (phaseState=='2' && baseInfo.indexOf('1')>-1) || (phaseState=='4' && baseInfo.indexOf('3')>-1)">
                  <div style="width:440px">
                        <el-col :span="11">
              <el-select 
                placeholder="请选择操作系统"
                v-model="osVersion"
                :disabled="(phaseState==2 || phaseState==4 || isEditable==false) || !this.theForm.prefix_name"
                 @change="selectOsVersion">
                <el-option
                  v-for="(item,index) in osList"
                  :key="index"
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
            :disabled="(phaseState==2 || phaseState==4 || isEditable==false) || !this.theForm.prefix_name"
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
            <el-form-item label="资源池" prop="resource_pool_id" v-if="(baseInfo.indexOf(phaseState)>-1) || (phaseState=='2' && baseInfo.indexOf('1')>-1) || (phaseState=='4' && baseInfo.indexOf('3')>-1)">
              <el-select
                placeholder="请选择资源池"
                :disabled="(phaseState==2 || phaseState==4 || isEditable==false) || !this.theForm.prefix_name"
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

            <el-form-item label="虚拟目录" prop="vm_folder_name" style="position:relative" v-if="(deployTarget.indexOf(phaseState)>-1) || (phaseState=='2' && deployTarget.indexOf('1')>-1) || (phaseState=='4' && deployTarget.indexOf('3')>-1)">
              <div v-clickoutside="handleClose" style="width:440px" class="xnml" @mouseover="mouseEnter" @mouseleave="isClear=false">
                  <el-input  @focus="isBox=true"
                  :disabled="(phaseState==2 || phaseState==4 || isEditable==false)"
                      v-model="theForm.vm_folder_name"
                      style="width:440px" 
                  ></el-input>
                  <div v-if="isBox" class="downTree" >
                    <el-tree :data="VDlist" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                  </div>
                  <span class="clearData" v-if="isClear" @click="clearVm">x</span>
              </div>
            </el-form-item>

            <el-form-item label="vCPU数量" v-if="(baseInfo.indexOf(phaseState)>-1) || (phaseState=='2' && baseInfo.indexOf('1')>-1) || (phaseState=='4' && baseInfo.indexOf('3')>-1)">
              <el-input-number
                :min="2"
                :disabled="(phaseState==2 || phaseState==4 || isEditable==false)"
                v-model="theForm.vcpu"
                @change="keepInRealTime"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="内存（GB)" v-if="(baseInfo.indexOf(phaseState)>-1) || (phaseState=='2' && baseInfo.indexOf('1')>-1) || (phaseState=='4' && baseInfo.indexOf('3')>-1)">
              <el-input-number
                :min="1"
                :disabled="(phaseState==2 || phaseState==4 || isEditable==false)"
                v-model="theForm.memory_gb"
                @change="keepInRealTime"
              ></el-input-number>
            </el-form-item>
             <el-form-item label="镜像" prop="image_id" v-if="(deployTarget.indexOf(phaseState)>-1) || (phaseState=='2' && deployTarget.indexOf('1')>-1) || (phaseState=='4' && deployTarget.indexOf('3')>-1)">
                <div style="color: rgb(195, 195, 195);" class='choiceMirror' @click="choiceJX" v-if="theForm.image_name==undefined || theForm.image_name==''" :class="{noInput:phaseState=='2'|| phaseState=='4' || isEditable==false}">选择镜像</div>
                <div class='choiceMirror' @click="choiceJX" v-if="theForm.image_name!=''&&theForm.image_name!=undefined " :class="{noInput:phaseState=='2'|| phaseState=='4' || isEditable==false}">{{theForm.image_name}}</div>
            </el-form-item>
             <el-form-item label="CPU插槽数" v-if="(deployTarget.indexOf(phaseState)>-1) || (phaseState=='2' && deployTarget.indexOf('1')>-1) || (phaseState=='4' && deployTarget.indexOf('3')>-1)">
              <el-input-number
                :min="2"
                :disabled="(phaseState==2 || phaseState==4 || isEditable==false)"
                v-model="theForm.cpu_cores"
                @change="keepInRealTime"
              ></el-input-number>
            </el-form-item>
            <div class="tableCon" v-if="(baseInfo.indexOf(phaseState)>-1) || (phaseState=='2' && baseInfo.indexOf('1')>-1)|| (phaseState=='4' && baseInfo.indexOf('3')>-1)">
              <div class="thetit" style='color: #332a7c;'>
                存储（GB）
              </div>
              <div class="inbox formBodyC" style="float:left">
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
                        <!-- <div class="inputBox">
                          <input
                            type="text"
                            v-model.number="inputOne"
                            @change="keepInRealTime"
                          />
                        </div> -->
                         <el-input
                            :disabled="(phaseState==2 || phaseState==4 || isEditable==false)"
                            v-model.number="inputOne"
                            @change="keepInRealTime"
                          ></el-input>
                      </td>
                      <td>
                        <el-input
                            :disabled="(phaseState==2 || phaseState==4 || isEditable==false)"
                            v-model.number="inputTwo"
                            @change="keepInRealTime"
                          ></el-input>
                      </td>
                      <td>
                        <el-input
                            :disabled="(phaseState==2 || phaseState==4 || isEditable==false )"
                            v-model.number="inputThree"
                            @change="keepInRealTime"
                          ></el-input>
                      </td>
                      <td>
                        <el-input
                            :disabled="(phaseState==2 || phaseState==4 || isEditable==false)"
                            v-model.number="inputFour"
                            @change="keepInRealTime"
                          ></el-input>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
            <!-- <el-form-item label="镜像" prop="image_id">
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
            </el-form-item> -->
           
        </el-collapse-item>
        <el-collapse-item name="2" v-if="(netInfo.indexOf(phaseState)>-1) || (phaseState=='2' && netInfo.indexOf('1')>-1) || (phaseState=='4' && netInfo.indexOf('3')>-1)">
          <template slot="title">
            <div class="formTit">
              虚拟机配置
              <div class="line"></div>
            </div>
          </template>
          <div style='padding: 20px 60px;'>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="(li,index) in hostInfoList" :label="li.name" :name="li.ticket_obj_id.toString()" :key='index'>
              <ul class="xnjpz">
                <li class="clearFloat">
                  <div class="thetit"><span>虚拟机名称</span></div>
                  <div class="thepara"><el-input :disabled="(phaseState==2 || phaseState==4 || isEditable==false)" style="max-width:440px" v-model="li.name" placeholder="请输入内容" @change='editHostData(index)' maxlength="64"
  show-word-limit></el-input></div>
                </li>
                <!--  <networkCard ref="networkCard" :phaseState='phaseState' :canvasObj='canvasObj' :pool_id="Number(theForm.resource_pool_id)"></networkCard> -->
                <li class="clearFloat">
                  <div class="thetit"><span>OS主机名(hostname)</span></div>
                  <div class="thepara"><el-input maxlength="64"
  show-word-limit :disabled="(phaseState==2 || phaseState==4 || isEditable==false)" style="max-width:440px" v-model="li.hostname" placeholder="请输入内容" @change='editHostData(index)'></el-input></div>
                </li>
                <li class="clearFloat">
                    <div class="thetit"><span>宿主机</span></div>
                    <div class="thepara">
                        <el-select placeholder="请选择宿主机" style="max-width:440px" 
                        :disabled="(phaseState==2 || phaseState==4 || isEditable==false)"
                          v-model="li.host_id" @change="changeHostId">
                          <el-option
                            v-for="list in hostList"
                            :key="list.id"
                            :label="list.name"
                            :value="list.id"
                          ></el-option>
                        </el-select>
                    </div>
                </li>
                
               <networkCard ref="networkCard" :phaseState='phaseState' :canvasObj='canvasObj' :ticket_obj_id='li.ticket_obj_id' :pool_id="Number(theForm.resource_pool_id)"></networkCard>
                <li class="clearFloat">
                  <div class="thetitYYP"><span>云硬盘</span></div>
                  <div class="thepara formBodyC">
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
                    <tr v-for="(list,index1) in li.volume" :key="index1">
                      <td>
                        <div class="inputBoxYp" style="font-size:16px;position:relative;">
                          <i
                            class="el-icon-sort-down"
                            style="color:#409eff;cursor:pointer"
                            @click="alterItem(index,index1,index1+1)"
                            v-if="theleng!=index1 && index1!=0"
                          ></i>
                          <i
                            class="el-icon-sort-down"
                            style="color:#ccc;cursor:not-allowed"
                            v-if="theleng==index1||index1==0"
                          ></i>
                          <i
                            class="el-icon-sort-up"
                            style="color:#409eff;cursor:pointer"
                            @click="alterItem(index,index1,index1-1)"
                            v-if="index1!=0 && index1!=1"
                          ></i>
                          <i
                            class="el-icon-sort-up"
                            style="color:#ccc;cursor:not-allowed"
                            v-if="index1==0||index1==1"
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
                         <el-tooltip effect="dark" :content="`${list.disk_name}`" placement="bottom-start" :disabled='!list.disk_name'>
                          <div class="inputBoxYp">{{list.disk_name}}</div>
                        </el-tooltip>
                      </td>
                      <td>
                        <el-tooltip effect="dark" :content="`${list.data_store_name}`" placement="bottom-start" :disabled='!list.data_store_name'>
                          <div class="inputBoxYp">{{list.data_store_name}}</div>
                        </el-tooltip>
                      </td>
                      <td>
                        <el-tooltip effect="dark" :content="`${list.scsi_name}`" placement="bottom-start" :disabled='!list.scsi_name'>
                          <div class="inputBoxYp">{{list.scsi_name}}</div>
                        </el-tooltip>
                      </td>
                      <td>
                        <el-tooltip effect="dark" :content="`${list.disk_type_name}`" placement="bottom-start" :disabled='!list.disk_type_name'>
                          <div class="inputBoxYp">{{list.disk_type_name}}</div>
                        </el-tooltip>
                      </td>
                      <td>
                        <el-tooltip effect="dark" :content="`${list.capacity_gb}`" placement="bottom-start" :disabled='!list.capacity_gb'>
                          <div class="inputBoxYp">{{list.capacity_gb}}{{list.disk_unit}}</div>
                        </el-tooltip>
                      </td>
                      <td>
                        <el-tooltip effect="dark" :content="`${list.description}`" placement="bottom-start" :disabled='!list.description'>
                          <div class="inputBoxYp">{{list.description}}</div>
                        </el-tooltip>
                      </td>
                      <td> 
                        <div class="inputBoxYp" style="color:#409eff;font-size:16px;cursor:pointer">
                          <i class="el-icon-edit" @click="detailCloudDisk(index,list)"></i>
                          <i
                            class="el-icon-delete"
                            @click="deleteCloudDisk(index,index1,list.disk_name)"
                            v-if="index1!=0"
                          ></i>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              
                  </div>
                </li>
              </ul>
              <div class="createLine"></div>
              <div @click="creatFom(index)" class="createBox">
                  <i class="el-icon-plus"></i>添加
              </div>
            </el-tab-pane>
          </el-tabs>
          </div>
        </el-collapse-item>
       <!--  todo -->
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
      :cloudServiceName="theName"
      :thelengList='thelengList'
      :merrSize='merrSize'
    ></addCloudDisk>
    <el-drawer title="镜像" :visible.sync="isMirror">
      <div style='width:90%;margin:0 auto;'>
         <el-select placeholder="请选择镜像类型" v-model="theForm.image_type" style="width:100%" @change="selectImageType">
                    <el-option
                      v-for="image in imageTypeList"
                      :label="image.label"
                      :value="image.value"
                      :key="image.value"
                    ></el-option>
        </el-select>
        <!-- image_id -->
        <el-table ref="singleTable" :data="imageList" tooltip-effect="dark" style="width: 100%;margin:10px auto"
          highlight-current-row
          @current-change="handleCurrentChange" >
          <el-table-column label="镜像名称" prop="image_name"></el-table-column>
          <el-table-column prop="description" label="镜像描述"></el-table-column>
        </el-table>
      </div>
      <div class='drawer_footer '>
        <el-button @click="cancelMirror">取 消</el-button>
        <el-button type="primary" @click="sureMirror">确 定</el-button>
      </div>
    </el-drawer>
    <el-dialog title="镜像未上传至后端，请选择镜像目标存储" :visible.sync="isdialog" width="30%">
      <el-select placeholder="请选择存储池" v-model="theForm.image_data_store">
          <el-option v-for="list in mirrorStorageList" :key="list.id"
              :label="list.name"
              :value="list.id">
          </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isdialog = false">取 消</el-button>
        <el-button type="primary" @click="sureStorage">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>
<script>
import networkCard from "./compontents/networkCard.vue";
import addCloudDisk from "../formComponents/compontents/addCloudDisk";
import * as requestMethodVMWARE from "@/modules/apps/api/serviceCatalog/openstack/vmware.js";
import { Bus, canvasEvent } from "@/modules/apps/bus/form.bus.js";
import {clickoutside} from '@/directive/clickoutside.js';
export default {
  name: "vmware",
  props: {
    phaseState: {
      type: null
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
  data() {
    return {
      saveMirrorObj:{},
      isClear:false,
      isdialog:false,
      currentRow: null,
      isMirror:false,
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
      inputOne: '',
      inputTwo: '',
      inputThree: '',
      inputFour: '',
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
        vmware_num:null,
        node_canvas_uuid:null,//画布节点ID
        name: "",
        hostname: "",
        description: "",
        os_version: "",
        resource_pool_id: null,
        resource_pool_description: "", //资源池配值说明
        vcpu: 2,
        memory_gb: 2,
        image_data_store:null,
        storage_gb: [],
        cluster_id: null, //集群ID
        cluster_name: "xxx", //集群名称
        image_type: "private", //镜像类型 public（公共）private（私有）shared（共享）
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
        image_id: [
          { required: true, message: "请选择镜像", trigger: "change" }
        ],
        vm_folder_id: [
          { required: true, message: "请选择虚拟目录", trigger: "change" }
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
      isAllSave:false,
      hostInfoList:[],
      activeName:null,
      theIndex:0,
      theName:'',
      merrSize:null,
      vmMaxNum:1,
    };
  },
  directives: {clickoutside},
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
    //this.toDetailVmwareTicket(this.canvasObj.service_uuid)
    
    this.getHostSetsList()
    this.getBaseInfos();
    this.getVmwareNum();
  },
  watch: {
    
  },
  methods: {
    mouseEnter(){
      if(this.theForm.vm_folder_name){
         this.isClear=true
      }
    },
    choiceJX(){
      this.saveMirrorObj={
        image_id:this.theForm.image_id,
        image_name:this.theForm.image_name,
        image_type:this.theForm.image_type
      } 
      if(!this.theForm.prefix_name){
        this.$notify.warning({
            title: '警告',
            message: `虚拟机前缀不能为空`,
            position: 'bottom-right',
            duration:3000
          });
        return
      }
      if(this.phaseState!=2 && this.phaseState!=4 && this.isEditable){
        this.isMirror=true
      }else{
        return
      }
      this.$nextTick(function(){
        if(this.theForm.image_id){
          for(var i=0;i<this.imageList.length;i++){
            if(this.imageList[i].image_id==this.theForm.image_id){
              this.$refs.singleTable.setCurrentRow(this.imageList[i]);
            }
          }
        }
      })
    },
    handleCurrentChange(val) {
      if(val){
        this.theForm.image_id=val.image_id;
        this.theForm.image_name=val.image_name
        this.currentRow = val;
      }
    },
    getVmwareNum(){
      requestMethodVMWARE.VmwareNum({ config_type: "23" }).then(res => {
        if (res.code === 200) {
          var thedata=res.data.items
          for(var i=0;i<thedata.length;i++){
            if(thedata[i].config_key=='vm_counts'){
              this.vmMaxNum=parseInt(thedata[i].value_json)
            }
          }
        }
      });
    },
    cancelMirror(){
      this.theForm.image_id=this.saveMirrorObj.image_id
      this.theForm.image_name=this.saveMirrorObj.image_name
      this.theForm.image_type=this.saveMirrorObj.image_type 
      this.isMirror = false;
    },
    sureMirror(){  //判断镜像是否上传
      this.keepInRealTime();
      if(this.theForm.image_type=='public'){
        requestMethodVMWARE.checkMirrorIsUpload(this.theForm.image_id,this.theForm.resource_pool_id).then(res => {
          if (res.code === 200) {
            if(res.data.items.ds_id==0){
              this.isdialog=true
            }else{
               this.isMirror=false
            }
          }else{
            this.$notify.error({
              title: '警告',
              message: `${res.message}`,
              position: 'bottom-right',
              duration:3000
            });
          }
        });
      }else{
        this.isMirror=false;
      }
    },
    sureStorage(){  //确定镜像的存储位置
      this.isdialog=false;
      this.keepInRealTime();
      this.isMirror = false;
    },
    handleClose(e){
      if(e.target.className !='el-input__inner'){
           this.isBox=false
      }
    },
    hostChangeName(){
      if(!this.theForm.prefix_name){
        this.$notify.warning({
            title: '警告',
            message: `虚拟机前缀不能为空`,
            position: 'bottom-right',
            duration:3000
          });
        return
      }
      this.hostChange(false,false)
    },
    hostChangeNum(currentValue, oldValue){
      if(currentValue>oldValue){
        this.hostChange(true,false)
      }else{
        this.hostChange(true,true)
      }
    },
    hostChange(isCanvas,isSmall){
     var arr=[]
      for(var i=1;i<this.theForm.vmware_num+1;i++){
        var name=this.theForm.prefix_name+'00'+i;
        arr.push(name)
      }
      var params={
        node_canvas_uuid:this.canvasObj.service_uuid,
        vmware_names:JSON.stringify(arr)
      }
      requestMethodVMWARE.checkVmwareName(params).then(res=>{
        if(res.code === 200) {
           this.keepInRealTime();
            if(this.theForm.vmware_num>0 && this.theForm.prefix_name!=''){
              this.getHostSetsList();
            }
            if(isCanvas){
              if(isSmall){
                this.toCanvas()
              }
              Bus.$emit('dispatchCanvasEvent',canvasEvent.vmware_event_2,{
                service_uuid:this.canvasObj.service_uuid,
                virtual_num:this.theForm.vmware_num,
              })
            }
        }else{
          this.$notify.warning({
            title: '警告',
            message: `${res.message}`,
            position: 'bottom-right',
            duration:3000
          });
        } 
      })
    },
    async toCanvas(){//与画布交互
      let res = await requestMethodVMWARE.getNodeIpData("get",this.canvasObj.app_id,this.canvasObj.ticket_id,this.canvasObj.service_uuid)
      let keys = Object.keys(res.data)
      keys.forEach(item=>{
        let ips = []
        res.data[item].forEach( uuid=>{
            ips.push(
              uuid.ip_type + ":" + uuid.ip
            )
        } )
        Bus.$emit("dispatchCanvasEvent", canvasEvent.vmware_event_1, {
          source_uuid: item, //
          target_uuid: this.canvasObj.service_uuid,
          ip: ips
        });
      })
    }, 
    handleClick(val){
      this.theIndex=parseInt(val.index);
      this.theleng = this.hostInfoList[this.theIndex].volume.length - 1; 
      this.theName=val.label;
    },
    getHostSetsList(){
      var params={
        app_id:parseInt(this.canvasObj.app_id),
        ticket_id:parseInt(this.canvasObj.ticket_id),
        node_canvas_uuid:this.canvasObj.service_uuid,
      }
      requestMethodVMWARE.hostSetsList(params).then(res=>{
        if(res.code === 200) {
           this.hostInfoList=res.data; 
           this.activeName=this.hostInfoList[0].ticket_obj_id.toString();
           this.theName=this.hostInfoList[0].name;
           this.theleng = this.hostInfoList[0].volume.length - 1; 
           //this.getBaseInfos(this.canvasObj.service_uuid);
        } 
      })
    },
    changeHostId(){
      this.requireImgListByHostId(this.osVersionNumber,this.osVersion,this.theForm.resource_pool_id,this.theForm.image_type);
      this.editHostData(this.theIndex);
    },
    editHostData(index){
      if(this.hostInfoList[index].name==''){
        this.hostInfoList[index].name=this.theName;
      }
      var obj={
        ticket_obj_id: this.hostInfoList[index].ticket_obj_id,
        hostname: this.hostInfoList[index].hostname,
        name: this.hostInfoList[index].name,
        description: "",
        cluster_id: 0,
        cluster_name: "",
        host_id: this.hostInfoList[index].host_id,
        host_uuid: "",
        vm_folder_id: this.hostInfoList[this.theIndex].vm_folder_id,
        vm_folder_name: this.hostInfoList[this.theIndex].vm_folder_name,
        vm_folder_uuid: null,
        volume: this.hostInfoList[index].volume.concat()
      }
      requestMethodVMWARE.editconfigInfos(obj).then(res=>{
        if(res.code === 200) {} 
      })
    },
    selectImageType() {
      this.theForm.image_id=null;
      this.imageList=[];
       if(this.theForm.image_type=='private' || this.theForm.image_type=='share'){
          this.theForm.image_data_store=null; 
          //this.requireImgListByHostId(this.osVersionNumber,this.osVersion,this.theForm.host_id,this.theForm.image_type);
          this.requireImgListByHostId(this.osVersionNumber,this.osVersion,this.theForm.resource_pool_id,this.theForm.image_type);
       }else if(this.theForm.image_type=='public'){
         this.getPublicImage();
       }
   },
   selectImageID() {
     if(this.compareSize(theForm.image_id,this.imageList)==false){
        this.$notify.warning({
          title: '警告',
          message: `系统盘不能小于镜像的大小`,
          position: 'bottom-right',
          duration:3000
        });
        return;
      }
      this.keepInRealTime();
    },
    //获取镜像的大小并和系统盘作比较：系统盘不能小于镜像的大小
    compareSize(id,list){
      for(var i =0;i<list.length;i++){
        if(id==list[i].image_id){
          this.merrSize=list[i].capacity_gb;
          if(this.hostInfoList[this.theIndex].volume.length!=0 && this.merrSize){
            if(this.hostInfoList[this.theIndex].volume[0].disk_unit=='TB'){
              if(parseFloat(this.merrSize) >= parseFloat(this.hostInfoList[this.theIndex].volume[0].capacity_gb)*1000){
                    return false
              }
            }else{
              if(parseFloat(this.merrSize) >=parseFloat(this.hostInfoList[this.theIndex].volume[0].capacity_gb)){
                return false
              }
            }
          }
        }
      }
      return true
    },
    requireImgListByHostId(osVersionNumber,osVersion,sourceId,isShare){  //isShare(private/share)
      if(osVersionNumber&&osVersion&&sourceId&&isShare){
        var params={
         pool_id:sourceId,
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
          this.imageList=[];
          var sj=this.osVersion+'-'+this.osVersionNumber;
          requestMethodVMWARE.getPublicImageList(sj).then(res=>{
                if(res.code === 200) {
                    res.data.forEach( (item,index) => {
                        this.imageList.push({
                            image_id:item.image_file_id,
                            image_name:item.image_name,
                            index:index,
                        })
                    })
                } 
            })
        } 
    },
    handleNodeClick(data) {
      if(!this.theForm.prefix_name){
        this.$notify.warning({
            title: '警告',
            message: `虚拟机前缀不能为空`,
            position: 'bottom-right',
            duration:3000
          });
        return
      }
      this.theForm.vm_folder_id=data.vmfolder_id;
      this.theForm.vm_folder_name=data.folder_name;
      //this.hostInfoList[this.theIndex].vm_folder_id=data.folder_id;
      //this.hostInfoList[this.theIndex].vm_folder_name=data.folder_name;
      this.isBox=false
      this.keepInRealTime();
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
        for(var i=0;i<this.$refs["networkCard"].length;i++){
          var  netObj = this.$refs["networkCard"][i].forComponentContent();
          if(netObj.flag) {
            obj.flag = netObj.flag
            obj.mess=netObj.mess;
            return obj
          }
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
      if(!this.theForm.prefix_name){
        this.$notify.warning({
            title: '警告',
            message: `虚拟机前缀不能为空`,
            position: 'bottom-right',
            duration:3000
          });
        return
      }
      if(this.isToEdit==true){ //编辑
        return this.toEditBaseinfos();
      }else{                   //创建
        this.isToEdit=true;   //因为实时保存的缘故，初始进来单字段保存之后都为编辑操作
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
      this.theForm.storage_gb = [
        this.inputOne,
        this.inputTwo,
        this.inputThree,
        this.inputFour
      ];
      var params = Object.assign({}, this.theForm);
      params.vmware_id = null;
      params.app_id=this.canvasObj.app_id;
      params.ticket_id=this.canvasObj.ticket_id;
      return await requestMethodVMWARE.addVmwareTicket(params).then(res => {
        if(res.code!=200){
          this.isToEdit=false;
        }
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
    async toEditBaseinfos(){
      this.theForm.storage_gb=[this.inputOne,
        this.inputTwo,
        this.inputThree,
        this.inputFour]
      var params = Object.assign({}, this.theForm);
      params.app_id=this.canvasObj.app_id;
      params.ticket_id=this.canvasObj.ticket_id;
      params.vmware_id = null;
      return await requestMethodVMWARE.editBaseInfos(params).then(res => {
        return this.alertMess(res)
      });
    },
    async editconfigInfos(){
      this.theForm.volume = this.thedata.concat();
      var params = Object.assign({}, this.theForm);
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
    getBaseInfos() {
      var obj = { 
        node_canvas_uuid: this.canvasObj.service_uuid,
        app_id:this.canvasObj.app_id,
        ticket_id:this.canvasObj.ticket_id
      };
      requestMethodVMWARE.requireBaseInfos(obj).then(res => {
        if(res.data.is_created==true){   //已创建（编辑）
          this.theForm = res.data;
          this.isToEdit=true;
          let arr = JSON.parse(res.data.storage_gb);
          this.inputOne = arr[0];
          this.inputTwo = arr[1];
          this.inputThree = arr[2];
          this.inputFour = arr[3];
          var versionData=this.theForm.os_version.split("-");
          this.osVersionNumber=versionData[1];
          this.osVersion=versionData[0]; 
          if(!this.theForm.image_type){
            this.theForm.image_type='private';
          }
          if(this.theForm.image_type=='private' || this.theForm.image_type=='share'){
          this.requireImgListByHostId(this.osVersionNumber,this.osVersion,this.theForm.resource_pool_id,this.theForm.image_type);
          }else if(this.theForm.image_type=='public'){
            this.getPublicImage();
          }
        }else{  //未创建（新增）
          this.isToEdit=false;
        }
        this.requireOsList();
        this.requireSourcePoolList(this.businessId);
        
        if(this.theForm.resource_pool_id!=''){
          this.requireListOfHost(this.theForm.resource_pool_id);
          this.reqiureListOfMirrorStoreagePool(this.theForm.resource_pool_id)
        }
        /* if(this.theForm.host_id!=''){
          this.requireListOfVirtualDirectory(this.theForm.host_id);
        } */
        if(this.theForm.resource_pool_id!=''){
          this.requireListOfVirtualDirectory(this.theForm.resource_pool_id);
        }
        
      });
    },
    toDeleteVmwareTicket() {
      requestMethodVMWARE.deleteVmwareTicket(obj).then(res => {
        //console.log(res);
      });
    },
    detailCloudDisk(index,obj) {
      if (this.phaseState =='2' || this.phaseState =='4' || this.isEditable==false) {
        return ;
      } 
      this.isShow = true;
      this.thetitle = "编辑云硬盘";
      this.$nextTick(function() {
        this.$refs.addCloud.thedetail(obj, this.hostInfoList[index].volume, true);
      });
    },
    deleteCloudDisk(index,index1, name) {
      if (this.phaseState =='2' || this.phaseState =='4' || this.isEditable==false) {
        return ;
      } 
      this.$confirm(`确定删除${name}吗？该操作不可恢复`, "提示", {
        type: "warning"
      })
        .then(() => {
          this.hostInfoList[index].volume.splice(index1, 1);
          this.theleng = this.hostInfoList[index].volume.length - 1;
          this.editHostData(index)
        })
        .catch(() => {});
    },
    creatFom(index) {
      if (this.phaseState ==2 || this.phaseState ==4 || this.isEditable==false) {
        return false;
      } 
      this.thetitle = "创建云硬盘";
      this.isShow = true;
      this.thelengList= this.hostInfoList[this.theIndex].volume.length+1
      this.$nextTick(function() {
        this.$refs.addCloud.thedetail(null, this.hostInfoList[this.theIndex].volume, false);
      });
    },
    closeDialog(res, obj) {
      this.isShow = false;
    },
    alterItem(index,index1, index2) {   
      if (this.phaseState ==2 || this.phaseState ==4 || this.isEditable==false) {
        return false;
      } 
      this.hostInfoList[0].volume[index1] = this.hostInfoList[0].volume.splice(
        index2,
        1,
        this.hostInfoList[0].volume[index1]
      )[0];
    },
    addCloudDiskData(val) {
      this.hostInfoList[this.theIndex].volume.push(val);
      this.theleng = this.hostInfoList[this.theIndex].volume.length - 1;
      this.editHostData(this.theIndex)
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
      this.theForm.image_type='private';
      this.theForm.image_id=null;
      this.imageList=[]; 
      //this.requireImgListByHostId(val,this.osVersion,this.theForm.host_id,this.theForm.image_type);
      this.requireImgListByHostId(val,this.osVersion,this.theForm.resource_pool_id,this.theForm.image_type);
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
    clearVm(){
      this.theForm.vm_folder_id=0     //0或者null代表的是没有选虚拟目录
      this.theForm.vm_folder_name=null
      this.keepInRealTime();
    },
    requireListOfVirtualDirectory(val){
      requestMethodVMWARE.getVirtualDirectoryByHostId(val).then(res => {
        if (res.code === 200) {
          this.VDlist = res.data.items;
          this.menuArr=[];
          if(!this.theForm.vm_folder_id && this.theForm.vm_folder_id!=0 && res.data.is_selected){
            this.theForm.vm_folder_id=res.data.is_selected.vmfolder_id;
            this.theForm.vm_folder_name=res.data.is_selected.folder_name;
          }
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
      //this.theForm.host_id=null;
      this.VDlist=[];
      this.imageList=[];
      this.requireListOfHost(this.theForm.resource_pool_id);
      this.requireListOfVirtualDirectory(this.theForm.resource_pool_id);
      this.theForm.vm_folder_id=null;
      this.theForm.vm_folder_name='';
      this.theForm.image_type='private';
      this.theForm.image_id=null;
      this.theForm.image_data_store=null;
      this.keepInRealTime();
      this.reqiureListOfMirrorStoreagePool(this.theForm.resource_pool_id)
      if(this.theForm.image_type=='private' || this.theForm.image_type=='share'){
          this.requireImgListByHostId(this.osVersionNumber,this.osVersion,this.theForm.resource_pool_id,this.theForm.image_type);
       }else if(this.theForm.image_type=='public'){
         this.getPublicImage();
       }
    },
  },
  components: { addCloudDisk,networkCard }
};
</script>
<style lang="less" scoped>
.content {
  /deep/ .el-table__body tr.current-row>td {
    background-color: #332A7C;
    color: #fff;
  }
  .choiceMirror{
    cursor: pointer;
    border-radius: 14px;
    width:440px;
    border:1px solid rgba(51, 42, 124, 0.45);
    text-indent: 15px;
  }
  .noInput{
    background-color: #F5F7FA;
    border:1px solid #E4E7ED;
    color: #C0C4CC;
    cursor: not-allowed;
  }
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
  .xnjpz{
    li{
      margin:15px 0px;
      line-height: 32px;
    }
    .thetit{
      width: 30%;
      float: left;
      text-align: right;
      padding-right: 12px;
      position: relative;
      color: #332A7C;
    }
    .thetitYYP{
      width: 140px;
      float: left;
      text-align: right;
      margin-right: 15px;
      position: relative;
      color: #332A7C;
    }
    .thetitYYP span:before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
    }
    .thetit span:before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
    }
  
    .thepara{
      float:left;
      width:70%;
      .downTree{
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);position:absolute;width:440px;max-height:135px;z-index:999;overflow-y:auto;border: 1px solid #ebebeb;border-radius: 3px;
      }
    }
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
  .formBody {
    margin-top: 25px;
    margin-left: 115px;
    width: 80%;
    .xnml{
      position: relative;
      .clearData{
        display: inline-block;
        width: 12px;
        height: 12px;
        text-align: center;
        line-height: 9px;
        border: 1px solid #c0c4cc;
        border-radius: 6px;
        position: absolute;
        right: 12px;
        top: 10px;
        color: #c0c4cc;
        font-size: 12px;
        cursor: pointer;
      }
    }
    .theInfo{
        font-size: 14px;
        color: #306bff;
        margin-left:8px;
        cursor: pointer;
    }
    .downTree{
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);position:absolute;width:440px;max-height:135px;z-index:999;overflow-y:auto;border: 1px solid #ebebeb;border-radius: 3px;
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
      
    }
  }
}

</style>