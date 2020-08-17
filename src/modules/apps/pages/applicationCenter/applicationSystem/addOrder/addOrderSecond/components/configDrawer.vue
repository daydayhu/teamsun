<template>
  <div class="configDrawer">
    <el-drawer
      :title="drawerTitle"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose"
      size="40%"
    >
      <div class="content">
        <el-tabs v-model="activeName">
          <el-tab-pane label="模板下载" name="temp">
            <el-table :data="tplTableData" v-loading="tplLoading" style="width: 100%">
              <el-table-column prop="name" label="模板名称"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    :disabled="scope.row.disable"
                    @click="onTempDownload(scope.row)"
                  >下载</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="配置导入" name="upload">
            <div class="upload">
              <div class="left">
                <el-upload
                  class="upload-demo"
                  :action="uploadUrl"
                  name="loadfile"
                  :show-file-list="false"
                  :limit="1"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  :on-success="uploadSuccess"
                >
                  <el-button size="small" type="primary">上传文件</el-button>
                  <div class="el-upload__tip" slot="tip">注：只 能 上 传 xlsx / xls 文 件</div>
                </el-upload>
              </div>
            </div>
            <el-tabs v-model="activeNameTable">
              <el-tab-pane
                v-for="(item, index) in tabData"
                :key="index"
                :label="item.sheet"
                :name="index.toString()"
              >
                <!-- <h5>{{ item.data[0].node_name}}</h5> -->
                <div class="wrap">
                  <div class="right">
                    <el-button
                      id="app_configDrawer_onImportForm"
                      type="text"
                      @click="onImportForm"
                    >批量导入</el-button>
                  </div>
                  <el-table
                    :data="item.data"
                    style="width: 100%"
                    v-loading="fileloading"
                    @selection-change="handleSelectionChange"
                  >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="node_name" label="服务名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="target_source" label="目标资源" show-overflow-tooltip>
                      <!-- <template slot-scope="scope">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="scope.row.target_source"
                          placement="bottom-start"
                        >
                          <span>{{ formateName(scope.row.target_source,20) }}</span>
                        </el-tooltip>
                      </template>-->
                    </el-table-column>
                    <el-table-column prop="is_flag" label="匹配">
                      <template slot-scope="scope">
                        {{scope.row.is_flag?'成功':'失败'}}&nbsp;&nbsp;
                        <span
                          v-if="!scope.row.is_flag"
                          style="color:red;"
                        >格式有误</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button type="text" @click="onUpload(scope.row)">{{scope.row.action}}</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="drawer_footer">
        <el-button id="app_configDrawer_onCancelForm" @click="onCancelForm">取 消</el-button>
        <!-- <el-button
          id="app_configDrawer_onSubmitForm"
          type="primary"
          @click="onSubmitForm"
          :loading="drawerLoading"
        >{{ drawerLoading ? "提交中 ..." : "确 定" }}</el-button> -->
      </div>
    </el-drawer>
  </div>
