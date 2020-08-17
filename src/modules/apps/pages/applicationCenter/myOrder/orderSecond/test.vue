<template>
  <div>
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

            <!--            <el-table-->
            <!--              :data="serviceInstanceList"-->
            <!--              v-loading="loading"-->
            <!--              style="width:100%"-->
            <!--              height="280"-->
            <!--            >-->
            <!--              <el-table-column prop="node_name" label="服务实例"></el-table-column>-->
            <!--              <el-table-column-->
            <!--                  prop="dep_node_name"-->
            <!--                  label="目标服务"-->
            <!--                ></el-table-column>-->
            <!--                <el-table-column prop="node_set_name" label="操作名称"></el-table-column>-->
            <!--                <el-table-column prop="deliver_type" label="交付策略" v-if="orderInfo.step === stepSet.plan || orderInfo.step === stepSet.collect ">-->
            <!--                  <template slot-scope="scope" >-->
            <!--                    <el-select v-model="scope.row.deliver_type.type" filterable allow-create :disabled="scope.row.deliver_type.type === 1|| scope.row.is_current_user === 0">-->
            <!--                      <el-option v-for="item in deliver_types" :key="item.type" :label="item.value" :value="item.type" >-->
            <!--                      </el-option>-->
            <!--                    </el-select>-->
            <!--                  </template>-->
            <!--                </el-table-column>-->
            <!--                <el-table-column prop="start_up_type" label="启动策略" v-if="orderInfo.step === stepSet.plan || orderInfo.step === stepSet.collect">-->
            <!--                  <template slot-scope="scope" >-->
            <!--                    <div v-if="scope.row.deliver_type.type === 1">&#45;&#45;</div>-->
            <!--                    <el-select v-model="scope.row.start_up_type.type" filterable allow-create v-else :disabled="scope.row.is_current_user == 0">-->
            <!--                      <el-option v-for="item in start_up_types" :key="item.type" :label="item.value" :value="item.type">-->
            <!--                      </el-option>-->
            <!--                    </el-select>-->
            <!--                  </template>-->
            <!--                </el-table-column>-->
            <!--                <el-table-column label="时间窗口">-->
            <!--                  <template slot-scope="scope">-->
            <!--                     <span>{{ scope.row.crontab}}</span>-->
            <!--                      <el-popover-->
            <!--                        :ref="`popover-${scope.$index}`"-->
            <!--                        placement="bottom"-->
            <!--                        title=""-->
            <!--                        width="314"-->
            <!--                        trigger="click"-->
            <!--                        :disabled="scope.row.is_current_user == 0"-->
            <!--                        content="">-->
            <!--                        <el-input v-model="scope.row.crontab" ></el-input>-->
            <!--                        <div class="pop-box">-->
            <!--                          <el-button type="primary" @click="changeCronjob(scope)">确定</el-button>-->
            <!--                          <el-button @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>-->
            <!--                        </div>-->
            <!--                        <svg-icon  icon-class='clock' class="icon-style" slot="reference"></svg-icon>-->
            <!--                      </el-popover>-->
            <!--                  </template>-->
            <!--                </el-table-column>-->
            <!--                <el-table-column prop="deliver_user" label="交付策略" v-if="orderInfo.step === stepSet.deploy"></el-table-column>-->
            <!--                <el-table-column prop="review_user" label="启动策略" v-if="orderInfo.step === stepSet.deploy"></el-table-column>-->
            <!--                <el-table-column prop="deliver_user" label="交付负责人" v-if="orderInfo.step === stepSet.deploy"></el-table-column>-->
            <!--                <el-table-column prop="review_user" label="复核人" v-if="orderInfo.step === stepSet.deploy"></el-table-column>-->
            <!--                <el-table-column prop="status" label="状态" v-if="orderInfo.step === stepSet.deploy"></el-table-column>-->
            <!--                <el-table-column prop="deliver_user" label="部署开始时间" v-if="orderInfo.step === stepSet.deploy"></el-table-column>-->
            <!--                <el-table-column prop="review_user" label="部署结束时间" v-if="orderInfo.step === stepSet.deploy"></el-table-column>-->
            <!--                <el-table-column prop="status" label="部署日志" v-if="orderInfo.step === stepSet.deploy"></el-table-column>-->
            <!--                <el-table-column prop="status" label="任务日志" v-if="orderInfo.step === stepSet.deploy"></el-table-column>-->
            <!--                <el-table-column prop="deliver_user" label="交付负责人">-->
            <!--                    <template slot-scope="scope">-->
            <!--                      <el-cascader-->
            <!--                        :options="groupUserList"-->
            <!--                        :show-all-levels="false"-->
            <!--                        v-model="scope.row.deliver_user"-->
            <!--                        :props="{ expandTrigger: 'hover', multiple: false, checkStrictly: true, value: 'id', label: 'name', children:'users' }"-->
            <!--                        clearable-->
            <!--                        style="width:100%"-->
            <!--                        :disabled="scope.row.is_current_user == 0"-->
            <!--                      ></el-cascader>-->
            <!--                    </template>-->
            <!--                </el-table-column>-->
            <!--                <el-table-column prop="review_user" label="复核人">-->
            <!--                  <template slot-scope="scope">-->
            <!--                     <div v-if="scope.row.is_review === 1">&#45;&#45;</div>-->
            <!--                    <el-cascader-->
            <!--                      v-else-->
            <!--                      :options="groupUserList"-->
            <!--                      :show-all-levels="false"-->
            <!--                      v-model="scope.row.review_user"-->
            <!--                      :props="{ expandTrigger: 'hover', multiple: false, checkStrictly: true, value: 'id', label: 'name',children:'users' }"-->
            <!--                      clearable-->
            <!--                      style="width:100%"-->
            <!--                      :disabled="scope.row.is_current_user == 0"-->
            <!--                    ></el-cascader>-->
            <!--                  </template>-->
            <!--                </el-table-column>-->
            <!--                <el-table-column prop="review_type" label="复核策略" v-if="orderInfo.step === stepSet.collect || orderInfo.step === stepSet.plan">-->
            <!--                  <template slot-scope="scope">-->
            <!--                    <div v-if="scope.row.is_review === 1">&#45;&#45;</div>-->
            <!--                    <el-select v-model="scope.row.review_type.type" filterable allow-create v-else :disabled="scope.row.is_current_user == 0">-->
            <!--                      <el-option v-for="item in review_types" :key="item.type" :label="item.value" :value="item.type">-->
            <!--                      </el-option>-->
            <!--                    </el-select>-->
            <!--                  </template>-->
            <!--                </el-table-column>-->
            <!--                  <el-table-column prop="handle_status" label="状态" v-if="orderInfo.step === stepSet.plan">-->
            <!--                    <template slot-scope="scope">-->
            <!--                      <span>{{ scope.row.handle_status.value}}</span>-->
            <!--                    </template>-->
            <!--                </el-table-column>-->
            <!--                <el-table-column prop="opertation" label="操作" v-if="orderInfo.step === stepSet.plan">-->
            <!--                    <template slot-scope="scope">-->
            <!--                      <div v-if="scope.row.handle_status.type == 1">-->
            <!--                        <el-button type="text" :disabled="scope.row.is_current_user == 0" @click="orderTake(scope.row)">接单</el-button>-->
            <!--                      </div>-->
            <!--                      <div v-if="scope.row.handle_status.type == 2">-->
            <!--                        <el-button type="text" :disabled="scope.row.is_current_user == 0" @click="orderTransfer(scope.row)">转单</el-button>-->
            <!--                      </div>-->
            <!--                      <div v-if="scope.row.handle_status.type == 3">-->
            <!--                      </div>-->
            <!--                    </template>-->
            <!--                </el-table-column>-->
            <!--                <el-table-column prop="opertation" label="操作" v-if="orderInfo.step === stepSet.deploy">-->
            <!--                  <template slot-scope="scope">-->
            <!--                    <el-button v-for="(value,key) in scope.row.actions" :key="key" @click="onActions(scope.row, key)" type="text" size="small">{{value}}</el-button>-->
            <!--                  </template>-->
            <!--                </el-table-column>-->
            <!--                <el-table-column prop="opertation" label="进度" v-if="orderInfo.step === stepSet.deploy">-->
            <!--                  <template slot-scope="scope">-->
            <!--                    <el-progress :text-inside="true" :stroke-width="26" :percentage="70"></el-progress>-->
            <!--                  </template>-->
            <!--                </el-table-column>-->
            <!--            </el-table>-->
          </div>
        </div>
      </div>
    </div>
    <!--    <div class="baseForm_footer">-->
    <!--      <el-button @click="onCancel">取消</el-button>-->
    <!--      <el-button type="primary" @click="onBack">上一步：部署视图</el-button>-->
    <!--      <el-button type="primary" @click="editServiceInstances(1)"-->
    <!--        :loading="submitLoading"-->
    <!--        v-if="orderInfo.type !== stepSet.deploy"-->
    <!--        >{{ submitLoading ? "提交中 ..." : "提 交" }}</el-button>-->
    <!--      <el-button type="primary" @click="editServiceInstances(0)"-->
    <!--        :loading="saveLoading"-->
    <!--        v-if="orderInfo.step_type !== stepSet.deploy"-->
    <!--        >{{ saveLoading ? "提交中 ..." : "保 存" }}</el-button>-->
    <!--      <el-button type="primary" v-if="orderInfo.step === stepSet.collect_approval || orderInfo.step === stepSet.plan_approval" @click="collectApprove">审 批</el-button>-->
    <!--      <el-button type="primary" v-if="orderInfo.step === stepSet.deploy" @click="close">关 闭</el-button>-->
    <!--    </div>-->
    <el-button type="text" @click="checkDeployLog('deploy')">部署日志</el-button>
    <!--    <el-button type="text" @click="checkDeployLog(('task'))">任务日志</el-button>-->
    <!--    <el-button type="text" @click="instanceReview">复核</el-button>-->
    <!--    <el-button type="text" @click="getSsh">SSH</el-button>-->
    <!--    <orderTransfer   v-if="dialogFormVisible" :dialog-form-visible="dialogFormVisible" @childClose="childClose" :dataInfo="dataInfo"></orderTransfer>-->
    <!--    <deployLog   v-if="deployLogVisible" :deploy-log-visible="deployLogVisible" @childClose="childClose" :logType="type"></deployLog>-->
    <!--    <orderReview   v-if="reviewDialogVisible" :review-dialog-visible="reviewDialogVisible" @closeDialog="childClose"></orderReview>-->
    <!--    <ssh v-if="sshDialogVisible" :ssh-dialog-visible="sshDialogVisible" @closeDialog="childClose"></ssh>-->
    <!--    <Approval-->
    <!--      v-if="dialogTableVisible"-->
    <!--      :dialog-table-visible="dialogTableVisible"-->
    <!--      @approveCancel="approveCancel"-->
    <!--      :instance_id="orderInfo.instance_id"-->
    <!--      :ticket_id="orderInfo.ticket_id"-->
    <!--      :operation="'edit'"-->
    <!--      :app_id="orderInfo.ticket_id"-->
    <!--    ></Approval>-->
  </div>
