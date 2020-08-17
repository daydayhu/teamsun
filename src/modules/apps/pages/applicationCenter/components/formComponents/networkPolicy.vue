<template>
  <div class="internetPolicyForm">
    <div class="base_card_content wrap">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item name="baseInfo">
          <template slot="title">
            <div class="formTit">
              基本信息
              <div class="line"></div>
            </div>
          </template>
          <el-row class="table">
            <el-row type="flex" justify="start">
               <el-button
               v-if="checkData.allow_submit"
                type="text"
                @click="onCheck"
              >提交校验</el-button>
              <div class="check" v-if="phaseState == '4'">
                <span>状态：</span>
                <span>{{checkData.overall_status}}</span>
              </div>
              <el-button
                v-if="checkData.allow_submit"
                type="text"
                @click="onDetail"
              >详情</el-button>
              <!-- <el-button
                :disabled="isDisabled"
                type="text"
                icon="el-icon-upload2"
                @click="onExport"
              >导入</el-button>
              <el-button
                :disabled="isDisabled"
                type="text"
                icon="el-icon-download"
                @click="onDownload"
              >模板下载</el-button> -->
            </el-row>
            <div class="table_wrap">
              <table
                id="app_networkPolicy_table"
                border="0"
                border-collapse="collapse"
                v-loading="tableLoading"
              >
                <thead>
                  <tr class="tableHeader_tr">
                    <th v-if="phaseState=='3'||phaseState=='4'||phaseState=='5'">需求行号</th>
                    <th><span>*</span>源IP</th>
                    <th><span>*</span>源服务器名称</th>
                    <th v-if="phaseState=='3'||phaseState=='4'||phaseState=='5'">源IP映射</th>
                    <th><span>*</span>目标IP</th>
                    <th><span>*</span>目标服务器名称</th>
                    <th v-if="phaseState=='3'||phaseState=='4'||phaseState=='5'">目标IP映射</th>
                    <th><span>*</span>目标端口</th>
                    <th><span>*</span>服务类型</th>
                    <th>连接时长</th>
                    <th v-if="phaseState=='3'||phaseState=='4'||phaseState=='5'">策略开通开始时间</th>
                    <th v-if="phaseState=='3'||phaseState=='4'||phaseState=='5'">策略开通结束时间</th>
                    <th v-if="phaseState=='3'||phaseState=='4'||phaseState=='5'"><span>*</span>备注</th>
                    <th class="operation_th"></th>
                    <th class="table_operation">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="tableContent_tr" v-for="(item,index) in tableData" :key="index">
                    <td v-if="phaseState=='3'||phaseState=='4'||phaseState=='5'">{{item.number}}</td>
                    <td>
                      <el-input
                        :disabled="isDisabled"
                        v-model="item.source_ip"
                        placeholder="请输入内容"
                        @change="onSave(item)"
                      ></el-input>
                    </td>
                    <td>
                      <el-input
                        :disabled="isDisabled"
                        v-model="item.source_server"
                        placeholder="请输入内容"
                        @change="onSave(item)"
                      ></el-input>
                    </td>
                    <td v-if="phaseState=='3'||phaseState=='4'||phaseState=='5'">
                      <el-input
                        :disabled="isDisabled"
                        v-model="item.source_map"
                        placeholder="请输入内容"
                        @change="onSave(item)"
                      ></el-input>
                    </td>
                    <td>
                      <el-input
                        :disabled="isDisabled"
                        v-model="item.target_ip"
                        placeholder="请输入内容"
                        @change="onSave(item)"
                      ></el-input>
                    </td>
                    <td>
                      <el-input
                        :disabled="isDisabled"
                        v-model="item.target_server"
                        placeholder="请输入内容"
                        @change="onSave(item)"
                      ></el-input>
                    </td>
                    <td v-if="phaseState=='3'||phaseState=='4'||phaseState=='5'">
                      <el-input
                        :disabled="isDisabled"
                        v-model="item.target_map"
                        placeholder="请输入内容"
                        @change="onSave(item)"
                      ></el-input>
                    </td>
                    <td>
                      <el-input
                        :disabled="isDisabled"
                        v-model="item.target_port"
                        placeholder="请输入内容"
                        @change="onSave(item)"
                      ></el-input>
                    </td>
                    <td>
                      <el-select
                        :disabled="isDisabled"
                        v-model="item.service_type"
                        placeholder="请选择"
                        @change="onSave(item)"
                      >
                        <el-option
                          v-for="item in serviceTypeData"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </td>
                    <td>
                      <el-select
                        :disabled="isDisabled"
                        v-model="item.connect_span"
                        placeholder="请选择"
                        @change="onSave(item)"
                      >
                        <el-option
                          v-for="item in connTimeData"
                          :key="item.value"
                          :label="item.label"
                          :value="item.label"
                        ></el-option>
                      </el-select>
                    </td>
                    <td v-if="phaseState=='3'||phaseState=='4'||phaseState=='5'">
                      <el-date-picker
                        :disabled="isDisabled"
                        v-model="item.start_time"
                        type="datetime"
                        placeholder="选择日期时间"
                        default-time="12:00:00"
                        default-value="1970-01-01 12:00:00"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="onSave(item)"
                      ></el-date-picker>
                    </td>
                    <td v-if="phaseState=='3'||phaseState=='4'||phaseState=='5'">
                      <el-date-picker
                        :disabled="isDisabled"
                        v-model="item.end_time"
                        type="datetime"
                        placeholder="选择日期时间"
                        default-time="12:00:00"
                        default-value="1970-01-01 12:00:00"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="onSave(item)"
                      ></el-date-picker>
                    </td>
                    <td v-if="phaseState=='3'||phaseState=='4'||phaseState=='5'">
                      <el-input
                        :disabled="isDisabled"
                        v-model="item.remarks"
                        placeholder="请输入内容"
                        @change="onSave(item)"
                      ></el-input>
                    </td>
                    <td></td>
                    <td class="table_button">
                      <el-button
                        :disabled="isDisabled"
                        type="text"
                        style="color:#F56C6C"
                        @click="onDelete(item,index)"
                      >
                        <i class="el-icon-delete" style="margin-right:5px"></i>删除
                      </el-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div id="app_networkPolicy_onAdd" class="button" @click="onAdd">
              <i class="el-icon-plus" style="margin-right:5px"></i>添加
            </div>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!----------------------------------------- 失败详情 -------------------------------------------->
    <el-dialog title="失败详情" :v-loading="detailLoading" :visible.sync="detailDialogVisible" width="50%">
      <el-table
      :data="detailData"
      style="width: 100%">
      <el-table-column
        prop="number"
        label="需求行号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="guidance"
        label="指导意见"
        >
      </el-table-column>
      </el-table>
      <span slot="footer" >
        <el-button type="primary" @click="detailDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!----------------------------------------- 模板导入 -------------------------------------------->
    <!-- <el-dialog title="模板导入" :visible.sync="dialogVisible" width="40%">
      <div class="loadContent">
        <el-upload
          drag
          :action="loadActionUrl"
          :data="loadData"
          :on-success="loadSuccess"
          :on-error="loadError"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
