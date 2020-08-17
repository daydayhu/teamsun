<template>
  <!------------------ 公共头部样式：应用事例（应用中心-应用系统） ------------------->
  <div class="detailTitle">
    <el-card>
      <el-row class="base_Wrap" type="flex" justify="space-between">
        <el-col :span="2" class="avatar">
          <el-avatar :size="64" :src="avatarSrc"></el-avatar>
        </el-col>
        <el-col :span="22">
          <el-row class="title" type="flex" justify="space-between">
            <h4>{{title}}</h4>
            <div class="title_right">
              <!------------------ 标题右边自定义操作内容（可以是按钮或者其他） ------------------->
              <slot name="operator"></slot>
            </div>
          </el-row>
          <el-row>
            <!------------------ 标题下部自定义内容（可以是按钮或者其他） ------------------->
            <slot name="content"></slot>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "detailTitle",
  props: {
    //头像
    avatarSrc: {
      default:
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
    },
    //头部标题
    title: String
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.detailTitle {
  margin-bottom: 15px;
  .base_Wrap {
    height: 100px;
    .avatar {
      height: 100px;
      padding-right: 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .title {
      margin: 10px 0px;
      height: 35px;
    }
  }
}
</style>
