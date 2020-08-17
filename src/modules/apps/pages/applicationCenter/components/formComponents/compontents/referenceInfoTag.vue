<template>
    <i class="el-icon-setting theInfo" @click="showDialog($event)" v-if="this.$route.name!='formDetail'"></i>
</template>
<script>
import * as requestMethodVMWARE from '@/modules/apps/api/serviceCatalog/openstack/vmware.js'
import {Bus, canvasEvent} from '@/modules/apps/bus/form.bus.js';
    export default {
        props:{
            theMess: {
                type: null
            },
            setKeyId:{
                type:null
            },
            theIndex:{
                type:Number,default:0
            },
            tabIndex:{
                type:Number,
                default:0
            },
            paraIndex:{
                type:Number,
                default:0
            },
            paraIndex1:{
                type:Number,
                default:0
            }
        },
        mounted() { 
        },
        data() {
            return {
            }
        },
        watch:{
          
        },
        methods:{
            showDialog() {
                var params={isShow:true,sj:this.theMess,id:this.setKeyId,theIndex:this.theIndex,tabIndex:this.tabIndex,paraIndex:this.paraIndex,paraIndex1:this.paraIndex1}
                Bus.$emit("dispatchCanvasEvent", canvasEvent.formDiagMess, params);
            },
        }
    }
</script>

<style lang="less" scoped>
    .theInfo{
        font-size: 14px;
        color: #306bff;
        margin-left:8px;
        cursor: pointer;
        width:16px;
        height:16px;
        padding:2px;
        display: inline-block
    }
</style>
