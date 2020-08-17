<template>
  <div class="deploymentTask">
    <div class="base_card">
      <div class="baseForm_content">
        <!-- ------------------------画布区域 --------------------->
        <div class="canvas-c" ref="canvas-c">
          <div class="service-show-c" ref="service-show-c">
            <div class="component-view-header">
              <div class="point-c">▪︎ ▪︎ ▪︎</div>
              <div class="btn-c">
                <el-button type="text" @click="changCanvasScreenRate(0.75)">
                  <svg-icon icon-class="screen_x"></svg-icon>
                </el-button>
                <el-button type="text" @click="changCanvasScreenRate(0.5)">
                  <svg-icon icon-class="screen_z"></svg-icon>
                </el-button>
                <el-button type="text" @click="changCanvasScreenRate(0)">
                  <svg-icon icon-class="screen_d"></svg-icon>
                </el-button>
              </div>
            </div>
            <div class="table-c">
              <el-table :data="taskList" v-loading="loading" style="width:100%" empty-text=" ">
                <template slot="empty">
                  <empty-in-table v-if="taskList.length<1&&!loading"></empty-in-table>
                </template>
                <el-table-column v-for="(item, index) in tableHeader" :key="index" :prop="item.key" :label="item.label" :fixed="index === 0 ? true : false">
                  <template slot-scope="scope">
                    <span v-if="item.key ==='deliver_type'||item.key ==='start_up_type' || item.key ==='review_type'">{{ scope.row[item.key].value }}</span>
                    <span v-else-if="item.key ==='deliver_user'">{{ get_name(scope.row.deliver_user) }}</span>
                    <span v-else-if="item.key ==='review_user'">{{ get_name(scope.row.review_user) }}</span>
                    <span v-else-if="item.key ==='status'">
                      <span>
                        <span class="circle-style status-success" v-if="
                            scope.row.status.key === 'SuccessfulDeployment' ||
                              scope.row.status.key === 'Completed'
                          "></span>
                        <span class="circle-style to-be-deployed" v-else-if="scope.row.status.key === 'ToBeDeployed'"></span>
                        <span class="circle-style status-error" v-else-if="
                            scope.row.status.key === 'FailedDeployment' ||
                              scope.row.status.key === 'FailedReview'
                          "></span>
                        <span class="circle-style to-be-reviewed" v-else-if="scope.row.status.key === 'ToBeReviewed'">
                        </span>
                      </span>
                      <span v-if="scope.row.status.key === 'Deploying' ||
                            scope.row.status.key === 'RollBacking'">
                        <el-progress :text-inside="true" :stroke-width="16" :percentage="scope.row.task_info.task_progress" :stroke-linecap="'square'"></el-progress>
                        <span><span class="circle-style to-be-reviewed"></span>{{ scope.row.status.value }}</span>
                      </span>
                      <span v-else>{{ scope.row.status.value }}</span>
                    </span>
                    <div class="crontab-c" v-else-if="item.key ==='crontab' && scope.row.crontab ">
                      <span>{{scope.row.crontab}}</span>
                      <el-tooltip placement="bottom-start" trigger="hover" :content="scope.row.crontab_message">
                        <el-button type="text">
                          <svg-icon icon-class="hint_icon"></svg-icon>
                        </el-button>
                      </el-tooltip>

                    </div>
                    <span v-else>{{ scope.row[item.key] }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="日志">
                  <template slot-scope="scope">
                    <div class="btn-c">
                      <el-tooltip trigger="hover" v-for="(value,key) in scope.row.actions" :key="key" v-if="value.key==='view_deployment_log'" placement="bottom-start" :content="'部署日志'">
                        <el-button type="text" @click="onActions(scope.row, value.key)">
                          <svg-icon icon-class="deploy_log" class="icon-style"></svg-icon>
                        </el-button>
                      </el-tooltip>
                      <el-tooltip trigger="hover" v-if="value.key==='view_task_log'" placement="bottom-start" :content="'任务日志'" v-for="(value,key) in scope.row.actions" :key="key">
                        <el-button type="text" @click="onActions(scope.row, value.key)">
                          <svg-icon icon-class="task_log" class="icon-style"></svg-icon>
                        </el-button>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <pagination :paginationData="pagination" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></pagination>
    <deployLog v-if="deployLogVisible" :deploy-log-visible="deployLogVisible" @childClose="childClose" @updateTaskStatus="updateTaskStatus" @wsReceive="wsReceive" :logData="logData" :logFlag="logFlag"
      @updateLogFlag="updateLogFlag">
    </deployLog>
    <orderReviewComments v-if="reviewCommentDialogVisible" :reviewCommentDialogVisible="reviewCommentDialogVisible" :reviewCommentsData="reviewCommentsData" @closeDialog="childClose">
    </orderReviewComments>
  </div>
</template>

<script>
import "@/commons/js/HT/ht-common.js";
import GraphView from "./ht/ddb-graphView";
import "./ht/ddb-config";
import "@/commons/js/HT/ht-edgetype.js"; // 连线类型js文件
import * as requestMethod from "@/modules/apps/api/applicationCenter/applicationSystem.js";
import * as taskRequestMethod from "@/modules/apps/api/applicationCenter/myTask.js";
import * as orderRequestMethod from "@/modules/apps/api/applicationCenter/myOrder.js";
import * as table from "./untils/config.js";
import deployLog from "../../components/deployLog.vue";
import orderReviewComments from "../../myTask/components/orderReviewComments";
import Pagination from "@/components/pagination";
import EmptyInTable from "@/components/emptyLayout/emptyInTable"

import { getSession } from "@/commons/js/searchFresh.js";
// import websocket from '@/modules/apps/mixins/websocket.js'
export default {
  name: "addOrderThird",
  // mixins:[websocket],
  data() {
    return {
      canvas_json: "",
      loading: false,
      paletteList: null,
      tableHeader: table.tableHeader2,
      canvas: {
        palette: null,
        graphView: null,
        toolbar: null
      },
      pagination: {
        current_page: 1, // 当前位于哪页
        per_page: 10, //每页显示多少条
        total_count: 0,
        total_page: 1
      },
      orderInfo: {
        app_id: "",
        ticket_id: "",
        step: 1,
        instance_id: "",
        ticket_step_id: ""
      },
      is_app_canvas: 0, // 1为应用画布、0为订单画布
      canvas_type: 4, // 画布类型 1为应用架构图、2为部署视图我、3为数据流向图、4交付视图
      submitLoading: false,
      saveLoading: false,
      dialogFormVisible: false,
      deployLogVisible: false,
      reviewDialogVisible: false,
      dialogTableVisible: false,
      reviewCommentDialogVisible: false,
      dataInfo: {},
      taskList: [],
      groupUserList: [],
      logData: {},
      initTimes: 0,
      reviewData: {},
      sshData: {},
      reviewCommentsData: {},
      operation: "",
      logFlag: {},
    };
  },
  components: {
    deployLog,
    // orderReviewComments,
    Pagination,
    EmptyInTable
  },
  computed: {},
  created() {
    var a = [];
    // 1.基于instanceof
    console.log(a instanceof Array);
    this.orderInfo.app_id = this.$route.query.app_id;
    this.orderInfo.ticket_id = this.$route.query.ticket_id;
    //this.orderInfo.step = parseInt(this.$route.query.step);
    this.orderInfo.instance_id = this.$route.query.instance_id;
    // this.orderInfo.ticket_step_id = this.$route.query.step_id
    this.getGroupUser();
    this.createCanvas();
    this.wsReceive();
    this.getDeployTaskList();
  },
  async mounted() {
    this.layoutCanvas();
    this.startCanvas();
    this.getSystemsCavas();
  },
  methods: {
    changCanvasScreenRate(position) {
      this.canvas.mainView.setPosition(position);
    },
    //--------------------------------画布相关--------------------------------------
    // 创建画布
    createCanvas() {
      // 1.创建拓扑组件
      let graphView = new GraphView(this);

      // 2.创建工具栏
      // let toolbar = new Toolbar(this);

      // 3.生成canvas
      this.canvas = { graphView };
    },
    // 布局画布
    layoutCanvas() {
      // 1 获取画布容器
      let containerDom = this.$refs["canvas-c"];
      // 3 创建视图
      let rightFooterView = this.$refs["service-show-c"];
      let rightView = new ht.widget.SplitView(
        this.canvas.graphView.$graphView,
        rightFooterView,
        "v",
        -280
      );
      this.canvas.graphView.$graphView.getView().style.backgroundColor = "#fff";
      rightView.setDividerBackground("#E7EDF3");
      rightView.setDragOpacity("1");
      rightView.getView().className = "canvas-style-c";
      // 6 注入容器
      containerDom.appendChild(rightView.getView());
      this.canvas.graphView.$graphView.setEditable(false);
      this.canvas.mainView = rightView;
      // 4 布局变化事件监听
      rightView.addViewListener(function (e) {
        if (e.kind === "layout") {
          let splitP = mainView.getPosition();
        }
      });
    },
    // 启动画布
    startCanvas() {
      for (let component of Object.values(this.canvas)) {
        if (component.init) {
          component.init();
        }
      }
    },
    getUuid(uuid) {
      let node = this.canvas.graphView.getNodeBysstUUid(uuid);
      return node
    },
    /**
     * 获取初始化画布
     */
    async getCanvas() {
      // this.canvas.graphView.deserialize(this.getJson());
      const { app_id, ticket_id } = this.orderInfo;
      const res = await requestMethod.getDeliveryView("get", {
        app_id,
        ticket_id
      });
      if (res.code === 200) {
        this.canvas.graphView.deserialize(res.data.canva_data)
      } else {
        this.$message.error(res.message || "获取画布失败");
      }
    },
    /**
     * 获取保存之后的画布
     */
    async getSystemsCavas() {
      const { app_id, ticket_id } = this.orderInfo;
      const res = await requestMethod.getSystemsCanvas("get", {
        app_id,
        ticket_id,
        is_app_canvas: this.is_app_canvas,
        canvas_type: this.canvas_type
      });
      if (res.code === 200) {
        this.canvas.graphView.deserialize(res.data.canvas_text);
      } else {
        if (JSON.stringify(res.data) === "{}") {
          this.getCanvas();
        } else {
          this.$message.error(res.message || "获取信息失败");
        }
      }
    },

    /**
     * 点击部署更新画布的部署状态
     */
    async saveCanvas() {
      const { app_id, ticket_id } = this.orderInfo;
      const canvas_text = JSON.stringify(
        JSON.parse(this.canvas.graphView.$graphView.dm().serialize())
      );
      const res = requestMethod.saveSystemsCanvas("post", {
        canvas_text,
        app_id,
        ticket_id,
        is_app_canvas: 0,
        canvas_type: 4
      });
    },

    // 上下分页
    handleCurrentChange(val) {
      this.getDeployTaskList(
        getSession("searchFresh").keyword,
        val,
        getSession("searchFresh").pageSize
      );
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.getDeployTaskList(
        getSession("searchFresh").keyword,
        getSession("searchFresh").pageNo,
        val
      );
    },

    // 交付计划获取交付负责人，复核人
    getGroupUser() {
      requestMethod.getGroupUser("get").then(res => {
        if (res.code == 200) {
          this.groupUserList = res.data.items;
        } else {
          this.$message.error(res.message);
        }
      });
    },

    //获取订单详情中-部署任务 orderRequestMethod
    getDeployTaskList(data, pageNo, pageSize) {
      let para = {
        body: {
          per_page: pageSize,
          current_page: pageNo,
          keyword: JSON.stringify(data)
        },
        ticket_id: this.orderInfo.ticket_id
      };
      orderRequestMethod
        .getDeployTaskList("get", para)
        .then(res => {
          if (res.code == 200) {
            this.taskList = res.data.items;
            this.pagination = res.data.pagination_data;
            let channels = [];
            this.taskList.forEach(item => {
              if (item.status) {
                if (item.status.key === 'Deploying' || item.status.key === 'RollBacking') {
                  let channel = `channel:app:progress:${item.sst_uuid}`
                  channels.push(channel)
                }
              }
            });
            this.wsSend(channels, "subscribe")
          } else {
            this.$message.error(res.message);
          }
          this.taskLoading = false;
        })
        .catch();
    },

    // socket发送消息
    wsSend(channel, msg_type) {
      let that = this;
      let sendData = {
        msg_type: msg_type,
        data: { channels: channel }
      };
      console.log(JSON.stringify(sendData));
      if (that.global.ws && that.global.ws.readyState == 1) {
        that.global.ws.send(JSON.stringify(sendData));
      }
    },

    //socket接收消息
    wsReceive() {
      let that = this;
      that.global.ws.onmessage = function (res) {
        let receiveData = JSON.parse(res.data);
        if (receiveData.msg_type == "subscribe") {
          console.log("进度条值11111", receiveData);
          that.taskList.forEach((item, index) => {
            if (item.sst_uuid == receiveData.data.uuid) {
              item.task_info.task_progress = +receiveData.data.task_progress;
              if (
                receiveData.data.task_status === "success" ||
                receiveData.data.task_status === "fail"
              ) {
                this.getDeployTaskList();
              }
            }
          });
        } else if (receiveData.msg_type == "sst_canvas_status") {
          const node = this.getUuid(receiveData.data.sst_uuid);
          if (node) {
            this.canvas.graphView.setIconJudge(node);
          }
        }
      };
    },

    //上一步
    onBack() {
      console.log("返回");
      //更新并传入step变化的值
      this.$emit("changeStep", 1);
      history.back();
    },

    //取消返回
    onCancel() {
      this.$router.back();
    },

    //操作栏按钮事件
    onActions(row, key) {
      switch (key) {
        case "view_deployment_log":
          this.viewLog(row, "deploy");
          break;
        case "view_task_log":
          this.viewLog(row, "task");
          break;
        default:
          break;
      }
    },

    childClose() {
      this.dialogFormVisible = false;
      this.deployLogVisible = false;
      this.reviewDialogVisible = false;
      this.sshDialogVisible = false;
      this.reviewCommentDialogVisible = false;
    },
    viewLog(row, type) {
      this.deployLogVisible = true;
      this.logData.log_type = type === "task" ? 2 : 1;
      this.logData.service_set_task_id = row.service_set_task_id;
    },

    //socket接收消息
    wsReceive() {
      let that = this;
      that.global.ws.onmessage = function (res) {
        let receiveData = JSON.parse(res.data);
        if (receiveData.msg_type == "subscribe") {
          console.log("进度条值11111", receiveData);
          that.taskList.forEach((item, index) => {
            if (item.sst_uuid == receiveData.data.uuid) {
              item.task_info.task_progress = +receiveData.data.task_progress;
              if (
                receiveData.data.task_status === "success" ||
                receiveData.data.task_status === "fail"
              ) {
                that.getDeployTaskList();
              }
            }
          });
        }
      };
    },
    collectApprove() {
      this.dialogTableVisible = true;
    },
    approveCancel() {
      this.dialogTableVisible = false;
    },

    //第五步点击关闭按钮
    handleClose() {
      // this.$router.push({
      //   path: '/applicationCenter/applicationSystem/systemDetail',
      //   query: {
      //       app_id:+this.orderInfo.app_id,
      //       selectedTab:'list',
      //       operation:'edit'
      //   }
      // });
      history.go(-3);
    },

    // 获取交付人,复核人 name
    get_name(id) {
      let name;
      let deliver_id, group_id;
      if (id.length === 1) {
        group_id = id[0];
        this.groupUserList.forEach((item, index) => {
          if (item.id == group_id) {
            name = item.name;
          }
        });
      } else if (id.length === 2) {
        let users;
        group_id = id[0];
        deliver_id = id[1];
        this.groupUserList.forEach((item, index) => {
          if (item.id == group_id) {
            users = item.users;
            users.forEach((item, index) => {
              if (item.id == deliver_id) {
                name = item.name;
              }
            });
          }
        });
      } else if (id.length === 0) {
        name = "--";
      }
      return name;
    },

    //记录日志打开次数
    updateLogFlag(service_set_task_id) {
      this.logFlag[service_set_task_id] = true
    },

    updateTaskStatus(receiveData) {
      this.taskList.forEach(item => {
        if (item.sst_uuid == receiveData.data.uuid) {
          item.task_info.task_progress = +receiveData.data.task_progress;
          if (
            receiveData.data.task_status === "success" ||
            receiveData.data.task_status === "fail"
          ) {
            this.getDeployTaskList();
          }
        }
      });
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
.baseForm_content {
  height: 690px;
  padding-bottom: 60px;
}
.icon-style {
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
      .circle-style {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 4px;
      }

      .status-success {
        background: #13ce66;
      }

      .to-be-deployed {
        background-color: #666666;
      }
      .to-be-reviewed {
        background-color: #1890ff;
      }
      .status-error {
        background: #ff4c4c;
      }
    }
    .btn-c {
      font-size: 0;
      .el-button + .el-button {
        margin-left: 0px !important;
      }
    }
  }
}
.baseForm_footer {
  padding: 20px 20px 0 0;
  text-align: right;
}
.pop-box {
  text-align: center;
  padding-top: 15px;
  margin-top: 20px;
  border-top: 1px solid rgba(238, 238, 238, 1);
  /deep/ .el-input__inner {
    width: 273px;
  }
  button {
    width: 80px;
    height: 28px;
  }
}
.deploymentTask {
  .ts-page-block {
    margin-top: 0;
  }
}
</style>