//addNetworkStrategy
import * as requestMethod from "@/modules/apps/api/serviceCatalog/serviceCatalogList.js";
export default {
  name: "networkPolicy",
  props: {
    // isAdd: Boolean,
    // app_id: Number,
    // ticket_id: Number,
    // strategy_id: Number,
    // canvas_uuid: Number,
    phaseState: {
      type: String,
       default: "4"
    },
    isEditable:{
      type:Boolean
    },
    canvasObj: {
      type: Object,
      default() {
        return {
          service_uuid: "FCD02FA5-A07A-4950-9199-AB50F594E6E8",
          app_id: 69,
          ticket_id: 130
        };
      }
    }
  },
  data() {
    return {
      activeNames: "baseInfo",
      isDisabled: false,
      //
      tableLoading: false,
      //表头数据
      tableHeader: [
        "源IP",
        "源服务名称",
        "目标IP",
        "目标服务器名称",
        "目标端口",
        "服务类型",
        "连接时长"
      ],
      //表格数据
      tableData: [],
      //数据长度
      currentLen: null,
      //服务类型数据
      serviceTypeData: [
        {
          label: "标准服务",
          value: 1
        },
        {
          label: "长链接",
          value: 2
        }
      ],
      //连接时常数据
      connTimeData: [
        {
          label: "30m",
          value: 0
        },
        {
          label: "1h",
          value: 1
        },
        {
          label: "2h",
          value: 2
        },
        {
          label: "4h",
          value: 4
        },
        {
          label: "6h",
          value: 6
        },
        {
          label: "8h",
          value: 8
        },
        {
          label: "10h",
          value: 10
        },
        {
          label: "12h",
          value: 12
        },
        {
          label: "14h",
          value: 14
        },
        {
          label: "16h",
          value: 16
        },
        {
          label: "18h",
          value: 18
        },
        {
          label: "24h",
          value: 24
        },
        {
          label: "48h",
          value: 48
        },
        {
          label: "72h",
          value: 72
        }
      ],
      //校验数据
      checkData:{
        allow_submit:false,
        overall_status:""
      },
      subCheckData:{
        strategy_uuids:[]
      },
      //失败详情
      detailDialogVisible:false,
      detailLoading:false,
      detailData:[],
      //模板导入dialog
      // dialogVisible: false,
      // loadActionUrl: "/v1/api/app/systems/strategy/load",
      // loadData: {}
    };
  },
  created() {
    //根据阶段判断是否表单禁用
    if (this.phaseState == "2" || this.phaseState == "4") {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
    //判断人是否可编辑
    this.isDisabled=!this.isEditable
    if (this.phaseState == "4"){
      this.getNetworkStrategyCheck(this.canvasObj.app_id,this.canvasObj.ticket_id)
    }
    this.getNetworkStrategy(this.canvasObj.service_uuid);

    this.loadData = {
      canvas_uuid: this.canvasObj.service_uuid
    };
  },
  methods: {
    forComponentContent() {
      console.log("networkPolicy", this.tableData);
      return this.submitForm("networkPolicy");
    },
    //点击保存事件
    submitForm(formName) {
      //暂时不用校验
      var obj = { flag: true, mess: "带*号的为必填项" };
      // this.$refs[formName].validate(valid => {
      //   if (valid) {
      //     obj.flag = true;
      //   } else {
      //     obj.flag = false;
      //   }
      // });
      return obj;
    },
    //提交表单事件
    onSave(item) {
      let para = null;
      //当有strategy_id时代表是编辑
      if (item.hasOwnProperty("strategy_id")) {
        para = {
          strategy_id: item.strategy_id,
          body: {
            number: item.number,
            start_time: item.start_time,
            end_time: item.end_time,
            source_map: item.source_map,
            target_map: item.target_map,
            remarks: item.remarks,

            service_type: item.service_type,
            connect_span: item.connect_span,
            source_ip: item.source_ip,
            source_server: item.source_server,
            target_ip: item.target_ip,
            target_port: item.target_port,
            target_server: item.target_server
          }
        };
        requestMethod.editNetworkStrategy("put", para).then(res => {
          if (res.code === 200) {
            this.$notify.success({
              title: "成功",
              message: `${res.message}`,
              position: "bottom-right",
              duration: 3000
            });
            this.getNetworkStrategy(this.canvasObj.service_uuid);
          } else {
            this.$notify.error({
              title: "失败",
              message: `${res.message}`,
              position: "bottom-right",
              duration: 3000
            });
          }
        });
      } else {
        //当没有strategy_id时代表是新增
        para = {
          number: item.number,
          start_time: item.start_time,
          end_time: item.end_time,
          source_map: item.source_map,
          target_map: item.target_map,
          remarks: item.remarks,
          app_id: this.canvasObj.app_id,
          ticket_id: this.canvasObj.ticket_id,
          canvas_uuid: this.canvasObj.service_uuid,
          service_type: item.service_type,
          connect_span: item.connect_span,
          source_ip: item.source_ip,
          source_server: item.source_server,
          target_ip: item.target_ip,
          target_port: item.target_port,
          target_server: item.target_server
        };
        requestMethod.addNetworkStrategy("post", para).then(res => {
          if (res.code === 200) {
            this.$notify.success({
              title: "成功",
              message: `${res.message}`,
              position: "bottom-right",
              duration: 3000
            });
            this.getNetworkStrategy(this.canvasObj.service_uuid);
          } else {
            //this.$message.error(res.message);
            this.$notify.error({
              title: "失败",
              message: `${res.message}`,
              position: "bottom-right",
              duration: 3000
            });
          }
        });
      }
      //editNetworkStrategy
    },
    //获取详情
    getNetworkStrategy(canvas_uuid) {
      this.tableLoading = true;
      requestMethod.getNetworkStrategy("get", { canvas_uuid }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.items;
          this.currentLen = this.tableData.length;
          this.subCheckData.strategy_uuids=res.data.items.map(e=>{
            return e.strategy_uuid
          })
        } else {
          this.$message.error(res.message);
        }
        this.tableLoading = false;
      });
    },
    //  获取表单校验状态
    getNetworkStrategyCheck(app_id,ticket_id){
      this.tableLoading = true;
      requestMethod.getNetworkStrategyCheck("get", {
        app_id,
        ticket_id
        }).then(res => {
        if (res.code === 200) {
          this.checkData = res.data;
        } else {
          this.$message.error(res.message);
        }
        this.tableLoading = false;
      });

    },
    //获取失败详情指导意见
    getNetworkStrategyCheckDetail(app_id,ticket_id){
      this.detailLoading = true;
      requestMethod.getNetworkStrategyCheckDetail("get", {
        app_id,
        ticket_id
        }).then(res => {
        if (res.code === 200) {
          this.detailData = res.data.items;
        } else {
          this.$message.error(res.message);
        }
        this.detailLoading = false;
      });

    },
    //添加
    onAdd() {
      if (this.currentLen == null) {
        this.$message.warning("获取网络策略信息失败，无法添加数据");
      } else {
        if (this.currentLen !== this.tableData.length) {
          this.$message.warning(
            "一次只能添加一条数据,请填写完上条数据后再添加"
          );
        } else {
          this.tableData.push({
            app_id: this.canvasObj.app_id,
            ticket_id: this.canvasObj.ticket_id,
            canvas_uuid: this.canvasObj.service_uuid,
            number: this.tableData.length + 1,
            service_type: 1,
            connect_span: "30m",
            source_ip: "",
            source_server: "",
            source_map: "",
            target_ip: "",
            target_port: 0,
            target_server: "",
            target_map: "",
            start_time: "1970-01-01 12:00:00",
            end_time: "1970-01-01 12:00:00",
            remarks: ""
          });
        }
      }
      console.log("this.tableData", this.tableData);
    },
    //删除
    onDelete(item, index) {
      //当有strategy_id时代表是走删除接口
      if (item.hasOwnProperty("strategy_id")) {
        this.$confirm("确认删除此条数据吗?", "提示", {
          type: "warning"
        })
          .then(() => {
            this.tableLoading = true;
            requestMethod
              .delNetworkStrategy("delete", item.strategy_id)
              .then(res => {
                if (res.code == 200) {
                  this.$message.success(res.message);
                  this.getNetworkStrategy(this.canvasObj.service_uuid);
                } else {
                  this.$message.error(res.message);
                }
                this.tableLoading = false;
              });
          })
          .catch(() => {});
      } else {
        //当没有strategy_id时直接删除
        this.tableData.splice(index, 1);
      }
    },
    //提交校验
    onCheck(){
      this.checkData.overall_status="校验中"
      requestMethod.subNetworkStrategyCheck("post", this.subCheckData).then(res => {
          if (res.code === 200) {
            this.$notify.success({
              title: "成功",
              message: `${res.message}`,
              position: "bottom-right",
              duration: 3000
            });
            this.getNetworkStrategyCheck(this.canvasObj.app_id,this.canvasObj.ticket_id)
          } else {
            this.$notify.error({
              title: "失败",
              message: `${res.message}`,
              position: "bottom-right",
              duration: 3000
            });
            this.checkData.overall_status="校验失败"
          }
        });

    },
    //失败详情
    onDetail(){
      this.detailDialogVisible=true
      this.getNetworkStrategyCheckDetail(this.canvasObj.app_id,this.canvasObj.ticket_id)

    },
    // //模板导入
    // onExport() {
    //   this.dialogVisible = true;
    // },
    // //模板导入成功
    // loadSuccess(res) {
    //   console.log("loadSuccess", res);
    //   if (res.code == 200) {
    //     this.$message.success(res.message);
    //     this.dialogVisible = false;
    //     this.getNetworkStrategy(this.canvasObj.service_uuid);
    //   } else {
    //     this.$message.error(res.message);
    //   }
    // },
    // //模板导入失败
    // loadError(res) {
    //   console.log("loadError", res);
    // },
    // //模板导入提交-networkStrategyLoad
    // load() {},
    // //模板下载
    // onDownload() {},

    //折叠面板事件
    handleChange(val) {}
  }
};
</script>

