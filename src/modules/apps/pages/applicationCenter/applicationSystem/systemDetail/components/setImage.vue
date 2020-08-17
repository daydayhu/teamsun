<template>
  <div class="user-dialog">
    <el-dialog :visible.sync="dialogFormVisible" @close="close" width="40%">
      <template slot="title">
        <div class="dialog-title">上传图片</div>
      </template>
      <el-form ref="cloudForm" :rules="rules" :model="editData" :label-position="'left'" label-width="80px">
        <div class="add-user-groups-content">
          <el-form-item label="节点名称" prop="_name">
            <el-input v-model="editData._name"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div>
        <el-upload class="avatar-uploader" ref="uploadFileCom" :auto-upload="false" style="width:100%" :action="`${ip}/v1/api/file_storage/file_store/files?custom_path=images`"
          :on-success="handleSuccess" :on-error="handleError" :on-progress="propgress" :limit="1" :file-list="fileList" :on-change="uploadFile" :show-file-list="false">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件
          </div>
        </el-upload>
        <div class="image-box">
          <!-- <svg-icon icon-class='upload' class="upload"></svg-icon> -->
          <img :src="imageUrl" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save('cloudForm')">确 定</el-button>
        <el-button @click="close()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { btoaPassword } from "@/utils/utils";
import * as requestIP from '@/modules/ops/api/operationsCenter/warehouseManage.js'

export default {
  props: {
    dialogFormVisible: {
      type: Boolean
    },
    editData: {
      _name: "",
      _id: "",
    }
  },
  data() {
    return {
      ip: "",
      isChange: false,
      image_file_name: "",
      imageUrl: require("../../../../../../../commons/images/upload-img.jpg"),
      dialogVisible: this.dialogFormVisible,
      cloud_id: 0,
      cloudForm: {
        _name: "上传图片",
        user_name: "",
        password: ""
      },
      rules: {
        _name: [{
          required: true,
          message: "节点名称不能为空",
          trigger: "blur"
        }],
      },
      isUpload: true,
      fileList: [],
    };
  },
  watch: {
  },
  methods: {
    async getUploadIp() {
      let ipRes = await requestIP.getUploadIp("get")
      if (ipRes.code == 200) {
        this.ip = ipRes.data.item.name
        console.log(ipRes.data.item.name);
      }
    },
    save(cloudForm) {
      if (this.isChange) {
        this.$refs.uploadFileCom.submit();
      } else {
        let param = {
          id: this.editData._id,
          _name: this.editData._name
        }
        this.$emit('setImage', param)
      }
    },
    validateName(rule, value, callback) {
      if (value == "") {
        return callback(new Error("名称不能为空"));
      } else {
        return callback();
      }
    },
    close() {
      this.$emit("close-dialog");
    },
    handleSuccess(response, file, fileList) {
      this.fileList = []
      if (response.code == 200) {
        this.$message({
          message: '文件上传成功',
          type: 'success'
        });
        let param = {
          id: this.editData._id,
          data: response.data,
          file: file,
          _name: this.editData._name
        }
        this.isChange = false;
        this.$emit('setImage', param)
      } else {
        this.$message({
          message: response.message,
          type: 'warning'
        });
      }
    },
    handleError(err, file, fileList) {
      this.fileList = []
      this.$message({
        message: '文件上传失败',
        type: 'error'
      });
    },
    uploadFile(files) {
      this.imageUrl = URL.createObjectURL(files.raw);
      this.isChange = true;
    },
    propgress(event, file, fileList) {
      console.log(3)
    },
    cancelFn() {
      this.$emit("closeDialog");
    }
  },
  created() {
    if (this.editData.hasOwnProperty('_image')) {
      this.imageUrl = this.editData._image
    }
    this.getUploadIp();
  }
};
</script>

<style lang="less">
.user-dialog {
  .dialog-title {
    position: relative;
    font-size: 18px;
    &:before {
      content: "";
      display: block;
      width: 4px;
      height: 20px;
      background-color: #20a0ff;
      position: absolute;
      bottom: 0px;
      left: -20px;
    }
  }

  .add-user-groups-content {
    & /deep/ .el-input {
      width: 70%;
    }
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.image-box {
  width: 150px;
  height: 150px;
  img {
    width: 100%;
    height: 100%;
  }
  .upload {
    width: 150px;
    height: 150px;
  }
}
</style>
