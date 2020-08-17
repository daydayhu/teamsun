<template>
  <div>
    <div class="ts-content-form">
      <div class="header">
        <span>交付计划</span>
      </div>
        <div class="baseForm_content">
                    <div class="table-c">
            <el-table
              :data="deliverPlanList"
              v-loading="loading"
              style="width:100%"
              empty-text=" "
            >
            <template slot="empty">
                  <empty-in-table v-if="deliverPlanList.length<1&&!loading"></empty-in-table>
              </template>
              <el-table-column prop="service_name" label="服务名称" fixed></el-table-column>
              <el-table-column
                  prop="node_set_name"
                  label="操作名称"
                ></el-table-column>
                <el-table-column prop="target_service" label="目标服务"></el-table-column>
                 <el-table-column prop="vms_ironic" label="目标资源">
                  <template slot-scope="scope">
                    <!-- <span> <p v-for="(item, index) in scope.row.ironics" :key="index">{{item += a=(index===scope.row.ironics.length-1?'':',') | targetSourceFormate}} </p></span>
                    <span> <p v-for="(item, index) in scope.row.vms" :key="index">{{item += a=(index===scope.row.vms.length-1?'':',') | targetSourceFormate}}</p></span> -->
                  
                    <el-tooltip trigger="hover" placement="bottom-start" effect="dark" :content="scope.row.vms + scope.row.ironics">
                          <span>{{scope.row | targetSourceFormate}}</span>
                    </el-tooltip>
                  </template>
                 </el-table-column>
                <el-table-column prop="deliver_type" label="交付策略" v-if="orderInfo.step !== stepSet.deploy">
                  <template slot-scope="scope" >
                    <el-select v-model="scope.row.deliver_type.type" :disabled="scope.row.deliver_type_lock.type==1 || scope.row.is_current_user === 0 || orderInfo.step===2 ||orderInfo.step===4">
                      <el-option v-for="item in deliver_types" :key="item.type" :label="item.value" :value="item.type" >
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="start_up_type" label="启动策略" v-if="orderInfo.step !== stepSet.deploy">
                  <template slot-scope="scope" >
                    <!-- <el-select v-if="scope.row.deliver_type.type === 1" v-model="scope.row.deliver_type.type" :disabled='true'>
                      <el-option v-for="item in start_up_types" :key="item.type" :label="item.value" :value="item.type">
                      </el-option>
                    </el-select>
                    <el-select v-model="scope.row.start_up_type.type"  v-else :disabled="scope.row.is_current_user === 0 || orderInfo.step===2||orderInfo.step===4">
                      <el-option v-for="item in start_up_types" :key="item.type" :label="item.value" :value="item.type" >
                      </el-option>
                    </el-select> -->
                    <el-select v-model="scope.row.start_up_type.type=scope.row.deliver_type.type === 1?scope.row.deliver_type.type:scope.row.start_up_type.type" :disabled="scope.row.deliver_type.type === 1 ||scope.row.is_current_user === 0 || orderInfo.step===2||orderInfo.step===4">
                      <el-option v-for="item in start_up_types" :key="item.type" :label="item.value" :value="item.type" >
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="deliver_type" label="交付策略" v-if="orderInfo.step === stepSet.deploy">
                  <template slot-scope="scope">
                    <span>{{scope.row.deliver_type.value}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="start_up_type" label="启动策略" v-if="orderInfo.step === stepSet.deploy">
                  <template slot-scope="scope">
                    <span>{{scope.row.start_up_type.value}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="时间窗口" prop="crontab">
                  <template slot-scope="scope">
                    <div v-if="scope.row.deliver_type.type === 2 && scope.row.start_up_type.type === 2">
                      <span>{{ scope.row.crontab_message }}</span>
                      <div class="time-div" v-show="scope.$index===popid">
                        <el-form
                          :rules="crontabRules"
                          ref="crontabForm"
                          :model="crontabForm"
                        >
                          <el-form-item prop="input_value">
                            <el-input v-model="crontabForm.input_value"
                              placeholder="定时格式和crontab格式相同，为：分  时  天  月  星期"
                              autocomplete="off"></el-input>
                          </el-form-item>
                        </el-form>
                          <div class="pop-box text-center">
                            <el-button @click="pCancel()">取消</el-button>
                            <el-button type="primary" @click="pSubmit(scope)">确定</el-button>
                          </div>
                      </div>
                      <span @click="changeCronjob(scope)">
                        <svg-icon  icon-class='clock' class="icon-style"></svg-icon>
                      </span>
                    </div>
                    <div v-else>--</div>
                  </template>
                </el-table-column>
                <el-table-column prop="deliver_user" label="交付负责人" v-if="orderInfo.step === stepSet.collect|| orderInfo.step === stepSet.collect_approval">
                    <template slot-scope="scope">
                      <el-cascader
                        :options="groupUserList"
                        :show-all-levels="false"
                        v-model="scope.row.deliver_user"
                        :props="{ expandTrigger: 'hover', multiple: false, checkStrictly: true, value: 'id', label: 'name', children:'users' }"
                        clearable
                        style="width:100%"
                        :disabled="scope.row.is_current_user == 0 || orderInfo.step===2 || orderInfo.step===4"
                      ></el-cascader>
                    </template>
                </el-table-column>
                <el-table-column prop="deliver_user" label="交付负责人" v-if="orderInfo.step === stepSet.deploy ||orderInfo.step === stepSet.plan||orderInfo.step === stepSet.plan_approval">
                  <template slot-scope="scope">
                    <span >{{ get_name(scope.row.deliver_user) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="review_user" label="复核人" v-if="orderInfo.step !== stepSet.deploy">
                  <template slot-scope="scope">
                     <div v-if="scope.row.is_review === 0">--</div>
                    <el-cascader
                      v-else
                      :options="groupUserList"
                      :show-all-levels="false"
                      v-model="scope.row.review_user"
                      :props="{ expandTrigger: 'hover', multiple: false, checkStrictly: true, value: 'id', label: 'name',children:'users' }"
                      clearable
                      style="width:100%"
                      :disabled="scope.row.is_current_user == 0 || orderInfo.step===2 || orderInfo.step===4"
                    ></el-cascader>
                  </template>
                </el-table-column>
                <el-table-column prop="review_user" label="复核人" v-if="orderInfo.step === stepSet.deploy">
                  <template slot-scope="scope">
                    <span>{{ get_name(scope.row.review_user) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="review_type" label="复核策略" v-if="orderInfo.step !== stepSet.deploy">
                  <template slot-scope="scope">
                    <div v-if="scope.row.is_review === 0">--</div>
                    <el-select v-model="scope.row.review_type.type" v-else :disabled="scope.row.is_current_user === 0 || orderInfo.step===2||orderInfo.step===4">
                      <el-option v-for="item in review_types" :key="item.type" :label="item.value" :value="item.type">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" v-if="orderInfo.step === stepSet.plan||orderInfo.step === stepSet.plan_approval">
                  <template slot-scope="scope">
                    <span>
                      <span class="circle-style to-be-deployed " v-if="scope.row.handle_status.type === 1 || scope.row.handle_status.type === 2"></span>
                      <span class="circle-style to-be-reviewed" v-else></span>
                    </span>
                    <span>{{(scope.row.handle_status.type === 1 || scope.row.handle_status.type === 2)?'未处理':'已确认'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" v-if="orderInfo.step === stepSet.deploy">
                  <template slot-scope="scope">
                    <span>
                      <span class="circle-style to-be-deployed " v-if="scope.row.deploy_status === '待执行'"></span>
                      <span class="circle-style to-be-reviewed" v-else-if="scope.row.deploy_status === '执行中'"></span>
                      <span class="circle-style status-success" v-else-if="scope.row.deploy_status === '已完成'"></span>
                    </span>
                     <span>{{scope.row.deploy_status}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="opertation" label="进度" v-if="orderInfo.step === stepSet.deploy">
                  <template slot-scope="scope">
                    <el-button
                      @click="toDeployTask(scope.row)"
                      type="text"
                      size="small"
                      :disabled="false"
                    >{{ scope.row.completed_deploy +'/' +scope.row.total_deploy }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="opertation" label="操作" v-if="orderInfo.step === stepSet.plan">
                  <template slot-scope="scope">
                    <div class="btn-c2">
                      <el-button v-for="(value,key) in scope.row.operation" :key="key" @click="onActions(scope.row, key)" type="text" size="small">{{(key==="view_deployment_log"||key==="view_task_log"||key==="view_review_comments"||key==="handle"||(key==="confirm"&&orderInfo.step === stepSet.plan))?'':value}}</el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="opertation" label="操作" v-if="orderInfo.step === stepSet.deploy">
                  <template slot-scope="scope">
                    <div class="btn-c2">
                      <el-button v-for="(value,key) in scope.row.buttons" :key="key" @click="onActions(scope.row, key)" type="text" size="small">{{(key==="view_deployment_log"||key==="view_task_log"||key==="view_review_comments"||key==="handle"||(key==="confirm"&&orderInfo.step === stepSet.plan))?'':value}}</el-button>
                    </div>
                  </template>
                </el-table-column>
            </el-table>
          </div>
    </div>
      <div class="footer">
        <div class="btn-c">
          <el-button @click="onCancel">取消</el-button>
        <el-button @click="onBack">上一步：部署视图</el-button>
        <el-button @click="submitServiceInstances()"
          :loading="submitLoading"
          v-if="orderInfo.step === stepSet.collect || orderInfo.step === stepSet.plan"
          >{{ submitLoading ? "提交中 ..." : "提 交" }}</el-button>
        <el-button type="primary" @click="editServiceInstances()"
          :loading="saveLoading"
          v-if="orderInfo.step === stepSet.collect || orderInfo.step === stepSet.plan"
          >{{ saveLoading ? "保存中 ..." : "保 存" }}</el-button>
        <el-button type="primary" v-if="orderInfo.step === stepSet.collect_approval || orderInfo.step === stepSet.plan_approval" @click="collectApprove">审 批</el-button>
        <el-button type="primary" v-if="orderInfo.step === stepSet.deploy" @click="handleClose">关 闭</el-button>
        </div>

      </div>
      </div>
    <orderTransfer
      v-if="dialogFormVisible"
      :dialog-form-visible="dialogFormVisible"
      @childClose="childClose"
      @getServiceInstances="getTicketDeliverPlan"
      :dataInfo="dataInfo"></orderTransfer>
    <Approval
      v-if="dialogTableVisible"
      :dialog-table-visible="dialogTableVisible"
      @approveCancel="approveCancel"
      :instance_id="+orderInfo.instance_id"
      :ticket_id="+orderInfo.ticket_id"
      :operation="'edit'"
      :app_id="+orderInfo.app_id"
      :from="currentFrom"
      ></Approval>
    </div>
</template>

<script>
import * as requestMethod from '@/modules/apps/api/applicationCenter/applicationSystem.js';
import * as taskRequestMethod from '@/modules/apps/api/applicationCenter/myTask.js';
import * as opsRequestMethod from '@/modules/ops/api/operationsCenter/productManage/baseService.js';
import orderTransfer from './../../../components/orderTransfer.vue'
import EmptyInTable from "@/components/emptyLayout/emptyInTable"
import Approval from './../addOrderFirst/components/approval.vue';

export default {
  name: "addOrderThird",
  data() {
    return {
      loading: false,
      stepSet: {
        collect: 1, // 需求收集
        collect_approval: 2, // 需求收集审批
        plan: 3, // 资源规划
        plan_approval: 4, // 资源规划审批
        deploy: 5 // 资源部署
      },
      //从哪个页面跳转而来的所有可能情况
      from:{
        'service':'/applicationCenter/serviceCatalog',
        'order':'/applicationCenter/myOrder',
        'app':'/applicationCenter/applicationSystem'
      },
      //当前从哪个页面跳转而来
      currentFrom:'',
      orderInfo:{
        app_id: '',
        ticket_id: '',
        step:1,
        instance_id:'',
        ticket_step_id:'',
        ticket_type:'',
        ticket_name:''
      },
      ticket_num:'',
      submitLoading: false,
      saveLoading: false,
      dialogFormVisible:false,
      dialogTableVisible: false,
      dataInfo:{},
      start_up_types:[{
          "type": 1,
          "value": "手工"
        },
        {
          "type": 2,
          "value": "自动"
        }],
      review_types:[
        {
          "type": 1,
          "value": "手工",
        },
        {
          "type": 2,
          "value": "自动",
        }
      ],
      deliver_types:[
        {
          "type": 1,
          "value": "手工",
        },
        {
          "type": 2,
          "value": "自动",
        }
      ],
      deliverPlanList: [],
      groupUserList:[],
      operation:'',
      service_name:'',
      popid:null,
      crontabForm:{
         input_value:'',
      },
      crontabRules: {
        input_value: {
          validator: this.handleCrontabChange, trigger: ['blur']
        }
      },
      crontabExplain: ''
    };
  },
  components: {
    orderTransfer,
    EmptyInTable,
    Approval
  },
  computed:{
  },
  filters:{
    targetSourceFormate:function(row){
      if(row.ironics.length < 1 && row.vms.length < 1) return '';
      let str = '';
      row.ironics.forEach((e, i)=>{
        if(i !== e.length-1){
          str += e +','
        }else{
          str += e
        }
      })
      row.vms.forEach((e, i)=>{
        if(i !== e.length-1){
          str += e +','
        }else{
          str += e
        }
      })
      return str.substring(0, 20) +'...';
    }
  },
  created() {
    this.orderInfo.app_id = this.$route.query.app_id;
    this.orderInfo.ticket_id = this.$route.query.ticket_id;
    this.orderInfo.step = parseInt(this.$route.query.step);
    this.orderInfo.instance_id = this.$route.query.instance_id;
    this.orderInfo.ticket_step_id = this.$route.query.step_id;
    this.orderInfo.bus_id = this.$route.query.bus_id;
    this.currentFrom = this.$route.query.from;
    this.ticket_num = this.$route.query.ticket_num;
    this.operation = this.$route.query.operation;
    this.orderInfo.ticket_name = this.$route.query.ticket_name
    //获取订单类型：1:快速申请，2:蓝图定义
    this.orderInfo.ticket_type=this.$route.query.ticket_type
        //当是新增，并且新增的是快速服务申请时：
    if(this.orderInfo.ticket_type==1){
        this.service_name=this.$route.query.service_name
        //修改页面标题
        this.$emit("changeTitle",this.service_name, this.orderInfo.ticket_name)
    }else{
        //蓝图定义时
        //修改页面标题
        this.$emit("changeTitle",Number(this.orderInfo.step), this.orderInfo.ticket_name)
      }
    this.$emit("changeStep", 2);
    this.getGroupUser();
    this.getTicketDeliverPlan();
  },
  async mounted() {
  },
  methods: {
     // 获取订单交付计划
    getTicketDeliverPlan(){
      let step_type = null;
      switch (this.orderInfo.step) {
        case 1:
        case 2:
           step_type = '1';
          break;
        case 3:
        case 4:
          step_type = '3';
          break;
        case 5:
          step_type = '5';
          break;
        default:
          break;
      }
      let params = {
        app_id: this.orderInfo.app_id,
        ticket_id: this.orderInfo.ticket_id,
        step_type:step_type
      }
      requestMethod.getTicketDeliverPlan('get', params).then(res =>{
        if(res.code == 200){
          this.deliverPlanList = res.data.items;
            res.data.items.forEach(item => {
              item.deliver_type_lock = JSON.parse(JSON.stringify(item.deliver_type))
            });
        }else{
          this.$message.error(res.message)
        }
      })
    },

    //点击进度列，跳转到部署任务菜单
    toDeployTask(row){
      this.$router.push({
        path: '/applicationCenter/deploymentTask',
        query:{
          from:'delivery',
          ticket_num:this.ticket_num
        }
      });
    },

    // 交付计划保存
    editServiceInstances(){
      let flag = false;
      this.deliverPlanList.forEach(item=>{
        if(item.deliver_type.type === 2 && item.start_up_type.type === 2 && item.crontab === ''){
          this.$message.error('交付策略和启动策略都为自动时，时间窗口值不能为空！');
          flag = true;
        }
      })
      if(flag){
        return;
      };
      let params = {
        app_id: this.orderInfo.app_id,
        ticket_id: this.orderInfo.ticket_id,
        body:{
          items: this.deliverPlanList,
          step_type: this.orderInfo.step,
          is_submit: 0
        }
      }
      this.saveLoading = true
      requestMethod.editTicketDeliverPlan('post',params).then(res => {
        this.saveLoading = false;
        if(res.code == 200){
          this.$message.success(res.message);
          this.getTicketDeliverPlan();
        }else {
          this.$message.error(res.message);
        }
      })
    },

    // 交付计划提交-资源规划点击提交，先获取网络策略审核状态，审核通过允许继续提交，不通过给出提示‘请校验网络策略信息后再提交’
    submitServiceInstances(){
      let params = {
        app_id: this.orderInfo.app_id,
        ticket_id:this.orderInfo.ticket_id,
        body:{
          items: this.deliverPlanList,
          step_type: this.orderInfo.step,
          is_submit: 1
        }
      }
      requestMethod.get_net_strategy_review_status('get', params).then(res =>{
        if(res.code === 200){
          if(res.data.is_passed){
            this.submitLoading = true;
            requestMethod.editTicketDeliverPlan('post',params).then(res => {
            this.submitLoading = false;
              if(res.code === 200){
                this.$message.success(res.message);
                if(this.currentFrom === "service"){
                  this.$router.push({
                    path: '/applicationCenter/myOrder?menu_id=1044'
                  });
                }else{
                  history.back()
                }
              }else {
                this.$message.error(res.message);
              }
            })
          }else{
            this.$message.error('请校验网络策略信息后再提交');
          }
        }else{
          this.$message.error(res.message)
        }
      })

    },

    // 交付计划获取交付负责人，复核人
    getGroupUser(){
      requestMethod.getGroupUser('get').then(res => {
        if(res.code == 200){
          this.groupUserList = res.data.items
        }else {
          this.$message.error(res.message);
        }
      })
    },

    // 修改cronjob
    changeCronjob(scope){
      if(this.orderInfo.step === 1 || this.orderInfo.step === 3){
        this.popid = scope.$index;
        this.crontabForm.input_value = scope.row.crontab;
      }
    },

    pCancel() {
      this.popid = null;
      this.crontabForm.input_value = '';
    },
    pSubmit(scope) {
      this.$refs['crontabForm'].validate((valid) => {
        if (valid) {
          this.popid = null;
          scope.row.crontab = this.crontabForm.input_value;
          let param = {
            crontab: scope.row.crontab
          };
          opsRequestMethod.checkCrontab('get', param).then(res => {
            if(res.code === 200){
              scope.row.crontab_message = res.message;
            }
          });
          this.crontabForm.input_value = '';
        }
      })
    },

    //上一步
    onBack() {
      this.$router.replace({
        path: './addOrderSecond',
        query: {
          app_id: this.orderInfo.app_id,
          ticket_id: this.orderInfo.ticket_id,
          bus_id: this.orderInfo.bus_id,
          step: this.orderInfo.step,
          operation: this.operation,
          ticket_type: this.orderInfo.ticket_type,//1:快速申请，2:蓝图定义
          from: this.currentFrom,
          ticket_num:this.ticket_num,
          ticket_name:this.orderInfo.ticket_name,
          service_name: this.service_name
        },
      });
    },

    //取消返回
    onCancel(){
      // if(this.currentFrom === "service"){
      //   this.$router.push({
      //     path: '/applicationCenter/myOrder?menu_id=1044'
      //   });
      // }else{
      //   history.back()
      // }
      history.back()
    },

    // 接单操作
    onAcceptOrder(row, key){
      let para = {
        node_set_id: row.node_set_id,
        state: row.task_status_type.type,
        operate: key
      }
      requestMethod.passOrder('post', para).then(res => {
        if (res.code == 200) {
          this.$message.success(res.message)
           this.getTicketDeliverPlan();
        } else {
          this.$message.error(res.message)
        }
      })

    },

    //操作栏按钮事件
    onActions(row, key){
      switch (key) {
        case "accept_order":
          this.onAcceptOrder(row, key);
          break;
        case "passed_order":
        case "transfer":
          this.orderTransfer(row, key)
          break;
        case "take":
          this.orderTake(row);
          break;
        default:
          break;
      }
    },

    orderTransfer(row, key){
      this.dialogFormVisible = true
      let body = {};
      let is_delivery;
      let group_id;
      let trans_type;
      if(key === "transfer"){
        body = {
          transfer_to: null,
          ticket_step_id: +this.orderInfo.ticket_step_id,
        }
        group_id = row.deliver_user[0];
        trans_type = 1;
      }else if(key === "passed_order"){
        if(row.task_status_type){
          if(row.task_status_type.type === 'ToBeDeployed'){
            is_delivery = 1;
            group_id = row.deliver_user[0];
            trans_type = 1
          }else if(row.task_status_type.type === 'ToBeReviewed'){
            is_delivery = 0;
            group_id = row.review_user[0];
            trans_type = 2;
          }
        }
        body = {
          transfer_to: null,
          ticket_step_id: +this.orderInfo.ticket_step_id,
          current_state:row.task_status_type.type,
          operate: key,
          is_delivery: is_delivery
        }
      }

      let params = {
        app_id: this.orderInfo.app_id,
        ticket_id: this.orderInfo.ticket_id,
        node_id:row.node_id,
        set_id:row.node_set_id,
        product:row.node_name,
        opertation:row.node_set_name,
        body:body,
        groupUserList: this.groupUserList,
        group_id: group_id,
        trans_type:trans_type,
      }
      this.dataInfo = params;
    },
    orderTake(row){
      let params = {
        app_id: this.orderInfo.app_id,
        ticket_id: this.orderInfo.ticket_id,
        node_id:row.node_id,
        set_id:row.node_set_id,
        body:{
          ticket_step_id:this.orderInfo.ticket_step_id
        }
      }
      requestMethod.orderTake('put',params).then(res => {
        if(res.code == 200){
          this.$message.success(res.message);
          this.getTicketDeliverPlan();
        }else{
          this.$message.error(res.message)
        }
      })
    },

    childClose() {
      this.dialogFormVisible = false
    },
    collectApprove(){
      this.dialogTableVisible = true
    },
    approveCancel(){
      this.dialogTableVisible = false
    },

    //第五步点击关闭按钮
    handleClose(){
      // this.$router.push({
      //   path: '/applicationCenter/applicationSystem/systemDetail',
      //   query: {
      //       app_id:+this.orderInfo.app_id,
      //       selectedTab:'list',
      //       operation:'edit'
      //   }
      // });
      //history.go(-3)
      history.back();
    },

    // 获取交付人,复核人 name
    get_name(id){
      let name;
      let deliver_id, group_id;
      if(id.length === 1){
        group_id = id[0]
        this.groupUserList.forEach((item, index)=>{
          if(item.id == group_id){
            name = item.name;
          }
        })
      }else if(id.length === 2){
        let users;
        group_id = id[0];
        deliver_id = id[1];
        this.groupUserList.forEach((item, index)=>{
          if(item.id == group_id){
            users = item.users;
            users.forEach((item, index)=>{
              if(item.id == deliver_id){
                name = item.name
              }
            })
          }
        })
      }else if(id.length ===0){
        name = '--';
      }
      return name;
    },


    handleCrontabChange(rule, value, callback) {
      this.crontabExplain = '';
      if (value !== '') {
        let param = {
          crontab: value
        };
        opsRequestMethod.checkCrontab('get', param).then(res => {
          if (res.code === 200) {
            callback();
            this.crontabExplain = res.message;
          } else {
            callback(new Error(res.message))
          }
        });
      }else if(value === ''){
        callback(new Error('交付策略和启动策略都为自动时，时间窗口不能为空！'));
      }else {
        callback();
      }
    },
  }
};
</script>

<style lang="less" scoped>
.dianj {
  width: 200px;
  height: 50px;
  background: red;
}
.content {
  height: 690px;
  padding-bottom: 60px;
  .table-c{
    /deep/ .el-table__body {
      padding-bottom: 60px;
    }
  }
}
  .icon-style{
    margin-right: 5px;
    font-size: 15px;
    margin-left: 5px;
    cursor: pointer;
  }
.form-show {
  width: 98%;
  height: 300px;
  transition: height 0.5s;
  border: 1px solid #ccc;
  position: absolute;
  bottom: 0;
  overflow: hidden;
  .operate-button {
    width: 100px;
    height: 30px;
    float: right;
    span {
      border: 1px solid red;
    }
  }
}
.canvas-c {
  @flex();
  height: 100%;
  position: relative;
  /deep/ .canvas-style-c {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    + div {
      height: 100%;
      width: 100% !important;
    }
  }
  .service-show-c {
    width: 100% !important;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #ffffff;
    transition: height 0.5s;
    z-index: 100;
    .component-view-header {
      @flex();
      position: relative;
      height: 40px;
      padding-right: 20px;
      .point-c {
        flex: 1;
        text-align: center;
      }
      .btn-c {
        @flex();
        justify-content: space-between;
        position: absolute;
        right: 10px;
        width: 60px;
        height: 100%;
      }
      .btn-c2 {
        font-size: 0;
        .el-button+.el-button {
          margin-left: 0px !important;
        }
      }
    }
    /*padding-left: 200px;*/
    // height: 280px;
    .operate-button {
      width: 100px;
      height: 30px;
      float: right;
      span {
        display: inline-block;
        width: 14px;
        height: 14px;
        border: 1px solid #343952;
      }
      span:nth-child(1) {
        background-image: linear-gradient(
          top,
          #343952,
          #343952 70%,
          transparent 70%,
          transparent 100%
        );
      }
      span:nth-child(2) {
        background-image: linear-gradient(
          top,
          #343952,
          #343952 50%,
          transparent 50%,
          transparent 100%
        );
      }
      span:nth-child(3) {
        background-image: linear-gradient(
          top,
          #343952,
          #343952 30%,
          transparent 30%,
          transparent 100%
        );
      }
    }
    .header-c {
      @flex();
      height: 50px;
      border: 1px solid @g-border-color;
      padding-left: 24px;
      .title {
        font-size: 14px;
      }
    }

    .table-c {
      padding: 15px 15px 0px 15px;
      position: relative;
      z-index: 99;
      // height: 100%;
      height: calc(100% - 36px);
      overflow: auto;
      .deliver-order-c {
        @flex();
        height: 50px;
        .name {
          font-size: 12px;
        }
        .order-val {
          margin-left: 4px;
          font-size: 14px;
          font-weight: 500;
        }
        & > .el-button {
          margin-left: 8px;
        }
        .input-c {
          @flex();
          .el-input {
            width: 80px;
          }
        }
      }
    }
  }
}

.baseForm_content {
  .table-c{
    /deep/ .el-table__body {
      padding-bottom: 65px;
    }
  }
    img{
    margin-top: -100px;
  }
    .btn-c {
      font-size: 0;
      .el-button+.el-button {
        margin-left: 0px !important;
      }
    }
}

.baseForm_footer {
  padding: 20px 20px 0 0;
  text-align: right;
}
.pop-box{
  text-align: center;
  padding-top: 5px;
  border-top: 1px solid rgba(238, 238, 238, 1);
  /deep/ .el-input__inner{
    width: 273px;
  }
  button{
    width: 80px;
    height: 28px;
  }
}
  .time-div{
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
    width: 360px;
    height: 100px;
    position: absolute;
    z-index: 7;
    background-color: white;
    /deep/ .el-input{
      padding: 5px 5px;
    }
  }
  .circle-style{
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 4px;
  }

  .status-success{
    background: #13CE66;
  }

  .to-be-deployed{
    background-color:#AAAAAA ;
  }
  .to-be-reviewed{
      background-color:#1890FF ;
  }
  .status-error {
    background: #FF4C4C;
  }
</style>
