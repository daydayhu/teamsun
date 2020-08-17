<template>
  <el-drawer
    title="导出报告"
    :visible.sync="drawerFlag"
    direction="rtl"
    :size="sizeSet[active]"
    ref="drawer"
    :append-to-body="true"
    :modal-append-to-body="true"
    custom-class="pool-drawer"
    @closed="close">
    <div class="ts-drawer__content">
      <exportInfo :fixed="false"></exportInfo>
    </div>
  </el-drawer>
</template>

<script>
    import exportInfo from "../../../report"

    export default {
        props: {

        },
        components: {
            exportInfo
        },
        data() {
            return {
                stepInfo:[{name:'基本信息'},{name:'流程定义'}],
                labelPosition: 'right',
                formLabelWidth: '106px',
                drawerFlag: true,
                submitLoading: false,
                baseLoading:false,
                active: 0,
                sizeSet: {
                    0: '46%',
                    1: '60%',
                },

            }
        },

        async created() {

        },

        methods: {
            close() {
                this.$emit('closePoolDrawer');
            },
        },


    };
</script>

<style lang="less" scoped>
  .pool-drawer {
    position: relative;
    .ts-drawer__content {
      padding-bottom: 60px;
      .ts-custom-steps{
        /deep/ .el-step__main{
          background: #ffffff;
        }
      }

      .base-Info-c {
        margin-top: 30px;
        .el-form-item {
          margin-bottom: 30px;
          .el-input, .el-textarea {
            width: 60%;
          }
        }
      }
    }
    // .ts-drawer__footer {
    //   position: fixed;
    //   bottom: 0;
    //   width: 100%;
    //   background: rgba(245, 245, 245, 1);
    //   height: 60px;
    //   line-height: 60px;
    //   padding-left: 30px;
    //   z-index: 99;
    // }
  }

  /deep/ .el-drawer {
    overflow-y: scroll;
  }
</style>
