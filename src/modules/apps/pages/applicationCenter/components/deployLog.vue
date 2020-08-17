<template>
    <div class="log-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="cancel">
            <div slot="title">
                <div class="btn-box">
                    <span style="float:left">{{type===1?"部署日志":"任务日志"}}</span>
                    <el-radio-group v-model="log_form.log_level" size="small">
                        <el-radio-button :label='1'>错误日志</el-radio-button>
                        <el-radio-button :label='2'>正确日志</el-radio-button>
                    </el-radio-group>             
                </div>
            </div>
            <div class="el-dialog-div">
                <el-form :model="log_form">
                    <el-form-item label="" :label-width="formLabelWidth2" v-if="type===1">
                      <el-alert  type="ts-description"  show-icon>
                        <template slot="title">
                          <p>1、部署日志是该服务器上所有已部署或正在部署的服务产生的日志；</p>
                          <p>2、请在某个服务执行部署后，再查看部署日志；</p>
                        </template>
                      </el-alert>
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth2" class="server-class">
                        <pre class="prev-style" :class="type===1?'':'h40'">
                            <div v-html="this.log_form.log_level===1? this.errorLog:this.rightLog">
                            </div>
                        </pre>
                    </el-form-item>
                </el-form>

            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="cancel()">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import * as requestMethod from '@/modules/apps/api/applicationCenter/applicationSystem.js';
    export default {
        name:'logDialog',
        props:{
            deployLogVisible:{
                type:Boolean
            },
            logData:{
                type:Object
            },
            logFlag:{
                type:Object
            }
        },
        data() {
            return {
                dialogVisible: this.deployLogVisible,
                type:this.logData.log_type,
                log_form:{
                    service_set_task_id: '',
                    log_type: '',  // 1, 部署 2,任务
                    log_level:1,   // 1, 错误 2,正确日志
                },
                formLabelWidth: '60px',
                formLabelWidth2: '10px',
                errorChannel:'',
                rightChannel:'',
                errorLog:'',
                rightLog:'',
                flag:false
            };
        },
        created(){
            this.dialogTitle = this.logData.log_type === 1 ? '部署日志':'任务日志';
            this.logFun();
            this.flag = this.logFlag[this.logData.service_set_task_id];
            if(this.flag){
                this.httpRightLog();
                this.httpErrorLog()
            }
            this.wsTaskProcessReceive();
        },
        methods: {
            cancel(){
                this.$emit('childClose');
                this.$emit('wsReceive');
            },

            httpRightLog() {
                var param = {
                    service_set_task_id: this.logData.service_set_task_id,
                    log_type: this.logData.log_type,
                    log_level:2,
                    delay:0
                }
                requestMethod.viewLog("get", param).then(res => {
                    if (res.status == true) {
                    }
                });
            },
            httpErrorLog() {
                var param = {
                    service_set_task_id: this.logData.service_set_task_id,
                    log_type: this.logData.log_type,
                    log_level:1,
                    delay:0
                }
                requestMethod.viewLog("get", param).then(res => {
                    if (res.status == true) {
                    }
                });
            },
            // subscribeRightLog(){
            //     let rightChannel = `logs_${this.logData.node_set_id}_${this.logData.log_type}_2`
            //     this.wsSend(rightChannel)

            // },
            // subscribeErrorLog(){
            //     let errorChannel = `logs_${this.logData.node_set_id}_${this.logData.log_type}_1`
            //     this.wsSend(errorChannel)
            // },

            async logFun() {
                let eos_id = localStorage.getItem('eos_id');
                let rightChannel = `logs_${eos_id}_${this.logData.service_set_task_id}_${this.logData.log_type}_2`
                let errorChannel = `logs_${eos_id}_${this.logData.service_set_task_id}_${this.logData.log_type}_1`
                let sendErrData =  {
                    "msg_type": "subscribe",
                    "data": {"channels": [errorChannel]}
                };

                let sendRightData =  {
                    "msg_type": "subscribe",
                    "data": {"channels": [rightChannel]}
                };
                let status = await this.sendMsg(sendRightData,sendErrData)
            },
            sendMsg(sendRightData,sendErrData) {
                let that = this
                return new Promise((async (resolve,reject)=>{
                    if (that.global.ws && that.global.ws.readyState == 1) {
                        await that.global.ws.send(JSON.stringify(sendRightData));
                        await that.global.ws.send(JSON.stringify(sendErrData));
                        resolve(true)
                    }
                }))
            },
            //socket发送消息
            // wsSend(channel) {
            //     let that = this;
            //     let sendData =  {
            //         "msg_type": "subscribe",
            //         "data": {"channels": [channel]}
            //     };
            //     if (that.global.ws && that.global.ws.readyState == 1) {
            //         that.global.ws.send(JSON.stringify(sendData));
            //         let log_level = channel.charAt(channel.length-1);
            //         if(log_level === "1"){
            //             that.httpErrorLog();
            //         }else if(log_level === "2"){
            //             that.httpRightLog();
            //         }
            //     }
            // },

            wsTaskProcessReceive() {
                let that = this;
                let receiveData;
                that.global.ws.onmessage = function (res) {
                    receiveData = JSON.parse(res.data)
                    if(receiveData.subscribed === 1){
                        that.httpRightLog();
                        that.httpErrorLog();
                        that.$emit('updateLogFlag',that.logData.service_set_task_id)
                    }
                    if (receiveData.msg_type == "subscribe") {
                        that.$emit('updateTaskStatus', receiveData);
                        if(receiveData.data.log){
                            let oneLineLog = receiveData.data.log;
                            let log_level = receiveData.data.channel.charAt(receiveData.data.channel.length-1);
                            if(log_level === "1"){
                                that.errorLog += '<div>'+ oneLineLog+'</div>';
                            }else if(log_level === "2"){
                                that.rightLog += '<div>'+ oneLineLog+'</div>';
                            }
                        }
                    }
                };
            }
        },

    };
</script>
<style lang="less" scoped>
    .log-dialog {
        .info-box{
            width: 554px;
            height: 56px;
            padding-left: 20px;
            border:1px solid rgba(51, 153, 255, 1);

            div{
                height: 17px;
            }
            i{
                font-size: 16px;
                color:rgba(51, 153, 255, 1);
            }
        }
        .server-class{
            /deep/ .el-select{
                width: 316px;
            }
        }
        .prev-style{
            display: block;
            padding: 9.5px;
            margin: 0 0 10px;
            font-size: 13px;
            line-height: 1.42857143;
            color: #333;
            word-break: break-all;
            word-wrap: break-word;
            background-color: #f5f5f5;
            border: 1px solid #ccc;
            border-radius: 4px;
            overflow: auto;
            height: 45vh;
        }
        .h40{
            height: 50vh;
        }
        /deep/ .el-dialog__body{
            padding: 16px 24px 4px 24px;
        }
        /deep/ .el-form-item {
            margin-bottom: 10px;
        }
        /deep/ .dialog-footer{
            padding-bottom: 20px;
            text-align: right;
        }
        /deep/ .el-dialog .el-dialog__footer{
            padding: 10px 24px;
        }
        /deep/ .el-dialog .el-form-item__content{
            margin-left: 0 !important;
        }
        /deep/ .el-dialog__header .el-dialog__close {
            color: #332a7c;
            border: 1px solid #909399;
            border-radius: 8px !important;
            font-size: 8px !important;
            width: 16px;
            height: 16px;
            text-align: center;
            line-height: 16px;
        }
        .btn-box{
            text-align: right;
            width: 100%;
            padding-right: 48px;
        }
    }
</style>
