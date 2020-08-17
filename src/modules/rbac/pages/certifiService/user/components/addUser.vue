<template>
  <el-drawer
    :title="carrier.title"
    :before-close="cancelForm"
    :visible.sync="isVisible"
    :modal="carrier.isModal"
    :append-to-body="true"
    :modal-append-to-body="true"
    size="50%"
    direction="rtl"
    custom-class="add-user-drawer"
    ref="drawer"
  >
    <div class="ts-drawer__content">
      <el-form
        ref="form"
        :model="form"
        :rules="form_rules"
        :label-position="labelPosition"
      >
        <el-form-item label="用户名" :label-width="formLabelWidth" class="ts-form-label" prop="user_name">
          <el-input v-model="form.user_name" autocomplete="off" class="ts-input keys-input" :disabled="carrier.type == 'add' ? false : true"
                    maxlength="64" show-word-limit @input="valueTrim" id="rbac_addUser_user_name"></el-input>
          <span class="ts-input-tips" ref="user_name">不超过64个字符</span>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" class="ts-form-label">
          <el-input v-model="form.alias_name" autocomplete="off" class="ts-input" id="rbac_addUser_alias_name"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" class="ts-form-label">
          <el-input type="textarea" v-model="form.remarks" class="ts-area" placeholder="描述" maxlength="255" show-word-limit id="rbac_addUser_remarks"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="pwd" :label-width="formLabelWidth" class="ts-form-label" v-if="carrier.type=='add'">
          <el-input type="password" v-model="form.pwd" autocomplete="off" class="ts-input" id="rbac_addUser_pwd"></el-input>
          <!-- <span class="ts-input-tips">密码设置规则说明</span> -->
        </el-form-item>
        <el-form-item label="确认密码" prop="pass" :label-width="formLabelWidth" class="ts-form-label" v-if="carrier.type=='add'">
          <el-input type="password" v-model="form.pass" autocomplete="off" class="ts-input" id="rbac_addUser_pass"></el-input>
        </el-form-item>
        <el-form-item label="所属组织" prop="dep_id" :label-width="formLabelWidth" class="ts-form-label">
          <el-select
            v-model="form.dep_id"
            placeholder="组织"
            ref="depUpLevel"
            class="ts-input"
            id="rbac_addUser_dep_id"
            @change="certOrganVal"
          >
            <el-option
              v-for="item in restaurants"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="直属组织/部门" :label-width="formLabelWidth" class="ts-form-label">
          <div class="ts-block ts-input">
            <el-cascader
              class="ts-cascade"
              :options="departments"
              :props="props"
              v-model="form.direct_dep_ids"
              ref="dep"
              id="rbac_addUser_direct_dep_ids"
              clearable></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone" class="ts-form-label">
          <el-input v-model="form.phone" autocomplete="off" class="ts-input" maxlength="11" @input="valuePhoneTrim" id="rbac_addUser_phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" class="ts-form-label" prop="email" id="rbac_addUser_email" :rules="[
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]">
          <el-input v-model="form.email" autocomplete="off" class="ts-input" id="email"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="drawer_footer">
        <el-button @click="cancelForm" id="rbac_addUser_cancel">取 消</el-button>
        <el-button type="primary"
                   v-if="carrier.type=='add'"
                   @click="onSubmitNext('form')"
                   :loading="submitLoading" id="rbac_addUser_submit1">{{ submitLoading ? '提交中 ...' : '继续添加' }}</el-button>
        <el-button type="primary" @click="onSubmit('form')" :loading="submitLoading" id="rbac_addUser_submit">{{ submitLoading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
  </el-drawer>
</template>

<script>
  import * as requestMethod from "@/modules/rbac/api/certifiService/userApi.js"

  export default {
    props: {
      carrier: {
        type: Object
      },
      isShow: {
        type: Boolean
      },
    },
    created() {
      // 组织 下拉全部数据
      requestMethod.certOrganDepartmentApi('get', '', 'org').then(res => {
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          this.restaurants.push({
            value: data[i].dep_id,
            label: data[i].dep_name,
          })
        }
      })

    },
    mounted() {
      if (this.carrier.type === 'edit' || this.carrier.type === 'detailsEdit') {
        // 编辑先获取详情 然后赋值
        let userId = this.carrier.rowData.user_id
        requestMethod.userApi('get','', userId).then(res => {
          this.form = res.data.user
          this.form.dep_id = Number(this.carrier.rowData.dep_id)
          this.form.direct_dep_ids = res.data.user.direct_dep_ids
          this.changeDepIds = this.form.direct_dep_ids
          if (this.form.dep_id) {
            // 直属组织+部门接口 下拉全部数据[改为根据组织筛选部门]
            requestMethod.getOrgDepApi('get').then(res => {
              this.departments = res.data.items.filter(item => {
                return this.form.dep_id == item.dep_id
              })
            })
          }
        })
      } else {
        this.$nextTick(() => {
          this.$refs['form'].resetFields()
        })
      }
      // form滚动条
      // const that = this
      // this.$nextTick(() => {
      //   let flowHeight = document.body.clientHeight - 150
      //   this.$refs.form.$el.style.cssText = `overflow-y:auto;height:${flowHeight}px`
      // })
      // window.onresize = () => {
      //   return (() => {
      //     let flowHeight = document.body.clientHeight - 150
      //     that.$refs.form.$el.style.cssText = `overflow-y:auto;height:${flowHeight}px`
      //   })()
      // }

    },
    destroyed() {
      // window.onresize = null;
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
      let validateEmail = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入邮箱~'));
          return;
        }
        let emailRegex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!emailRegex.test(value)) {
          callback(new Error('邮箱格式不正确！'))
        } else {
          callback();
        }
      };
      let validateSurepassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认密码'));
        } else if (value !== this.form.pwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      const validate = (rule, value, callback) => {
        if (value.length !== 6) {
          callback(new Error('请输入六个字符'))
        } else {
          callback()
        }
      }
      let validatePhone = (rule, value, callback) => {
        if (value) {
          let phoneRegex = /^1[34578]\d{9}$/;
          if (!phoneRegex.test(value)) {
            callback(new Error('手机号码格式不正确！'))
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      let validateUserName = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入用户名！'));
          this.$refs['user_name'].style.display = 'none'
          return;
        } else {
          this.$refs['user_name'].style.display = 'block'
          callback();
        }
      };
      return {
        props: {
          value: 'dep_id',
          label: 'dep_name',
          multiple: true,
          checkStrictly: true
        },
        isVisible: this.isShow,
        validate: validate,
        multiple: {multiple: true},
        formLabelWidth: '132px',
        labelPosition: 'right',
        restaurants: [],
        departments: [],
        submitLoading: false,
        form_rules: {
          user_name: [
            {required: true, validator: validateUserName, trigger: 'change'}
          ],
          pwd: [
            {required: true, validator: validatepassword, trigger: 'change'}
          ],
          pass: [
            {required: true, validator: validateSurepassword, trigger: 'change'}
          ],
          /*email:[
             {required: true,validator: validateEmail,trigger: 'change'}
          ],*/
          dep_id: [
            {required: true, message: '所属组织不能为空！', trigger: 'change'}
          ],
          phone: [
            {required: false, validator: validatePhone, trigger: 'change'}
          ]
        },
        form: {
          user_name: '',
          alias_name: '',
          remarks: '',
          pwd: '',
          pass: '',
          dep_id: '',
          direct_dep_ids: [],
          email: '',
          phone: ''
        },
        temporary_var_pwd: '',
        changeDepIds: []
      }
    },

    methods: {
      //表单提交
      onSubmit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {//表单数据验证完成之后，提交数据;
            this.submitLoading = true
            this.form.direct_dep_ids.length = 0
            let selectedDep = this.$refs['dep'].getCheckedNodes();
            selectedDep.forEach(item => {
              this.form.direct_dep_ids.push(item.data.dep_id)
            });
            // 两次密码一致 前台确认 后台接收一次参数
            let pwd = window.btoa(this.form.pwd)
            if (pwd.length > 4) {
              let arr = Array.from(pwd)
              arr.splice(5, 0, Math.floor(Math.random() * 10))
              pwd = arr.join('')
              // this.form.pass = pwd
              this.temporary_var_pwd = pwd
            }
            // this.form.pwd = pwd
            this.form.dep_id = this.$refs['depUpLevel'].value
            let formData = this[form];
            const para = Object.assign({}, formData)
            para.pwd = this.temporary_var_pwd
            // edit
            if (this.carrier.type === 'edit') {
              // methods two
              let testData = {};
              if (delete para.user_id) {
                testData = {
                  "user": para,
                  "session_id": 0
                }
              }
              requestMethod.userApi('put', testData, formData.user_id).then(res => {
                res.code === 200 ?
                  (this.$message({
                    message: res.message,
                    type: 'success'
                  }), this.$emit('loadListEdit'), this.$refs['form'].resetFields(), this.$emit('closeDialog'))
                  : this.$message.error(res.message);
                this.submitLoading = false
              })
            } else if(this.carrier.type === 'detailsEdit') {
              let testData = {};
              if (delete para.user_id) {
                testData = {
                  "user": para,
                  "session_id": 0
                }
              }
              requestMethod.userApi('put', testData, formData.user_id).then(res => {
                res.code === 200 ?
                  (this.$message({
                    message: res.message,
                    type: 'success'
                  }), this.$emit('loadList'), this.$refs['form'].resetFields(), this.$emit('closeDialog'))
                  : this.$message.error(res.message);
                this.submitLoading = false
              })
            }
            else{
              let data = {user_data: para}
              requestMethod.userApi('post', data).then(res => {
                res.code === 200 ?
                  (this.$message({
                    message: res.message,
                    type: 'success'
                  }), this.$emit('loadListAdd'), this.$refs['form'].resetFields(), this.$emit('closeDialog'))
                  : this.$message.error(res.message);
                this.submitLoading = false
              })
            }
          }
        })
      },
      onSubmitNext(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {//表单数据验证完成之后，提交数据;
            this.submitLoading = true
            this.form.direct_dep_ids.length = 0
            let selectedDep = this.$refs['dep'].getCheckedNodes();
            selectedDep.forEach(item => {
              this.form.direct_dep_ids.push(item.data.dep_id)
            });
            // 两次密码一致 前台确认 后台接收一次参数
            let pwd = window.btoa(this.form.pwd)
            if (pwd.length > 4) {
              let arr = Array.from(pwd)
              arr.splice(5, 0, Math.floor(Math.random() * 10))
              pwd = arr.join('')
              // this.form.pass = pwd
              this.temporary_var_pwd = pwd
            }
            // this.form.pwd = pwd
            this.form.dep_id = this.$refs['depUpLevel'].value
            let formData = this[form];
            const para = Object.assign({}, formData)
            para.pwd = this.temporary_var_pwd
            // edit
            if (this.carrier.type === 'edit') {
              // methods two
              let testData = {};
              if (delete para.user_id) {
                testData = {
                  "user": para,
                  "session_id": 0
                }
              }
              requestMethod.userApi('put', testData, formData.user_id).then(res => {
                res.code === 200 ?
                  (this.$message({
                    message: res.message,
                    type: 'success'
                  }), this.$emit('loadListEdit'), this.$refs['form'].resetFields(), this.$emit('closeDialog'))
                  : this.$message.error(res.message);
                this.submitLoading = false
              })
            } else if(this.carrier.type === 'detailsEdit') {
              let testData = {};
              if (delete para.user_id) {
                testData = {
                  "user": para,
                  "session_id": 0
                }
              }
              requestMethod.userApi('put', testData, formData.user_id).then(res => {
                res.code === 200 ?
                  (this.$message({
                    message: res.message,
                    type: 'success'
                  }), this.$emit('loadList'), this.$refs['form'].resetFields(), this.$emit('closeDialog'))
                  : this.$message.error(res.message);
                this.submitLoading = false
              })
            }
            else{
              let data = {user_data: para}
              requestMethod.userApi('post', data).then(res => {
                res.code === 200 ?
                  (this.$message({
                    message: res.message,
                    type: 'success'
                  }), this.$emit('loadListAdd'), this.$refs['form'].resetFields(),this.form.remarks='',this.form.alias_name='',this.form.direct_dep_ids=[])
                  : this.$message.error(res.message);
                this.submitLoading = false
              })
            }
          }
        })
      },
      cancelForm() {
        this.$emit('closeDialog');
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
      },
      valueTrim() {
        this.form.user_name = this.form.user_name.trim()
      },
      valuePhoneTrim() {
        this.form.phone = this.form.phone.trim()
      },
      certOrganVal(val) {
        if (this.form.dep_id) {
          // 直属组织+部门接口 下拉全部数据[改为根据组织筛选部门]
          requestMethod.getOrgDepApi('get').then(res => {
            this.departments = res.data.items.filter(item => {
              return this.form.dep_id == item.dep_id
            })
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .ts-drawer__content {
    .el-form-item__error {
      left: 56px;
    }
  }
  .ts-input{
    width: 80%;
    margin-left: 46px;
  }
  .ts-input-tips {
    width: 80%;
    color: #7F7F7F;
    font-size: 12px;
    padding-left: 46px;
    display: inline-block;
  }
  .ts-block {
    .ts-cascade {
      width: 100%;
    }
  }
  .operate-btn-common {
    @operate-btn-common();
  }

  .ts-area {
    width: 80%;
    margin: 0 46px;
  }

  /deep/ .keys-input .el-input__inner {
    padding-right: 48px;
  }
</style>
