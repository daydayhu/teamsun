<template>
<!------------------ 公共头部样式：应用事例（应用中心-应用系统） ------------------->
  <el-row class="page_header">
    <el-row class="title" type="flex" justify="space-between">
      <el-col class="left">
        <el-row v-if="back" class="breadCrumb" >
        <!------------------ 有无面包屑（与返回按钮同步） ------------------->
            <el-breadcrumb  separator="/" >
              <el-breadcrumb-item v-for="item in breadCrumb" :key="item.name" :to="{path:item.path}">{{item.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>
        <el-row>
          <b :v-if="title">{{title}}</b>
          <slot name="operate">
          </slot>
        </el-row>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
export default {
  name: 'pageHeader',
  props: {
    //头部标题
    title:String,
    //有无返回按钮和面包屑
    back:{
      type:Boolean,
      default:false
    },
    //右边宽度-为col的span宽度
    rightWidth:{
      type:Number,
      default:3
    },
    //面包屑数据
    breadCrumb:{
      type:Array,
      default(){
        return [{
          name:"名称一",
          path:"/"
        },{
          name:"名称2",
          path:"/"
        }]
      }
    }
  },
  methods:{
    handleBack(){
      //返回按钮点击事件
      this.$emit('handleBack')
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  font-size: 18px;
  margin-bottom: 10px;
  align-items:center;
  //有返回按钮时的左部样式
  .left {
    //定制步骤条样式
     .breadCrumb{
      .el-breadcrumb{
            padding-bottom: 16px;
            font-size: 12px;

        }
      }
    b{
      margin-left: 18px;
    }
    span{
      margin-left: 8px;
    }
  }
  //右边样式，从右向左排列
  .right{
    display: flex;
    justify-content: flex-end;

  }
}
//步骤条样式
/deep/.el-steps {
    display: contents;
}
</style>
