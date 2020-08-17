<template>
    <el-drawer
            :title="titleSet[drawerInfo.status]"
            :visible.sync="drawerFlag"
            direction="rtl"
            size="40%"
            ref="drawer"
            :append-to-body="true"
            :modal-append-to-body="true"
            custom-class="operation-drawer"
            @closed="close"
    >
        <div class="ts-drawer-c">
            <el-form
                    ref="natForm"
                    :model="natForm"
                    :rules="natFormRules"
                    :label-position="labelPosition"
                    :label-width="formLabelWidth"
            >
                <el-form-item label="规则名" prop="name">
                    <el-input v-model="natForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="正则表达式" prop="regExp">
                    <el-input v-model="natForm.regExp" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="替换内容" prop="content">
                    <el-input v-model="natForm.content" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="drawer_footer">
            <el-button @click="drawerFlag = false">取 消</el-button>
            <el-button type="primary" :loading="submitLoading" @click="confirm">{{ submitLoading ? '提交中...'
                : '确认' }}
            </el-button>
      
        </div>
    </el-drawer>
</template>

<script>
  // import * as requestMethod from '@/modules/ops/api/operationsCenter/productManage/productDesign.js';
  import * as requestMethod from '@/modules/rbac/api/systemConfig/baseData.js';

  export default {
    name: 'operationDrawer',
    props: {
      drawerInfo: {
        type: Object,
      },
    },
    data() {
      return {
        natForm: {},
        natFormRules: {
          name: [
            {required: true, message: '规则名称是必填项', trigger: 'blur'},
            {max: 64, message: '字符不能超过64位', trigger: 'blur'},
          ],
          regExp: {required: true, message: '请填写正则表达式', trigger: 'blur'},
          content: {required: true, message: '请选择替换内容', trigger: 'blur'},
        },
        titleSet: {
          add: '添加NAT规则',
          edit: '编辑NAT规则'
        },
        drawerFlag: true,
        labelPosition: 'right',
        formLabelWidth: '150px',
        submitLoading: false,
        operation: 'add',
      };
    },
    created() {
      this.getNatForm();
    },
    methods: {
      getNatForm() {
        this.natForm.id = this.drawerInfo.natForm.id;
        this.natForm.config_type = this.drawerInfo.natForm.config_type;
      },
      confirm() {
        this.$refs.natForm.validate((isValid, s) => {
          if (isValid) {
            switch (this.operation) {
              case 'add':
                this.addNat();
                break;
              case 'edit':
                // this.editNode();
                break;
              default:
                break;
            }
          }
        });
      },
      addNat() {
        let default_value = {
           name: this.natForm.name,
           regular: this.natForm.regExp,
           replace: this.natForm.content
        };
        let param = {
          parent_id: this.natForm.id,
          default_value: JSON.stringify(default_value),
          config_type: this.natForm.config_type
        };
        console.log('param',param);
        requestMethod.addBaseNode('post', param).then(res => {
          if (res.code === 200) {
            this.$emit('getBaseDataForType');
            this.$message.success('添加成功');
          }
          this.close();
        });
      },
      editNat() {},
      close() {
        this.$emit('closeNatDrawer');
      },
    },
  };
</script>

<style lang="less" scoped>
    .operation-drawer {
        position: relative;
        height: 500px;
        .ts-drawer-c {
            padding: 0 40px 60px 0;
        }
        
    }

</style>
