<template>
  <div class="tag-drawer">
    <el-dialog
      :title="tagObj.title"
      @close="cancelForm"
      :visible.sync="isVisible"
      custom-class="formCustom"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
        :label-position="labelPosition"
      >
        <el-form-item label="类型" prop="tag_type" :label-width="formLabelWidth">
          <div v-if="tagObj.type == 'edit'">
            <el-radio-group v-model="form.tag_type">
              <el-radio-button label="1" v-if="tagObj.tag_type==1">全局
              </el-radio-button>
              <el-radio-button label="3" v-else-if="tagObj.tag_type==3">我的
              </el-radio-button>
              <!--            <el-radio-button label="3">用户自定义</el-radio-button>-->
            </el-radio-group>
          </div>
          <div v-else>
            <el-radio-group v-model="form.tag_type">
              <el-radio-button label="1">全局
              </el-radio-button>
              <el-radio-button label="3">我的
              </el-radio-button>
              <!--            <el-radio-button label="3">用户自定义</el-radio-button>-->
            </el-radio-group>
          </div>

        </el-form-item>
        <div v-if="!isBatchAdd">
          <el-form-item
            label="键-Key"
            :label-width="formLabelWidth"
            class="ts-form-label"
            prop="tag_key"
          >
            <el-input
              v-model="form.tag_key"
              autocomplete="off"
              class="ts-input"
              placeholder="请输入Key"
              id="rbac_userPassword_new_pwd"
              :disabled="tagObj.type=='edit'"
              maxlength="64"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item
            label="值-Value"
            :label-width="formLabelWidth"
            class="ts-form-label"
            prop="tag_value_single"
          >
            <el-input
              v-model="form.tag_value_single"
              autocomplete="off"
              class="ts-input"
              placeholder="请输入Value"
              maxlength="64"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item
            :label-width="formLabelWidth"
            class="ts-form-label"
            prop="tag_value"
          >
            <el-input
              v-model="form.tag_value"
              type="textarea"
              autocomplete="off"
              class="ts-input"
              :placeholder="inputTips"
              :rows="4"
            ></el-input>
          </el-form-item>
          <span class="tips">
              注：Key和Value之间使用”：“分割<br/>
              多个标签之间使用换行分割
            </span>
        </div>

      </el-form>
      <div class="batchAdd" v-if="tagObj.type=='add'">
        <el-button
          type="primary"
          @click="handleBatchAdd(true)"
          v-if="!this.isBatchAdd"
        >批量添加
        </el-button>
        <el-button v-else type="primary" @click="handleBatchAdd(false)">单个添加</el-button>
      </div>
      <div class="operate-btn-common">
        <el-button @click="cancelForm" id="rbac_userPassword_cancel">
          取 消
        </el-button>
