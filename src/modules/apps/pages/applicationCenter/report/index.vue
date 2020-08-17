<template>
  <div :class="{ 'is-fixed': fixed }">
    <div class="header">
      <el-button type="text"
                 size="small"
                 @click="handleDown">
        下载
      </el-button>
      <el-button type="text"
                 size="small"
                 @click="print">
        打印
      </el-button>
    </div>
    <div class="report"  id="demo" v-loading="loading">
      <h1>{{ticket_name+"——订单报告"}}</h1>
      <el-collapse  style="padding:15px 20px;width: 96%" v-model="activeNames">
        <el-collapse-item class="form" v-for="(item,index) in reportData" :key="index" :name="item.key">
          <template slot="title">
            <div class="base_card_title">
              <h3>{{item.reportName}}</h3>
            </div>
          </template>
          <div class="content">
            <el-row>
              <div v-for="(value, key, tag) in item.data" :key="tag">
                <el-col :span="12" v-if="getTitle(key)">
                  <p class="info-l"><span class="info-l-left">{{getTitle(key).name}}:</span> <span>{{value}}</span></p>
                </el-col>
              </div>
              <!------------------- 应用架构 ------------------->
              <div v-if="item.key === 'arch_view'">
                <deliverPlan :canvas-text="item.data.canvas_text"></deliverPlan>
              </div>
              <!--------------------部署视图-------------------->
              <div v-if="item.key === 'deployment_view'">
                <deliverPlan :canvas-text="item.data.canvas_text"></deliverPlan>
              </div>
                <!--------------------参数-------------------->
                <div v-if="item.key === 'service_set_paras'">
                  <paramContent :data-info="item.data"></paramContent>
              </div>
              <!--------------------交付计划-------------------->
              <div v-if="item.key=== 'deliver_view'">
                <span>{{geyDeliverPlay(item.data.items)}}</span>
                <list :table-info="{tableHeader,tableData:item.data.items,canvas_text:item.data.canva_data}" :isMultiple="false"></list>
              </div>
            </el-row>
          </div>
      </el-collapse-item>
      </el-collapse>

    </div>
  </div>
</template>

<script>
    import htmlToPdf from '@/utils/htmlToPdf';
    import {filterKey,tableHeader} from './utils/config';
    import * as requestMethod from "@/modules/apps/api/applicationCenter/report";
    import deliverPlan from "./components/deliverPlan";
    import paramContent from "./components/param";
    import list from "./components/list";
    import { printPage } from "@/utils/utils"
    import * as requestUsers from "@/modules/apps/api/applicationCenter/applicationSystem"
    //引入API
    export default {
        name: "report",
        components: {
            deliverPlan,
            paramContent,
            list
        },
        props: {
            fixed: { // 是否需要设置fixed定位样式
                type: Boolean,
                default: true
            },
            paramsInfo:{}
        },
        data() {
            return {
                reportData: [],
                filterKey,
                tableHeader,
                tableInfo:{
                    tableHeader,
                    tableData:[]
                },
                activeNames:[],
                loading:false,
                ticket_name: this.$route.query.ticket_name,
                userAndGroup: [],
            };
        },
        mounted() {
            this.getReportData()
            this.getUserAndGroup();
        },
        methods: {
            print() {
                printPage(document.getElementById("demo"))
            },
            testDownd() {
                this.handleDown();
            },
            getTitle(key){
                return  this.filterKey.find(item=>item.key === key);
            },
            handleDown() {
                htmlToPdf.downloadPDF(document.querySelector('#demo'), this.ticket_name);
            },


            //获取用户组和用户
            async getUserAndGroup() {
                const res  = await requestUsers.getGroupUser("get")
                if(res.code === 200){
                    this.userAndGroup = res.data.items
                }
            },

            geyDeliverPlay(data){
                data.forEach(item=>{
                    const newDeliverUser = this.displayUser(item.deliver_user);
                    const newReviewUser = this.displayUser(item.review_user)
                    item.deliverUser = newDeliverUser;
                    item.reviewUser = newReviewUser;
                })

                console.log(data);
                console.log(22222);
            },

            // 由于后台返回格式的问题，只能特殊处理，代码是从交付计划拷贝过来的，待优化
            displayUser(val) {
                if(val.length == 1) {
                    return this.lookOutGroup(val,1)
                } else if(val.length == 2) {
                    return this.lookOutGroup(val,2)
                } else {
                    return ""
                }
            },

            //查找用户组或用户
            lookOutGroup(nums,type) {
                let str = ""
                this.userAndGroup.forEach(item=>{
                    if( item.id == nums[0] ) {
                        if(type === 1){
                            str = item.name
                        } else {
                            item.users.forEach( users=>{
                                if(users.id === nums[1]) {
                                    str = users.name
                                }
                            })
                        }
                    }
                })

                return str
            },
            async getReportData(){
                const {app_id,ticket_id} = this.$route.query;
                this.loading = true;
                const res = await requestMethod.getReport('get',{app_id:app_id,ticket_id:ticket_id});
                // const res = await requestMethod.getReport('get',{app_id:90,ticket_id:62});
                if (res.code === 200) {
                    this.reportData = res.data.items;
                    this.getActiveNames(res.data.items)
                }
                this.loading = false;
            },

            getActiveNames(data){
                let arr = []
                data.forEach(item=>{
                    arr.push(item.key);
                });
                this.activeNames = arr;
            }
        }
    };
</script>

<style lang="less" scoped>
.header{
  background-color:@g-bg-color ;
  padding: 0 24px;
}
.info-l{
  line-height: 2;
  .info-l-left{
    padding-right:3px;
  }
}
  .report {
    position: relative;
    /deep/ .el-collapse-item__arrow {
      position: absolute;
      left: 45px;
    }
    background-color: #fff;
    display: flex;
    flex-flow: column;
    align-items: center;
    padding: 20px;
    overflow-y: scroll;
    &.is-fixed {
      position: fixed;
      top: 0px;
      bottom: 0px;
      left: 0px;
      right: 0px;
    }
    /*.form {*/
    /*  width: 80%;*/
    /*}*/

    .base_card_title {
      padding-left: 0px;
    }

    .content {
      padding: 20px;
    }

  }
</style>
