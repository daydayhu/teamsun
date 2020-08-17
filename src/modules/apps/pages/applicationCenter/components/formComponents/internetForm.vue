<template>
  <div class="content el-collapse">
    <div>
      <el-form :model="theForm" :rules="rules" ref="theForm" label-width="160px" class="demo-ruleForm">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <template slot="title">
              <div class="formTit">
                基本信息
                <div class="line"></div>
              </div>
            </template>
            <div class="formBody">
              <el-form-item label="网络区域" prop="area_name">
                <el-select placeholder="请选择网络区域" v-model="theForm.area_name" @change="getInterNet" :disabled="isApproval">
                  <el-option v-for="list in internetAreaList" :key="list.config_id" :label="list.value_json" :value="list.value_json+'-'+list.config_key">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="网络类型" prop="area_type_name">
                <el-select placeholder="请选择网络类型" v-model="theForm.area_type_name" @change="getInterNetType" :disabled="isApproval">
                  <el-option v-for="list in internetTypeList" :key="list.config_id" :label="list.value_json" :value="list.value_json+'-'+list.config_key">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="网段" prop="cidr">
                <el-select placeholder="请选择网段" v-model="theForm.cidr" multiple :multiple-limit="2" :disabled="isApproval" @change="getCid">
                  <el-option v-for="list in internetList" :key="list.cidr_id" :label="list.cidr" :value="list.cidr">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </div>
  </div>
