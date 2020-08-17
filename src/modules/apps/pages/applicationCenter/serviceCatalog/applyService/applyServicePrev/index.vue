<template>
  <div class="applyServicePrev base_card">
    <div class="base_card_title">
      <span>基本信息</span>
    </div>
    <div class="base_card_content">
      <el-row>
        <el-col :span="4">
          &nbsp;
        </el-col>
        <el-col :span="14">
          <el-form ref="orderForm" :model="orderInfo" :rules="rules" label-width="110px" label-position="left">
            <el-form-item label="应用系统" prop="app_id">
              <el-select v-model="orderInfo.app_id" placeholder="请选择应用系统" @change="handleSystemChange">
                <el-option v-for="(item, index) in appMemberList" :key="index" :label="item.app_name" :value="item.app_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单标题" prop="ticket_name">
              <el-input v-model="orderInfo.ticket_name" id="apps_applyServicePrev_ticket_name"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remarks" >
              <el-input type="textarea" :rows="8" v-model="orderInfo.desc" id="apps_applyServicePrev_remarks"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4">
        </el-col>
      </el-row>
    </div>
    <div class="base_card_footer">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="onSubmit('orderForm')" :loading="submitLoading">{{submitLoading ? '提交中': '下一步：部署视图'}}</el-button>
    </div>
  </div>
</template>

<script>
import * as requestMethod from "@/modules/apps/api/applicationCenter/applicationSystem"

export default {
  name: "applyServicePrev",
  components:{
  },
  data() {
    return {
      orderInfo: {
        app_id: '',
        ticket_id: '',
        ticket_name: '',
        remarks: '',
        step: '',
        bus_id: '',
      },
      //订单状态
      operation: 'add',
      appMemberList: [],
      submitLoading: false,
      dialogTableVisible: false,
      //表单验证
      rules: {
        app_id: [
          { required: true, message: '请选择应用系统', trigger: 'change' }
        ],
        ticket_name: [
          { required: true, message: '请输入订单标题', trigger: 'change' }
        ]
      },
    };
  },
  created() {
    this.getDataList();
    //---------------------------------------已废弃！！！！！！-------------------------------------
//---------------------------------------已废弃！！！！！！-------------------------------------
//---------------------------------------已废弃！！！！！！-------------------------------------
//---------------------------------------已废弃！！！！！！-------------------------------------
//---------------------------------------已废弃！！！！！！-------------------------------------
//---------------------------------------已废弃！！！！！！-------------------------------------
//---------------------------------------已废弃！！！！！！-------------------------------------
//---------------------------------------已废弃！！！！！！-------------------------------------
//---------------------------------------已废弃！！！！！！-------------------------------------
//---------------------------------------已废弃！！！！！！-------------------------------------
  },
  mounted() {
  },
  methods: {
    handleSystemChange() {
      let currentSystem = this.appMemberList.find(item => item.app_id === this.orderInfo.app_id);
      this.orderInfo.bus_id = currentSystem.bus_id
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
              this.editOrder();
              break;
            default:
              break;
          }
        }
      })
    },

    addOrder() {
      let param = {
        app_id: this.orderInfo.app_id,
        ticket_name: this.orderInfo.ticket_name,
        remarks: this.orderInfo.remarks,
        service_id:this.$route.query.service_id
      }
      requestMethod.createTicket('post', param).then(res => {
        this.submitLoading = false
        if (res.code == 200) {
          let ticket_id = res.data.item.ticket_id;
          let app_id = this.orderInfo.app_id
          let step=res.data.item.step_type_num
          this.$emit("stepChange", 1)
          this.$router.push({
            path: './applyServiceFirst',
            query: {
              operation: this.operation,
              isOrder: this.$route.query.isOrder,
              ticket_id: ticket_id,
              app_id: app_id,
              step: step,
              bus_id: this.orderInfo.bus_id,
              service_id: param.service_id
            }
          })
        } else if (res.code == 400) {
          this.$message.error(res.message);
        }
      })
    },
    //
     editOrder(){
      let param = {
        ticket_id: this.current_ticket_id,
        body:{
          ticket_name: this.orderInfo.ticket_name,
          remarks: this.orderInfo.remarks
        }
      }
      requestMethod.editTicket('put', param).then(res=>{
        this.submitLoading = false
        if(res.code == 200){
          this.$emit("changeStep",1)
          this.$router.push({
            path: './addOrderSecond',
            query: {
              operation: this.operation,
              ticket_id:this.current_ticket_id,
              app_id:this.orderInfo.app_id,
              step:this.orderInfo.step.step_type_num.toString(),
              bus_id:this.orderInfo.bus_id
            }
          })
        }else if(res.code == 400) {
          this.$message.error(res.message);
        }
      })
    },
    //取消返回
    onCancel() {
      this.$router.back();
    },
    getDataList() {
      requestMethod.getAllSystems('get').then(res => {
        this.appMemberList = res.data.items
      })
    },
    //获取订单详情
    getOrderDetail(row) {
      let ticket_id = row.ticket_id;
      requestMethod.getOrderDetail('get', ticket_id).then(res => {
      })
    }
  }
};
</script>

<style lang="less" scoped>
.applyServicePrev {
  .base_card_content {
    padding-top: 30px;
  }
}
</style>
