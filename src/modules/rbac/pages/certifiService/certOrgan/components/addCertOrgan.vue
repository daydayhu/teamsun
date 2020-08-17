<template>
  <el-drawer
    :title="organDialogObj.title"
    :before-close="cancelForm"
    :visible.sync="isVisible"
    size="50%"
    direction="rtl"
    ref="drawer"
  >
    <div class="form_wrap">
      <el-form
        ref="form"
        :model="this_form"
        :rules="form_rules"
        :label-position="labelPosition"
      >
        <el-form-item :label="organDialogObj.name" prop="dep_name" :label-width="formLabelWidth" class="ts-form-label">
          <el-input v-model="this_form.dep_name" autocomplete="off" class="ts-input" maxlength="64" show-word-limit id="rbac_addCertOrgan_dep_name"></el-input>
          <span class="ts-input-tips" ref="dep_name">不超过64个字符</span>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" class="ts-form-label">
          <el-input type="textarea" v-model="this_form.remarks" class="ts-input ts-area" maxlength="128" show-word-limit id="rbac_addCertOrgan_remarks"></el-input>
          <span class="ts-input-tips">最大长度128字符</span>
        </el-form-item>
        <el-form-item label="组织管理员" prop="user_id" :label-width="formLabelWidth" v-model="this_form.user_id" class="ts-form-label"
                      v-if="organDialogObj.is_top_root == 1">
          <el-radio-group v-model="this_form.is_have_user" class="ts-input" @change="isHaveUser" id="rbac_addCertOrgan_is_have_user">
            <el-radio :label="1">已有用户</el-radio>
            <el-radio :label="0" v-if="organDialogObj.type=='add'">新建用户</el-radio>
          </el-radio-group>
          <div class="ts-input-auto" v-show="this_form.is_have_user==1">
            <el-select v-model="this_form.user_id" filterable placeholder="请选择" id="rbac_addCertOrgan_user_id">
              <el-option
                v-for="item in userListData"
                :key="item.user_id"
                :label="item.alias_name"
                :value="item.user_id"
              >
              </el-option>
            </el-select>
          </div>
          <div class="ts-input-auto" v-if="organDialogObj.type=='add'" v-show="this_form.is_have_user==0">
            <el-form
              ref="user_form"
              :model="user_form"
              :rules="user_rules"
              :label-position="labelPosition"
            >
              <el-form-item label="用户名称" prop="user_name" :label-width="userFormWidth" class="ts-user-form-label">
                <el-input v-model="user_form.user_name" autocomplete="off" class="ts-input ts-user-input" id="rbac_addCertOrgan_user_name"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="pwd" :label-width="userFormWidth" class="ts-user-form-label ts-mt36">
                <el-input type="password" v-model="user_form.pwd" autocomplete="off" class="ts-input ts-user-input" placeholder="" rbac_addCertOrgan_pwd></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="pass" :label-width="userFormWidth" class="ts-user-form-label">
                <el-input type="password" v-model="user_form.pass" autocomplete="off" class="ts-input ts-user-input" rbac_addCertOrgan_pass></el-input>
              </el-form-item>
              <el-form-item label="邮箱" :label-width="userFormWidth" class="ts-user-form-label" prop="email">
                <el-input v-model="user_form.email" autocomplete="off" class="ts-input ts-user-input" rbac_addCertOrgan_email></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-form-item>
      </el-form>
    </div>
      <div class="drawer_footer">
        <el-button @click="cancelForm" id="rbac_addCertOrgan_cancal">取 消</el-button>
        <el-button type="primary"
                   v-if="organDialogObj.type === 'add'"
                   @click="onSubmitNext('form')"
                   :loading="submitLoading" id="rbac_addCertOrgan_submit1">{{ submitLoading ? '提交中 ...' : '继续添加' }}</el-button>
        <el-button type="primary" @click="onSubmit('form')" :loading="submitLoading" id="rbac_addCertOrgan_submit">{{ submitLoading ? '提交中 ...' : '确 定' }}</el-button>
      </div>

  </el-drawer>

