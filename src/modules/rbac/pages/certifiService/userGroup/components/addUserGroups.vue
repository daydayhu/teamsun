<template>
  <div class="user-dialog">
    <el-dialog :visible.sync="dialogVisible" @close="close" :title="dialogTitle">
      <el-form ref="userGroupForm" :rules="rules" :model="userGroupForm" :label-position="labelPosition" :label-width="formLabelWidth">
        <div class="add-user-groups-content">
          <el-form-item label="用户组名称" prop="group_name">
            <el-input autocomplete="off" v-model="userGroupForm.group_name" maxlength="64" show-word-limit id="rbac_addUserGroups_group_name"></el-input>
            <span class="ts-input-tips" ref="user_name">不超过64个字符</span>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" placeholder="备注" v-model="userGroupForm.remarks" maxlength="255" show-word-limit id="rbac_addUserGroups_remarks"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirm(false)" id="rbac_addUserGroups_cancel">取 消</el-button>
        <el-button type="primary" @click="saveNext('userGroupForm')" id="rbac_addUserGroups_submit" v-if="group_id == ''">继续添加</el-button>
        <el-button type="primary" @click="save('userGroupForm')" id="rbac_addUserGroups_submit1">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
  import * as requestMethod from "@/modules/rbac/api/certifiService/userGroupApi";

  export default {
    props: {
      dialogTitle: {
        type: String
      },
      dialogFormVisible: {
        type: Boolean
      },
      editData: {
        type: Object
      }
    },
    data() {
      let validateDepName = (rule, value, callback) => {
        if (value == '' || typeof value == 'undefined') {
          callback(new Error('请输入用户组名称!'));
        } else if (/^\s+$/gi.test(value)) {
          callback(new Error('不能纯输入空格!'));
          return;
        } else {
          callback();
        }
      };
      return {
        dialogVisible: this.dialogFormVisible,
        group_id: '',
        userGroupForm: {
          group_name: '',
          remarks: '',
        },
        rules: {
          group_name: [
            {required: true, validator: validateDepName, trigger: 'change'},
            {max: 64, message: '不超过64个字符', trigger: 'blur'}
          ]
        },
        labelPosition: 'right',
        formLabelWidth: '106px',
      }
    },
    watch: {
      editData: {
        handler(newVal) {
          if (JSON.stringify(newVal) === '{}') return;
          let {group_alias, remarks, group_id} = newVal;
          this.userGroupForm.group_name = group_alias;
          this.userGroupForm.remarks = remarks;
          this.group_id = group_id
        },
        immediate: true
      }
    },
    methods: {
      validateName(rule, value, callback) {
        if (value == "") {
          return callback(new Error("名称不能为空"));
        } else {
          return callback();
        }
      },
      save(userGroupForm) {
        this.$refs[userGroupForm].validate(valid => {
          if (valid) {
            let type = 'post';
            let params = Object.assign({}, this.userGroupForm);
            if (this.group_id) {
              params['group_id'] = this.group_id;
              type = 'put';
            }
            requestMethod.addUserGroup(type, params).then(res => {
              if (res.code === 200) {
                if (res.status) {
                  this.$emit('close-dialog');
                  this.$message.success(res.message);
                } else {
                  this.$message.error(res.message);
                }
              }else {
                this.$message.error(res.message);
              }
            })
          } else {
            return false;
          }
        });
      },
      saveNext(userGroupForm) {
        this.$refs[userGroupForm].validate(valid => {
          if (valid) {
            let type = 'post';
            let params = Object.assign({}, this.userGroupForm);
            if (this.group_id) {
              params['group_id'] = this.group_id;
              type = 'put';
            }
            requestMethod.addUserGroup(type, params).then(res => {
              if (res.code === 200) {
                if (res.status) {
                  this.$emit('loadList')
                  this.$message.success(res.message);
                  this.$refs['userGroupForm'].resetFields()
                } else {
                  this.$message.error(res.message);
                }
              }else {
                this.$message.error(res.message);
              }
            })
          } else {
            return false;
          }
        });
      },
      confirm(res, obj) {
        this.$emit("close-dialog", res, obj);
      },
      close() {
        this.confirm(false, {});
      }
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .ts-input-tips {
    color: #7F7F7F;
    font-size: 12px;
    padding-left: 25px;
    display: block;
  }

  .user-dialog {
    .add-user-groups-content {
      .el-form-item {
        .el-input, .el-textarea {
          width: 80%;
          margin-left: 20px;
        }

        .el-input {
          margin-bottom: 5px;
        }
      }

      .el-form-item:first-child {
        margin-bottom: 30px;
      }

      /deep/ .el-form-item__error {
        left: 20px;
      }

      /*.user-group-name{*/
      /*.font-mark{*/
      /*color: red;*/
      /*}*/
      /*.user-group-left{*/
      /*line-height:40px;*/
      /*}*/
      /*.user-name-tip{*/
      /*color:#999;*/
      /*}*/
      /*}*/
      /*.user-group-left{*/
      /*line-height:40px;*/
      /*}*/
    }


  }
</style>
