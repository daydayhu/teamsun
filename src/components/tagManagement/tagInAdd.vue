<template>
  <el-form-item :class="[operation === 'edit' ? tagInEdit : tagInAdd]"
                label="标签"
  >
    <el-form
      :model="tagWrap"
    >
      <div
        v-for="(item, index) in tagWrap.tagInputs"
        :key="item.self_id"
        class="input-wrap"
      >
        <el-form-item
          :prop="`tagInputs.${index}.tag_key`"
          :rules="tagRules['tagKey']"
        >
          <el-select
            v-model="item.tag_key"
            filterable
            allow-create
            default-first-option
            clearable
            placeholder="请输入标签key"
            @change="tagKeyChange(item,index)"
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
        >
          <el-select
            v-model="item.tag_value"
            filterable
            allow-create
            default-first-option
            clearable
            placeholder="请输入标签value"
          >
            <el-option
              v-for="item in options_value"
              :key="item.value_id"
              :label="item.tag_value"
              :value="item.tag_value">
            </el-option>
          </el-select>
        </el-form-item>

        <div class="operate-wrap">
        <span class="icon-cursor" @click="addInputs" v-if="index==tagWrap.tagInputs.length-1">
          <svg-icon icon-class='task_step_add' class='iconCss'></svg-icon>
        </span>
          <span class="icon-cursor" @click="removeInputs(item)">
          <svg-icon v-if="index != 0" icon-class='task_step_remove' class='iconCss'></svg-icon>
        </span>
        </div>
      </div>
    </el-form>


  </el-form-item>
</template>

<script>
  import * as requestMethods from '@/components/tagManagement/api/tag.js'
  export default {
    name: "tagInAdd",
    props: {
      operation: {
        type: String
      }
    },
    data() {
      const tagInKey = (rule, value, callback) => {
        // 获取当前所点击ele元素的index
        let index1 = this.options_key.findIndex(fruit => fruit.tag_key === value)
        if (index1 != -1) {
          callback()
        }else {
          callback(new Error('该key不存在，将添加到您的用户标签中'))
        }
      }
      return {
        tagWrap: {
          tagInputs: [
            {
              self_id: 0,
              tag_key: '',
              tag_value: '',
              tag_type: 2
            }
          ],
        },
        snap_id: 0,
        options_key: [],
        options_value: [],
        selectedTag: [],
        dynamic: {},
        tagRules: {
          tagKey: [{ required: true, validator: tagInKey, trigger: 'change'}],
        },
        tagInEdit: 'tag-edit-in-wrap',
        tagInAdd: 'tag-in-wrap',
      }
    },
    mounted() {
      this.tagKeyList()
      console.log(this.operation)
    },
    methods: {
      addInputs() {
        this.snap_id = this.snap_id + 1
        this.tagWrap.tagInputs.push({
          self_id: this.snap_id,
          tag_key: '',
          tag_value: '',
          tag_type: 2
        })
        // 标签添加的时候置灰已选择标签（）
        this.selectedTag.push(this.dynamic)
        // 取下标
        let index_s = []
        this.selectedTag.forEach(item => {
          index_s.push(this.options_key.findIndex(fruit => fruit.tag_id === item.tag_id))
        })
        this.options_key.map((item, i) => {
          if (index_s.indexOf(i) != -1) {
            item.disabled = true
            this.dynamic = item
          }
          return item
        })
      },
      removeInputs(item) {
        let index = this.tagWrap.tagInputs.indexOf(item)
        let selectedIndex = this.selectedTag.indexOf(item)
        if (index !== -1) {
          this.tagWrap.tagInputs.splice(index, 1)
          this.selectedTag.splice(selectedIndex, 1)
          this.options_key.map((item, i) => {
            if (index == i) {
              item.disabled = false
            }
            return item
          })
        }
      },
      // 获取标签key
      tagKeyList() {
        let para = {
          // tag_category: 7,
          tag_type: '1,2,3'
        }
        requestMethods.getTagKey('get', para).then(res => {
          if (res.code == 200) {
            let newData = res.data.items.map(item => {
              item.disabled = false
              item.tag_type = item.tag_type.type
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
            // let index = this.tagWrap.tagInputs.findIndex(item => item.tag_id==tag_id)
            // this.tagWrap.tagInputs[index].tag_value = ''
            this.options_value= []
            this.options_value = res.data.items
          }else {
            this.$set(this, 'options_value', [])
          }
          this.loading = false
        })
      },
      // 切换标签key获取标签value
      tagKeyChange(item,index) {
        console.log(this.tagWrap)
        // 改变key下拉选项，置灰已选择选项
        let index1 = this.options_key.findIndex(fruit => fruit.tag_key === item.tag_key)
        let tag_type = this.options_key.find(fruit => fruit.tag_key === item.tag_key)
        if (typeof tag_type == 'undefined') {
          this.tagWrap.tagInputs[index].tag_type = 3
        }
        if (index1 != -1) {
          this.options_key[index].disabled = true
          // 其他未选择选项还原
          this.options_key.map((item, i) => {
            if (index1 == i) {
              item.disabled = true
              this.dynamic = item
            }else {
              item.disabled = false
            }
            return item
          })
          let id = this.options_key[index1].tag_id
          this.tagValueList(id)
        }else {
        }
      },
      tagInfo() {
        return this.tagWrap.tagInputs
      },
    }
  }
</script>

<style lang="less" scoped>
  .tag-in-wrap{
    /deep/.input-wrap{
      display: flex;
      div {
        padding-right: 6px;
      }
      .operate-wrap{
        width: 104px;
        .icon-cursor {
          display: inline-block;
          cursor: pointer;
        }
      }
    }
    /deep/.el-form-item__label {
      line-height: 68px;
    }
  }
  .tag-edit-in-wrap{
    /deep/.input-wrap{
      display: flex;
      div {
        padding-right: 6px;
      }
      .operate-wrap{
        width: 104px;
        .icon-cursor {
          display: inline-block;
          cursor: pointer;
        }
      }
    }
  }
</style>
