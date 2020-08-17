<template>
    <div class="addSystemFirst form-c">
        <!--<div class="left">-->
        <!--<img :src="iconName" alt="" srcset="">-->
        <!--</div>-->
        <systemAddEdit :app_id="appId" @changeTitle="changeTitle"></systemAddEdit>
        <!--<div class="form"></div>-->
    </div>
</template>

<script>
  //引入新建应用系统组件
  import systemAddEdit from '../../components/systemAddEdit';
  //引入API
  //import * as requestMethod from "../../../../../api/applicationCenter/applicationSystem"
  export default {
    name: 'addSystemFirst',
    components: {
      systemAddEdit,
    },
    data() {
      return {
        iconName: require('@/commons/images/g_baseinfo.svg'),
        appId: null,
      };
    },
    created() {
      //改变进度条变化
      this.$emit('changeStep', 0);
      //改变标题
      this.$emit("changeTitle","新建应用系统")
      if (this.$route.query.app_id != null) {
        this.appId = this.$route.query.app_id;
      }
    },
    mounted() {
    },
    methods: {
      //监听标题变化
      changeTitle(val){
        this.$emit("changeTitle",val)
      }
    },
  };
</script>

<style lang="less" scoped>
    .addSystemFirst {

    }
</style>
