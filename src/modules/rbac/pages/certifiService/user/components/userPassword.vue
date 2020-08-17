<template>
  <div class="pwd-drawer">
    <el-dialog
      :title="password.title"
      @close="cancelForm"
      :visible.sync="isVisible"
    >
      <el-form
        ref="pwdForm"
        :model="pwdForm"
        :rules="pwdRules"
        :label-position="labelPosition"
      >
        <el-form-item v-if="password.type == 'updata'" label="原密码" :label-width="formLabelWidth" class="ts-form-label" prop="old_pwd">
          <el-input v-model="pwdForm.old_pwd" autocomplete="off" class="ts-input" type="password" id="rbac_userPassword_old_pwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" class="ts-form-label" prop="new_pwd">
          <el-input v-model="pwdForm.new_pwd" autocomplete="off" class="ts-input" placeholder="请输入新密码" type="password" id="rbac_userPassword_new_pwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="passwords" class="ts-form-label">
          <el-input v-model="pwdForm.passwords" autocomplete="off" class="ts-input" placeholder="请输入确认新密码" type="password" id="rbac_userPassword_passwords"></el-input>
        </el-form-item>
      </el-form>
      <div class="operate-btn-common">
        <el-button @click="cancelForm" id="rbac_userPassword_cancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="submitLoading" id="rbac_userPassword_submit">{{ submitLoading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import * as requestMethod from "@/modules/rbac/api/certifiService/userApi.js"

  export default {
    props: {
      password: {
        type: Object
      },
      isShow: {
        type: Boolean
      }
    },

    mounted() {

    },
    data() {
      let validateNewpassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else {
          // if (this.pwdForm.surepassword !== '') {
          //     this.$refs.pwdForm.validateField('surepassword');
          // }
          // callback();
        }
      };

      let validateSurepassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认密码'));
        } else if (value !== this.pwdForm.new_pwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        isVisible: this.isShow,
        formLabelWidth: '106px',
        labelPosition: 'right',
        submitLoading: false,
        pwdRules: {
          old_pwd: [
            {required: true, message: '请输入原密码', trigger: 'change'},
          ],
          new_pwd: [
            {required: true, validator: validateNewpassword, trigger: 'change'},
          ],
          passwords: [
            {required: true, validator: validateSurepassword, trigger: 'change'},
          ],
        },
        pwdForm: {
          old_pwd: '',
          new_pwd: '',
          passwords: ''
        },
        temporaryPwdForm: {
          old_pwd: '',
          new_pwd: '',
          passwords: ''
        },
      }
    },

    methods: {
      // 密码加密处理
      encryption(pwd) {
        let password = window.btoa(pwd)
        if (password.length > 4) {
          let arr = Array.from(password)
          arr.splice(5, 0, Math.floor(Math.random() * 10))
          password = arr.join('')
        }
        return password
      },
      //表单提交
      onSubmit() {
        let flag = true
        this.$refs['pwdForm'].validate((valid) => {
          flag = valid
        })
        if (flag) {
          this.submitLoading = true
          this.temporaryPwdForm = {
            old_pwd: this.encryption(this.pwdForm.old_pwd),
            new_pwd: this.encryption(this.pwdForm.new_pwd),
            passwords: this.encryption(this.pwdForm.passwords)
          }

          let formData = this.temporaryPwdForm;
          const para = Object.assign({}, formData)

          if (this.password.type == 'updata') {
            requestMethod.userUpdataPassword('patch', para, this.password.userUuid).then(res => {
              res.code === 200 ?
                (this.$message({message: res.message, type: 'success'}), this.$emit('loadList'), this.$refs['pwdForm'].resetFields(), this.$emit('closeDialog'))
                : this.$message.error(res.message);
              this.submitLoading = false
            })
          } else {
            requestMethod.resetPassword('patch', para, this.password.userUuid).then(res => {
              res.code === 200 ?
                (this.$message({message: res.message, type: 'success'}), this.$emit('loadList'), this.$refs['pwdForm'].resetFields(), this.$emit('closeDialog'))
                : this.$message.error(res.message);
              this.submitLoading = false
            })
          }
        }
      },
      cancelForm() {
        this.$emit('closeDialog');
      }
    }
  }
</script>

<style lang="less" scoped>
  .pwd-drawer {
    /deep/.el-dialog__body {
      padding-bottom: 62px;
    }
    .operate-btn-common {
      @operate-btn-common();
      left: 0;
    }
  }
</style>
