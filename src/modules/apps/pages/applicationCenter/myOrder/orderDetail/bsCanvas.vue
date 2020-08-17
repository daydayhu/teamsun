<template>
  <div>
    <deploymentOperate></deploymentOperate>
  </div>
</template>
<script>
import deploymentOperate from "../../applicationSystem/systemDetail/components/deploymentOperate.vue";

export default {
  data() {
    return {
      activeName: "view"
      //审批
    };
  },
  components: {
    deploymentOperate
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