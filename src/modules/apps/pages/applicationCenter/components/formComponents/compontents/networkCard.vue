<template>
<div>
    <section v-if="cidrList.length !== 0">
        <div v-for="(list,index) in cidrList" :key="index">
            <el-form-item :label="'IPv' + list.cidr_type">
                <el-input
                    style="width:160px"
                    :readonly="true"
                    :value="list.cidr"
                    :disabled="(phaseState == '4' || phaseState == '2') && !isEditable">
                </el-input>
                <div v-if=" is_ops ? !(list.area_type == 'net_deploy'):true " style="width:40px;display:inline-block;text-align: center;">——</div>
                <el-autocomplete
                    v-if=" is_ops ? !(list.area_type == 'net_deploy'):true "
                    style="width:160px"
                    popper-class="my-autocomplete"
                    v-model="list.lockIP"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入内容"
                    :disabled="(phaseState == '4' || phaseState == '2') && !isEditable"
                    @focus="getCidrIPList(list,index)"
                    @select="handleSelect"
                    @blur.stop="blur($event,index)">
                    <!-- <i
                        class="el-icon-arrow-down"
                        slot="suffix">
                    </i> -->
                    <template slot-scope="{ item }">
                        <div class="name">{{ item }}</div>
                    </template>
                </el-autocomplete>
                <el-button
                    v-if=" is_ops ? ((list.cidr_type == 4) && !(list.area_type == 'net_deploy')) : (list.cidr_type == 4)"
                    type="text"
                    @click="enableNat(index)">
                    <i style="font-size:16px" class="el-icon-circle-plus-outline"></i>
                    启用NAT策略
                </el-button>
                <!-- <infoTag :theMess='list.lockIP'></infoTag> -->
            </el-form-item>
            <el-form-item v-show="list.toEnable" label="NAT 策略">
                <el-select
                    style="width:160px"
                    v-model="list.nat_strategy"
                    @change="selectNat"
                    @focus="focusNat(index)"
                    :disabled="(phaseState == '4' || phaseState == '2') && !isEditable">
                    <el-option
                        v-for="(item,index) in natList"
                        :key="item.name + index"
                        :label="item.name"
                        :value="item.config_key">
                    </el-option>
                </el-select>
                <div style="width:40px;display:inline-block;text-align: center;">——</div>
                <el-input
                    style="width:160px"
                    v-model="list.nat_ip"
                    :disabled="(phaseState == '4' || phaseState == '2') && !isEditable">
                </el-input>
                <el-button type="text" @click="closeNat(index)">
                    <i style="font-size:16px;color: #306BFF" class="el-icon-remove-outline"></i>
                </el-button>
                <!-- <infoTag :theMess='list.nat_strategy'></infoTag> -->
            </el-form-item>
        </div>
    </section>
    <section v-else>
        <el-form-item :label="'IP'">
          <el-input
              style="width:160px"
              :readonly="true"
              :disabled="true">
          </el-input>
          <div style="width:40px;display:inline-block;text-align: center;">——</div>
          <el-autocomplete
              style="width:160px"
              popper-class="my-autocomplete"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              :disabled="true">
              <i
                  class="el-icon-arrow-down"
                  slot="suffix">
              </i>
              <template>
                  <div class="name"></div>
              </template>
          </el-autocomplete>
        </el-form-item>
        <div style="text-align: center;">
            <strong style="color: red;">该网段不在资源池，请重新选择网段！</strong>
        </div>
    </section>
