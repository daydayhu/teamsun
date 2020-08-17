<template>
  <el-row class="columnar">
    <el-col :span="12" >
      <div class="item">
        <div class="title">
          <h3>业务组应用统计</h3>
        </div>
        <ve-histogram :data="chartData" :settings="chartSettings" :extend="extend" height="245px"></ve-histogram>
      </div>
    </el-col>
    <el-col :span="12" >
      <div class="item">
        <div class="title">
          <h3>应用资源统计</h3>
        </div>
        <dispersedColumnar></dispersedColumnar>
      </div>
    </el-col>
  </el-row>
</template>

<script>
    import veHistogram from "v-charts/lib/histogram.common";
    import dispersedColumnar from "./dispersedColumnar";
    import 'echarts/lib/component/dataZoom';
    import * as requestMethod from "@/modules/apps/api/dashboard/dashboard";


    export default {
        data () {
            this.extend = {
                series:{
                    barMaxWidth: 35, // 柱子的宽度,
                    type:'bar'
                },
                dataZoom: [//给x轴设置滚动条
                    {
                        start:0,//默认为0
                        end: 30,
                        endValue:5,
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                        handleSize: 0,//滑动条的 左右2个滑动条的大小
                        height: 8,//组件高度
                        left: 50, //左边的距离
                        right: 40,//右边的距离
                        bottom: 10,//下边的距离
                        handleColor: '#ddd',//h滑动图标的颜色
                        handleStyle: {
                            borderColor: "#cacaca",
                            borderWidth: "1",
                            shadowBlur: 2,
                            background: "#ddd",
                            shadowColor: "#ddd",
                        },
                    },
                ],

                color:["#7C67FE", "#FFA067", "#C1C7D0"],
                grid:{
                    bottom:25,// 距离容器下边界的像素
                },
                xAxis: {
                    // name: "地区",
                    // type:'category',
                    show:true,
                    // 坐标轴轴线
                    axisLine:{
                        show:true,
                    },
                    // 坐标轴每项的文字
                    axisLabel:{
                        showMaxLabel:true,
                        showMinLabel:true,
                        color:'#3a3a3a',
                        interval:0, // 该属性设置成0则表示强制显示所有标签，设置为1的话，隔一个标签显示一个标签，以此类推。
                        rotate:0, //刻度文字旋转，防止文字过多不显示
                        margin:8,//文字离x轴的距离
                        boundaryGap:true,
                        // backgroundColor:'#0f0',
                        formatter:(v)=>{
                            if(v.length>3){
                                return v.substring(0,6)+'...'
                            }
                            return v
                        },
                        align:'center'
                    },
                    // X轴下面的刻度小竖线
                    axisTick:{
                        show:false,
                        alignWithLabel:true,//axisLabel.boundaryGap=true时有效
                        interval:0,
                        length:4,//长度
                    },
                    // x轴对应的竖线
                    splitLine: {
                        show: false,
                        interval: 0,
                        lineStyle:{
                            color:'red',
                            backgroundColor:'red',
                        }
                    }
                },
                yAxis:{
                    show:false
                }

            }

            this.chartSettings = {
                stack: { '用户': ['业务应用系统', '资源服务类应用系统','平台类应用系统',] },
                // labelMap:{
                //     apps:'业务应用系统',
                //     service:'资源服务类应用系统',
                //     platform:'平台类应用系统'
                // }
            }
            return {
                applicationType:[],
                chartData: {
                    columns: ['bus_name'],
                    rows: []
                }
            }
        },
        components: {
            veHistogram,
            dispersedColumnar

        },

        mounted() {
            this.getApplicationType();
            this.getBusGroupData();

        },
        methods: {
            showName(index){
                return this.chartData.rows[index].name
            },
            async getBusGroupData(){
                const res = await requestMethod.getBusGroup('get');
                if(res.code === 200){
                    this.chartData.rows = res.data.graph;
                }
            },

            /**
             *
             * 获取应用类型数据-该数据从基础数据接口中获取
             */
            async getApplicationType() {
               const res = await requestMethod.getDataBase('get', {config_type: "15"});
                if(res){
                    let arr = []
                    res.data.items.forEach(e => {
                        if (e.parent_id !== null) {
                            arr.push(e.value_json)
                        }
                    })
                    const {columns} = this.chartData
                    const newColumns = columns.concat(arr);
                    this.chartData.columns = newColumns;

                }

            }
        },

    }

</script>
<style lang="less" scoped>
  .columnar{
    .el-col{
      padding-right: 16px;
      &:nth-child(2n){
        padding-right: 0;
      }
    }
    .item{
      .title{
        margin-top: 16px;
        margin-left: 16px;
      }
      height: 280px;
      border-radius: 14px;
      border: 1px solid rgba(51,42,124,0.1);
    }
  }
</style>

