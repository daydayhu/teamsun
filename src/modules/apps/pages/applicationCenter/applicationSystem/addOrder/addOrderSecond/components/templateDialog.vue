<template>
    <div class="layout-c">
        <el-dialog
                :visible.sync="dialogVisible"
                width="70%"
                :title="dialogTitle"
                @closed="close">
            <div class="ts-drawer__content">
                <div class="json-c">
                    <el-input
                            type="textarea"
                            :rows="26"
                            placeholder="请输入模板json"
                            v-model="canvasJson">
                    </el-input>
                </div>
            </div>
            <span slot="footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addJsonToCanvas">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
  export default {
    name: 'addResourceDialog',
    data() {
      return {
        dialogVisible: true,
        submitLoading: false,
        dialogTitle: '导入模板',
        canvasJson: ''
      }
    },
    created() {},
    methods: {
      addJsonToCanvas() {
        if (this.canvasJson) {
          this.$emit('getCanvasData', this.canvasJson);
          this.close();
        }
      },
      close() {
        this.$emit('closeTemplateDialog')
      }
    }
  };
</script>

<style lang="less" scoped>
    .layout-c {
        // .el-dialog {
        //     .dialog-title {
        //         position: relative;
        //         font-size: 18px;
        //         &:before {
        //             content: "";
        //             display: block;
        //             width: 4px;
        //             height: 20px;
        //             background-color: #20a0ff;
        //             position: absolute;
        //             bottom: 0px;
        //             left: -20px;
        //         }
        //     }
        //     .ts-drawer__content {
        //         .json-c {
        //             /*height: 700px;*/
        //         }
        //     }
        // }
        // /deep/.el-table--scrollable-y .el-table__body-wrapper {
        //     overflow-x: hidden;
        // }
        // /deep/.el-dialog__body {
        //     padding: 10px 20px;
        // }
    }
</style>
