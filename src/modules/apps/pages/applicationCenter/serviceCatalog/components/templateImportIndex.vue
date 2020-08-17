<template>
  <div class="templateImport">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="模板导入" back :rightWidth="8" @handleBack="goBack" >
      <template v-slot:right>
        <Steps :stepsList="stepsList"
               :step="Number(active)">
        </Steps>
      </template>
    </pageHeader>
    <div class="ts-content-form">
      <div  class="header">
        <span v-if="active===1" >服务匹配</span>
        <span v-if="active===2" >资源匹配</span>
      </div>
        <router-view @changeStep="stepChange"></router-view>
    </div>
  </div>
</template>

<script>
import pageHeader from "@/components/pageHeader.vue"
export default {
  name: "templateImport",
  components: {
    pageHeader,
  },
  data() {
    return {
        active: 1,
        stepsList:[
            {step: 1,name:'服务匹配',},
            {step: 2,name:'资源匹配'},
        ],
      };
  },
  mounted(){
  },
  methods: {
    //返回按钮点击事件
    goBack() {
      history.back();
    },
    //监听步骤条变化
    stepChange(val) {
      this.active = val;
    },
  },
};
</script>

<style lang="less" scoped>
.addSystem{


}

</style>
