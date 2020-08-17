<template>
  <ve-pie :data="chartData"
          height="241px"
          :extend="chartExtend"
          :settings="chartSettings"
          :judge-width="true"
  ></ve-pie>

</template>

<script>
    import VePie from "v-charts/lib/pie.common"
    import * as requestMethod
        from "@/modules/apps/api/dashboard/dashboard";

    export default {
        data() {
            this.chartExtend = {
                legend: {
                    show: true,
                    orient: 'vertical',
                    top: "middle",
                    left: '60%',
                    itemWidth: 16, //图例标记的图形宽度。
                    itemHeight: 16,
                    data: []

                },
                color: [],
                series: {
                    center: ["30%", "50%"], 　　　　//饼图的中心（圆心）坐标
                    itemStyle: {
                        borderWidth: 5,
                        borderColor: '#fff'
                    },
                    label: {
                        normal: {
                            show:true,
                            position:'inner',
                            textStyle: {
                                fontWeight: 200,
                                fontSize: 12   //文字的字体大小
                            },
                            formatter: '{d}%',/*饼状图内显示百分比*/
                        },

                        emphasis: {
                            show: false,/*空心文字出现*/
                        }
                    },
                },

            };
            return {
                guideVisible: false,
                defaultIconUrl: require('@/commons/images/ops_service_icon@2x.png'),
                chartData: {
                    columns: [],
                    rows: []
                },
                chartSettings: {
                    radius: 80,
                    label: {show: false},
                    labelLine: {show: false},
                }
            }
        },
        props: {
            applicationTypeData: {
                type: Object
            }
        },
        watch: {
            applicationTypeData: {
                handler(newVal, oldVla) {
                    this.chartData = newVal.chartData;
                    this.chartExtend.legend = {...this.chartExtend.legend,...newVal.legend}
                    this.chartExtend.color = newVal.color
                },
                immediate: true,
                deep: true
            }
        },
        components: {
            VePie

        },

        mounted() {
            // this.getApplicationTypeData();

        },
        methods: {
            async getApplicationTypeData() {
                const res = await requestMethod.getApplicationType('get');
                if (res.code === 200) {
                    this.chartData.rows = res.data.graph;
                }
            },

        },

    }

</script>
<style lang="less" scoped>
  .pie {
    margin-bottom: 16px;

    .el-col {
      padding-right: 16px;

      &:nth-child(2n) {
        padding-right: 0;
      }
    }

    .item {
      .title {
        margin-top: 16px;
        margin-left: 16px;
      }

      height: 280px;
      border-radius: 14px;
      border: 1px solid rgba(51, 42, 124, 0.1);
    }
  }
</style>