</template>

<script>
    //引入画布代码
    import '@/commons/js/HT/ht-common.js';
    import GraphView from '../ht/ddb-graphView';
    import Toolbar from '../../../../ht/ddb-toolbar';
    import '../ht/ddb-config';
    // 组件
    import TemplateDialog from './components/templateDialog';
    import OperationDialog from './components/operationDialog';
    // import FormComponents from '../../../components/formComponentContent.vue'
    // api
    import * as requestMethod from '@/modules/apps/api/applicationCenter/myOrder.js';
    export default {
        name: "addOrderThird",
        // mixins:[websocket],
        data() {
            return {
                canvas_json: '',
                loading: false,
                paletteList: null,
                canvas: {
                    palette: null,
                    graphView: null,
                    toolbar: null,
                },
                stepSet: {
                    collect: 1, // 需求收集
                    collect_approval: 2, // 需求收集审批
                    plan: 3, // 资源规划
                    plan_approval: 4, // 资源规划审批
                    deploy: 5 // 资源部署
                },
                orderInfo:{
                    app_id: '',
                    ticket_id: '',
                    step:1,
                    instance_id:''
                },
                is_app_canvas:0,// 1为应用画布、0为订单画布
                canvas_type:4,// 画布类型 1为应用架构图、2为部署视图我、3为数据流向图、4交付视图
                submitLoading: false,
                saveLoading: false,
                dialogFormVisible:false,
                deployLogVisible:false,
                reviewDialogVisible:false,
                sshDialogVisible:false,
                dialogTableVisible: false,
                dataInfo:{},
                start_up_types:[{
                    "type": 1,
                    "value": "手动"
                },
                    {
                        "type": 2,
                        "value": "自动"
                    }],
                review_types:[
                    {
                        "type": 1,
                        "value": "手动"
                    },
                    {
                        "type": 2,
                        "value": "自动"
                    },
                    {
                        "type": 3,
                        "value": "现场复核"
                    }
                ],
                deliver_types:[
                    {
                        "type": 1,
                        "value": "手工"
                    },
                    {
                        "type": 2,
                        "value": "自动"
                    }
                ],
                serviceInstanceList:[],
                groupUserList:[],
                type:'deploy',
                initTimes:0,
                wsObj: null,
                channel: {
                    "msg_type": "subscribe",
                    "data": {"channels": ['channel:app:progress:403d9076-4f8a-4664-9d64-bd2933f595f8']}
                },
                uuids:[]
            };
        },
        components: {
            // orderTransfer,
            // deployLog,
            // orderReview,
            // ssh,
            // Approval
        },
        created() {
            this.orderInfo.app_id = this.$route.query.app_id;
            this.orderInfo.ticket_id = this.$route.query.ticket_id;
            this.orderInfo.step = parseInt(this.$route.query.step);
            this.orderInfo.instance_id = this.$route.query.instance_id
            // this.$emit("changeStep", 2);
            // this.getGroupUser();
            // this.getServiceInstances();
            this.createCanvas();

        },
        async mounted() {
            this.layoutCanvas();
            this.startCanvas();
            this.getCanva();
            // this.getSystemsCavas();
            // this.initWebsocket();
            // this.wsSend2(this.channel);
            // this.wsReceive2();
        },
        methods: {
            changCanvasScreenRate(position) {
                this.canvas.mainView.setPosition(position);
            },
            resetSteps() {
                this.$emit("changeStep",1);
            },
            //--------------------------------画布相关--------------------------------------
            // 创建画布
            createCanvas() {
                // 1.创建拓扑组件
                let graphView = new GraphView(this);
                this.canvas = { graphView };
            },
            // 布局画布
            layoutCanvas() {
                // 1 获取画布容器
                let containerDom = this.$refs['canvas-c'];
                // 2 创建视图
                let bottomView = this.$refs['service-show-c'];
                let mainView = new ht.widget.SplitView(this.canvas.graphView.$graphView, bottomView, 'v', 0.7);
                this.canvas.mainView = mainView;
                mainView.setDividerBackground('#E7EDF3');
                mainView.setDragOpacity('1');
                mainView.getView().className = 'canvas-style-c';
                // 3 注入容器
                containerDom.appendChild(mainView.getView());
                // 4 布局变化事件监听
                mainView.addViewListener(function (e) {
                    if (e.kind === 'layout') {
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
            /**
             * 获取初始化画布
             */
            async getCanva(){
                // this.canvas.graphView.deserialize(this.getJson());
                // const node = this.getUuid();
                // if(node){
                //   this.canvas.graphView._addIconForNode(node, 'success');
                //   this.canvas.graphView._createBarNode(node);
                //   // this.saveCanvas();
                //   // this.canvas.graphView._addAttachesElementToCanvas(node);
                //
                // }
                // const {app_id, ticket_id} = this.orderInfo;
                // const res = await requestMethod.getDeliveryView('get', {app_id,ticket_id});
                //
                // if(res.code === 200){
                //     console.log(res.data.canva_data);
                //     console.log(2222);
                //   this.canvas.graphView.deserialize(res.data.canva_data);
                // }else{
                //   this.$message.error(res.message || '获取画布失败');
                // }
                const json = this.getJson();
                this.canvas.graphView.deserialize(json);

            },
            /**
             * 获取保存之后的画布
             */
            async getSystemsCavas(){
                this.getCanva();
                // const {app_id, ticket_id} = this.orderInfo;
                // const res = await  requestMethod.getSystemsCanvas('get', {app_id,ticket_id,is_app_canvas:this.is_app_canvas,canvas_type:this.canvas_type});
                // console.log(res);
                // console.log(6666);
                // if(res.code ===200){
                //     console.log(22222);
                //     this.canvas.graphView.deserialize(res.data.canvas_text);
                // }else{
                //     if(JSON.stringify(res.data) === '{}'){
                //         console.log(2222);
                //         this.getCanva();
                //     }else{
                //         this.$message.error(res.message || '获取信息失败');
                //     }
                //
                // }

            },


            /**
             * 点击部署更新画布的部署状态
             */
            async saveCanvas(){
                const {app_id, ticket_id} = this.orderInfo;
                const canvas_text = JSON.stringify(JSON.parse(this.canvas.graphView.$graphView.dm().serialize()));
                const res = requestMethod.saveSystemsCanvas('post', {canvas_text,app_id,ticket_id,is_app_canvas:0,canvas_type:4});
                // console.log(JSON.parse(this.getJson()))

            },
            getUuid(){
                let node = this.canvas.graphView.getNodeByUUID('439544f8-c8e0-451a-809a-20084a10445a');
                return node
            },

            getJson(){
                //const json = {"v": "7.0.7-dev15", "p": {"autoAdjustIndex": true, "hierarchicalRendering": false}, "d": [{"c": "ht.Node", "i": 1001, "p": {"image": {"width": 10, "height": 10, "comps": [{"type": "circle", "rect": [0, 0, 10, 10], "borderWidth": 0.5, "borderColor": "rgba(0,0,0,1)", "background": "#fff"}]}, "position": {"x": -110, "y": 200}, "width": 27, "height": 25.5}}, {"c": "ht.Node", "i": 1002, "p": {"image": {"width": 10, "height": 10, "comps": [{"type": "circle", "rect": [0, 0, 10, 10], "borderWidth": 0.5, "borderColor": "rgba(0,0,0,1)", "background": "#fff"}]}, "position": {"x": 970, "y": 200}, "width": 27, "height": 25.5}}, {"c": "ht.Edge", "i": 1003, "p": {"source": {"__i": 1001}, "target": {"__i": 1000}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "ortho"}}, {"c": "ht.Edge", "i": 1004, "p": {"source": {"__i": 1001}, "target": {"__i": 999}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.offset": 4, "edge.source.position": 19, "edge.target.position": 15}}, {"c": "ht.Edge", "i": 1005, "p": {"source": {"__i": 1001}, "target": {"__i": 996}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "ortho"}}, {"c": "ht.Edge", "i": 1006, "p": {"source": {"__i": 1000}, "target": {"__i": 1002}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "h.v"}}, {"c": "ht.Edge", "i": 1007, "p": {"source": {"__i": 997}, "target": {"__i": 1002}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.offset": 4, "edge.source.position": 19, "edge.target.position": 15}}, {"c": "ht.Edge", "i": 1008, "p": {"source": {"__i": 996}, "target": {"__i": 1002}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "h.v"}}, {"c": "ht.Node", "i": 1000, "p": {"name": "Network", "image": {"width": 230, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 230, 55], "borderWidth": 1, "borderColor": "#000000", "background": "#ffffff", "cornerRadius": 4}]}, "position": {"x": 160, "y": 100}}, "s": {"label": "Network \u2014 Apache\u5b89\u88c5", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"defaultIcon": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["defaultIcon"]}}}, "a": {"name": "Network", "elementType": "node", "service_id": "None", "proType": 4, "image": null, "canva_uuid": null, "set_uuid": "e43aead7-bc48-4de0-bb11-d77735692080", "uuid": "cb92d0ee-5c53-4111-807c-e94a62bb0e1a"}}, {"c": "ht.Node", "i": 999, "p": {"name": "VMware", "image": {"width": 230, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 230, 55], "borderWidth": 1, "borderColor": "#000000", "background": "#ffffff", "cornerRadius": 4}]}, "position": {"x": 160, "y": 200}}, "s": {"label": "VMware \u2014 trre", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"defaultIcon": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["defaultIcon"]}}}, "a": {"name": "VMware", "elementType": "node", "service_id": "28", "proType": 1, "image": null, "canva_uuid": null, "set_uuid": "76543333334", "uuid": "88b37a25-3d7c-4992-a88f-38a0055b39e0"}}, {"c": "ht.Node", "i": 998, "p": {"name": "VMware", "image": {"width": 230, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 230, 55], "borderWidth": 1, "borderColor": "#000000", "background": "#ffffff", "cornerRadius": 4}]}, "position": {"x": 430, "y": 200}}, "s": {"label": "VMware \u2014 trre1", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"defaultIcon": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["defaultIcon"]}}}, "a": {"name": "VMware", "elementType": "node", "service_id": "28", "proType": 1, "image": null, "canva_uuid": null, "set_uuid": "765433333341", "uuid": "21c8aecb-544b-44bb-981b-a0ae3755ca50"}}, {"c": "ht.Node", "i": 997, "p": {"name": "VMware", "image": {"width": 230, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 230, 55], "borderWidth": 1, "borderColor": "#000000", "background": "#ffffff", "cornerRadius": 4}]}, "position": {"x": 700, "y": 200}}, "s": {"label": "VMware \u2014 trre1", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"defaultIcon": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["defaultIcon"]}}}, "a": {"name": "VMware", "elementType": "node", "service_id": "28", "proType": 1, "image": null, "canva_uuid": null, "set_uuid": "765433333341", "uuid": "404756f1-9f92-49a7-9013-684550510809"}}, {"c": "ht.Edge", "i": 996, "p": {"source": {"__i": 999}, "target": {"__i": 998}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.offset": 4, "edge.source.position": 19, "edge.target.position": 15}}, {"c": "ht.Edge", "i": 995, "p": {"source": {"__i": 998}, "target": {"__i": 997}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.offset": 4, "edge.source.position": 19, "edge.target.position": 15}}, {"c": "ht.Node", "i": 996, "p": {"name": "\u88f8\u673a", "image": {"width": 230, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 230, 55], "borderWidth": 1, "borderColor": "#000000", "background": "#ffffff", "cornerRadius": 4}]}, "position": {"x": 160, "y": 300}}, "s": {"label": "\u88f8\u673a \u2014 VMware\u865a\u62df\u673a\u5b89\u88c5", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"defaultIcon": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["defaultIcon"]}}}, "a": {"name": "\u88f8\u673a", "elementType": "node", "service_id": "29", "proType": 1, "image": null, "canva_uuid": null, "set_uuid": "84c603e1-6ca9-4aa4-b4ab-ef18b1e9cdf6", "uuid": "439544f8-c8e0-451a-809a-20084a10445a"}}]};
                const json = {"v": "7.0.7-dev15", "p": {"autoAdjustIndex": true, "hierarchicalRendering": false}, "d": [{"c": "ht.Node", "i": 1001, "p": {"image": {"width": 10, "height": 10, "comps": [{"type": "circle", "rect": [0, 0, 10, 10], "borderWidth": 0.5, "borderColor": "rgba(0,0,0,1)", "background": "#fff"}]}, "position": {"x": -110, "y": 400}, "width": 27, "height": 25.5}}, {"c": "ht.Node", "i": 1002, "p": {"image": {"width": 10, "height": 10, "comps": [{"type": "circle", "rect": [0, 0, 10, 10], "borderWidth": 0.5, "borderColor": "rgba(0,0,0,1)", "background": "#fff"}]}, "position": {"x": 700, "y": 400}, "width": 27, "height": 25.5}}, {"c": "ht.Edge", "i": 1003, "p": {"source": {"__i": 1001}, "target": {"__i": 1000}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "ortho"}}, {"c": "ht.Edge", "i": 1004, "p": {"source": {"__i": 1001}, "target": {"__i": 999}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "ortho"}}, {"c": "ht.Edge", "i": 1005, "p": {"source": {"__i": 1001}, "target": {"__i": 997}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "ortho"}}, {"c": "ht.Edge", "i": 1006, "p": {"source": {"__i": 1001}, "target": {"__i": 996}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.offset": 4, "edge.source.position": 19, "edge.target.position": 15}}, {"c": "ht.Edge", "i": 1007, "p": {"source": {"__i": 1001}, "target": {"__i": 995}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "ortho"}}, {"c": "ht.Edge", "i": 1008, "p": {"source": {"__i": 1001}, "target": {"__i": 994}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "ortho"}}, {"c": "ht.Edge", "i": 1009, "p": {"source": {"__i": 1001}, "target": {"__i": 993}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "ortho"}}, {"c": "ht.Edge", "i": 1010, "p": {"source": {"__i": 1000}, "target": {"__i": 1002}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "h.v"}}, {"c": "ht.Edge", "i": 1011, "p": {"source": {"__i": 998}, "target": {"__i": 1002}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "h.v"}}, {"c": "ht.Edge", "i": 1012, "p": {"source": {"__i": 997}, "target": {"__i": 1002}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "h.v"}}, {"c": "ht.Edge", "i": 1013, "p": {"source": {"__i": 996}, "target": {"__i": 1002}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.offset": 4, "edge.source.position": 19, "edge.target.position": 15}}, {"c": "ht.Edge", "i": 1014, "p": {"source": {"__i": 995}, "target": {"__i": 1002}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "h.v"}}, {"c": "ht.Edge", "i": 1015, "p": {"source": {"__i": 994}, "target": {"__i": 1002}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "h.v"}}, {"c": "ht.Edge", "i": 1016, "p": {"source": {"__i": 993}, "target": {"__i": 1002}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "h.v"}}, {"c": "ht.Node", "i": 1000, "p": {"name": "\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8", "image": {"width": 230, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 230, 55], "borderWidth": 1, "borderColor": "#000000", "background": "#ffffff", "cornerRadius": 4}]}, "position": {"x": 160, "y": 100}}, "s": {"label": "\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8 \u2014 network", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8-44": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8-44"]}}}, "a": {"name": "\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8", "elementType": "node", "service_id": "44", "proType": 3, "image": "http://172.16.194.160:31318/download/imgs/bugatti(1)(2).svg", "canva_uuid": null, "set_uuid": "2926a510-9676-4220-8f9a-4085442b934a", "uuid": "c20eb270-b974-464f-b1c8-4caff2999aae"}}, {"c": "ht.Node", "i": 999, "p": {"name": "VMware-qkm\uff08\u52ff\u5220\uff09", "image": {"width": 230, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 230, 55], "borderWidth": 1, "borderColor": "#000000", "background": "#ffffff", "cornerRadius": 4}]}, "position": {"x": 160, "y": 200}}, "s": {"label": "VMware-qkm\uff08\u52ff\u5220\uff09 \u2014 \u4e3b\u4ea7\u54c1", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"defaultIcon": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["defaultIcon"]}}}, "a": {"name": "VMware-qkm\uff08\u52ff\u5220\uff09", "elementType": "node", "service_id": "37", "proType": 1, "image": "", "canva_uuid": null, "set_uuid": "7b29283b-5466-4f6d-81bb-9b87eb2eff2b", "uuid": "eb3e6c30-2f81-42c8-89ca-9f97e251d695"}}, {"c": "ht.Node", "i": 998, "p": {"name": "Oracle-\u9996\u6b21", "image": {"width": 230, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 230, 55], "borderWidth": 1, "borderColor": "#000000", "background": "#ffffff", "cornerRadius": 4}]}, "position": {"x": 430, "y": 200}}, "s": {"label": "Oracle-\u9996\u6b21 \u2014 Oracle-\u9996\u6b21", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"Oracle-\u9996\u6b21-52": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["Oracle-\u9996\u6b21-52"]}}}, "a": {"name": "Oracle-\u9996\u6b21", "elementType": "node", "service_id": "52", "proType": 2, "image": "http://172.16.194.160:31318/download/imgs/audi(1).svg", "canva_uuid": null, "set_uuid": "9761f7a9-8230-447f-9122-33b64132710e", "uuid": "5f77f7c1-620b-404a-8c5c-a80c1f3de2bf"}}, {"c": "ht.Edge", "i": 997, "p": {"source": {"__i": 999}, "target": {"__i": 998}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.offset": 4, "edge.source.position": 19, "edge.target.position": 15}}, {"c": "ht.Node", "i": 997, "p": {"name": "X86\u91d1\u5c5e\u88f8\u673a", "image": {"width": 230, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 230, 55], "borderWidth": 1, "borderColor": "#000000", "background": "#ffffff", "cornerRadius": 4}]}, "position": {"x": 160, "y": 300}}, "s": {"label": "X86\u91d1\u5c5e\u88f8\u673a \u2014 OpenStack\u4ea7\u54c1", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"defaultIcon": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["defaultIcon"]}}}, "a": {"name": "X86\u91d1\u5c5e\u88f8\u673a", "elementType": "node", "service_id": "41", "proType": 1, "image": "", "canva_uuid": null, "set_uuid": "07fa2264-9fdd-4af6-84d6-49fe97fe2fc6", "uuid": "1a17057e-d6a0-4964-9cf4-855c3b25c79c"}}, {"c": "ht.Node", "i": 996, "p": {"name": "VMware-qkm\uff08\u52ff\u5220\uff09", "image": {"width": 230, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 230, 55], "borderWidth": 1, "borderColor": "#000000", "background": "#ffffff", "cornerRadius": 4}]}, "position": {"x": 160, "y": 400}}, "s": {"label": "VMware-qkm\uff08\u52ff\u5220\uff09 \u2014 \u4e3b\u4ea7\u54c1", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"defaultIcon": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["defaultIcon"]}}}, "a": {"name": "VMware-qkm\uff08\u52ff\u5220\uff09", "elementType": "node", "service_id": "37", "proType": 1, "image": "", "canva_uuid": null, "set_uuid": "3f7127c0-8c07-4200-b43f-e8df5cee2c33", "uuid": "cc84f0f0-8e1e-4fba-a2cd-a1e229491a5c"}}, {"c": "ht.Node", "i": 995, "p": {"name": "\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8", "image": {"width": 230, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 230, 55], "borderWidth": 1, "borderColor": "#000000", "background": "#ffffff", "cornerRadius": 4}]}, "position": {"x": 160, "y": 500}}, "s": {"label": "\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8 \u2014 network", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8-44": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8-44"]}}}, "a": {"name": "\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8", "elementType": "node", "service_id": "44", "proType": 3, "image": "http://172.16.194.160:31318/download/imgs/bugatti(1)(2).svg", "canva_uuid": null, "set_uuid": "08a87856-8221-4c84-b10e-d1dd44c8e6f4", "uuid": "85112d37-1ee4-4e61-82d0-fb96d81f3275"}}, {"c": "ht.Node", "i": 994, "p": {"name": "\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8", "image": {"width": 230, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 230, 55], "borderWidth": 1, "borderColor": "#000000", "background": "#ffffff", "cornerRadius": 4}]}, "position": {"x": 160, "y": 600}}, "s": {"label": "\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8 \u2014 network", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8-44": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8-44"]}}}, "a": {"name": "\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8", "elementType": "node", "service_id": "44", "proType": 3, "image": "http://172.16.194.160:31318/download/imgs/bugatti(1)(2).svg", "canva_uuid": null, "set_uuid": "4bd08e8d-1ee3-4d3d-ace1-6e90c19db563", "uuid": "bff006e8-fcbf-4c4c-8e37-d5b2d1e0bde4"}}, {"c": "ht.Node", "i": 993, "p": {"name": "\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8", "image": {"width": 230, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 230, 55], "borderWidth": 1, "borderColor": "#000000", "background": "#ffffff", "cornerRadius": 4}]}, "position": {"x": 160, "y": 700}}, "s": {"label": "\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8 \u2014 network", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8-44": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8-44"]}}}, "a": {"name": "\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8", "elementType": "node", "service_id": "44", "proType": 3, "image": "http://172.16.194.160:31318/download/imgs/bugatti(1)(2).svg", "canva_uuid": null, "set_uuid": "ae283c98-d9f7-40ca-b9ad-de91c4dcaee0", "uuid": "10e560b2-607a-4a74-9f98-c1fa7a885178"}}]}
                return json
            },

            // 交付计划获取服务实例列表
            getServiceInstances(){
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
                    app_id:this.orderInfo.app_id,
                    ticket_id: this.orderInfo.ticket_id,
                    step_type: step_type
                }
                requestMethod.getServiceInstances('get', params).then(res => {
                    if(res.code == 200){
                        this.serviceInstanceList = res.data.items;
                    }else if(res.code == 400){
                        this.$message.error(res.message)
                    }
                })
            },

            // 交付计划编辑服务实例列表
            editServiceInstances(isSubmit){
                if(isSubmit == 0){
                    this.saveLoading = true
                }else if(isSubmit == 1){
                    this.submitLoading = true;
                }

                let params = {
                    app_id: this.orderInfo.app_id,
                    ticket_id:this.orderInfo.ticket_id,
                    body:{
                        items: this.serviceInstanceList,
                        step_type: this.orderInfo.step,
                        is_submit: isSubmit
                    }
                }
                requestMethod.editServiceInstances('post',params).then(res => {
                    this.submitLoading = false;
                    this.saveLoading = false;
                    if(res.code == 200){
                        this.$message.success(res.message);
                        this.$router.push({
                            path: '/applicationCenter/serviceCatalog?menu_id=4103',
                            query: {selectedTab: "list"}
                        });
                    }else {
                        this.$message.error(res.message);
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
                scope._self.$refs[`popover-${scope.$index}`].doClose()
            },

            //上一步
            onBack() {
                console.log("返回");
                //更新并传入step变化的值
                this.$emit("changeStep", 1)
                history.back();
            },

            //取消返回
            onCancel(){
                this.$router.back();
            },

            //部署，终止， 回滚，重新部署，部署成功，提交确认。 // SSH,转单，复核，查看部署日志 不通过操作集接口。
            operateSet(row, key){
                let node_set_id = row.node_set_id;
                let state = row.state;
                let param = {
                    node_set_id: node_set_id,
                    state:state,
                    operate: key
                }
                requestMethod.operateSet('post', param).then(res => {
                    if(res.code == 200){
                        this.$message.success(res.message);
                    }else if(res.code == 500){
                        this.$message.error(res.message);
                    }
                })
            },
            //操作栏按钮事件
            onActions(row,key){
                switch (key) {
                    case "deploy":
                    case "deploy_to_success":
                    case "redeploy":
                    case "terminate_deployment":
                    case "rollback":
                    case "submit_review":
                        this.operateSet(row, key);
                        break;
                    case "submit_confirm":
                        this.confirm(row, key);
                        break;
                    case "ssh":
                        this.ssh(row);
                        break;
                    case "passed_order":
                        this.orderTransfer(row)
                        break;
                    case "view_deployment_log":
                        this.viewLog(row);
                        break;
                    case "view_task_log":
                        this.viewLog(row);
                        break;
                    default:
                        break;
                }
            },

            orderTransfer(row){
                this.dialogFormVisible = true
                let params = {
                    app_id: this.orderInfo.app_id,
                    ticket_id: this.orderInfo.ticket_id,
                    node_id:row.node_id,
                    set_id:row.node_set_id,
                    product:row.node_name,
                    opertation:row.node_set_name,
                    body:{
                        transfer_to: null,
                        ticket_step_id: this.orderInfo.step
                    },
                    groupUserList: this.groupUserList,
                    group_id: row.deliver_user[0]
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
                        ticket_step_id:this.orderInfo.step
                    }
                }
                requestMethod.orderTake('put',params).then(res => {
                    if(res.code == 200){
                        this.$message.success(res.message);
                    }else if(res.code == 500){
                        this.$message.error(res.message);
                    }else if(res.code == 405){
                        this.$message.error(res.message);
                    }
                })
            },
            checkDeployLog(type){
                this.deployLogVisible = true;
                this.type = type;

            },
            instanceReview(){
                this.reviewDialogVisible = true
            },
            getSsh(){
                this.sshDialogVisible = true
            },
            childClose() {
                this.dialogFormVisible = false
                this.deployLogVisible = false
                this.reviewDialogVisible = false
                this.sshDialogVisible = false
            },
            viewLog() {
                this.logs = '';
                this.loading = true;
                var param = {
                    node_set_id: 87,
                    log_type: this.log_form.log_type,
                    log_level:this.log_form.log_level,
                }
                requestMethod.viewLog("get", param).then(res => {
                    if (res.status == true) {
                        let channel = res.data.channel;
                        this.wsSend(channel);
                    }
                    this.loading = false;
                });
            },

            // 建立连接
            taskStatus() {
                var param = {
                    node_set_id: 87,
                    log_type: this.log_form.log_type,
                    log_level:this.log_form.log_level,
                }
                requestMethod.viewLog("get", param).then(res => {
                    if (res.status == true) {
                        let channel = res.data.channel;
                        this.wsSend(channel);
                    }
                    this.loading = false;
                });
            },

            // 实例化socket
            initWebsocket(){
                let that = this;
                console.log(that)
                if ("WebSocket" in window) {
                    // console.log("您的浏览器支持 WebSocket!");
                    // that.wsObj = new WebSocket('ws://172.16.134.149:8007/api/app/ws/message') // 创建websocket对象
                    // console.log(that.wsObj)
                    // that.wsObj.onopen = function(){  //发送请求
                    //     console.log("socket连接成功----");
                    //     that.wsSend2(that.channel);
                    //     that.wsReceive2();
                    // };
                    // that.wsObj.onclose = function(ev){
                    //     setTimeout(() => {
                    //       that.initWebsocket();
                    //     }, 2000);
                    // };
                    // that.wsObj.onerror = function(ev){
                    //   that.initTimes++
                    //   console.log('444444444444')
                    //   if(this.initTimes>10) {
                    //       clearTimeout(this.initFunc)
                    //       return
                    //   }
                    //   let that = this
                    //   this.initFunc = setTimeout(function(){
                    //       that.init()
                    //       that.initTimes++
                    //   },2000)
                    // };
                }else {
                    console.log("您的浏览器不支持 WebSocket!");
                }
            },
            //socket接收消息
            wsReceive2() {
                this.wsObj.onmessage = function (res) {
                    let receiveData = JSON.parse(res.data)
                    if (receiveData.msg_type == "subscribe") {
                    }
                    console.log('++++++++++++++++++++++++++',receiveData)
                };
            },
            //socket发送消息
            wsSend2(channel) {
                try{
                    console.log(JSON.stringify(channel))
                    this.wsObj.send(JSON.stringify(channel));
                    if (this.wsObj && this.wsObj.readyState == 1) {
                        this.wsObj.send(JSON.stringify(channel));
                    }
                }catch(err){
                    var tryTime = 0;
                    if (tryTime < 10) {
                        var t1 = setTimeout(function () {
                            tryTime++;
                            console.log(JSON.stringify(channel))
                            this.wsObj.send(JSON.stringify(channel));
                            if (this.wsObj && this.wsObj.readyState == 1) {
                                this.wsObj.send(JSON.stringify(channel));
                            }
                        }, 3*1000);
                    } else {
                        console.error("重连失败.");
                    }}
            },

            // 点击部署、重新部署、回滚后 实时获取进度状态
            viewDeployRollbackStatus(row){
                let uuid = row.node_set_uuid;
                let channel = {
                    "msg_type": "subscribe",
                    "data": {"channels": [`channel:app:progress:${uuid}`]}
                };
                this.wsSend(channel)
            },

            // 部署中和回滚中, 订阅获取进度状态。
            isDeployingRollbackStatus(){
                this.serviceInstanceList.forEach((item, index) => {
                    if(item.status == ''){
                        this.uuids.push(`channel:app:progress:${item.node_set_uuid}`)
                    }
                })
                let channel = {
                    "msg_type": "subscribe",
                    "data": {"channels": this.uuids}
                };
                this.wsSend(channel)
            },

            collectApprove(){
                this.dialogTableVisible = true
            },
            approveCancel(){
                this.dialogTableVisible = false
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
    height: 800px;
    padding: 0px;
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
    background-color: #ffffff;
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
      width: 100%;
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
        padding: 15px 15px 60px 15px;
        position: relative;
        z-index: 99;
        // height: 100%;
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
  .baseForm_footer {
    padding: 20px 20px 0 0;
    text-align: right;
  }
  .pop-box{
    text-align: center;
    padding-top: 15px;
    margin-top: 20px;
    border-top: 1px solid rgba(238, 238, 238, 1);
    /deep/ .el-input__inner{
      width: 273px;
    }
    button{
      width: 80px;
      height: 28px;
    }
  }
</style>