</template>
<script>
import * as requestMethod from "@/modules/apps/api/applicationCenter/addOrder/addOrderSecond.js";
export default {
  name: "configDrawer",
  props: {
    //是否显示
    configDrawerVisible: Boolean,
    //相关所需参数
    configDrawerData: {
      type: Object,
      default() {
        return {
          ticket_id: null,
        };
      },
    },
  },
  data() {
    return {
      drawer: this.configDrawerVisible,
      drawerLoading: false,
      drawerTitle: "集中配置下发",
      activeName: "temp",
      activeNameTable: "0",
      // fileTemp: null,
      // file: null,
      //文件上传
      uploadUrl: "/v1/api/app/systems/tickets/verify_tpl",
      fileloading: false,
      tabData: [],
      multipleSelection: {},
      loadfile: null,
      //模板下载
      tplLoading: false,
      tplTableData: [],
    };
  },
  created() {
    this.getTplList(this.configDrawerData.ticket_id);
  },
  methods: {
    //关闭事件
    handleClose() {
      this.dialogVisible = false;
      this.$emit("closeDrawer");
    },
    //取消事件
    onCancelForm() {
      this.dialogVisible = false;
      this.$emit("closeDrawer");
    },
    //提交事件
    onSubmitForm() {
      this.dialogVisible = false;
      this.$emit("handleSuccess");
    },
    //获取模板列表
    getTplList(ticket_id) {
      this.tplLoading = true;
      requestMethod.getConfigTpl("get", ticket_id).then((res) => {
        if (res.code == 200) {
          this.tplTableData = res.data.items;
          console.log("this.tplTableData", this.tplTableData);
        } else {
          this.$message.error(res.message);
        }
        this.tplLoading = false;
      });
    },
    //模板下载
    onTempDownload(row) {
      this.tplLoading = true;
      requestMethod
        .configTplDowmload("getBuffer", {
          ticket_id: row.ticket_id,
          form_source: row.form_source,
        })
        .then((response) => {
          console.log("response", response);
          if (response.status == 200) {
            var headers = response.headers;
            var filename = (headers["content-disposition"] || "")
              .split(";")[1]
              .split("filename*=UTF-8")[1];
            filename = filename.replace("''", "");
            filename = decodeURI(filename);
            var blob = new Blob([response.data], {
              type: headers["content-type"],
            });
            var link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();
          } else {
            this.$message.error("下载失败");
          }
          this.tplLoading = false;
        })
        .catch((error) => {
          this.tplLoading = false;
          this.$message.error(error.message);
        });
    },
    //上传成功事件
    uploadSuccess(res, file, fileList) {
      console.log("uploadSuccess", res, file, fileList);
      if (res.code == 200) {
        this.tabData = res.data;
        this.loadfile = file;
        console.log("uploadSuccess", this.loadfile);
      } else {
        this.$message.error(res.message);
      }
    },
    // 导入configTplImport
    onUpload(row) {
      this.fileloading = true;
      console.log("onUpload",this.loadfile)
      let formData = new FormData()
     // formData.append("ticket_id",this.configDrawerData.ticket_id)
      formData.append("loadfile",this.loadfile.raw)
      formData.append("sheet_name",row.sheet_name)
      formData.append("index",row.row)
      requestMethod
        .configTplImport("post", this.configDrawerData.ticket_id,formData
        //{
          // ticket_id: this.configDrawerData.ticket_id,
          // loadfile: this.loadfile,
          // sheet_name: row.sheet_name,
          // index: row.row,
        //}
        )
        .then((res) => {
          if (res.code == 200) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
          this.fileloading = false;
        });
    },
    // 文件列表多选事件
    handleSelectionChange(val) {

      this.multipleSelection.sheet_name = val[0].sheet_name;
      this.multipleSelection.index = val.map((e) => {
        return e.row;
      });
      console.log("handleSelectionChange", this.multipleSelection);
    },
    //批量导入
    onImportForm() {
      //判断是否选择
      if(this.multipleSelection.index.length<1){
        this.$message.warning("请选择导入的配置");
        return
      }
      this.fileloading = true;
       console.log("onUpload",this.loadfile)
      let formData = new FormData()
     // formData.append("ticket_id",this.configDrawerData.ticket_id)
      formData.append("loadfile",this.loadfile.raw)
      formData.append("sheet_name", this.multipleSelection.sheet_name)
      formData.append("index",this.multipleSelection.index.join(","))
      requestMethod
        .configTplImport("post", this.configDrawerData.ticket_id,formData
        // {
        //   ticket_id: this.configDrawerData.ticket_id,
        //   loadfile: this.loadfile,
        //   sheet_name: this.multipleSelection.sheet_name,
        //   index: this.multipleSelection.index.join(","),
        // }
        )
        .then((res) => {
          if (res.code == 200) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
          this.fileloading = false;
        });
    },
    formateName(str, len) {
      if (str && str.length > len) {
        return str.substr(0, len) + "...";
      } else {
        return str;
      }
    },
    // // excel表上传
    // handleChange(file, fileList) {
    //   this.fileTemp = file.raw;
    //   // 判断上传文件格式
    //   if (this.fileTemp) {
    //     if (
    //       this.fileTemp.type ==
    //         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    //       this.fileTemp.type == "application/vnd.ms-excel"
    //     ) {
    //       // this.importfxx(this.fileTemp);
    //     } else {
    //       this.$message({
    //         type: "warning",
    //         message: "附件格式错误，请删除后重新上传！"
    //       });
    //     }
    //   } else {
    //     this.$message({
    //       type: "warning",
    //       message: "请上传附件！"
    //     });
    //   }
    // },
    // // 移除excel表
    // handleRemove(file, fileList) {
    //   this.fileTemp = null;
    // },
    // importfxx(obj) {
    //   let _this = this;
    //   // 通过DOM取文件数据
    //   this.file = obj;
    //   var rABS = false; //是否将文件读取为二进制字符串
    //   var f = this.file;
    //   var reader = new FileReader();
    //   FileReader.prototype.readAsBinaryString = function(f) {
    //     var binary = "";
    //     var rABS = false; //是否将文件读取为二进制字符串
    //     var pt = this;
    //     var wb; //读取完成的数据
    //     var reader = new FileReader();
    //     reader.onload = function(e) {
    //       var bytes = new Uint8Array(reader.result);
    //       console.log(reader.result);
    //       var length = bytes.byteLength;
    //       for (var i = 0; i < length; i++) {
    //         binary += String.fromCharCode(bytes[i]);
    //       }
    //       var XLSX = require("xlsx");
    //       if (rABS) {
    //         wb = XLSX.read(btoa(fixdata(binary)), {
    //           //手动转化
    //           type: "base64"
    //         });
    //       } else {
    //         wb = XLSX.read(binary, {
    //           type: "binary"
    //         });
    //       }
    //       let sheetNames = wb.SheetNames;
    //       let tempArr = [];
    //       sheetNames.forEach(e => {
    //         let obj = {};
    //         obj.name = e;
    //         let outdata = [];
    //         outdata = XLSX.utils.sheet_to_json(wb.Sheets[e]);
    //         console.log("outdata", outdata);
    //         let arr = [];
    //         outdata.forEach(e => {
    //           obj.tableTitle = Object.keys(e)[0];
    //           arr.push(Object.values(e));
    //         });
    //         console.log("arr", arr);
    //         console.log("obj", obj);
    //         tempArr.push(obj);
    //       });
    //       _this.tabData = tempArr;
    //       console.log("tabData", _this.tabData);
    //     };
    //     reader.readAsArrayBuffer(f);
    //   };
    //   if (rABS) {
    //     reader.readAsArrayBuffer(f);
    //   } else {
    //     reader.readAsBinaryString(f);
    //   }
    // }
  },
};
</script>

<style lang="less" scoped>
.content {
  padding: 0 15px 0px 15px;
}
.table {
  margin: 15px;
}
.upload {
  display: flex;
  justify-content: space-between;
}
.wrap {
  position: relative;
  .right {
    position: absolute;
    right: 0px;
    top: -50px;
  }
}
/deep/.el-tabs__content {
  overflow: inherit;
}
</style>
