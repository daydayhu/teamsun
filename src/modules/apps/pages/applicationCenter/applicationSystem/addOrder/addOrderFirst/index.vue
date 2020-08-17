<template>
    <div class="addOrderFirst ts-content-form">
        <div class="header">
            <span>基本信息</span>
        </div>
        <div class="form-c">
            <el-form ref="orderForm" :model="orderInfo" :rules="rules" label-width="110px" label-position="right">
                <el-form-item label="应用系统" prop="app_id">
                    <el-select v-model="orderInfo.app_id" :disabled="operation !== 'add'" placeholder="请选择应用系统" filterable
                               @change="handleSystemChange"
                               >
                        <el-option
                          v-for="(item, index) in appMemberList"
                          :key="index"
                          :label="item.app_name"
                          :value="item.app_id"
                          :title="item.disable ? item.message :''"
                          :disabled="item.disable"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单标题" prop="ticket_name">
                    <el-input v-model.trim="orderInfo.ticket_name"
                              :disabled="operation !== 'add'&&orderInfo.step_type_num !== stepSet.collect"
                              id="apps_addOrderFirst_ticket_name"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input type="textarea" :rows="8" maxlength="200" show-word-limit v-model="orderInfo.remarks"
                              :disabled="operation !== 'add'&&orderInfo.step_type_num !== stepSet.collect"
                              id="apps_addOrderFirst_remarks"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="footer">
            <div class="btn-c">
                <el-button @click="onCancel">取消</el-button>
                <el-button @click="onSubmit('orderForm')" :loading="submitLoading" :disabled="submitLoading"
                           :type="(+orderInfo.step === stepSet.collect_approval || +orderInfo.step === stepSet.plan_approval)?'':'primary'">
                    {{submitLoading ? '提交中': '下一步：部署视图'}}
                </el-button>
                <el-button type="primary"
                           v-if="orderInfo.step_type_num === stepSet.collect_approval || orderInfo.step_type_num === stepSet.plan_approval"
                           @click="collectApprove">审 批
                </el-button>
            </div>

        </div>
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
  import * as requestMethod from '@/modules/apps/api/applicationCenter/applicationSystem';
  import Approval from './components/approval.vue';

  export default {
    name: 'addOrderFirst',
    components: {
      Approval,
    },
    props: {
      //父页面传入订单数据
      // ticketData:Object
    },
    data() {
      return {
        //approvalFrom:"",
        ticket_num:'',
        iconName: require('@/commons/images/g_baseinfo.svg'),
        current_ticket_id: null,
        ticket_type: null,
        service_id: null,
        service_name: '',
        orderInfo: {
          app_id: '',
          ticket_id: '',
          ticket_name: '',
          remarks: '',
          step_type_num: '',
          bus_id: '',
          instance_id: '',
          ticket_step_id: '',
        },
        //订单状态
        operation: 'add',
        stepSet: {
          collect: 1, // 需求收集
          collect_approval: 2, // 需求收集审批
          plan: 3, // 资源规划
          plan_approval: 4, // 资源规划审批
          deploy: 5, // 资源部署
        },
        //从哪个页面跳转而来的所有可能情况
      from:{
        'service':'/applicationCenter/serviceCatalog',
        'order':'/applicationCenter/myOrder',
        'app':'/applicationCenter/applicationSystem'
      },
      //当前从哪个页面跳转而来
      currentFrom:'',
        appMemberList: [],
        submitLoading: false,
        dialogTableVisible: false,
        //表单验证
        rules: {
          app_id: [
            {required: true, message: '请选择应用系统', trigger: 'change'},
          ],
          ticket_name: [
            {required: true, message: '请输入订单标题', trigger: 'change'},
          ],
        },
        bus_ids:""
      };
    },
    created() {
      //判断新增还是编辑
      this.operation = this.$route.query.operation;
      //获取current_ticket_id
      this.current_ticket_id = this.$route.query.ticket_id;
      //获取订单类型：1:快速申请，2:蓝图定义
      this.ticket_type = this.$route.query.ticket_type;
      this.currentFrom = this.$route.query.from;
      this.ticket_num = this.$route.query.ticket_num;
      this.orderInfo.ticket_name = this.$route.query.ticket_name
      if (this.operation === 'edit') {
        //当是编辑状态时，获取订单详情数据
        this.getOrderInfo(this.current_ticket_id);
      } else {
        //当是新增，并且新增的是快速服务申请时：
        if (this.ticket_type == 1) {
          //获取快速申请的服务ID和服务名
          this.service_id = this.$route.query.service_id;
          this.service_name = this.$route.query.service_name;
          //修改页面标题
          this.$emit('changeTitle', this.service_name);
        } else {
          //当是新增，并且新增的是蓝图定义时
          //修改页面标题
          this.$emit('changeTitle', 1);
        }
      }
      //获取应用系统
      if(this.ticket_type == 1){
        let bus_ids;
        bus_ids = this.$route.query.bus_ids;
        this.getDataList(bus_ids);
      }else if(this.ticket_type == 2){
        this.getDataList();
      }

      //改变进度条变化
      this.$emit('changeStep', 0);
    },
    mounted() {

    },
    methods: {
      handleSystemChange() {
        let currentSystem = this.appMemberList.find(item => item.app_id === this.orderInfo.app_id);
        this.orderInfo.bus_id = currentSystem.bus_id;
      },
      //获取订单详情-getOrderDetail
      getOrderInfo(ticket_id) {
        requestMethod.getOrderDetail('get', ticket_id).then(res => {
          if (res.code == 200) {
            this.orderInfo = res.data.item;
            //监听订单阶段变化
            this.$emit('changeTicketStep', res.data.item.step_type_num);
            //标题变化-当是蓝图定义时
            if (this.ticket_type == 2) {
              this.$emit('changeTitle', res.data.item.step_type_num, this.orderInfo.ticket_name);
            } else {
              //当是快速服务申请时
              this.service_name = res.data.item.ticket_service_name;
              this.$emit('changeTitle', this.service_name, this.orderInfo.ticket_name);
            }
          } else {
            this.$message.error(res.message);
          }
        }).catch();
      },
      //下一步提交
      onSubmit(orderForm) {
        this.$refs[orderForm].validate((valid) => {
          if (valid) {
            switch (this.operation) {
              case 'add':
                this.addOrder();
                break;
              case 'edit':
                //判断阶段状态
                if (this.orderInfo.step_type_num == 1) {
                  this.editOrder();
                } else {
                  //判断订单类型
                  this.$emit('changeStep', 1);
                  //快速申请
                  if (this.ticket_type == 1) {
                    this.$router.replace({
                      path: './addOrderSecondQuick',
                      query: {
                        operation: this.operation,
                        ticket_id: this.current_ticket_id,
                        app_id: this.orderInfo.app_id,
                        step: this.orderInfo.step_type_num.toString(),
                        bus_id: this.orderInfo.bus_id,
                        instance_id: this.orderInfo.instance_id,
                        step_id: this.orderInfo.ticket_step_id,
                        service_id: this.orderInfo.ticket_service_id,
                        ticket_type: this.ticket_type,
                        service_name: this.service_name,
                        from: this.currentFrom,
                        ticket_num: this.ticket_num,
                        ticket_level: this.orderInfo.ticket_level,
                        ticket_name: this.orderInfo.ticket_name
                      },
                    });
                  } else {
                    //蓝图定义
                    this.$router.replace({
                      path: './addOrderSecond',
                      query: {
                        operation: this.operation,
                        ticket_id: this.current_ticket_id,
                        app_id: this.orderInfo.app_id,
                        step: this.orderInfo.step_type_num.toString(),
                        bus_id: this.orderInfo.bus_id,
                        instance_id: this.orderInfo.instance_id,
                        step_id: this.orderInfo.ticket_step_id,
                        ticket_type: this.ticket_type,
                        from: this.currentFrom,
                        ticket_num:this.ticket_num,
                        ticket_level: this.orderInfo.ticket_level,
                        ticket_name: this.orderInfo.ticket_name
                      },
                    });
                  }
                }
                break;
              default:
                break;
            }
          }
        });
      },

      addOrder() {
        //快速申请
        if (this.ticket_type == 1) {
          let param = {
            app_id: this.orderInfo.app_id,
            ticket_name: this.orderInfo.ticket_name,
            remarks: this.orderInfo.remarks,
            service_id: this.service_id,
            pro_service_name: this.service_name,
          };
          this.submitLoading = true;
          requestMethod.quickCreateTicket('post', param).then(res => {
            this.submitLoading = false;
            if (res.code == 200) {
              let ticket_id = res.data.item.ticket_id;
              let app_id = this.orderInfo.app_id;
              let step = res.data.item.step_type_num;
              let ticket_level = res.data.item.ticket_level;
              this.$emit('stepChange', 1);
              this.operation = 'edit';
              this.$router.replace({
                path: './addOrderSecondQuick',
                query: {
                  operation: this.operation,
                  ticket_id: ticket_id,
                  app_id: app_id,
                  step: step.toString(),
                  bus_id: this.orderInfo.bus_id,
                  service_id: this.service_id,
                  step_id: this.orderInfo.ticket_step_id,
                  ticket_type: this.ticket_type,
                  service_name: this.service_name,
                  ticket_level: ticket_level,
                  ticket_name: this.orderInfo.ticket_name,
                  from: this.currentFrom,
                },
              });
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          //蓝图定义
          let param = {
            app_id: this.orderInfo.app_id,
            ticket_name: this.orderInfo.ticket_name,
            remarks: this.orderInfo.remarks,
          };
          this.submitLoading = true,
            requestMethod.createTicket('post', param).then(res => {
              this.submitLoading = false;
              if (res.code == 200) {
                let ticket_id = res.data.item.ticket_id;
                let app_id = this.orderInfo.app_id;
                let step = res.data.item.step_type_num;
                this.$emit('changeStep', 1);
                this.operation='edit';
                this.$router.replace({
                  path: './addOrderSecond',
                  query: {
                    operation: this.operation,
                    ticket_id: ticket_id,
                    app_id: app_id,
                    step: step.toString(),
                    bus_id: this.orderInfo.bus_id,
                    step_id: this.orderInfo.ticket_step_id,
                    ticket_type: this.ticket_type,
                    ticket_name: this.orderInfo.ticket_name,
                    from: this.currentFrom,       
                  },
                });
              } else {
                this.$message.error(res.message);
              }
            });

        }

      },
      editOrder() {
        let param = {
          ticket_id: this.current_ticket_id,
          body: {
            ticket_name: this.orderInfo.ticket_name,
            remarks: this.orderInfo.remarks,
          },
        };
        this.submitLoading = true;
        requestMethod.editTicket('put', param).then(res => {
          this.submitLoading = false;
          if (res.code == 200) {
            this.$emit('changeStep', 1);
            //快速申请
            if (this.ticket_type == 1) {
              this.$router.replace({
                path: './addOrderSecondQuick',
                query: {
                  operation: this.operation,
                  ticket_id: this.current_ticket_id,
                  app_id: this.orderInfo.app_id,
                  step: this.orderInfo.step_type_num.toString(),
                  bus_id: this.orderInfo.bus_id,
                  instance_id: this.orderInfo.instance_id,
                  service_id: this.orderInfo.ticket_service_id,
                  step_id: this.orderInfo.ticket_step_id,
                  ticket_type: this.ticket_type,
                  service_name: this.service_name,
                  ticket_level: this.orderInfo.ticket_level,
                  ticket_name: this.orderInfo.ticket_name
                },
              });
            } else {
              //蓝图定义
              this.$router.replace({
                path: './addOrderSecond',
                query: {
                  operation: this.operation,
                  ticket_id: this.current_ticket_id,
                  app_id: this.orderInfo.app_id,
                  step: this.orderInfo.step_type_num.toString(),
                  bus_id: this.orderInfo.bus_id,
                  instance_id: this.orderInfo.instance_id,
                  step_id: this.orderInfo.ticket_step_id,
                  ticket_type: this.ticket_type,
                  ticket_level: this.orderInfo.ticket_level,
                  ticket_name: this.orderInfo.ticket_name
                },
              });
            }
          }
          else {
            this.$message.error(res.message);
          }
        });
      },
      //取消返回
      onCancel() {
        history.back();
        // this.$router.push({
        //   path: this.from[this.currentFrom]
        // });
      },
      //获取应用系统列表
      getDataList(param) {
        if(param){
          requestMethod.getAllSystems('get', param).then(res => {
            this.appMemberList = res.data.items;
          });
        }else{
            requestMethod.getAllSystems('get').then(res => {
            this.appMemberList = res.data.items;
          });
        }

      },
      collectApprove() {
        this.dialogTableVisible = true;
      },
      approveCancel() {
        this.dialogTableVisible = false;
      },
    },
  };
</script>

<style lang="less" scoped>
    .addOrderFirst {

    }

    .ts-content-form {
        min-height: calc(100vh - 158px); // 24px * 2 + 34px + 24px = 106px
    }

</style>
