<template>
    <section class="app-overview">
        <pageHeader :title="'服务匹配'" back @handleBack="goBack" >
        </pageHeader>
        <section class="ts-body-part">
            <section class="match-box" style="overflow: hidden">
                <div class="left">
                    <div class="left-img">
                        <svg-icon style="width: 240px;height:172px" icon-class='g-template-export-source'></svg-icon>
                    </div>
                    <div class="word-content">
                        <p class="title">源应用</p>
                        <p
                            v-for="(item,index) in source_node"
                            :key="item.pro_service_uuid + index">
                            <span>{{item.node_name}}&nbsp;</span>
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
                            <span>{{item ? item.pro_service_name : ""}} &nbsp;</span>
                        </p>
                    </div>
                </div>
            </section>
            <div class="footer-btn">
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
            params:{},
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
        this.$emit('changeStep', 1);
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
        cancel(){
            this.$router.push({
                path:"/applicationCenter/applicationSystem/addOrder/addOrderSecond",
                query:this.queryParams
            })
            sessionStorage.removeItem("moduleFile")
        },
        goBack() {
            window.history.go(-1)
        },
        async getMatchData(params) {
            let formData = this.jsonToFormData(this.params)
            let res = await requestMethod.releasePublishedAppTemplate("post",formData)
            if( res.code === 200 ) {
                this.source_node = this.handleData(res.data.source_node)
                this.target_node = this.handleData(res.data.target_node)
            } else {
                this.$message.error(res.message)
            }
        },
        handleData(arr) {
            let newArr = []
            arr.forEach(item=>{
                newArr.push(item)
            })
            return newArr
        },
        async submit() {
            if(this.chackServe()){
                this.$message.error("服务不匹配！")
                return
            }
            let formData = this.jsonToFormData(this.params)
            let res = await requestMethod.importTemplate("post",formData)
            console.log(res)
            this.$router.push({
                path:"/applicationCenter/templateImport/resourceMatch",
                query:this.queryParams
            })
            if(res.code === 200) {
                window.history.go(-1)
                // this.$router.push({
                //     path:"/applicationCenter/resourceMatch",
                //     query:{
                //     }
                // })
            } else {
                this.$message.error(res.message)
            }
            sessionStorage.removeItem("moduleFile")
        },
        chackServe() {
            let resStatus = false
            this.source_node.forEach((item,index)=>{
                if(item && this.target_node[index]) {
                    if( !(item.node_name == this.target_node[index].pro_service_name)) {
                        resStatus = true
                    }
                } else if(item.node_name && (!this.target_node[index])) {
                    resStatus = true
                }
            })
            return resStatus
        },
        jsonToFormData(json) {
            const formData = new FormData();
            Object.keys(json).forEach((key) => {
              console.log(key)
                if(key == "is_file" && json[key]) {
                    let base64Data = sessionStorage.getItem("moduleFile")
                    let file = this.dataURLtoFile(base64Data,this.$route.query.fileName)
                    formData.append("app_template_file", file);
                    formData.append(key, json[key]);
                } else {
                    formData.append(key, json[key]);
                }
            });
            return formData
        },
        //将base64转换为文件
        dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }

            return new File([u8arr], filename, {type:mime});
      }
    },
    mounted(){
        this.params = {
            app_id: Number(this.$route.query.app_id),
            ticket_id: Number(this.$route.query.ticket_id),
            is_file: this.$route.query.is_file ,
            app_template_id: Number(this.$route.query.app_template_id)
        };
        this.getMatchData()
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
