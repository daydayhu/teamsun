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
              <div class='inbox'>
                <el-form-item label="上传附件" prop="region">
                  <el-upload class="upload-demo" :action="`${ip}/v1/api/file_storage/file_store/files?custom_path=attachments`" :on-preview="handlePreview" :on-remove="handleRemove"
                    :before-remove="beforeRemove" multiple :on-exceed="handleExceed" :file-list="fileList" :on-success="handleSuccess">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </div>
  </div>
</template>
<script>
import * as requestMethod from '@/modules/apps/api/serviceCatalog/theLogForm.js'
import { Bus, canvasEvent } from '@/modules/apps/bus/form.bus.js';

export default {
  name: "internet",
  data() {
    return {
      theForm: { region: "" },
      ip: '',
      fileList: [],
      activeNames: ['1'],
      rules: {
        region: [
          { required: true, message: "请选择备份类型", trigger: "change" }
        ],
      }
    };
  },
  props: {
    canvasObj: {
      type: Object
    }
  },
  mounted() {
    this.isFirstReload = false;
  },
  created() {
    // this.getList();
    // this.getNetworkInfo();
    this.getFileList();
    console.log(this.canvasObj.service_uuid);
  },
  computed: {
  },
  watch: {
  },
  methods: {
    forComponentContent() {
      var obj = {
        flag: true,
        mess: ""
      }
      return obj
    },
    async getUploadIp() {
      let ipRes = await requestIP.getUploadIp("get")
      if (ipRes.code == 200) {
        this.ip = ipRes.data.item.name
        console.log(ipRes.data.item.name);
      }
    },
    handleSuccess(response, file, fileList) {
      if (response.code == 200) {
        // this.$message({
        //   message: '文件上传成功',
        //   type: 'success'
        // });
        let param =
        {
          app_id: this.$route.query.app_id,
          ticket_id: this.$route.query.ticket_id,
          "size": response.data.file_info[0].size,
          "storage_path": response.data.file_info[0].storage_path,
          "download_url": response.data.file_info[0].download_url,
          "no_domain_url": response.data.file_info[0].no_domain_url,
          "upload_remote_ip": response.data.file_info[0].upload_remote_ip,
          "file_md5": response.data.file_info[0].file_md5,
          "file_name": response.data.file_info[0].name,
        }
        requestMethod.save_files('post', param).then(res => {
          if (res.code == 200) {
            file.service_file_id = res.data.service_file_id
            //this.getFileList();
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        this.$message({
          message: response.message,
          type: 'warning'
        });
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      let param = {
        service_file_id: file.service_file_id
      }
      requestMethod.delete_files('delete', param).then(res => {
        if (res.code == 200) {

          //this.getFileList();
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    requestFileApi(type, param) {
      requestMethod.get_post_file_list(type, param).then(res => {
        if (res.code == 200) {
          if (res.data.items.length) {
            let listArry = res.data.items.map(t => {
              return {
                name: t.file_name,
                service_file_id: t.service_file_id
              }
            })
            this.fileList = listArry;
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getFileList() {
      let param = {
        app_id: this.$route.query.app_id,
        ticket_id: this.$route.query.ticket_id
      }
      this.requestFileApi("get", param)
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
    }
  }
}
</style>
