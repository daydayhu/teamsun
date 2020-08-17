<template>
  <div class="productServiceForm">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="表单1" name="1">
       <!-- <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
        <el-form-item label="名称">
          <el-input v-model="formLabelAlign.name"></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-input v-model="formLabelAlign.region"></el-input>
        </el-form-item>
        <el-form-item label="活动形式">
          <el-input v-model="formLabelAlign.type"></el-input>
        </el-form-item>
        </el-form> -->
      </el-collapse-item>
      <el-collapse-item title="表单2" name="2">
        <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
        <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: "productServiceForm",
  data() {
    return {
      activeNames:"1",

    };
  },
  methods: {
    //折叠面板事件
    handleChange(val){}

  }
};
</script>

<style lang="less" scoped>
.productServiceForm{
  height: 100%;
}
</style>
