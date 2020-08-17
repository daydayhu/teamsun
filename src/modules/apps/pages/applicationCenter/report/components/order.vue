<template>
  <div class="order">
    <el-row :data="orderInfo" type="flex" justify="space-between">
      <el-col>
        <el-row>编号: {{orderInfo.ticket_number}}</el-row>
        <br />
        <el-row>状态: {{orderInfo.step_status}}</el-row>
        <br />
        <el-row>创建时间: {{orderInfo.create_time}}</el-row>
      </el-col>
      <el-col>
        <el-row>标题: {{orderInfo.ticket_name}}</el-row>
        <br />
        <el-row>创建人: {{orderInfo.user_name}}</el-row>
        <br />
        <el-row>备注： {{orderInfo.remarks}}</el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
//引入API
//import * as requestMethod from "../../../../../api/applicationCenter/applicationSystem"
export default {
  name: "order",
  components: {},
  data() {
    return {
      orderInfo: {
        ticket_number: "xxxxxxxxx",
        ticket_name: "xxxxxxxx",
        step_status: "xxxxxxx",
        user_name: "xxxxxxx",
        create_time: "xxxxx",
        remarks: "xxxxx"
      }
    };
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.order {
}
</style>