<style lang="less" scoped>
.internetPolicyForm {
  background-color: #ffffff;
  height: 100%;
  position: relative;
  .check{
    line-height: 32px;
    margin:0 24px;
  }
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
  .loadContent {
    display: flex;
    justify-content: center;
  }
  .wrap {
    margin: 20px;
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
  .table {
    margin: 10px;

    position: relative;
    .table_wrap {
      overflow-x: auto;
      margin-bottom: 40px;
    }
    .button {
      position: absolute;
      bottom: 0px;
      width: 100%;
      margin-top: 15px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      color: #409eff;
      border: 1px dashed rgba(24, 34, 59, 0.25);
      // background-color: #ecf5ff;
      // border: 1px solid #b3d8ff;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        border: 1px solid #409eff;
        font-weight: 700;
      }
    }
    table {
      border-collapse: collapse;
      width: fit-content;
      min-width: 100%;
      td {
        padding: 0px 10px;
      }
      .tableHeader_tr {
        border-radius: 4px;
        position: relative;
        span{
          color: red;
        }
        .operation_th {
          min-width: 70px;
        }
        .table_operation {
          min-width: 60px;
          line-height: 54px;
          position: absolute;
          right: 0px;
          background: rgba(247, 249, 255);
        }
        th {
          padding: 0px 10px;
          height: 54px;
          min-width: 120px;
          background: rgba(48, 107, 255, 0.03);
          text-align: left;
          font-size: 14px;
          font-family: "PingFangSC-Regular, PingFang SC";
          font-weight: 400;
          color: rgba(25, 34, 59, 1);
        }
      }
      .tableContent_tr {
        height: 60px;
        border-bottom: 1px solid #e7edf3;
        position: relative;
        .table_button {
          height: 58px;
          line-height: 58px;
          position: absolute;
          right: 0px;
          background-color: #fff;
          border-left: 1px solid rgba(48, 107, 255, 0.03);
        }
      }
    }
  }
}
</style>
