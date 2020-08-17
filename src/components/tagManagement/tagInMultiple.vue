<template>
  <div class="tag-drawer">
    <el-dialog
      title="批量添加标签"
      @close="cancelForm"
      :visible.sync="isVisible"
      custom-class="formCustom"
    >
      <el-form
        ref="form"
        :model="form"
        :label-position="labelPosition"
      >
        <div>
          <el-form-item
            label="键-Key"
            :label-width="formLabelWidth"
            class="ts-form-label"
            prop="tag_key"
          >
            <el-select
              v-model="form.tag_key"
              filterable
              allow-create
              default-first-option
              placeholder="请输入标签key"
              @change="tagKeyChange"
            >
              <el-option
                v-for="item in options_key"
                :key="item.tag_id"
                :label="item.tag_key"
                :value="item.tag_key"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="值-Value"
            :label-width="formLabelWidth"
            class="ts-form-label"
            prop="tag_value_single"
          >
            <el-select
              v-model="form.tag_value"
              filterable
              allow-create
              default-first-option
              placeholder="请输入标签value">
              <el-option
                v-for="item in options_value"
                :key="item.value_id"
                :label="item.tag_value"
                :value="item.tag_value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
            <span class="icon-cursor" @click="addInputs">
            <svg-icon icon-class='task_step_add' class='iconCss'></svg-icon>
            </span>
          </el-form-item>
          <el-tag
            v-for="tag in dynamicTags"
            :key="tag.value_id"
            closable
            type="info"
            :disable-transitions="false"
            @close="handleClose(tag.tag_key)">
            键：{{tag.tag_key}}  值：{{tag.tag_value}}
          </el-tag>
        </div>
      </el-form>
      <span slot="footer">
        <el-button @click="cancelForm" id="rbac_userPassword_cancel">
          取 消
        </el-button>
        <el-button type="primary" @click="onSubmit" :loading="submitLoading" id="rbac_userPassword_submit">
          {{ submitLoading ? '提交中 ...' : '确 定' }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as requestMethods from '@/components/tagManagement/api/tag.js'
  export default {
    name: "tagInDetails",
    props: {
      isShow: {
        type: Boolean
      },
      appId: {
        type: String
      },
      tagList: {
        type: String
      },
      multipleSelection: {
        type: Array
      }
    },
    data() {
      return {
        isVisible: this.isShow,
        formLabelWidth: '106px',
        labelPosition: 'right',
        submitLoading: false,
        form: {
          tag_type: 2,
          tag_category: 7,
          tag_key: '',
          tag_value: '',
          instance_list: [
            {
              tag_id: 0,
              value_id: 0,
              obj_id: 0
            }
          ]
        },
        options_key: [],
        options_value: [],
        dynamicTags: [],
        valuesList: []
      }
    },
    mounted() {
      this.tagKeyList()
      // this.dynamicTags = JSON.parse(this.tagList)
      // this.dynamicTags.forEach(item => {
      //   this.valuesList.push({
      //     tag_value: item.tag_value,
      //     value_id: item.value_id
      //   })
      // })
      console.log(this.multipleSelection)
    },
    methods: {
      cancelForm() {
        this.$emit('closeDialog')
      },
      tagKeyList() {
        let para = {
          tag_type: '1,2,3'
        }
        requestMethods.getTagKey('get', para).then(res => {
          if (res.code == 200) {
            let newData = res.data.items.map(item => {
              item.disabled = false
              return item
            })
            this.options_key = newData
          }else {
            // this.$message.error(res.message || '标签key获取失败')
          }
          this.loading = false
        })
      },
      // 获取标签value
      tagValueList(tag_id) {
        let para = {
          tag_id: tag_id,
        }
        requestMethods.getTagValue('get', para).then(res => {
          if (res.code == 200) {
            this.form.tag_value = ''
            this.options_value= []
            this.options_value = res.data.items
            let options_value = this.options_value
            options_value.forEach(item => {
              if (this.valuesList.findIndex(items => items.value_id == item.value_id) == -1) {
                this.valuesList.push(item)
              }
            })
            options_value.map(item => {
              if (this.checkSelected(item.tag_value) != -1) {
                item.disabled = true
              }
              return item
            })
          }else {
            this.$set(this, 'options_value', [])
          }
          this.loading = false
        })
      },
      // 切换标签key获取标签value
      tagKeyChange(val) {
        // 改变key下拉选项，置灰已选择选项
        let index = this.options_key.findIndex(fruit => fruit.tag_key === val)
        if (index != -1) {
          this.options_key[index].disabled = true
          // 其他未选择选项还原
          this.options_key.map((item, i) => {
            if (index == i) {
              item.disabled = true
              this.dynamic = item
            }else {
              item.disabled = false
            }
            return item
          })
          let id = this.options_key[index].tag_id
          this.tagValueList(id)
        }else {

        }
      },
      onSubmit() {
        if(this.dynamicTags.length) {
          // 更改所需参数
          let arr = []
          // 遍历标签
          this.dynamicTags.forEach(item => {
            let tag_id = this.getCorrespondKey(item.tag_key)
            let value_id = this.getCorrespondValue(item.tag_value)
            item.instance_list = {

            }
            this.multipleSelection.forEach(items => {
              let obj = {
                tag_id: tag_id,
                value_id: value_id,
                obj_id: items.app_id
              }
              // item.instance_list.obj_id = items.app_id
              arr.push(obj)
            })
          })
          let para = {
            tag_category: 7,
            obj_type: 'app_system',
            instance_list: arr
          }
          requestMethods.linkObjTag('post', para).then(res => {
            if (res.code == 200) {
              this.$message.success(res.message)
              this.$emit('closeDialog')
              this.$emit('loadList')
            }else {
              this.$message.error(res.message)
            }
          })
        }else {
          // 判断如果预选标签区不存在则传select框选中的值
          let tag_id = this.getCorrespondKey(this.form.tag_key)
          let value_id = this.getCorrespondValue(this.form.tag_value)
          let para = this.form
          para.obj_type = 'app_system'
          let arr = []
          this.multipleSelection.forEach(items => {
            let obj = {
              tag_id: tag_id,
              value_id: value_id,
              obj_id: items.app_id
            }
            arr.push(obj)
          })
          para.instance_list = arr
          requestMethods.linkObjTag('post', para).then(res => {
            if (res.code == 200) {
              this.$message.success(res.message)
              this.$emit('closeDialog')
              this.$emit('loadList')
            }else {
              this.$message.error(res.message)
            }
          })
        }

      },
      addInputs() {
        let index = this.dynamicTags.findIndex(item => item.tag_value==this.form.tag_value)
        if (index==-1 && this.form.tag_key) {
          let str = JSON.stringify(this.form)
          this.dynamicTags.push(JSON.parse(str))
        }
      },
      handleClose(val) {
        let index = this.dynamicTags.findIndex(item => item.tag_key==index)
        this.dynamicTags.splice(index, 1)
      },
      // 获取key 对应的id
      getCorrespondKey(key) {
        let index = this.options_key.findIndex(item => item.tag_key == key)
        let id = this.options_key[index].tag_id
        return id
      },
      // 获取tag_id 对应的名称
      getCorrespondValue(val) {
        let index = this.valuesList.findIndex(item => item.tag_value == val)
        let id = this.valuesList[index].value_id
        return id
      },
      // 检测是否存在已选中数据
      checkSelected(val) {
        if (JSON.parse(this.tagList)) {
          let index = JSON.parse(this.tagList).findIndex(item => item.tag_value == val)
          return index
        }else {
          return -1
        }
      }
    }
  }
</script>

<style scoped>
  .el-tag {
    margin: 6px 0 0 6px;
  }
  .theme_default .el-select {
    width: 90%;
  }
  .icon-cursor {
    cursor: pointer;
    margin-left: 12px;
  }
</style>
