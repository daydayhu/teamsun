<template>
    <div class="theContent clearFloat" v-if="item" :class="[isTitle==true ? 'hasTitleWidth': 'noTitleWidth']">
        <div class="thetit" v-if="isTitle">
            {{item.pro_para_name}}<span v-if="item.is_required===1">*</span>
        </div>
        <div class='inbox'>
            <el-input-number :disabled="!(isEdit.indexOf(phaseState)>-1)" v-model="item.value" @change="changgevalue(item)"></el-input-number>
            <span class="theError" v-if="msg!=''">{{msg}}</span>
        </div>
    </div>
</template>
<script>
import {checkFiled} from '../productForms/checkForm.js'
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
            }
        },
        data(){
            return{
                msg:''
            }
        },
        methods:{
            changgevalue(val){
                this.msg=checkFiled(val);
                this.$emit('changeForms', {
                    index: this.ActionSetFromIndex,
                    value: val.value,
                    key_uuid:val.key_uuid,
                    ref_key_uuid:val.ref_key_uuid,
                    isUpload:false
                })
            }
        }
    }
</script>
<style src="./common.less" lang="less" scoped></style>
<style lang="less" scoped>
.theContent{
     line-height: 60px;
     
}
</style>