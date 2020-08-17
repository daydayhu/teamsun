<template>
  <el-row type="flex" class="annular">
    <el-col :span="8">
      <div class="item">
        <div class="title">
          <h3>按照应用统计</h3>
        </div>
        <ve-ring :data="chartData"
                 :extend="chartExtend"
                 :settings="chartSettings"
                 :tooltip="rtooltip"
                 height="180px"
                 :width-change-delay="0"
        ></ve-ring>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="item">
        <div class="title">
          <h3>按照应用统计</h3>
        </div>
        <ve-ring :data="chartData"
                 :extend="chartExtend"
                 :settings="chartSettings"
                 :tooltip="rtooltip"
                 height="180px"
                 :width-change-delay="0"
        ></ve-ring>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="item">
        <div class="title">
          <h3>按照应用统计</h3>
        </div>
        <ve-ring :data="chartData"
                 :extend="chartExtend"
                 :settings="chartSettings"
                 :tooltip="rtooltip"
                 height="180px"
                 :width-change-delay="0"
        ></ve-ring>
      </div>
    </el-col>
  </el-row>
</template>

<script>
    import VeRing from "v-charts/lib/ring.common";
    export default {
        data() {
            this.chartExtend = {
                legend: {
                    show: true,
                    orient: 'vertical',
                    top: "middle",
                    right:16,
                    itemWidth:16, //图例标记的图形宽度。
                    itemHeight:16,
                    data:[
                        {
                            name:'变更中',
                            textStyle:{
                                fontSize:12,
                                fontWeight:'bolder',
                                color:'#cccccc'
                            },
                            icon:`image://${require('@/commons/images/ops_service_icon@2x.png')}`
                        },
                        {
                            name:'运行中',
                            textStyle:{
                                fontSize:12,
                                fontWeight:'bolder',
                                color:'#cccccc'
                            },
                            icon:`image://${require('@/commons/images/ops_service_icon@2x.png')}`
                        },
                        {
                            name:'建设中',
                            textStyle:{
                                fontSize:12,
                                fontWeight:'bolder',
                                color:'#cccccc'
                            },
                            icon:`image://${require('@/commons/images/ops_service_icon@2x.png')}`
                        },

                    ]

                },  //隐藏legend
                series: {
                    center: ['30%', '50%']
                },
                color:["#7C67FE", "#26C7B7", "#26C7B7"],

            };
            this.rtooltip = { show: true };
            return {
                guideVisible: false,
                defaultIconUrl: require('@/commons/images/ops_service_icon@2x.png'),
                chartData: {
                    columns: ['日期', '访问用户'],
                    rows: [
                        { '日期': '变更中', '访问用户': 1393 },
                        { '日期': '运行中', '访问用户': 3530 },
                        { '日期': '建设中', '访问用户': 2923 },
                    ]
                },
                chartSettings: {
                    radius: ['55px', '72px'],
                    label:{show:false},
                    labelLine:{show:false}
                }
            }
        },
        components: {
            VeRing

        },

        mounted() {

        },
        methods: {

        },

    }

</script>
<style lang="less" scoped>
.annular{
  margin-bottom: 16px;
  .el-col{
    padding-right: 16px;
    &:nth-child(3n){
      padding-right: 0;
    }
  }
  .item{
    .title{
      margin-top: 16px;
      margin-left: 16px;
    }
    height: 240px;
    border-radius: 14px;
    border: 1px solid rgba(51,42,124,0.1);
  }
}
</style>

