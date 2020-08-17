<template>
    <div class="theContent clearFloat" v-if="item" :class="[isTitle==true ? 'hasTitleWidth': 'noTitleWidth']">
        <div class="thetit" v-if="isTitle">
            {{item.pro_para_name}}<span v-if="item.is_required===1">*</span>
        </div>
        <div class='inbox'>
             <el-select
                v-model="item.value" 
                placeholder="请选择类型" 
                :disabled="!(isEdit.indexOf(phaseState)>-1)"
                v-if='item.source_type!=2'
                @change='changgevalue()'
               >
                <el-option
                    v-for="(list,index) in item.pro_source_json"
                    :key="index"
                    :label="list"
                    :value="list">
                </el-option>
            </el-select>
        </div>
        <referenceInfoTag :theMess='item.value' v-if="item.source_type==2" :setKeyId='item.set_key_id' :theIndex='theIndex' :tabIndex='tabIndex' :paraIndex1='paraIndex1' :paraIndex='paraIndex'></referenceInfoTag>
    </div>
</template>
<script>
    import referenceInfoTag from "../compontents/referenceInfoTag"
    export default {
        data(){
            return{
            }
        },
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
        methods:{
            changgevalue(val){
                this.$emit('changeForms', {
                    index: this.ActionSetFromIndex,
                    value: this.item.value,
                    key_uuid:val.key_uuid,
                    ref_key_uuid:val.ref_key_uuid,
                    isUpload:false
                })
            },
            
        },
        components: {
            referenceInfoTag
        },
        mounted(){
            
        }
    }
</script>
<style src="./common.less" lang="less" scoped></style>
<style lang="less" scoped>
.theContent{
     line-height: 60px;
}
</style>