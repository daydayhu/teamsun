<template>
  <div class="tag-filter-wrap">
    <el-button
      type="default"
      size="small"
      :disabled="false"
      @click.stop="ShowHidden = !ShowHidden"
    >
      标签<i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>
    <div v-if="ShowHidden" @click.stop="" class="tag-block">
      <el-cascader-panel
        v-model="sourceData"
        :options="tagOptions"
        :props="propsConfig"
        @change="selectItem"
        visible-change="false"
      ></el-cascader-panel>
    </div>
  </div>
</template>

<script>
  import * as requestMethods from '@/components/tagManagement/api/tag.js'
  import {setSession, getSession} from '@/commons/js/searchFresh.js';
  import eventBus from "@/components/tagManagement/utils/eventBus.js";
  export default {
    name: "tagInList",
    props: {
      theTagObj: {
        type: Object
      }
    },
    data() {
      return {
        dynamicTags: [],
        value1: [],
        value2: [],
        tagOptions: [],
        propsConfig: {
          multiple: true,
          expandTrigger: 'hover',
          label: 'value',
          value: 'id'
        },
        sourceData: [

        ],
        ShowHidden: false
      }
    },
    created() {
      this.closeTags()
    },
    mounted () {
      document.addEventListener('click', this.tagFilter)
      this.getTagList()
      // 获取对应标签显示
      // let keyword = getSession('searchFresh').keyword
      // if (JSON.stringify(keyword) != "{}") {
      //   let key_json = keyword.key_json
      //   let newVal = key_json.map(item => {
      //     let key = this.getCorrespondKey(item.tag_id)
      //     let value = this.getCorrespondValue(item.value_id)
      //     return {
      //       name: '键'+' '+key+' '+'值'+' '+value,
      //       type: 'info'
      //     }
      //   })
      //   this.$set(this, 'dynamicTags', newVal)
      // }
    },
    methods: {
      tagFilter() {
        this.ShowHidden = false
      },
      selectItem(val) {
        this.ShowHidden = false
        // 控制标签显示隐藏
        // 标签数据转换
        this.sourceData = val
        // 转换成label
        let newVal = val.map(item => {
          let key = this.getCorrespondKey(item[0])
          let value = this.getCorrespondValue(item[1])
          return {
            name: '键'+' '+key+' '+'值'+' '+value,
            type: 'info'
          }
        })
        this.$set(this, 'dynamicTags', newVal)
        // 转换所需查询过滤的标签
        let filterSourceData = this.sourceData
        let filterJson = filterSourceData.map(item => {
          let obj = {
            tag_id: item[0],
            value_id: item[1]
          }
          return obj
        })
        let key_json = {}
        // 获取session
        let obj = getSession('searchFresh')
        obj.keyword.key_json = filterJson
        setSession('searchFresh', obj);
        this.showFilterResult()
        this.$emit('searchContdition')
      },
      // 获取tag标签列表
      getTagList() {
        let para = {
          tag_category: this.theTagObj.tag_category,
          tag_type: this.theTagObj.tag_type
        }
        requestMethods.getTagCascader('get', para).then(res => {
          if (res.code == 200) {
            this.tagOptions = res.data.items
          }else {
            // this.$message.error(res.message || '标签key获取失败')
          }
          this.loading = false
        })
      },
      // 获取tag_id 对应的名称
      getCorrespondKey(id) {
        let index = this.tagOptions.findIndex(item => item.id == id)
        let name = this.tagOptions[index].value
        return name
      },
      // 获取tag_id 对应的名称
      getCorrespondValue(id) {
        // 获取所有children数据
        let value_arr = this.tagOptions.map(item => item.children)
        let value_json = value_arr.reduce(function (a, b) { return a.concat(b)} )
        let index = value_json.findIndex(item => item.id == id)
        let name = value_json[index].value
        return name
      },
      // 传值函数
      showFilterResult:function(){
        eventBus .$emit("commonFn",this.dynamicTags)   //$emit这个方法会触发一个事件
      },
      closeTags() {
        eventBus.$on('commonCloseFn',(message)=>{   //这里最好用箭头函数，不然this指向有问题
          this.sourceData.splice(message, 1)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .tag-filter-wrap {
    margin-right: 16px;
    .el-tag {
      margin: 0 4px;
    }
    .tag-block {
      position: absolute;
      z-index: 99;
      background: #fff
    }
  }
</style>
