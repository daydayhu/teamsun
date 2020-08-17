<template>
    <div class="emailConfigPage">
        <div class="headerC">
            <div class="title">邮箱设置</div>
        </div>
        <div class="contentC">
            <el-form
                    ref="emailForm"
                    :model="emailForm"
                    :rules="emailFormRules"
                    :label-position="labelPosition"
                    :label-width="formLabelWidth"
            >
                <el-form-item label="邮箱服务器" prop="mail_host">
                    <el-input v-model="emailForm.mail_host" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="端口" prop="mail_port">
                    <el-input type="number" v-model="emailForm.mail_port" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="发件人" prop="mail_from">
                    <el-input v-model="emailForm.mail_from" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="user_name">
                    <el-input v-model="emailForm.user_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="emailForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否使用TLS" prop="is_tls">
                    <el-switch
                            v-model="emailForm.is_tls"
                            active-value="1"
                            inactive-value="0"
                            active-color="#409eff"
                            inactive-color="#DCDFE6"
                            @change="handleTlsChange"
                    ></el-switch>
                </el-form-item>
                <el-form-item label="是否使用SSL" prop="is_ssl">
                    <el-switch
                            v-model="emailForm.is_ssl"
                            active-value="1"
                            inactive-value="0"
                            active-color="#409eff"
                            inactive-color="#DCDFE6"
                            @change="handleSslChange"
                    ></el-switch>
                </el-form-item>
            </el-form>
            <div class="btnC">
                <el-button type="primary" :loading="submitLoading" @click="saveEmailConfig">{{ submitLoading ? '保存中...' : '确认' }}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
  import * as requestMethod from '@/modules/rbac/api/systemConfig/baseData.js';
  export default {
    name: 'emailConfig',
    props: {
      paneData: {
        type: Array,
        deep: true
      },
    },
    data() {
      return {
        emailForm: {
          mail_host: '', // 邮箱服务器
          mail_port: '', // 端口
          mail_from: '', // 发件人
          user_name: '', // 用户名
          password: '', // 密码
          is_tls: '', // 是否使用TLS
          is_ssl: '' // 是否使用SSL
        },
        emailFormRules: {
          mail_host: [
            {required: true, message: '邮箱服务器不能为空', trigger: 'blur'},
            {max: 64, message: '字符不能超过64位', trigger: 'blur'},
          ],
          mail_port: {required: true, message: '端口不能为空', trigger: 'blur'},
          mail_from: {required: true, message: '发件人不能为空', trigger: 'blur'},
          user_name: {required: true, message: '用户名不能为空', trigger: 'blur'},
          password: {required: true, message: '密码不能为空', trigger: 'blur'},
        },
        labelPosition: 'right',
        formLabelWidth: '150px',
        submitLoading: false
      }
    },
    created() {
      this.getBaseDataForType();
    },
    methods: {
      getBaseDataForType() {
        let param = {
          config_type: 21
        };
        requestMethod.getBaseDataForType('get',param).then(res => {
          if (res.code === 200) {
            res.data.items.forEach(item => {
              if (this.emailForm.hasOwnProperty(item.config_key)) {
                this.emailForm[item.config_key] = item.value_json;
              }
            })
          }
        });
      },
      saveEmailConfig() {
        this.$refs.emailForm.validate((isValid, s) => {
          if (isValid) {
            let param = {
              config_type: 21,
              mail_list: this.emailForm
            };
            requestMethod.emailConfig('put',param).then(res => {
              if (res.code === 200) {
                this.$message.success('修改邮箱设置成功');
                this.getBaseDataForType();
              }
            })
          }
        });
      },
      handleTlsChange() {},
      handleSslChange() {}
    }
  };
</script>

<style lang="less" scoped>
    .emailConfigPage {
        padding: 0 30px;
        .headerC {
            height: 50px;
            display: flex;
            align-items: center;
            .title {
                font-weight: 600;
                font-size: 16px;
                color: @g-font-color-c
            }
        }
        .contentC {
            .el-form {
                width: 400px;
            }
            .btnC {
                margin-top: 20px;
                width: 400px;
                text-align: center;
            }
        }
    }
</style>



