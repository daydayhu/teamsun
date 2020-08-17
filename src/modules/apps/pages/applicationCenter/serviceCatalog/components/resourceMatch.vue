<template>
    <section class="app-overview">
        <section class="ts-body-part">
            <section class="match-box" style="overflow: hidden">
                <div class="left">
                    <div class="left-img">
                        <svg-icon style="width: 240px;height:172px" icon-class='g-template-export-source'></svg-icon>
                    </div>
                    <div class="word-content">
                        <p class="title">源应用</p>
                        <p
                            v-for="item in source_node"
                            :key="item.pro_service_uuid">
                            {{item.node_name}}
                        </p>
                    </div>
                </div>
                <div class="right">
                    <div class="right-img">
                        <svg-icon style="width: 240px;height:172px" icon-class='g-template-export-target'></svg-icon>
                    </div>
                    <div class="word-content">
                        <p class="title">目标应用</p>
                        <p
                            v-for="(item,index) in target_node"
                            :key="index">
                            {{item.pro_service_name ? item.pro_service_name : ""}}
                        </p>
                    </div>
                </div>
            </section>
            <div class="footer-btn">
                <el-button @click="goBack">上一步：服务匹配</el-button>
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </div>
        </section>
    </section>
</template>
<script>
import pageHeader from "@/components/pageHeader.vue"
import * as requestMethod from '@/modules/apps/api/applicationCenter/addOrder/addOrderSecond.js';

export default {
    data() {
        return {
            source_node: [],
            target_node: [],
            queryParams: {
                app_id:"",
                ticket_id:"",
                is_file:"",
                app_template_id:"",
                step:"",
                bus_id:"",
                instance_id:"",
                operation:"",
                step_id:"",
                ticket_type:""
            },

        }
    },
    components: {
        pageHeader
    },
    created(){
        this.$emit('changeStep', 2);
        this.queryParams.app_id = this.$route.query.app_id,
        this.queryParams.ticket_id = this.$route.query.ticket_id,
        this.queryParams.is_file = this.$route.query.is_file,
        this.queryParams.app_template_id = this.$route.query.app_template_id,
        this.queryParams.step = this.$route.query.step,
        this.queryParams.bus_id = this.$route.query.bus_id,
        this.queryParams.instance_id = this.$route.query.instance_id,
        this.queryParams.operation = this.$route.query.operation,
        this.queryParams.step_id = this.$route.query.step_id,
        this.queryParams.ticket_type = this.$route.query.ticket_type
    },
    methods: {
        goBack() {
            // window.history.go(-1)
            this.$router.push({
                path:"/applicationCenter/templateImport/serviceMatch",
                query:this.queryParams
            })
        },
        cancel(){
            this.$router.push({
                path:"/applicationCenter/applicationSystem/addOrder/addOrderSecond",
                query:this.queryParams
            })
        },
        submit(){

        }  
    },
    mounted(){

    }
}
</script>
<style lang="less" scoped>
@right-and-left: {
    height: 100%;
    text-align: center;
    flex:1;
}

.app-overview {
  position: relative;
  height: 100%;
  width: 100%;
  .ts-body-part {
    @ts-body-part();
    min-height:calc( 100% - 56px );
    padding-left: 0px;
    padding-right: 0px;
    border-radius: 0;
    border: 0;
    .match-box {
        margin: 24px 0px;
        height: 100%;
        display: flex;
        .left {
            @right-and-left();
            .left-img {
                margin-top: 100px;
            }
        }
        .right {
             @right-and-left();
            .right-img {
                margin-top: 100px;
            }
        }
        .word-content {
            text-align: center;
            margin-top: 40px;
            .title {
                    height: 24px;
                    font-size: 18px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #332a7c;
                    line-height: 24px;
                    margin-bottom: 16px;
            }
            & > p {
                font-size:14px;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color:rgba(51,42,124,1);
                margin-bottom: 8px;
            }
        }
        .left::after {
            content: "";
            position: absolute;
            width: 1px;
            left: 50%;
            top: 48px;
            bottom: 99px;
            display: inline-block;
            background: #E7EDF3;
            box-shadow:0px 4px 12px 0px rgba(52,69,99,0.04);
        }
    }
    .footer-btn {
        position: absolute;
        bottom: 0px;
        height: 50px;
        width: 100%;
        border-top: 1px solid #E7EDF3;
        text-align: end;
        padding-top: 8px;
        padding-right: 24px;
    }
  }
}
</style>