</template>

<script>
  import * as requestMethod from "@/modules/rbac/api/certifiService/organizationApi.js"
  import addUser from "../../user/components/addUser.vue"

  export default {
    props: {
      organDialogObj: {
        type: Object
      },
      isShow: {
        type: Boolean
      },
    },
    data() {
      let validatepassword = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('密码不能为空'));
          return;
        }
        let pwRegex = /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{8,16}$/;
        if (!pwRegex.test(value)) {
          callback(new Error('必须包含大写字母，小写字母和数字，8-16个字符'))
        } else {
          callback();
        }
      };
      let validateUserName = (rule, value, callback) => {
        if (value == '' || typeof value == 'undefined') {
          callback(new Error('请输入用户名称!'));
          //this.$refs['dep_name'].style.display = 'none'
        } else if (/^\s+$/gi.test(value)) {
          //this.$refs['dep_name'].style.display = 'none'
          callback(new Error('不能纯输入空格!'));
          return;
        } else {
          //this.$refs['dep_name'].style.display = 'block'
          callback();
        }
      };
      let validateDepName = (rule, value, callback) => {
        if (value == '' || typeof value == 'undefined') {
          callback(new Error('请输入组织名称!'));
          this.$refs['dep_name'].style.display = 'none'
        } else if (/^\s+$/gi.test(value)) {
          this.$refs['dep_name'].style.display = 'none'
          callback(new Error('不能纯输入空格!'));
          return;
        } else {
          this.$refs['dep_name'].style.display = 'block'
          callback();
        }
      };
      let validateEmail = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入邮箱!'));
          return;
        }
        let emailRegex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!emailRegex.test(value)) {
          callback(new Error('请检查邮箱格式！'))
        } else {
          callback();
        }
      };
      let validateSurepassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认密码!'));
        } else if (value !== this.user_form.pwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      let validateUser = (rule, value, callback) => {
        if (value == '' || typeof value == 'undefined') {
          callback(new Error('请选择组织管理员!'));
          //this.$refs['dep_name'].style.display = 'none'
        } else if (/^\s+$/gi.test(value)) {
          //this.$refs['dep_name'].style.display = 'none'
          callback(new Error('不能纯输入空格!'));
          return;
        } else {
          //this.$refs['dep_name'].style.display = 'block'
          callback();
        }
      };
      return {
        isVisible: this.isShow,
        carrier: {
          show: false,
          isModal: false,
          title: '新增用户',
          type: 'add',
          rowData: {}
        },
        // this_form: {
        //   dep_name: this.organDialogObj.rowData.dep_name,
        //   dep_id: typeof this.organDialogObj.rowData.dep_id != 'undefined' ? this.organDialogObj.rowData.dep_id : '',
        //   remarks: typeof this.organDialogObj.rowData.remarks != 'undefined' ? this.organDialogObj.rowData.remarks : '',
        //   is_have_user: this.organDialogObj.dep_parent_id == 0 || this.organDialogObj.rowData != 'undefined' ? 1 : 0,
        //   user_id: typeof this.organDialogObj.rowData.user_id != 'undefined' ? this.organDialogObj.rowData.user_id : ''
        // },
        this_form: {
          dep_name: '',
          dep_id: '',
          remarks: '',
          is_have_user: 1, // 默认已有用户
          user_id: ''
        },
        user_form: {
          user_name: '',
          pwd: '',
          pass: '',
          email: ''
        },
        form_rules: {
          dep_name: [
            {required: true, validator: validateDepName, trigger: 'change'}
          ],
          user_id: [
            {required: true, validator: validateUser, trigger: 'change'}
          ]
        },
        user_rules: {
          user_name: [
            {required: true, validator: validateUserName, trigger: 'change'}
          ],
          pwd: [
            {required: true, validator: validatepassword, trigger: 'change'}
          ],
          pass: [
            {required: true, validator: validateSurepassword, trigger: 'change'}
          ],
          email: [
            {required: true, validator: validateEmail, trigger: 'change'}
          ]
        },
        formLabelWidth: '132px',
        labelPosition: 'right',
        userListData: '',
        innerDrawer: false,
        submitLoading: false,
        userFormWidth: '106px'
      }
    },
    mounted() {
      if (this.organDialogObj.type === 'edit' || this.organDialogObj.type === 'editDetail') {
        // 获取编辑详情数据
        requestMethod.certOrganApi('get', this.organDialogObj.rowData.dep_id, 'getDetails').then(res => {
          this.this_form = res.data.detail
          this.this_form.is_have_user = 1
          this.this_form.user_id = res.data.detail.user_id == 0 ? '' :  res.data.detail.user_id
        })
      } else {
        this.$nextTick(() => {
          this.$refs['form'].resetFields()
        })
      }
      // 更新组织
      this.loadOrganList()
      // 滚动条
      const that = this
      this.$nextTick(() => {
        let flowHeight = document.body.clientHeight - 150
        this.$refs.form.$el.style.cssText = `overflow-y:auto;height:${flowHeight}px`
      })
      window.onresize = () => {
        return (() => {
          let flowHeight = document.body.clientHeight - 150
          that.$refs.form.$el.style.cssText = `overflow-y:auto;height:${flowHeight}px`
        })()
      }
    },
    destroyed() {
      window.onresize = null;
    },
    methods: {
      //表单提交
      onSubmit(form) {
        this.$refs[form].validate((valid) => {
          let user_valid = true
          if (this.this_form.is_have_user == 0) {
            user_valid = this.user_create_formValid()
          }
          if (user_valid && valid) {//表单数据验证完成之后，提交数据;
            // 判断是否选中新建用户，选中则进行校验
            this.submitLoading = true
            let formData = this.this_form;
            const para = Object.assign({}, formData)
            // edit
            if (this.organDialogObj.type === 'edit') {
              requestMethod.certOrganApi('put', para).then(res => {
                res.code === 200 ?
                  (this.$message({
                    message: res.message,
                    type: 'success'
                  }), this.$emit('initMsg'), this.$refs['form'].resetFields(), this.$emit('closeDialog'))
                  : this.$message.error(res.message);
                this.submitLoading = false
              })
            } else if (this.organDialogObj.type === 'editDetail') {
              requestMethod.certOrganApi('put', para).then(res => {
                res.code === 200 ?
                  (this.$message({
                    message: res.message,
                    type: 'success'
                  }), this.$emit('loadList'), this.$refs['form'].resetFields(), this.$emit('closeDialog'))
                  : this.$message.error(res.message);
                this.submitLoading = false
              })
            } else {
              // 判断是否选中新建
              if (this.this_form.is_have_user == 0) {
                // 两次密码一致 前台确认 后台接收一次参数
                let pwd = window.btoa(this.user_form.pwd)
                if (pwd.length > 4) {
                  let arr = Array.from(pwd)
                  arr.splice(5, 0, Math.floor(Math.random() * 10))
                  pwd = arr.join('')
                  para.pass = pwd
                }
                para.pwd = pwd
                para.user_name = this.user_form.user_name
                para.email = this.user_form.email
              }
              para.dep_parent_id = this.organDialogObj.dep_parent_id
              requestMethod.certOrganApi('post', para).then(res => {
                res.code === 200 ?
                  (this.$message({
                    message: res.message,
                    type: 'success'
                  }), this.$emit('initMsg'), this.$refs['form'].resetFields(), this.$emit('closeDialog'))
                  : this.$message.error(res.message);
                this.submitLoading = false
              })
            }
          }
        })
      },
      onSubmitNext(form) {
        this.$refs[form].validate((valid) => {
          let user_valid = true
          if (this.this_form.is_have_user == 0) {
            user_valid = this.user_create_formValid()
          }
          if (user_valid && valid) {//表单数据验证完成之后，提交数据;
            // 判断是否选中新建用户，选中则进行校验
            this.submitLoading = true
            let formData = this.this_form;
            const para = Object.assign({}, formData)
            // edit
            if (this.organDialogObj.type === 'edit') {
              requestMethod.certOrganApi('put', para).then(res => {
                res.code === 200 ?
                  (this.$message({
                    message: res.message,
                    type: 'success'
                  }), this.$emit('initMsg'), this.$refs['form'].resetFields(), this.$emit('closeDialog'))
                  : this.$message.error(res.message);
                this.submitLoading = false
              })
            } else if (this.organDialogObj.type === 'editDetail') {
              requestMethod.certOrganApi('put', para).then(res => {
                res.code === 200 ?
                  (this.$message({
                    message: res.message,
                    type: 'success'
                  }), this.$emit('loadList'), this.$refs['form'].resetFields(), this.$emit('closeDialog'))
                  : this.$message.error(res.message);
                this.submitLoading = false
              })
            } else {
              // 判断是否选中新建
              if (this.this_form.is_have_user == 0) {
                // 两次密码一致 前台确认 后台接收一次参数
                let pwd = window.btoa(this.user_form.pwd)
                if (pwd.length > 4) {
                  let arr = Array.from(pwd)
                  arr.splice(5, 0, Math.floor(Math.random() * 10))
                  pwd = arr.join('')
                  para.pass = pwd
                }
                para.pwd = pwd
                para.user_name = this.user_form.user_name
                para.email = this.user_form.email
              }
              para.dep_parent_id = this.organDialogObj.dep_parent_id
              requestMethod.certOrganApi('post', para).then(res => {
                res.code === 200 ?
                  (this.$message({
                    message: res.message,
                    type: 'success'
                  }), this.$emit('initMsg'), this.$refs['form'].resetFields(),this.this_form.remarks='')
                  : this.$message.error(res.message);
                this.submitLoading = false
              })
            }
          }
        })
      },
      user_create_formValid() {
        let user_valid
        this.$refs['user_form'].validate((valid) => {
          user_valid = valid
        })
        return user_valid
      },
      cancelForm() {
        this.$emit('closeDialog');
      },
      addUser() {
        this.carrier.show = true
      },
      closeDialog() {
        this.carrier.show = false
      },
      loadOrganList() {
        let data = {
          per_page: 10000,
          current_page: 1,
          keyword: []
        }
        // 用户接口
        requestMethod.getHaveUserApi('get').then(res => {
          this.userListData =res.data.items
        })
      },
      selectDisposeCode() {
        this.$forceUpdate()
      },
      isHaveUser(val) {
        if (val == 0) {
          this.this_form.user_id = 'false'
        } else {
          this.this_form.user_id = ''
        }
        // this.is_have_user = val
      }
    },
    components: {
      addUser,
    },
  }
</script>

<style lang="less" scoped>
  .form_wrap{
    padding-right: 24px;
  }
  .ts-form-label {
    .el-form-item__label {
      padding-left: 26px;
    }
  }

  /deep/ .ts-user-form-label {
    .el-form-item__label {
      width: 84px !important;
      padding-left: 0 !important;
    }

    .el-form-item__content {
      margin-left: 0 !important;
    }
  }

  .ts-certorgan-manager {
    width: 68%;
  }


  /deep/ .ts-user-input {
    width: 36%;
    margin: 0 6px !important;
  }

  /deep/ .ts-input-tips {
    position: inherit;
    color: #7F7F7F;
    font-size: 12px;
    display: inline-block;
  }

  .ts-area {
    height: auto !important;
  }

  .ts-form-label {
    .el-form-item__label {
      padding-left: 26px;
    }
  }

  .ts-input-auto {
    margin-top: 20px;
  }

</style>
