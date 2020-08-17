<template>
  <!------------------ 使用指引公共样式 ------------------->
  <transition>
    <el-row class="guide g_guide" v-show="visible">
      <el-row class="wrap" type="flex" justify="space-between">
        <slot>
          <guideItem></guideItem>
        </slot>
      </el-row>
    </el-row>
  </transition>
</template>

<script>
//引入使用指引组件
import guideItem from "./guide_item.vue";
export default {
  name: "guide",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    guideItem
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.guide {
  border-radius: 20px;
  border: 1px solid;
  padding: 16px 32px;
  margin-bottom: 16px;
  // animation: name 0.3s 1ms;
  // @keyframes name {
  //   0% {
  //     opacity: 0;
  //   }
  //   100% {
  //     opacity: 1;
  //   }
  // }
}
</style>
