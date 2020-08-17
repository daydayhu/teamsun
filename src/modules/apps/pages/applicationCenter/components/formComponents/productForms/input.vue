<template>
    <div class="theContent clearFloat" v-if="item" :class="[isTitle==true ? 'hasTitleWidth': 'noTitleWidth']">
        <div class="thetit" v-if="isTitle">
            {{item.pro_para_name}}<span v-if="item.is_required===1">*</span>
        </div>
        <div class='inbox'>
            <el-input  :disabled="!(isEdit.indexOf(phaseState)>-1)" :class="[msg!='' ? 'theinput' : '']" placeholder="请输入内容" v-model="item.value" @change='changgevalue(item)' />
            <span class="theError" v-if="msg!=''">{{msg}}</span>
        </div>
        <referenceInfoTag :theMess='item.value' v-if="item.source_type==2" :setKeyId='item.set_key_id' :theIndex='theIndex' :tabIndex='tabIndex' :paraIndex1='paraIndex1' :paraIndex='paraIndex'></referenceInfoTag>
        <!-- <infoTag :theMess='item.value' v-if="this.$route.name!='formDetail'"></infoTag> -->
    </div>
</template>
<script>
import {checkFiled} from '../productForms/checkForm.js'
import referenceInfoTag from "../compontents/referenceInfoTag"
/* import infoTag from "../compontents/infoTag" */
    export default {
        props:{
            item: {
                type: Object
            },
            serial: {
                type: Number
            },
            isTitle:{
                type:Boolean,
                default: true
            },
            phaseState:{
                type:String
            },
            isEdit:{
                type:String
            },
            ActionSetFromIndex:{
                type:Number
            },
            theIndex:{
                type:Number
            },
            tabIndex:{
                type:Number
            },
            paraIndex:{
                type:Number
            },
            paraIndex1:{
                type:Number
            }
        },
        mounted(){
        },
        components: {
            /* infoTag */
            referenceInfoTag
        },
        data(){
            return{
                msg:'',
            }
        },
        methods:{
            changgevalue(val){
                this.msg=checkFiled(val);
                if(this.msg==''){
                    this.$emit('changeForms', {
                        index: this.ActionSetFromIndex,
                        value: val.value,
                         key_uuid:val.key_uuid,
                        ref_key_uuid:val.ref_key_uuid,
                        isUpload:false
                    })
                }
            },
            forParent(val){
                this.msg=checkFiled(val);
            }
        }
    }
</script>
<style src="./common.less" lang="less" scoped></style>
<style lang="less" scoped>
.theContent{
     line-height: 60px;
    .theinput /deep/ .el-input__inner{
         border:1px solid red
     }
}
</style>