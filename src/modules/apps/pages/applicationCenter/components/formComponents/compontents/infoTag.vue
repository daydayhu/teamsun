<template>
    <i class="el-icon-info theInfo" @mouseover="showDialog($event)" @mouseout.stop.prevent="closeDialog($event)"></i>
</template>
<script>
import * as requestMethodVMWARE from '@/modules/apps/api/serviceCatalog/openstack/vmware.js'
import {Bus, canvasEvent} from '@/modules/apps/bus/form.bus.js';
    export default {
        props:{
            theMess: {
                type: null
            },
        },
        mounted() { 
           
        },
        data() {
            return {
                timer:false,
            }
        },
        watch:{
          
        },
        methods:{
            closeDialog(event) {
                if (!this.timer) {
                    this.timer = true
                    let that = this
                    var sj=setTimeout(function () {
                        that.timer = false;
                        var params={isShow:false,left:event.clientX,top:event.clientY,sj:this.theMess}
                        Bus.$emit("dispatchCanvasEvent", canvasEvent.formDiagMess, params);
                        clearInterval(sj)
                    }, 500)
                }
            },
            showDialog(event) {
                if (!this.timer) {
                    this.timer = true
                    let that = this
                    var sj=setTimeout(function () {
                        that.timer = false;
                        var contentWidth=document.getElementById('formComponents').offsetWidth;
                        if(contentWidth-event.clientX<250){
                            var x=contentWidth-250
                        }else{
                            var  x=event.clientX+30
                        }
                        var params={isShow:true,left:x,top:event.clientY+30,sj:that.theMess}
                        Bus.$emit("dispatchCanvasEvent", canvasEvent.formDiagMess, params);
                        clearInterval(sj)
                    }, 500)
                }
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
