<template>
  <!------------------ 使用指引item样式 ------------------->
  <el-col :xs="4" :sm="6" :md="8" :lg="12" class="guide_item g_guide_item">
    <div class="guide_item_head">
      <div class="guide_item_line">
        <div class="icon">
          <i class="el-icon-arrow-right defIcon"></i>
          <i class="el-icon-arrow-right defIcon"></i>
          <i class="el-icon-arrow-right defIcon"></i>
        </div>
      </div>
      <div class="guide_item_img">
        <!-- <img :src="imgUrl" alt="" srcset="" /> -->
        <svg-icon :icon-class="iconName" class="myicon"></svg-icon>
      </div>
    </div>
    <div class="guide_item_main">
      <div class="guide_item_title">
        {{ title }}
      </div>
      <div class="guide_item_desc">
        <!------------------ 自定义内容 ------------------->
        <slot name="content"></slot>
      </div>
    </div>
  </el-col>
</template>

<script>
export default {
  name: "guide",
  props: {
    iconName: {
      type: String,
      default: "menu"
    },
    title: {
      type: String
    }
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.guide_item {
  position: relative;
  flex-shrink: 1;
  &:last-of-type {
    .guide_item_line {
      display: none;
    }
  }
  .guide_item_head {
    text-align: center;
    width: 100%;
    margin-bottom: 8px;
    .guide_item_img {
      // display: inline-flex;
      // justify-content: center;
      // align-items: center;
      // width: 48px;
      // height: 48px;
      .myicon {
        font-size: 48px;
      }
    }
    .guide_item_line {
      position: absolute;
      left: 65%;
      right: -35%;
      top: 23px;
      height: 1px;
      border-bottom: 1px dashed;
      z-index: 1;
      .icon {
        position: absolute;
        left: 40%;
        top: -9px;
        font-size: 18px;
        padding-right: 12px;
        .defIcon {
          font-weight: 700;
          width: 7px;
        }
      }
    }
  }
  .guide_item_main {
    text-align: center;
    width: 100%;
    font-size: 12px;
    padding-left: 15%;
    padding-right: 15%;
    line-height: 20px;
    .guide_item_title {
      font-weight: 500;
      margin-bottom: 4px;
    }
  }
}
</style>