<!--        <el-button type="primary" @click="deleteTagRequest" id="rbac_userPassword_del" v-if="tagObj.type=='edit'">-->
<!--          删除-->
<!--        </el-button>-->
        <el-button type="primary" @click="onSubmit" :loading="submitLoading" id="rbac_userPassword_submit">
          {{ submitLoading ? '提交中 ...' : '确 定' }}
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import * as requestMethods from "@/modules/rbac/api/tagManagement/tagManagement.js"
  import _ from 'lodash'

  export default {
    props: {
      tagObj: {
        type: Object
      },
      isShow: {
        type: Boolean
      }
    },
    data() {
      let validTagValue = (rule, value, callback) => {
        if (value) {
          let res = this.checkTagList(value)
          if (res.length) {
            callback()
          } else {
            callback(new Error('仅支持汉字、英文字母、数字、+-=._/@'))
          }
        } else {
          callback(new Error('请输入内容'))
        }
      }
      let validTagKeyValue = (rule, value, callback) => {
        if (value) {
          let res = this.checkTagKeyOrVal(value)
          if(res) {
            callback()
          }else {
            callback(new Error('仅支持汉字、英文字母、数字、+-=._/@'))
          }
        } else {
          callback(new Error('请输入内容'))
        }
      }
      return {
        isVisible: this.isShow,
        formLabelWidth: '106px',
        labelPosition: 'right',
        submitLoading: false,
        pwdRules: {},
        pwdForm: {
          old_pwd: '',
          new_pwd: '',
          passwords: ''
        },
        form: {
          tag_type: '1',
          tag_category: 0,
          tag_key: '',
          tag_value_single: '',
          tag_list: [
            {
              'tag_key': '',
              'tag_value': []
            }
          ]
        },
        formRules: {
          tag_key: [
            {required: true, validator: validTagKeyValue, trigger: ['blur', 'change']}
          ],
          tag_value: [
            {validator: validTagValue, trigger: ['blur', 'change']}
          ],
          tag_value_single: [
            {required: true, validator: validTagKeyValue, trigger: ['blur', 'change']},
          ]
        },
        isBatchAdd: false,
        temporaryPwdForm: {
          old_pwd: '',
          new_pwd: '',
          passwords: ''
        },
        inputTips: '举例：\n部门：IT部'
      }
    },


    mounted() {
      if (this.tagObj.type == 'edit') {
        let para = {
          tag_id: this.tagObj.tag_id,
          value_id: this.tagObj.value_id
        }
        requestMethods.tagDetails('get', para).then(res => {
          if (res.code == 200) {
            this.form = res.data.item
            this.$set(this.form, 'tag_value_single', res.data.item.tag_value)
          } else {
            this.$message.error(res.message || '获取指定标签信息失败')
          }
        })
      }
    },

    methods: {
      checkTagList(text) {
        let data = text.replace(/\s/gi, function () {
          return ','
        })
        let arr = _.compact(data.split(','))
        if (arr.length) {
          let res = arr.filter(item => {
            return this.checkTagKeyOrVal(item);
          })
          return res
        }
        return arr
      },
      checkTagKeyOrVal(text) {
        // 输入规则匹配
        /**
         * 仅支持汉字、英文字母、数字、+-=._/@
         **/
        let reg = /^[\u4e00-\u9fa5+-=._/@a-zA-Z0-9：]+$/
        return reg.test(text)
      },
      //表单提交
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.tagObj.type == 'edit') {
              let para = this.form
              para.value_id = this.tagObj.value_id
              para.tag_value = this.form.tag_value_single
              requestMethods.editTag('put', para).then(res => {
                /*this.$message({
                  message: res.message,
                  type: 'success'
                }),*/
                  res.code === 200 ?
                  (this.$emit('loadList'), this.$refs['form'].resetFields(), this.$emit('closeDialog'))
                  : this.$message.error(res.message);
                this.submitLoading = false
              })
            } else {
              let para = '';
              let params = this.form
              if (this.isBatchAdd) {
                let tag_list = this.getBatchAddData();
                params.tag_list = tag_list;
              } else {
                params.tag_list[0].tag_key = this.form.tag_key
                params.tag_list[0].tag_value = [this.form.tag_value_single]
              }
              para = params;
              requestMethods.addTag('post', para).then(res => {
                res.code === 200 ?
                  (this.$emit('loadList'), this.$refs['form'].resetFields(), this.$emit('closeDialog'))
                  : this.$message.error(res.message);
                this.submitLoading = false
              })
            }
          }
        })
      },
      handleBatchAdd(boole) {
        this.isBatchAdd = boole;
      },
        async deleteTagRequest() {
            let para = {
                tag_list: [
                    {
                        tag_id:this.tagObj.tag_id,
                        value_id: this.tagObj.value_id
                    }
                ]
            }
            const res = await requestMethods.deleteTag('delete', para);
            if (res.code == 200) {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                this.cancelForm();
                this.$emit('get-data-list');
            } else {
                this.$message.error(res.message || '标签删除失败');
            }
        },
      /**
       * 批量添加
       */
      getBatchAddData() {
        let obj = {}
        let tagArr = this.checkTagList(this.form['tag_value'])
        let tagList = []
        tagArr.forEach(item => {
            console.log()
            const index = item.indexOf("：");
            let arr = index > -1 ? item.split("：") : item.split(':')
            arr = arr ? arr : item.split("：")
          !obj[arr[0]] && (obj[arr[0]] = [])
          obj[arr[0]].push(arr[1])
        })
        for (let key in obj) {
          tagList.push({
            'tag_key': key,
            'tag_value': obj[key][0] ? obj[key] : [key]
          })
        }
        return tagList;
      },
      cancelForm() {
        this.$emit('closeDialog');
      }
    }
  }
</script>

<style lang="less" scoped>
  .tag-drawer {


    /deep/ .el-dialog__body {
      padding-bottom: 62px;
    }

    .batchAdd {
      display: flex;
      justify-content: flex-end;
    }

    .operate-btn-common {
      @operate-btn-common();
      left: 0;
    }
  }


  .formCustom {
    .el-dialog__body {
      .el-form {
        width: 80%;
        margin: 0 auto;
      }
    }
    .tips{
      display: inline-block;
      margin-left: 106px;
      color: rgba(25,34,59,.45);
    }
  }
</style>
