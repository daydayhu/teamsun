<template>
  <div style="margin-top: 16px">
    <span v-if="dynamicTags.length!=0">检索项：</span>
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag.name"
      closable
      type="info"
      :disable-transitions="false"
      @close="handleClose(tag.name)">
      {{tag.name}}
    </el-tag>
  </div>
</template>

<script>
  import eventBus from "@/components/tagManagement/utils/eventBus.js";
  import {setSession, getSession} from '@/commons/js/searchFresh.js';
  export default {
    name: "tagInResult",
    data() {
      return {
        dynamicTags: []
      }
    },
    created() {
      this.filterTag()
    },
    methods: {
      handleClose(tag) {
        // 获取所删除标签在数组中的index
        let tagIndex = this.dynamicTags.findIndex(item => item.name == tag)
        this.dynamicTags.splice(tagIndex, 1);
        // 对应删除下拉框过滤条件
        // this.sourceData.splice(tagIndex, 1)
        this.closeTags(tagIndex)
        this.ShowHidden = false
        // 获取session
        let obj = getSession('searchFresh')
        obj.keyword.key_json.splice(tagIndex, 1)
        if (obj.keyword.key_json.length == 0) {
          obj.keyword = {}
        }
        setSession('searchFresh', obj);
        this.$emit('searchContdition')
        // 删除下拉框中数据

      },
      filterTag() {
        eventBus.$on('commonFn',(message)=>{   //这里最好用箭头函数，不然this指向有问题
          this.dynamicTags = message
        })
      },
      closeTags(tagIndex) {
        eventBus.$emit("commonCloseFn",tagIndex)   //$emit这个方法会触发一个事件
      }
    }
  }
</script>

<style scoped>

</style>
