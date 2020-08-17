<template>
  <div class="deliverPlan">
    <el-table :data="tableList">
      <template slot="empty">
          <empty-in-table v-if="tableList.length<1"></empty-in-table>
        </template>
      <el-table-column v-for="(item, index) in tableHeader" :key="index" :prop="item.key" :label="item.label">
      </el-table-column>
      <el-table-column
        prop="target_source"
        label="目标资源">
        <template slot-scope="scope">
            <span v-if="dispalySource(scope.row.target_source)">
                <el-tooltip class="item" effect="dark" :content="scope.row.target_source.join(',')" placement="bottom">
                    {{scope.row.target_source.slice(0,2).join(",")}}
                </el-tooltip>
            </span>
            <span v-else>{{ !scope.row.target_source ? "" : scope.row.target_source.join(",")}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="deliver_type"
        label="交付策略">
        <template slot-scope="scope">
            <span>{{scope.row.deliver_type.value}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="start_up_type"
        label="启动策略">
        <template slot-scope="scope">
            <span>{{scope.row.start_up_type.value}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="crontab"
        label="时间窗口">
        <template slot-scope="scope">
            <div class="crontab-c" v-if="scope.row.crontab">
                <span>{{scope.row.crontab}}</span>
                <el-tooltip
                    placement="bottom-start"
                    trigger="hover"
                    :content="scope.row.crontab_message">
                    <el-button type="text"> <svg-icon icon-class="hint_icon"></svg-icon></el-button>
                </el-tooltip>
            </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="deliver_user"
        label="交付负责人">
        <template slot-scope="scope">
             <span>{{scope.row.deliver_user | displayUser(that)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="review_user"
        label="复核人">
        <template slot-scope="scope">
             <span>{{scope.row.review_user | displayUser(that)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="review_type"
        label="复核策略">
        <template slot-scope="scope">
            <span>{{scope.row.review_type | displayReviewType}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="review_time"
        label="完成时间">
        <!-- <template slot-scope="scope">
            <span>{{scope.row.review_type | displayReviewType}}</span>
        </template> -->
      </el-table-column>
      <el-table-column
        prop="deploy_status"
        label="状态"
        v-if="$route.query.step_type > 1">
        <template slot-scope="scope">
            <span >{{(scope.row.deploy_status == undefined) ?  scope.row.handle_status.value : scope.row.deploy_status  }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="progress"
        label="进度（已完成/部署任务数）"
        v-if="$route.query.step_type == 5">
        <template slot-scope="scope">
            <span>{{scope.row.completed_deploy + "/" + scope.row.total_deploy}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import * as table from "./untils/config.js"
import * as requestMethods from "@/modules/apps/api/applicationCenter/myOrder"
import * as requestUsers from "@/modules/apps/api/applicationCenter/applicationSystem"
export default {
    data() {
        return {
            tableList: [],
            activeName: "plan",
            tableHeader: table.tableHeader,
            userAndGroup: [],
            that: this,
            //审批
        };
    },
    computed:{
        dispalySource(target_source){
            return function(target_source) {
                if(target_source && Number(target_source.length) > 2 ) {
                    return true
                } else {
                    return false
                }
            }
        }
    },
    filters:{
        displayDeployStatus(val) {
            if( val == 1 ) {
                return "待执行"
            } else if( val == 2 ) {
                return "执行中"
            } else {
                return "已完成"
            }
        },
        displayReviewType(val) {
            if( val.type == 1 ) {
                return "手动"
            } else if( val.type == 2 ) {
                return "自动"
            } else {
                return "现场复核"
            }
        },
        displayUser(val,that) {
            if(val.length == 1) {
                return that.lookOutGroup(val,1)
            } else if(val.length == 2) {
                return that.lookOutGroup(val,2)
            } else {
                return ""
            }
        }
    },
    components: {
    },
    async created() {
        this.getUserAndGroup()
    },
    methods: {
        //获取订单详情交付计划
        async getOrderDetailDeliveryPlan() {
            const app_id = this.$route.query.app_id
            const ticket_id = this.$route.query.ticket_id
            const step_type = this.$route.query.step_type
            const res = await requestMethods.getOrderDetailPlan("get",app_id,ticket_id,step_type)
            this.tableList = res.data.items
            this.tableList.forEach(item=>{
                item.target_source = item.vms.concat(item.ironics)
            })
        },
        //获取用户组和用户
        getUserAndGroup() {
            requestUsers.getGroupUser("get").then(res=>{
                this.userAndGroup = res.data.items
                this.getOrderDetailDeliveryPlan()
            })
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
        }
    }
}
</script>
<style lang="less" scoped>

</style>
