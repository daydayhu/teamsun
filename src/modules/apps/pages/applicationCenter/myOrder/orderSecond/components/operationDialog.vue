<template>
    <div class="layout-c" ref="layout-c">
        <div class="header">
            <div class="name-c">
                <span class="name">{{serviceInfo.name}}</span>
                <el-button type="text" v-if="serviceNameStatus === 'off'" @click="serviceNameStatus='on'">
                    <svg-icon icon-class='edit_icon' class="edit_icon"></svg-icon>
                </el-button>
                <div class="input-c" v-if="serviceNameStatus === 'on'">
                    <el-input v-model="saveServiceName" type="text"></el-input>
                    <el-button type="text" @click="saveName">保存</el-button>
                    <el-button type="text" @click="cancelName">取消</el-button>
                </div>
            </div>
        </div>
        <div class="deliver-order-c">
            <span class="name">交付顺序：</span>
            <span class="order-val" v-if="deliverOrderStatus === 'off'">{{serviceInfo.order}}</span>
            <el-button type="text" v-if="deliverOrderStatus === 'off'" @click="deliverOrderStatus='on'">
                <svg-icon icon-class='edit_icon' class="edit_icon"></svg-icon>
            </el-button>
            <div class="input-c" v-if="deliverOrderStatus === 'on'">
                <el-input v-model="saveOrderVal" type="number"></el-input>
                <el-button type="text" @click="saveDeliverOrder">保存</el-button>
                <el-button type="text" @click="cancelDeliverOrder">取消</el-button>
            </div>
        </div>
        <div class="operation-c">
            <el-checkbox-group v-model="checkOperationList">
                <el-checkbox :label="item.id" v-for="(item,index) in operationList" :key="index" :disabled="item.show_time_type !== 2">{{item.name}}</el-checkbox>
            </el-checkbox-group>
        </div>
        <div class="footer-c">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="confirm">确认</el-button>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'operationDialog',
    data() {
      return {
        serviceInfo: {
          name: 'VM',
          order: 1
        },
        serviceNameStatus: 'off', // off、on
        saveServiceName: '',
        deliverOrderStatus: 'off',
        saveOrderVal: '',
        operationList: [
          {
            id: 1,
            name: 'Mysql安装设置',
            show_time_type: 2, // 1为任意时间；2首次申请；3为非首次申请
          },
          {
            id: 2,
            name: 'Mysql服务状态检查',
            show_time_type: 2
          },
          {
            id: 3,
            name: '停止Mysql服务',
            show_time_type: 2
          },
          {
            id: 4,
            name: '操作集4',
            show_time_type: 1
          },
          {
            id: 5,
            name: '操作集5',
            show_time_type: 3
          }
        ],
        checkOperationList: []
      }
    },
    methods: {
      resetLayoutPosition(position) {
        this.$refs['layout-c'].style.left = position.left + 'px';
        this.$refs['layout-c'].style.top = position.top + 'px';
      },
      saveName() {
        let param = {};
        // requestMethod.saveDeliverOrder('put', param).then(res => {
        //   if (res.code === 200) {
        //
        //   }else {
        //     this.$message.error(res.message)
        //   }
        // });
        this.serviceNameStatus = 'off'
      },
      cancelName() {
        this.saveServiceName = this.serviceInfo.name;
        this.serviceNameStatus = 'off'
      },
      // 保存交互顺序
      saveDeliverOrder() {
        // let param = {
        //   component_id: this.comServiceId,
        //   service_id: this.currentNodeData.service_id,
        //   canvas: {
        //     canvas_uuid: this.currentNodeData.uuid,
        //     pro_service_index: this.saveOrderVal
        //   }
        // };
        // requestMethod.saveDeliverOrder('put', param).then(res => {
        //   if (res.code === 200) {
        //     this.deliverOrderVal = this.saveOrderVal;
        //     this.deliverOrderStatus = 'off'
        //   }else {
        //     this.$message.error(res.message)
        //   }
        // });
      },
      cancelDeliverOrder() {
        this.saveOrderVal = this.deliverOrderVal;
        this.deliverOrderStatus = 'off'
      },
      confirm() {

      },
      close() {
        this.$emit('closeOperationDialog')
      }
    }
  };
</script>

<style lang="less" scoped>
    .layout-c {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        width: 300px;
        height: 320px;
        overflow-y: auto;
        background-color: #ffffff;
        box-shadow: 0 6px 12px 0 rgba(48,107,255,0.1);
        .header {
            @flex();
            height: 40px;
            padding: 0 20px;
            border-bottom: 1px solid @g-border-color;
            .name-c {
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
                & > .el-button  {
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
        .deliver-order-c {
            @flex();
            padding-left: 20px;
            height: 50px;
            border-bottom: 1px solid @g-border-color;
            .name {
                font-size: 12px;
            }
            .order-val {
                margin-left: 4px;
                font-size: 14px;
                font-weight: 500;
            }
            & > .el-button  {
                margin-left: 8px;
            }
            .input-c {
                @flex();
                .el-input {
                    width: 80px;
                }
            }
        }
        .operation-c {
            min-height: 180px;
            border-bottom: 1px solid @g-border-color;
            .el-checkbox-group {
                display: flex;
                flex-direction: column;
                padding-left: 20px;
                .el-checkbox {
                    margin-top: 15px;
                    color: @g-font-color-c;
                }
            }

        }
        .footer-c {
            @flex();
            justify-content: center;
            height: 50px;
            & > .el-button:last-child {
                margin-left: 20px;
            }
        }

    }
</style>
