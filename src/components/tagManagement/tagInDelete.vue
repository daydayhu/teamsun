<template>
  <div class="tag-drawer">
    <el-dialog
      title="移除标签"
      @close="cancelForm"
      :visible.sync="isVisible"
      custom-class="formCustom"
    >
      <el-form
        ref="form"
        :model="form"
        :label-position="labelPosition"
      >
        <div style="display: flex">
          <div class="selectedTags">
            <el-tag
              v-for="tag in dynamicTags"
              :key="tag.value_id"
              closable
              type="info"
              :disable-transitions="false"
              @close="handleClose(tag.tag_value)">
              键：{{tag.tag_key}}  值：{{tag.tag_value}}
            </el-tag>
          </div>
          <span @click="removeAllTags" class="icon-cursor remove-all-tags">移除全部</span>
        </div>
        <div style="margin: 12px 0 0 6px;">预移除标签区：</div>
        <div>
          <el-tag
            v-for="tag in deleteTags"
            :key="tag.value_id"
            closable
            type="info"
            :disable-transitions="false"
            @close="handleCloseDelete(tag.tag_key)">
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
    name: "tagInDelete",
    props: {
      isShow: {
        type: Boolean
      },
      appId: {
        type: String
      },
      tagList: {
        type: String
      }
    },
    data() {
      return {
        isVisible: this.isShow,
        formLabelWidth: '106px',
        labelPosition: 'right',
        submitLoading: false,
        form: {},
        options_key: [],
        options_value: [],
        dynamicTags: [],
        valuesList: [],
        deleteTags: [],
        isRemove: true
      }
    },
    mounted() {
      this.dynamicTags = JSON.parse(this.tagList)
      if (typeof this.dynamicTags == 'Array') {
        this.dynamicTags.forEach((item) => {
          this.valuesList.push({
            tag_value: item.tag_value,
            value_id: item.value_id
          })
        })
      }
    },
    methods: {
      cancelForm() {
        this.$emit('closeDialog')
      },
      onSubmit() {
        console.log(this.deleteTags)
        // removeObjTag
        let deleteArr = this.deleteTags.map(item => {
          return item.instance_id
        })
        let para = {
          instance_list: deleteArr
        }
        requestMethods.removeObjTag('delete',para).then(res => {
          if (res.code == 200) {
            this.$message.success(res.message || '标签解除成功')
            this.$emit('closeDialog')
            this.$emit('loadList')
          }else {
            this.$message.error(res.message || '标签解除失败')
          }
        })
      },
      handleClose(val) {
        let index = this.dynamicTags.findIndex(item => item.tag_value==val)
        let obj =  this.dynamicTags.splice(index, 1)
        this.deleteTags.push(obj[0])
        if (this.dynamicTags.length == 0) {
          this.isRemove = false
        }
      },
      handleCloseDelete(val) {
        let index = this.deleteTags.findIndex(item => item.tag_value==val)
        let obj = this.deleteTags.splice(index, 1)
        this.dynamicTags.push(obj[0])
      },
      // 移除全部
      removeAllTags() {
        if (this.isRemove){
          this.deleteTags = JSON.stringify(this.dynamicTags)
          this.dynamicTags = []
          this.deleteTags = JSON.parse(this.deleteTags)
          this.isRemove = false
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
  .selectedTags {
    background: #fff;
    color: #332a7c;
    border-color: rgba(51,42,124,.45);
    border-radius: 14px;
    border: 1px solid #dcdfe6;
    padding: 8px;
    width: 88%;
    min-height: 100px;
  }
  .remove-all-tags {
    margin-top: 6px;
    color: #409EFF;
  }
</style>
