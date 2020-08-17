<template>
  <div>
    <deploy-view :isArchType="'jf'"></deploy-view>
  </div>
</template>
<script>
import deployView from "../../applicationSystem/systemDetail/components/deploymentView.vue";
export default {
  data() {
    return {
      activeName: "plan"
      //审批
    };
  },
  components: {
    deployView
  },
  created() {

  },
  methods: {
    //获取订单详情审批历史
  }
}
</script>
<style lang="less" scoped>
</style>