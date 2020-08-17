<template>
  <div class="empty-wrap">
    <el-col class="empty-box">
      <img src="@/commons/images/g_empty.svg" />
      <div class="tips">暂无数据</div>
    </el-col>
  </div>
</template>

<script>
  export default {
    name: "emptyInTable"
  }
</script>

<style lang="less" scoped>
  .empty-wrap {
    // position: absolute;
    // left: 0;
    // top: 50%;
   // margin-top: -70px;
    width: 100%;
    height: 100%;
    .empty-box {
      margin-top: 70px;
      margin-bottom: 70px;
      text-align: center;
      .tips {
        margin-top: 24px;
      }
    }
  }
</style>
