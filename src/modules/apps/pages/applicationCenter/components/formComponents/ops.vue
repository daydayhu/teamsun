<template>
  <div class="content">
    <el-collapse v-model="activeNames">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-collapse-item name="1">
        <template slot="title">
          <div class="formTit">
            基本信息
            <div class="line"></div>
          </div>
        </template>
        <ul class="formBody">
          <el-form-item label="活动区域" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
            <li class='clearFloat'>
                <div class='thetit'>虚拟机名称</div>
                <div class="inbox">
                  <el-input
                    placeholder="请输入内容"
                    clearable>
                  </el-input>
                </div>
            </li>
            <li class='clearFloat'>
                <div class='thetit'>OS主机名(hostname)</div>
                <div class="inbox">
                  <el-input
                    placeholder="请输入内容"
                    clearable>
                  </el-input>
                </div>
            </li>
            <li class='clearFloat'>
                <div class='thetit'>备注</div>
                <div class="inbox">
                  <el-input
                    placeholder="请输入内容"
                    clearable>
                  </el-input>
                </div>
            </li>
            <li class='clearFloat'>
                <div class='thetit'><span>*</span>操作系统</div>
                <div class="inbox">
                  <el-select
                    placeholder="请选择操作系统" 
                    v-model="os"
                  >
                  <el-option
                    v-for="list in osList"
                    :key="list.config_id"
                    :label="list.config_key"
                    :value="list.config_id">
                  </el-option>
                </el-select>
                </div>
            </li>
        </ul>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <div class="formTit">
            容量信息
            <div class="line"></div>
          </div>
        </template>
        <ul class="formBody">
            <li class='clearFloat'>
                <el-form-item label="特殊资源" prop="resource">
                  <el-radio-group v-model="ruleForm.resource">
                    <el-radio label="线上品牌商赞助"></el-radio>
                    <el-radio label="线下场地免费"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <div class='thetit'><span>*</span>资源池</div>
                <div class="inbox">
                  <el-select
                    placeholder="请选择资源池" 
                    v-model="poolid"
                    @change="sourcePoolChange"
                  >
                  <el-option
                    v-for="list in soucepoolList"
                    :key="list.pool_id"
                    :label="list.pool_name"
                    :value="list.pool_id">
                  </el-option>
                </el-select>
                </div>
            </li>
            <li class='clearFloat'>
                <div class='thetit'><span>*</span>vCPU数量</div>
                <div class="inbox">
                  <el-input-number :min="1"></el-input-number>
                </div>
            </li>
            <li class='clearFloat'>
                <div class='thetit'><span>*</span>内存（GB）</div>
                <div class="inbox">
                 <el-input-number  :min="1"></el-input-number>
                </div>
            </li>
            <li class='clearFloat' style="width:900px;height:80px;line-height:80px;padding-top:10px;">
                <div class='thetit'><span>*</span>存储（GB）</div>
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
                            <input type="text"/>
                          </div>
                        </td>
                        <td>
                          <div class="inputBox">
                             <input type="text"/>
                          </div>
                        </td>
                        <td>
                          <div class="inputBox"> <input type="text"/></div>
                        </td>
                        <td>
                          <div class="inputBox"> <input type="text"/></div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
            </li>
        </ul>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <div class="formTit">
            部署目标
            <div class="line"></div>
          </div>
        </template>
        <ul class="formBody">
            <li class='clearFloat'>
                <div class='thetit'>宿主机<span>*</span></div>
                <div class="inbox">
                  <el-select
                    placeholder="请选择宿主机" 
                    v-model="szj"
                  >
                  <el-option
                    v-for="list in hostList"
                    :key="list.id"
                    :label="list.name"
                    :value="list.id">
                  </el-option>
                </el-select>
                </div>
            </li>
            <li class='clearFloat'>
                <div class='thetit'>虚拟机目录</div>
                <div class="inbox">
                  <el-input
                    placeholder="请输入内容"
                    clearable>
                  </el-input>
                </div>
            </li>
            <li class='clearFloat'>
                <div class='thetit'>镜像<span>*</span></div>
                <div class="inbox">
                  <el-input
                    placeholder="请输入内容"
                    clearable>
                  </el-input>
                </div>
            </li>
            <li class='clearFloat'>
                <div class='thetit'><span>*</span>CPU插槽数</div>
                <div class="inbox">
                  <el-input-number v-model="num"  :min="1"></el-input-number>
                </div>
            </li>
            <li class='clearFloat' style="width:1100px;height:80px;line-height:80px;padding-top:10px;">
                <div class='thetit'><span>*</span>云硬盘</div>
                <div class="inbox formBodyC" style='width:900px'>
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
                      <tr v-for="(list,index) in thedata" :key='index'>
                        <td>
                          <div class="inputBox" style="font-size:16px;">
                            <i class="el-icon-sort-down" style="color:#409eff;cursor:pointer" @click="alterItem(index,index+1)" v-if='theleng!=index && index!=0'></i>
                            <i class="el-icon-sort-down" style="color:#ccc;cursor:not-allowed" v-if='theleng==index||index==0'></i>
                            <i class="el-icon-sort-up" style="color:#409eff;cursor:pointer" @click="alterItem(index,index-1)" v-if="index!=0 && index!=1"></i>
                            <i class="el-icon-sort-up" style="color:#ccc;cursor:not-allowed" v-if='index==0||index==1'></i>
                          </div>
                        </td>
                        <td>
                          <div class="inputBox">
                            {{list.disk_name}}
                          </div>
                        </td>
                        <td>
                          <div class="inputBox"> 
                            {{list.data_store}}
                          </div>
                        </td>
                        <td>
                          <div class="inputBox">
                            {{list.scsi_name}}
                          </div>
                        </td>
                        <td>
                          <div class="inputBox">
                            {{list.disk_type}}
                          </div>
                        </td>
                        <td>
                          <div class="inputBox">
                            {{list.capacity_gb}}
                          </div>
                        </td>
                        <td>
                          <div class="inputBox"> 
                            {{list.description}}
                          </div>
                        </td>
                        <td>
                          <div class="inputBox" style="color:#409eff;font-size:16px;cursor:pointer">
                            <i class="el-icon-edit" @click="detailCloudDisk(list)"></i>
                            <i class="el-icon-delete" @click='deleteCloudDisk(index,list.disk_name)' v-if="index!=0"></i>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <i class='el-icon-circle-plus-outline' 
                    @click="creatFom"
                    style="color:#409eff;font-size:16px;cursor:pointer"></i>
                    <span @click="submitForm('ruleForm')">xxx</span>
                </div>

            </li>
        </ul>
      </el-collapse-item>
      </el-form>
    </el-collapse>

    <addCloudDisk 
      ref="addCloud"
      v-if='isShow' 
      :thetitle="thetitle" 
      :is-show="isShow" 
      @closeDialog="closeDialog" 
      @addCloudDiskData="addCloudDiskData"
      :poolid="poolid">
    </addCloudDisk>
  </div>
