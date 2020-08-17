<template>
  <div class="user-dialog">
    <el-dialog :visible.sync="dialogVisible" @close="close">
      <template slot="title">
        <div class="dialog-title">设置参数</div>
      </template>
      <el-form ref="cloudForm" :rules="rules" :model="editData" label-width="80px">
        <div class="add-user-groups-content">
          <el-form-item label="节点名称" prop="_name">
            <el-input v-model="editData._name"></el-input>
          </el-form-item>
          <el-form-item label="节点形状">
            <el-select v-model="editData._styleMap.shape" placeholder="请选择">
              <el-option v-for="item in nodeShap" :key="item.id" :label="item.label" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字体位置">
            <el-select v-model="editData._styleMap['label.position']" placeholder="请选择">
              <el-option v-for="item in fontPosition" :key="item.id" :label="item.label" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="边框线型">
            <el-select v-model="editData.borderType" placeholder="请选择" @change="updateBorder">
              <el-option v-for="item in borderPatton" :key="item.id" :label="item.label" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="背景颜色">
            <el-color-picker v-model="editData._styleMap['shape.background']" style="width:200px;"></el-color-picker>
          </el-form-item>
          <el-form-item label="边框颜色">
            <el-color-picker v-model="editData._styleMap['shape.border.color']" style="width:200px;"></el-color-picker>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save('cloudForm')">确 定</el-button>
        <el-button @click="close()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { btoaPassword } from "@/utils/utils";
export default {
  props: {
    dialogFormVisible: {
      type: Boolean
    },
    editData: {
      _name: "",
      _styleMap: {}
    }
  },
  data() {
    return {
      nodeSHapes: "",
      nodeShap: [
        {
          id: "rect",
          label: "直角"
        },
        {
          id: "roundRect",
          label: "圆角"
        },
      ],
      fontPosition: [{
        id: 3, label: "上"
      }, {
        id: 31, label: "下"
      }, {
        id: 14, label: "左"
      }, {
        id: 20, label: "右"
      }, {
        id: 17, label: "居中"
      }],
      borderPatton: [{
        id: "line", label: "实线"
      }, {
        id: "dash", label: "虚线"
      }],
      dialogVisible: this.dialogFormVisible,
      cloud_id: 0,
      cloudForm: {
        alias_name: "",
        user_name: "",
        password: ""
      },
      rules: {
        _name: [{ required: true, message: "图层名称不能为空", trigger: "blur" }],
      }
    };
  },
  methods: {
    handleControllerChange() {
      console.log(333);
    },
    updateBorder() {
      this.$forceUpdate();
    },
    validateName(rule, value, callback) {
      if (value == "") {
        return callback(new Error("名称不能为空"));
      } else {
        return callback();
      }
    },
    save(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          //表单数据验证完成之后，提交数据;
          // requestMethod
          //   .edit_baremetal_details("put", this.form, this.node_id)
          //   .then(res => {
          //     if (res.code === 200) {
          //       this.$message({
          //         message: '修改成功',
          //         type: 'success'
          //       });
          //       this.$emit("closeDialog");
          //       this.$emit("isReload");
          //     } else {
          //       this.$message({
          //         message: res.message,
          //         type: "warning"
          //       });
          //     }
          //   });
          // let chineseReg = /[\u4e00-\u9fa5]/;//中文正则
          // let setNodeName = "";
          // let nodeName = this.editData._name;
          // let zfLength = 0;
          // if (this.editData.fontPosition == "14" || this.editData.fontPosition == "20") {
          //   for (var i = 0; i < nodeName.length; i++) {
          //     setNodeName += nodeName[i] + "\n";
          //   }
          // } else {
          //   for (var i = 0; i < nodeName.length; i++) {
          //     if (chineseReg.test(nodeName[i])) {//中文正则
          //       zfLength += 2;
          //     } else {//非中文
          //       zfLength += 1;
          //     }
          //     setNodeName += nodeName[i];
          //     if (zfLength % 16 == 0) {
          //       setNodeName += "\n";
          //     }
          //   }
          // }
          //this.editData._attrObject = setNodeName;
          this.$emit('editNode', this.editData);
        }
      });
    },
    close() {
      this.$emit("close-dialog");
    }
  },
  watch: {
    editData() {
    }
  },
  created() {
    console.log(this.editData)
    if (this.editData._styleMap['shape.dash']) {
      this.editData.borderType = 'dash'
    } else {
      this.editData.borderType = 'line'
    }
  }
};
</script>

<style lang="less" scoped>
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
      width: 250px;
    }
  }
}
.ts-form-label {
  width: 300px;
}
</style>
