<template>
    <section>
        <el-collapse v-model="activeNames" @change="handleChange" style="padding:15px 20px;">
            <el-form label-width="30%" ref="form" :model="form" :rules="rules">
                <el-collapse-item name="1">
                    <div class="collapse-title" slot="title">
                        <span>基本信息</span>
                        <!-- <el-button @click.stop="set" type="text" class="slot-btn">高级参数</el-button> -->
                    </div>
                    <el-form-item label="OS主机名（hostname）" prop="hostname">
                            <el-input 
                                placeholder="请填写主机hostname" 
                                style="width:440px" 
                                v-model="form.hostname"
                                :disabled="disabled"
                                @blur="holdData">
                            </el-input>
                            <infoTag :theMess='form.hostname'></infoTag>
                    </el-form-item>
                    <el-form-item label="云主机名称" prop="name">
                            <el-input 
                                placeholder="请填写主机名称" 
                                style="width:440px" 
                                v-model="form.name"
                                @blur="holdData"
                                :disabled="disabled">
                            </el-input>
                            <infoTag :theMess='form.name'></infoTag>
                    </el-form-item>
                    <el-form-item label="备注">
                            <el-input 
                                placeholder="请填写备注" 
                                style="width:440px" 
                                v-model="form.description"
                                @blur="holdData"
                                :disabled="disabled">
                            </el-input>
                            <infoTag :theMess='form.description'></infoTag>
                    </el-form-item>
                    <el-form-item label="操作系统" prop="os_version">
                            <el-cascader
                                placeholder="请填写操作系统"
                                style="width:440px" 
                                :options="osOptions"
                                :props="props"
                                clearable
                                :collapse-tags="false"
                                v-model="osVersion"
                                @change="osAndVersionchange"
                                :disabled="disabled">
                            </el-cascader>
                            <infoTag :theMess='form.os_version'></infoTag>
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item name="2">
                    <div class="collapse-title" slot="title">
                        <span>容量信息</span>
                        <!-- <el-button type="text" class="slot-btn">高级参数</el-button> -->
                    </div>
                    <el-form-item label="资源池" prop="resource_pool_id">
                            <el-select
                                placeholder="请选择资源池"
                                v-model="form.resource_pool_id"
                                style="width:440px" 
                                @change="holdData"
                                :disabled="disabled">
                                <el-option 
                                    v-for="(image,index) in resourcePoolsList"
                                    :label="image.label"
                                    :value="image.value"
                                    :key="image.label+index">
                                </el-option>
                            </el-select>
                            <infoTag :theMess='form.resource_pool_id'></infoTag>
                    </el-form-item>
                    <el-form-item label="CPU">
                            <el-input
                                style="width:440px" 
                                v-model="form.require_cpu"
                                placeholder="请填写CPU"
                                @blur="holdData"
                                :disabled="disabled">
                            </el-input>
                            <infoTag :theMess='form.require_cpu'></infoTag>
                    </el-form-item>
                    <el-form-item label="内存(GB)">
                            <el-input
                                style="width:440px" 
                                v-model="form.require_memory_mb"
                                placeholder="请填写内存"
                                @blur="holdData"
                                :disabled="disabled">
                            </el-input>
                            <infoTag :theMess='form.require_memory_mb'></infoTag>
                    </el-form-item>
                    <el-form-item label="磁盘(GB)">
                            <el-input
                                style="width:440px" 
                                v-model="form.require_local_gb"
                                placeholder="请填写磁盘"
                                @blur="holdData"
                                :disabled="disabled">
                            </el-input>
                            <infoTag :theMess='form.require_local_gb'></infoTag>
                    </el-form-item>
                    <el-form-item label="网卡">
                            <el-input
                                style="width:440px" 
                                v-model="form.require_network"
                                placeholder="请填写网卡"
                                @blur="holdData"
                                :disabled="disabled">
                            </el-input>
                            <infoTag :theMess='form.require_network'></infoTag>
                    </el-form-item>
                    <el-form-item label="其他备注说明">
                            <el-input
                                style="width:440px" 
                                v-model="form.others_require"
                                placeholder="请填写备注说明"
                                @blur="holdData"
                                :disabled="disabled">
                            </el-input>
                            <infoTag :theMess='form.others_require'></infoTag>
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item v-show="phaseState >= 3" name="3">
                    <div class="collapse-title" slot="title">
                        <span>网络信息</span>
                    </div>
                    <networkCard 
                        ref="networkCard" 
                        :phaseState='phaseState' 
                        :canvasObj='canvasObj'
                        :pool_id="Number(form.resource_pool_id)"
                        :product="'openstack'">
                    </networkCard>
                </el-collapse-item>
                <el-collapse-item v-show="phaseState >= 3" name="4">
                    <div class="collapse-title" slot="title">
                        <span>部署目标</span>
                        <!-- <el-button type="text" class="slot-btn">高级参数</el-button> -->
                    </div>
                    <el-form-item label="计算可用域" prop="availability_zone">
                            <el-select 
                                v-model="form.availability_zone" 
                                style="width:440px"
                                @change="holdData"
                                :disabled="phaseState == '4'">
                                <el-option 
                                    v-for="(item,index) in availableZonesList"
                                    :label="item.label"
                                    :value="item.value"
                                    :key="index+item.label">
                                </el-option>
                            </el-select>
                            <infoTag :theMess='form.availability_zone'></infoTag>
                    </el-form-item>
                    <el-form-item label="金属裸机" prop="ironic_node_id">
                        <el-row>
                                <el-select
                                    placeholder="请选择金属裸机"
                                    v-model="form.ironic_node_id"
                                    style="width:440px" 
                                    @change="selectBaremetals"
                                    :disabled="phaseState == '4'">
                                    <el-option 
                                        v-for="(image,index) in baremetalsList"
                                        :label="image.label"
                                        :value="image.value"
                                        :key="image.label+index">
                                    </el-option>
                                </el-select>
                                <infoTag :theMess='form.ironic_node_id'></infoTag>
                        </el-row>
                        <b>计算模板：</b><span>{{form.flavor_name+","}}</span>
                        <b>CPU数量：</b><span>{{form.cpus+","}}</span>
                        <b>内存(GB)：</b><span>{{form.memory_mb+","}}</span>
                        <b>存储(GB)：</b><span>{{form.local_gb}}</span>
                    </el-form-item>
                    <el-form-item label="镜像" prop="image_id">
                        <div style="width:440px">
                            <el-col :span="11">
                                <el-select
                                    placeholder="请选择镜像类型"
                                    v-model="form.image_type"
                                    style="width:100%"
                                    @change="selectImageType(true)"
                                    :disabled="phaseState == '4'">
                                    <el-option 
                                        v-for="(image,index) in imageTypeList"
                                        :label="image.label"
                                        :value="image.value"
                                        :key="image.label+index">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="2" style="text-align: center;">
                                <span>--</span>
                            </el-col>
                            <el-col :span="11">
                                <el-select
                                    placeholder="请选择镜像"
                                    v-model="form.image_id"
                                    style="width:100%"
                                    @change="selectImageID"
                                    :disabled="phaseState == '4'">
                                    <el-option 
                                        v-for="(image,index) in imageList"
                                        :label="image.label"
                                        :value="image.value"
                                        :key="image.label+index">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </div>
                        <infoTag :theMess='form.image_id'></infoTag>
                    </el-form-item>
                </el-collapse-item>
            </el-form>
        </el-collapse>
    </section>
