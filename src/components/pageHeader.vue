<template>
  <!------------------ 公共头部样式：应用事例（应用中心-应用系统） ------------------->
  <el-row class="page_header g_pageHeader">
    <el-row class="title" type="flex" justify="space-between">
      <el-col class="left">
        <el-row v-if="back" class="breadCrumb">
          <!------------------ 有无面包屑（与返回按钮同步） --已去掉----------------->
          <!-- <el-breadcrumb  separator="/" >
              <el-breadcrumb-item v-for="item in breadCrumb" :key="item.name" :to="{path:item.path}">{{item.name}}</el-breadcrumb-item>
          </el-breadcrumb>-->
        </el-row>
        <el-row>
          <!------------------ 有无返回按钮（与面包屑同步）------------------->
          <el-button
            class="back_button"
            v-if="back"
            type="text"
            icon="el-icon-arrow-left"
            @click="handleBack"
          >返回</el-button>
          <b >{{title}}</b>
          <!-- <span>
            <svg-icon icon-class="ts-guide"></svg-icon>
          </span> -->
          <el-button
            class="guide_button"
            v-if="guide"
            type="text"
            icon="el-icon-view"
            @click="handleGuide"
          >使用指引</el-button>
        </el-row>
      </el-col>
      <el-col class="right ts-custom-steps">
        <!------------------ 右边自定义内容（可以是按钮或者步骤条等，注意需设置宽度） ------------------->
        <slot name="right"></slot>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
export default {
  name: "pageHeader",
  props: {
    //头部标题
    title: String,
    //有无返回按钮和面包屑
    back: {
      type: Boolean,
      default: false
    },
    //右边宽度-为col的span宽度
    rightWidth: {
      type: Number,
      default: 24
    },
    //是否有指引
    guide:{
      type: Boolean,
      default: false

    }
    //面包屑数据
    // breadCrumb:{
    //   type:Array,
    //   default(){
    //     return [{
    //       name:"名称一",
    //       path:"/"
    //     },{
    //       name:"名称2",
    //       path:"/"
    //     }]
    //   }
    // }
  },
  methods: {
    handleBack() {
      //返回按钮点击事件
      this.$emit("handleBack");
    },
    handleGuide(){
      //指引按钮点击事件
      this.$emit("handleGuide");

    }
  }
};
</script>
<style lang="less" scoped>
.page_header {
  /*TODO: 勿修改*/
  margin-bottom: 24px;
  max-height: 32px;
  .title {
    font-size: 18px;
    align-items: center;
    //有返回按钮时的左部样式
    .left {
      & > .el-row {
        display: flex;
        align-items: center;
      }
      .breadCrumb {
        .el-breadcrumb {
          padding-bottom: 16px;
          font-size: 12px;
        }
      }
      .back_button {
        margin-right: 12px;
      }
      .guide_button{
         margin-left: 19px;

      }
      b {
        // margin-left: 18px;
      }
      span {
        margin-left: 8px;
      }
    }
    //右边样式，从右向左排列
    .right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      min-height: 32px;
    }
  }
}

//步骤条样式
/deep/.el-steps {
  display: contents;
}
</style>