</div>
</template>
<script>
import * as requestMethod from "@/modules/apps/api/serviceCatalog/openstack/openstackApply.js";
import { Bus, canvasEvent } from "@/modules/apps/bus/form.bus.js";
// import infoTag from "./infoTag"
export default {
    props: {
        phaseState: {
            type: String
        },
        canvasObj:{
            type:Object
        },
        pool_id:{
            type:Number
        },
        product: {
            type:String
        },
        ticket_obj_id: {
            type:Number
        },
        isEditable:{
            type:Boolean
        },
        is_ops:{
            type:Boolean,
            default:false
        }
    },
    components: {
        // infoTag
    },
    created() {},
    mounted() {},
    data() {
        return {
            cidrList:[],
            restaurants:[],
            state:"",
            cidrData:{},
            current_cidr:"",
            current_cidr_lockIP:"",
            tempIP:"",
            current_cidr_key:null,
            selectAble:false,
            natList:[],
            timeOutFunc: null,
        };
    },
    watch: {
        tempIP:{
            handler(newVal,oldVal) {
                let index = this.current_cidr_key
                this.cidrList[index].lockIP = newVal
                if(this.cidrList[index].lockIP !== this.cidrList[index].unlockIP) {
                    this.natList.forEach(item=>{
                        if( item.config_key === this.cidrList[index].nat_strategy ) {
                            let reg = eval(item.regular)
                            let regular = new RegExp(reg)
                            let nat_ip = this.cidrList[index].lockIP.replace(regular,item.replace)
                            this.cidrList[index].nat_ip = nat_ip
                        }
                    })
                    this.lockOrUnlockData()
                }
            }
        },
        pool_id:{
            handler(newVal,oldVal) {
                this.getCidrList()
            },
            // immediate: true
        },
    },
    mounted() {
        // this.getCidrList()
        this.getNatStrategy()
        if(this.pool_id) {
            this.getCidrList()
        }
    },
    methods: {
        //获取指定节点对应网段
        getCidrList() {
            this.cidrList = []
            //通过CIDR筛选出可用IP列表
            requestMethod.getNodeCidrs("get",this.canvasObj.app_id,this.canvasObj.ticket_id,this.canvasObj.service_uuid,this.ticket_obj_id).then(res=>{
                if(JSON.stringify(res.data) !== "{}") {
                    res.data.forEach(async item=>{
                        let isArrStatus = Array.isArray(item)
                        if(isArrStatus) {
                            let cidr_id_arr = []
                            item.forEach(idItem=> cidr_id_arr.push(idItem.cidr_id) )
                            let exist = await this.judgeCidrUserAble(this.pool_id,cidr_id_arr)
                            if(exist) {
                                item.forEach(idItem => {
                                    this.handleObject(idItem)
                                })
                            }
                        } else {
                            let exist = await this.judgeCidrUserAble(this.pool_id,item.cidr_id)
                            if(exist) {
                                this.handleObject(item)
                            }
                        }
                    })
                }
            })
        },
        //处理json数据
        async handleObject(item) {
            let json = {}
            json.network_canvas_uuid = item.canvas_uuid
            json.cidr = item.cidr
            json.cidr_id = item.cidr_id
            json.cidr_type = item.cidr_type
            json.ticket_ip_id = item.ticket_ip_id
            json.area_type = item.area_type
            let detialData = await this.getCidrIpNatData(item.ticket_ip_id)
            json.lockIP = detialData.ip
            json.unlockIP = ""
            if( detialData.nat_ip && detialData.nat_strategy ) {
                json.toEnable = true
                json.nat_strategy = detialData.nat_strategy
                json.nat_ip = detialData.nat_ip
            } else {
                json.toEnable = false
                json.nat_strategy = ""
                json.nat_ip = ""
            }
            this.cidrList.push(json)
        },
        //判断该网段是否可用
        judgeCidrUserAble(pool_id,cidr_id) {
            return new Promise(((resolve,reject)=>{
                if( this.product == "openstack" ) {
                    requestMethod.opsJudgeCidrUserAble("get",pool_id,cidr_id).then(res=>{
                        resolve(res.data.is_exist)
                    })
                } else {
                    requestMethod.vmJudgeCidrUserAble("get",pool_id,cidr_id).then(res=>{
                        resolve(res.data.is_exist)
                    })
                }
            }))
        },
        //获取指定网段锁定IP
        getCidrIpNatData(ticket_ip_id) {
            return new Promise(((resolve,reject)=>{
                requestMethod.getIPAndNATMsg("get",ticket_ip_id).then(res=>{
                    resolve(res.data)
                })
            }))
        },
        //获取指定网段下的ip列表
        getCidrIPList(list,index) {
            this.restaurants = []
            this.current_cidr_key = index
            if(this.cidrList[index].lockIP) {
                this.cidrList[index].unlockIP = this.cidrList[index].lockIP
            }
            requestMethod.getCidrsIP("get",this.cidrList[index].cidr_id).then(res=>{
                if(res.code === 200) {
                    this.restaurants = res.data
                }
            })
        },
        //失去焦点立刻进行处理
        blur(e,index){
            if(this.restaurants.indexOf(this.cidrList[index].lockIP) == -1) {
                this.cidrList[index].lockIP = this.cidrList[index].unlockIP
                return
            }
            if(!this.cidrList[index].lockIP) {
                this.cidrList[index].lockIP = this.cidrList[index].unlockIP
                return
            }
            let that = this
            this.timeOutFunc = setTimeout(()=>{
                let status = that.checkIP(that.cidrList[index].lockIP)
                if( !status ) {
                    that.$message.error("IP地址不合法")
                    return
                }
                that.handleSelect(that.cidrList[index].lockIP)
            },500)
        },
        //与画布交互
        async toCanvas(source_uuid,ip){
            let res = await requestMethod.getNodeIpData("get",this.canvasObj.app_id,this.canvasObj.ticket_id,this.canvasObj.service_uuid)
            let ips = []
            res.data[source_uuid].forEach(item=>{
                ips.push(
                    item.ip_type + ":" + item.ip
                )
            })
            Bus.$emit("dispatchCanvasEvent", canvasEvent.vmware_event_1, {
                source_uuid: source_uuid, //
                target_uuid: this.canvasObj.service_uuid,
                ip: ips
            });
        },
        //启用Nat策略
        enableNat(index) {
            if(this.phaseState == '4' || this.phaseState == '2') {
                return
            }
            this.cidrList[index].toEnable = true
        },
        //关闭Nat策略
        closeNat(index) {
            if(this.phaseState == '4' || this.phaseState == '2') {
                return
            }
            this.cidrList[index].toEnable = false
        },
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        //选择IP
        handleSelect(item) {
            clearTimeout(this.timeOutFunc)
            if( item ) {
                this.tempIP = item
            }
        },
        //编辑表单
        editIPData(status) {
            let list = this.cidrList[this.current_cidr_key]
            let params = {
                ticket_ip_id: list.ticket_ip_id,
                ip: list.lockIP,
                nat_ip: list.nat_ip,
                nat_strategy: list.nat_strategy,
            }
            requestMethod.editIPAndNATMsg("put",params).then(res=>{
                if( res.code === 200 ) {
                    this.toCanvas(list.network_canvas_uuid,list.lockIP)
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        //锁定或解锁表单
        lockOrUnlockData() {
            let list = this.cidrList[this.current_cidr_key]
            let status = this.checkIP(list.lockIP)

            if( !status ) {
                this.$message.error("IP地址不合法")
                this.cidrList[this.current_cidr_key].lockIP = this.cidrList[this.current_cidr_key].unlockIP
                return
            }

            let params = {
                locked_data: {
                    ips_data: [
                        {
                            ip: list.lockIP,
                            cidr_id: list.cidr_id
                        }
                    ]
                },
                unlocked_data: {
                    ips: [list.unlockIP]
                }
            }
            requestMethod.lockOrUnlockIP("post",params).then(res=>{
                if( res.code === 200 ) {
                    // console.log("锁定或解锁")
                    this.editIPData()
                } else {
                    this.$message.error(res.message)
                    this.cidrList[this.current_cidr_key].lockIP = this.cidrList[this.current_cidr_key].unlockIP
                }
            })
        },
        //校验IPv4 IPv6
        checkIP(ip) {
            let IPv4Regex = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
            let IPv6Regex = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/
            if( IPv4Regex.test(ip) ) {
                return true
            } else if( IPv6Regex.test(ip) ) {
                return true
            } else {
                return false
            }
        },
        //获取NAT策略
        getNatStrategy() {
            this.natList = []
            requestMethod.getNAT("get",22).then(res=>{
                if( res.code === 200 ) {
                    res.data.items.forEach(item=>{
                        let json = {}
                        if( item.config_level === 2 ) {
                            json.config_key = item.config_key
                            let data = JSON.parse(item.config_type.value)
                            json.name = data.name
                            json.regular = data.regular
                            json.replace = data.replace
                            this.natList.push(json)
                        }
                    })
                }
            })
        },
        //选择NAT
        selectNat(value) {
            this.natList.forEach(item=>{
                if( item.config_key === value ) {
                    let reg = eval(item.regular)
                    let regular = new RegExp(reg)
                    let nat_ip = this.cidrList[this.current_cidr_key].lockIP.replace(regular,item.replace)
                    this.cidrList[this.current_cidr_key].nat_ip = nat_ip
                }
            })
            this.editIPData()
        },
        focusNat(index) {
            this.current_cidr_key = index
        },
        forComponentContent(){
            let obj = { flag:true,mess:'请填写或选择IP地址' }
            this.cidrList.forEach(item=>{
                if(!item.lockIP) {
                    obj.flag = false
                }
            })
            if(this.cidrList.length == 0) {
                obj.flag = false
            }
            return obj
        }
    }
};
</script>

<style lang="less" scoped>
/deep/ .el-form-item__label:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
}
</style>
