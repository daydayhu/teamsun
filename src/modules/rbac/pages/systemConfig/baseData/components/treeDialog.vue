<template>
    <div class="layout-c">
        <el-dialog
                :visible.sync="dialogVisible"
                width="30%"
                @closed="close">
            <template slot="title">
                <div class="dialog-title">{{titleSet[nodeForm.config_type][treeDialogInfo.status]}}</div>
            </template>
            <div class="ts-drawer__content">
                <el-form :model="nodeForm" ref="nodeForm" label-width="auto" :rules="formRules">
                    <el-form-item
                            label="key"
                            prop="key"
                            v-if="treeDialogInfo.status === 'add' && false"
                    >
                        <el-input v-model="nodeForm.key" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item
                            label="名称"
                            prop="name"
                    >
                        <el-input v-model="nodeForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" :loading="submitLoading" @click="confirm">{{ submitLoading ? '提交中...' : '确认' }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  import * as requestMethod from '@/modules/rbac/api/systemConfig/baseData.js';
  export default {
    name: 'treeDialog',
    props: {
      treeDialogInfo: {
        type: Object,
      },
    },
    data() {
      return {
        dialogVisible: true,
        submitLoading: false,
        titleSet: {
          '2': {
            add: '添加网络区域节点',
            edit: '编辑网络区域节点',
          },
          '11': {
            add: '添加产品分类节点',
            edit: '编辑产品分类节点',
          },
          '12': {
            add: '添加服务路径节点',
            edit: '编辑服务路径节点',
          },
          '13': {
            add: '添加业务组分类节点',
            edit: '编辑业务组分类节点',
          },
          '14': {
            add: '添加表单分类节点',
            edit: '编辑表单分类节点',
          },
          '18': {
            add: '添加服务分类节点',
            edit: '编辑服务分类节点',
          },
          '10': {
            add: '添加软件服务器地址',
            edit: '编辑软件服务器地址',
          },
          '24': {
            add: '添加第三方系统',
            edit: '编辑第三方系统',
          }
        },
        nodeForm: {
          config_type: '',
          id: '',
          name: '',
          key: ''
        },
        formRules: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
            {max: 64, message: '字符不能超过64位', trigger: 'blur'},
          ],
          key: [
            {required: true, message: 'key不能为空', trigger: 'blur'},
          ]
        }
      }
    },
    created() {
      this.getNetForm()
    },
    methods: {
      getNetForm() {
        this.nodeForm = JSON.parse(JSON.stringify(this.treeDialogInfo.form))
        console.log('this.nodeForm',this.nodeForm)
      },
      confirm() {
        this.$refs.nodeForm.validate((isValid, s) => {
          if (isValid) {
            switch (this.treeDialogInfo.status) {
              case 'add':
                this.appendNode();
                break;
              case 'edit':
                this.editNode();
                break;
              default:
                break;
            }
          }
        });
      },
      appendNode() {
        let param = {
          parent_id: this.nodeForm.id,
          default_value: this.nodeForm.name,
          // config_key: this.nodeForm.key,
          config_type: this.nodeForm.config_type
        };
        requestMethod.addBaseNode('post', param).then(res => {
          if (res.code === 200) {
            this.$emit('getBaseDataForType');
            this.$message.success("添加成功");
          }else {
            this.$message.error(res.message);
          }
          this.close()
        })
      },
      editNode() {
        let param = {
          config_type: this.nodeForm.config_type,
          config_key: this.nodeForm.key,
          value_json: this.nodeForm.name
        };
        requestMethod.editBaseNode('put', param).then(res => {
          if (res.code === 200) {
            this.$emit('getBaseDataForType');
            this.$message.success("编辑成功");
          }else {
            this.$message.error(res.message);
          }
          this.close()
        })
      },
      close() {
        this.$emit('closeTreeDialog')
      }
    }
  };
</script>

<style lang="less" scoped>
    .layout-c {
        .el-dialog {
            .dialog-title {
                position: relative;
                font-size: 18px;
            }
            .ts-drawer__content {}
        }
    }
</style>