</template>
<script>
import * as requestMethod from '@/modules/apps/api/serviceCatalog/openstack/internet.js'
import { Bus, canvasEvent } from '@/modules/apps/bus/form.bus.js';
export default {
  name: "internet",
  data() {
    return {
      isApproval: false,
      isNew: true,
      isEdit: true,
      isStage: true,
      isFirstReload: true,
      internetList: [],
      internetAreaList: [],
      internetTypeList: [],
      activeNames: [],
      ticket_obj_id: "",
      List: [
        { id: 1, os_version: "" },
        { id: 2, os_version: "" },
      ],
      isShow: false,
      theForm: {
        area_name: "",
        area_type_name: "",
        cidr: []
      },
      canvas_uuid: "6955BEE1-DEAA-4E11-803E-FD58AEA520C6",
      isSame: "",
      rules: {
        area_name: [
          { required: true, message: '请选择网络区域', trigger: 'change' },
        ],
        area_type_name: [
          { required: true, message: '请选择网络类型', trigger: 'change' }
        ],
        cidr: [
          { required: true, message: '请选择网段', trigger: 'blur' }
        ],
      }
    };
  },
  props: {
    canvasObj: {
      type: Object
    },
    phaseState: {
      type: String
    }
  },
  mounted() {
    this.isFirstReload = false;
  },
  created() {
    this.getList();
    this.getNetworkInfo();
    console.log(this.phaseState);
    this.phaseState == '2' || this.phaseState == '4' ? this.isApproval = true : this.isApproval = false
  },
  computed: {
    area_name() {
      return this.theForm.area_name
    },
    area_type_name() {
      return this.theForm.area_type_name
    },
    cidr_id() {
      return this.theForm.cidr_id
    }
  },
  watch: {
    area_name(newValue, oldValue) {
      if (this.theForm.area_type_name) {
        this.isSame = this.theForm.area_type_name + this.theForm.area_name;
        this.getInternetList()
        this.isEdit = false;
        //this.isFirstReload ? '' : this.theForm.cidr = "";
      } else {
        this.isEdit = true;
      }
    },
    area_type_name(newValue, oldValue) {
      if (this.theForm.area_name) {
        this.isEdit = false
        if (this.isSame == this.theForm.area_type_name + this.theForm.area_name) {
          return
        }
        this.getInternetList()
        //this.isFirstReload ? '' : this.theForm.cidr = "";
      } else {
        this.isEdit = true;
      }
    },
    cidr_id(val) {
      this.isFirstReload = false;
      console.log(val);
    }
  },
  methods: {
    getcidr(val) {
      console.log(val)
    },
    getInterNet(val) {
      this.theForm.cidr = '';
      // TODO: 参数 eventName(事件名称)、param(回传数据)
      let arr = val.split('-');
      this.theForm.area_key = arr[1];
      this.theForm.area_name = arr[0];
      this.busEmitData(arr[0], this.theForm.area_type_name, this.theForm.cidr);
      this.toEditNetwork()
    },
    getInterNetType(val) {
      this.theForm.cidr = '';
      let arr = val.split('-');
      this.theForm.area_type = arr[1];
      this.theForm.area_type_name = arr[0];
      this.busEmitData(this.theForm.area_name, arr[0], this.theForm.cidr);
      this.toEditNetwork()
    },
    getCid(val) {
      this.$forceUpdate()
      let busData = val.join(',')
      this.busEmitData(this.theForm.area_name, this.theForm.area_type_name, busData);
      this.toEditNetwork()
    },
    busEmitData(a, b, c) {
      let param = {
        network_area: a,
        network_type: b,
        network_cidr: c,
        service_uuid: this.canvasObj.service_uuid
      }
      Bus.$emit('dispatchCanvasEvent', canvasEvent.network_event_1, param);
    },
    getInternetList() {
      let params = {
        bus_id: this.$route.query.bus_id,
        area_key: this.theForm.area_key,
        area_type: this.theForm.area_type
      }
      requestMethod.getDataNetListg('get', params).then(res => {
        if (res.code == 200) {
          this.internetList = res.data.items;
        }
      })
    },
    async getNetworkInfo() {
      let params = {
        app_id: this.$route.query.app_id,
        ticket_id: this.$route.query.ticket_id,
        canvas_uuid: this.canvasObj.service_uuid
      }
      requestMethod.net_work_get_post('get', params).then(res => {
        if (res.code == 200) {
          if (res.data) {
            let arr = [];
            this.isNew = false;
            this.ticket_obj_id = res.data.ticket_obj_id;
            this.theForm = JSON.parse(JSON.stringify(res.data));
            if (this.theForm.cidr_list[0].cidr) {
              this.theForm.cidr_list.forEach(t => {
                arr.push(t.cidr);
              })
            } else {
              arr = []
            }
            this.theForm.cidr = arr;
            // this.busEmitData(this.theForm.area_type_name, this.theForm.area_type_name, this.theForm.cidr);
            this.busEmitData(this.theForm.area_name, this.theForm.area_type_name, this.theForm.cidr);
            console.log(this.theForm.cidr);
          } else {
            this.isNew = true;
          }
        }
      })
    },
    async getList() {
      let params1 = {
        config_type: "2"
      }
      let params2 = {
        config_type: "17"
      }
      requestMethod.getDataBase('get', params1).then(res => {
        if (res.code == 200) {
          this.internetAreaList = res.data.items.filter(item => item.value_json !== '网络区域')
        }
        console.log(this.internetAreaList);
      })
      requestMethod.getDataBase('get', params2).then(res => {
        if (res.code == 200) {
          this.internetTypeList = res.data.items.filter(item => item.value_json !== '网络类型')
        }
      })
    },
    forComponentContent() {
      //console.log('network', this.productInfo)
      return this.submitForm('theForm');
    },
    //点击保存事件
    submitForm(formName) {
      let obj = { flag: true, mess: "带*号的为必填项" };
      this.$refs[formName].validate(valid => {
        if (valid) {
          obj.flag = true;
        } else {
          obj.flag = false;
        }
      });
      return obj;
    },
    // async SaveOperationSet() {
    //   let params = {
    //     app_id: this.$route.query.app_id,
    //     ticket_id: this.$route.query.ticket_id,
    //     canvas_uuid: this.canvasObj.service_uuid,
    //     "area_key": this.theForm.area_key,
    //     "area_name": this.theForm.area_name,
    //     "area_type": this.theForm.area_type,
    //     "area_type_name": this.theForm.area_type_name,
    //     "cidr_id": 0,
    //     "cidr": this.theForm.cidr,
    //     "ticket_cidr_id": this.ticket_cidr_id
    //   }
    //   this.theForm.cidr_id ? params.cidr_id = this.theForm.cidr_id : params.cidr_id = 0
    //   params.ticket_cidr_id = this.ticket_cidr_id;
    //   return await requestMethod.net_work_get_post('put', params).then(res => {
    //     return this.alertMess(res);
    //   })
    // },
    alertMess(res) {
      var sj = {
        flag: true,
        mess: ""
      }
      if (this.isAllSave === true) {
        if (res.code == 200) {
          sj.flag = true;
          sj.mess = res.message
        } else {
          sj.flag = false;
          sj.mess = res.message
        }
        this.isAllSave = false;
        return sj
      } else {
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
        if (res.code != 200) {
          this.$notify.error({
            title: '失败',
            message: `${res.message}`,
            position: 'bottom-right',
            duration: 3000
          });
        }
      }
    },
    async toEditNetwork() {
      var arr = [];
      if (this.theForm.cidr.length) {
        arr = [];
        this.theForm.cidr.forEach(t => {
          this.internetList.forEach(m => {
            if (t == m.cidr) {
              arr.push(
                { cidr: m.cidr, cidr_id: m.cidr_id }
              )
            }
          })
        })
      }
      let params = {
        app_id: this.$route.query.app_id,
        ticket_id: this.$route.query.ticket_id,
        canvas_uuid: this.canvasObj.service_uuid,
        ticket_obj_id: "",
        "area_key": this.theForm.area_key,
        "area_name": this.theForm.area_name,
        "area_type": this.theForm.area_type,
        "area_type_name": this.theForm.area_type_name,
      }
      if (this.isNew) {
        this.theForm.cidr_id ? params.cidr_id = this.theForm.cidr_id : params.cidr_id = 0
        return await requestMethod.net_work_get_post('post', params).then(res => {
          if (res.code == 200) {
            this.ticket_obj_id = res.data.ticket_obj_id;
            this.isNew = false;
          } else {
            this.$notify.error({
              title: '错误',
              message: `${res.message}`,
              position: 'bottom-right',
              duration: 3000
            });
          }
        })
      } else {
        params.ticket_obj_id = this.ticket_obj_id;
        arr.length ? params.cidr_list = arr : ''
        return await requestMethod.net_work_get_post('put', params).then(res => {
          if (res.code == 200) {
          } else {
            this.$notify.error({
              title: '错误',
              message: `${res.message}`,
              position: 'bottom-right',
              duration: 3000
            });
          }
        })
      }
    }
  },
  components: {}
};
</script>
<style lang="less" scoped>
.content {
  position: relative;
  padding: 15px 20px;
  /deep/ .el-collapse-item__arrow {
    position: absolute;
    left: 45px;
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
    margin-left: 120px;
    width: 80%;
    .tableCon {
      height: 80px;
      line-height: 80px;
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
          padding: 10px;
        }
        table tbody tr td .inputBox {
          height: 30px;
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
