<template>
    <el-drawer
        title="订单报告"
        :visible.sync="defaultConfig.exportDrawer"
        direction="rtl"
        :before-close="handleClose"
        size="80%">
        <iframe
            v-if="defaultConfig.exportDrawerIframe"
            :src="`/apps.html#/applicationCenter/report?ticket_id=${defaultConfig.ticket_id}&app_id=${defaultConfig.app_id}`"
            width="100%"
            height="100%"
            frameborder="0">
        </iframe>
      </el-drawer>
</template>
<script>
export default {
    props:{
      defaultConfig: {
          type:Object
      }
    },
    methods:{
      handleClose() {
        this.$emit("handleClose")
      }
    }
}
</script>
<style lang="less" scoped>

</style>
