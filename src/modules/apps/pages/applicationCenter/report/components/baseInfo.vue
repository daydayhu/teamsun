<template>
  <div class="baseInfo">
    <el-row :data="baseInfo" type="flex" justify="space-between">
      <el-col>
        <el-row>业务组： {{baseInfo.bus_name}}</el-row>
        <br />
        <el-row>所属环境： {{baseInfo.app_base_env}}</el-row>
      </el-col>
      <el-col>
        <el-row>应用类型: {{baseInfo.app_base_type}}</el-row>
        <br />
        <el-row>灾备等级: {{baseInfo.app_base_level}}</el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
//引入API
//import * as requestMethod from "../../../../../api/applicationCenter/applicationSystem"
export default {
  name: "baseInfo",
  components: {},
  data() {
    return {
      baseInfo: {
        bus_name: "xxxxxxxxx",
        app_base_env: "xxxxxxxx",
        app_base_type: "xxxxxxx",
        app_base_level: "xxxxxxx"
      }
    };
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.baseInfo {
}
</style>
