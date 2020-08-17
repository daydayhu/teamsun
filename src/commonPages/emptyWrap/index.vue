<template>
  <div class="theme_default wrap">
    <!--空路由布局，用于许可证单独页面-->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "LayoutEmpty",
};
</script>

<style lang="less" scoped>
.wrap {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  padding: 24px;
}
</style>