</template>
<script>
import * as requestMethod from '@/modules/apps/api/serviceCatalog/openstack/openstackApply.js'
import networkCard from './compontents/networkCard'
import { errorMessage } from '../../serviceCatalog/utils/message'
import infoTag from "../formComponents/compontents/infoTag"
import { successMessage } from '../../../../../ops/pages/operationsCenter/warehouseManage/publicImage/utils/message'

export default {
    name:"quickApplyOpenstack",
    components: {
        networkCard,
        infoTag
    },
    props:{
        phaseState:{
            type:String,
            default:"1"
        },
        canvasObj:{
            type:Object
        }
    },
    computed:{
        disabled(){
            let status = (this.phaseState == '2' || this.phaseState == '3' || this.phaseState == '4' )
            return status
        }
    },
    data() {
        return {
            activeNames: ["1"],
            props: { 
                multiple: false,
                expandTrigger: 'hover',
            },
            osOptions: [],
            osVersion: [],
            availableZonesList:[],
            imageList:[],
            imageListInfo:[],
            baremetalsList:[],
            resourcePoolsList:[],
            ironicTicketInfo:{},
            editStatus:false,
            bus_id: this.canvasObj.bus_id,
            imageTypeList:[
                {
                    label: '公共镜像',
                    value: 'public'
                },
                {
                    label: '私有镜像',
                    value: 'private'
                },
                {
                    label: '共享镜像',
                    value: 'share'
                },
            ],
            form: {
                app_id: this.canvasObj.app_id,       
                ticket_id: this.canvasObj.ticket_id,    
                node_canvas_uuid: this.canvasObj.service_uuid,
                hostname:'',
                name:'',
                description:'',
                os_version:'',
                resource_pool_id: null,
                require_cpu: 0,
                require_memory_mb: 0,
                require_local_gb: 0,
                require_network: "",
                others_require: "",
                availability_zone:'',
                ironic_node_id: null,
                ironic_node_uuid:"",
                image_type:'',
                image_id: null,
                image_uuid:'',
                cpus: 0,
                flavor_id: 0,
                flavor_uuid:"",
                memory_mb: 0,
                local_gb: 0,
                flavor_name:"",
                private_image_type:""
            },
            rules:{
                hostname: [
                    { required: true, message: '请输入OS主机名', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入云主机名称', trigger: 'blur' }
                ],
                os_version: [
                    { required: true, message: '请选择操作系统', trigger: 'change' }
                ],
                resource_pool_id: [
                    { required: true, message: '请选择资源池', trigger: 'change' }
                ],
                availability_zone: [
                    { required: true, message: '请选择计算可用域', trigger: 'blur' }
                ],
                ironic_node_id: [
                    { required: true, message: '请选择金属裸机', trigger: 'blur' }
                ],
                image_id: [
                    { required: true, message: '请选择镜像类型和镜像', trigger: 'blur' }
                ]
            },
            usingIronicList:[],
            isAllSave:false
        }
    },
    methods: {
        handleChange(){

        },
        getBaseData(query){
            console.log(query)
        },
        //保存数据
        holdData(){
            if(this.editStatus) {
                return this.editData()
            } else {
                return this.saveData()
            }
        },
        // 实时保存
        SaveOperationSet() {
            this.isAllSave=true
            return this.holdData()
            // this.$refs["networkCard"].SaveOperationSet();
        },
        //创建裸机表单
        async saveData(){
            return await requestMethod.createIronicTicket("post",this.form).then(res=>{
                if(res.code === 200) {
                    this.editStatus = true
                    // successMessage(res.message,this)
                }
                return this.alertMess(res)
            })
        },
        //编辑逻辑表单
        async editData() {
            this.form.node_canvas_uuid = this.canvasObj.service_uuid
            return await requestMethod.editIronicTicket("put",this.form).then(res=>{
                // successMessage(res.message,this)
                return this.alertMess(res)
            })
        },
        alertMess(res){
            let sj = {
                flag:true,
                mess:""
            }
            if( this.isAllSave===true ){
                if( res.code == 200 ) {
                    sj.flag = true;
                    sj.mess = res.message
                } else {
                    sj.flag = false;
                    sj.mess = res.message
                }
                this.isAllSave = false;

                return sj
            }else{
                if ( res.code == 200 ) {
                    // this.$notify.success({
                    //     title: '成功',
                    //     message: `${res.message}`,
                    //     position: 'bottom-right',
                    //     duration:3000
                    // });
                } else {
                    // this.$notify.error({
                    //     title: '成功',
                    //     message: `${res.message}`,
                    //     position: 'bottom-right',
                    //     duration:3000
                    // });
                }
            }
        },
         //获取裸机数据
        getIronicTicketData(){
            requestMethod.getIronicTicket("get",this.form.node_canvas_uuid).then(res=>{
                if(res.data.is_created) {
                    this.editStatus = res.data.is_created
                    this.form = res.data.ironic_data
                    this.form.availability_zone = Number(this.form.availability_zone)
                    this.osVersion = this.form.os_version.split("-")
                    if(this.phaseState >=3) {
                        this.selectImageType(false)
                        this.getBaremetalsData()
                    }
                } else {
                    this.editStatus = res.data.is_created
                }
            })
        },
        //验证表单
        forComponentContent(){
            let obj = { flag:true,mess:'带*号的为必填项' }
            let status = this.$refs["networkCard"]!=undefined
            if(status){
                var netObj = this.$refs["networkCard"].forComponentContent();
                if(!netObj.flag) {
                    obj.flag = netObj.flag
                    obj.mess=netObj.mess;
                    return obj
                }
            }
            this.$refs.form.validate((valid)=>{
                if (valid) {
                    obj.flag = true;
                } else {
                    obj.flag = false;
                }
            })
            return obj
        },
        //获取资源池列表
        getResourceRoolList() {
            let bus_id = this.$route.query.bus_id
            requestMethod.getResourcePoolData("get",bus_id,1).then(res=>{
                if(res.code === 200) {
                    res.data.items.forEach(item=>{
                        this.resourcePoolsList.push({
                            value:item.pool_id,
                            label:item.pool_name,
                        })
                    })
                }
            })
        },

        //选择镜像类型
        selectImageType(select_status) {
            this.imageList = []
            this.holdData()
            if(select_status) {
                this.form.image_id = null
            }
            if(this.form.image_type === "public") {
                this.getPublicImage()
            } else if(this.form.image_type === "private" || this.form.image_type === "share") {
                this.getPrivateAndShareImage()
            }
        },
        //获取公共镜像 
        getPublicImage() {
            requestMethod.getPublicImageList("get",this.form.os_version).then(res=>{
                if(res.code === 200) {
                    this.imageListInfo = res.data
                    this.imageListInfo.forEach( (item,index) => {
                        item.image_id = item.image_file_id
                        this.imageList.push({
                            value:item.image_id,
                            label:item.name,
                            index:index,
                        })
                    })
                }
            })
        },
        //获取私有镜像和共享镜像
        getPrivateAndShareImage() {
            let params = {
                per_page:1000,
                image_type:this.form.image_type
            }
            requestMethod.getImageList("get",this.form.image_type,this.form.ironic_node_id,this.form.os_version).then(res=>{
                if(res.code === 200) {
                    this.imageListInfo = res.data.images
                    res.data.images.forEach( (item,index)=>{
                        this.imageList.push({
                            value:item.image_id,
                            label:item.name,
                            index:index,
                        })
                    })
                } else {
                    errorMessage(res.message,this)
                }
            })
        },
        //选择镜像
        selectBaremetals(index) {
            this.baremetalsInfo.forEach(item=>{
                if(item.ironic_node_id === index) {
                    this.form.memory_mb = item.memory_mb
                    this.form.local_gb = item.local_gb
                    this.form.cpus = item.cpus
                    this.form.ironic_node_uuid = item.ironic_node_uuid
                    this.form.flavor_name = item.az.value
                    this.form.flavor_id = item.flavor_id
                    this.form.flavor_uuid = item.flavor_uuid
                }
            })
            this.holdData()
        },
        //选择镜像ID
        selectImageID(select_id) {
            this.imageListInfo.forEach(item=>{
                if(item.image_id == select_id) {
                    this.form.image_uuid = item.uuid
                    if(this.form.image_type !== "public") {
                        this.form.private_image_type = item.source_way.source_way_key
                    }
                    this.holdData()
                }
            })
        },
        //获取rbac基础数据
        getRBACbaseData() {
            let params = {
                config_type:1
            }
            requestMethod.getRbacBaseData("get",params).then(res=>{
                if(res.code === 200) {
                    this.handlerOsAndVersionData(res)
                } else {
                    errorMessage(res.message,this)
                }
            })
        },
        //操作系统及版本改变后
        osAndVersionchange(os_version){
            this.form.os_version = ""
            let len = os_version.length
            this.form.os_version = os_version.join('-')
            this.holdData()
        },
        //处理操作系统及版本数据
        handlerOsAndVersionData(res){
            let items = res.data.items
            let len = items.length
            for (let i = 1; i < len; i++ ) {
                let versionItem = {
                    value: items[i].config_key,
                    label: items[i].config_key,
                    children: []
                }
                items[i].config_type.value.version.forEach( version => {
                    versionItem.children.push({
                        value: version,
                        label: version,
                    })
                })
                this.osOptions.push(versionItem)
            }
        },
        //获取计算可用域
        getAvailableZonesData() {
            let params= {
                page:1,
                per_page:1000,
                keyword:''
            }
            requestMethod.getAvailableZones("get",params).then(res=>{
                if(res.code === 200) {
                    this.handlerAvailableZonesData(res)
                } else {
                    errorMessage(res.message,this)
                }
            })
        },
        //处理计算可用域数据
        handlerAvailableZonesData(res) {
            let data = res.data.items
            data.forEach( item =>{
                this.availableZonesList.push({
                    value:item.az_id,
                    label:item.az_name
                })
            })
        },
        //获取金属裸机
        getBaremetalsData() {
            requestMethod.getBaremetals("get",this.form.resource_pool_id).then(res=>{
                this.baremetalsInfo = res.data.IronicNodes
                this.baremetalsInfo.forEach(item=>{
                    if(item.flavor_id == this.form.flavor_id) {
                        this.form.flavor_name = item.az.value
                    }
                })
                if(res.code === 200) {
                    this.handlerBaremetalsData(res.data)
                } else {
                    errorMessage(res.message,this)
                }
            })
        },
        //处理金属裸机
        handlerBaremetalsData(res){
            if(res.IronicNodes) {
                res.IronicNodes.forEach(item => {
                    if(this.usingIronicList.indexOf(item.ironic_node_id) === -1) {
                        this.baremetalsList.push({
                            value:item.ironic_node_id,
                            label:item.ironic_node_name
                        })
                    } else {
                        this.baremetalsList.push({
                            value:item.ironic_node_id,
                            label:item.ironic_node_name,
                            disabled:true
                        })
                    }
                })
            }
        },
        //创建裸机表单
        createIronicTicket() {
            requestMethod.createIronicTicket("post",this.form).then(res=>{
                console.log(res)
            })
        },
        //获取正在使用的裸机
        getUsingIronicInfo() {
            this.usingIronicList = []
            requestMethod.getUsingIronic("get").then(res=>{
                res.data.ironic_data.forEach(item=>{
                    this.usingIronicList.push(item.ironic_node_id)
                })
            })
        }
    },
    mounted() {
        //操作系统
        this.getRBACbaseData()
        //可用域
        this.getAvailableZonesData()
        //获取表单数据
        this.getIronicTicketData()
        //资源池
        this.getResourceRoolList()
        //获取正在使用的裸机
        this.getUsingIronicInfo()
    }
}
</script>
<style lang="less" scoped>
    .collapse-title {
        padding-left: 60px;
        padding-right: 20px;
        font-size: 14px;
        width: 100%;
    }

    /deep/ .el-collapse-item {
        border: 0px !important;
    }
    
    /deep/ .el-collapse-item__header {
        flex: 1 0 auto;
        order: -1;
        background: #fff !important;
        border-bottom: 1px solid #e7edf3;
    }

    /deep/ .el-collapse-item__arrow {
        position: absolute;
        left: 60px;
    }
    /deep/ .el-collapse-item__content {
        margin-top: 5px;
        margin-left: 35px;
    }

    .slot-btn {
        float: right;
        margin-right: 20px;
        margin-top: 9px;
    }
    /deep/ .el-cascader .el-input{
        width: 100%;
    }
</style>