</template>
<script>
import addCloudDisk from '../formComponents/compontents/addCloudDisk'
import * as requestMethod from '@/modules/apps/api/serviceCatalog/openstack/openstackApply.js'
export default {
  name: "vmware",
  data() {
    return {
      thedata:[],
      theleng:-1, //thedata.length-1
      activeNames: ['1','2','3'],
      thetitle:'附加云硬盘',
      isShow: false,
      osList:[],
      soucepoolList:[],
      hostList:[],
      mirrorImage:[{
        id:'1',
        label:'公共镜像'
      },{
        id:'2',
        label:'私有镜像'
      },{
        id:'3',
        label:'共享镜像'
      }],
      os:'',
      poolid:'',
      szj:'',
      ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
      rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
      }
    };
  },
  mounted() {
    this.theleng=this.thedata.length-1;
    this.requireOsList();
    this.requireSourcePoolList()
  },
  watch: {},
  methods: {
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    seeData(){
      console.log(this.thedata,'xxxxx')
    },
    detailCloudDisk(obj){
      this.isShow=true;
      this.thetitle='编辑云硬盘'
      this.$nextTick(function(){
        this.$refs.addCloud.thedetail(obj,this.thedata,true);
      })
    },
    deleteCloudDisk(index,name){
      this.$confirm(`确定删除${name}吗？该操作不可恢复`, '提示', {
        type: 'warning'
      })
      .then(() => {
          this.thedata.splice(index,1)
          this.theleng=this.thedata.length-1;
      }).catch(() => {

      });
    },
    creatFom(){
      this.thetitle='创建云硬盘'
      this.isShow=true;
      this.$nextTick(function(){
        this.$refs.addCloud.thedetail(null,this.thedata,false);
      })
    },
    closeDialog(res, obj) {
      this.isShow = false
    },
    alterItem(index1, index2) {
      this.thedata[index1] = this.thedata.splice(index2, 1, this.thedata[index1])[0]
    },
    addCloudDiskData(val){
      this.thedata.push(val);
      this.theleng=this.thedata.length-1;
    },
    requireOsList(){
      requestMethod.getOsList({config_type:'1'}).then(res => {
        if(res.code === 200){
          let items=res.data.items
          this.osList=items.filter((item)=>{
          return item.parent_id!=null
        })
        }
        
      });
    },
    requireSourcePoolList(){
      requestMethod.getSourcePoolList(9).then(res => {
        if(res.code === 200){
          this.soucepoolList=res.data.items;
          this.poolid=res.data.items[0].pool_id;
          this.requireListOfZYC()
        }
      });
    },
    sourcePoolChange(){
      this.szj='';
      this.requireListOfZYC();
    },
    requireListOfZYC(){
      var params={
        pool_id:this.poolid,
        source_type:JSON.stringify(['cluster_resource'])
      }
      requestMethod.getListOfZYC(params).then(res => {
        if(res.code === 200){
          this.hostList=res.data.items;
        }
      });
    }
  },
  components: {addCloudDisk}
};
</script>
<style lang="less" scoped>
.content{
  position: relative;
  /deep/ .el-collapse-item__arrow{
    position: absolute;
    left: 45px;
  }
  .formTit{
    padding-left: 60px;
    padding-right: 20px;
    font-size: 14px;
    width: 100%;
    background: rgba(48, 107, 255, 0.03);
    .line{
      float: right;
      margin-right: 200px;
      height:1px;
      background: #333;
      margin-top: 25px;
      width: calc(100% - 290px);
    }
  }
  .formBody{
    width:800px;
    margin-left:150px;
    li{
      height:60px;
      line-height: 60px;
      .thetit{
        float:left;
        width:150px;
        text-align: right;
        margin-right:15px;
        position:relative;
      }
      .thetit span{
          color: #f56c6c;
          position: absolute;
          right:-7px;
      }
      .inbox{
        float:left;
        width:400px;
      }
      .formBodyC {
        font-size: 14px;
        width:700px;
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
          line-height:30px;
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
          font-size:12px;
          padding:10px;
        }
        table tbody tr td .inputBox {
          height:30px;
          line-height:30px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        
       
      }
    }
  }
}
</style>