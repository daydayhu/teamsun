<template>
    <div class="theContent clearFloat" v-if="item" :class="[isTitle==true ? 'hasTitleWidth': 'noTitleWidth']">
        <div class="thetit" v-if="isTitle" >
            {{item.pro_para_name}}<span v-if="item.is_required===1">*</span>
        </div>
        <div class='inbox' v-if='item.source_type!=2'>
          <el-checkbox 
            :indeterminate="isIndeterminate" 
            v-model="checkAll" 
            @change="handleCheckAllChange"
            :disabled="!(isEdit.indexOf(phaseState)>-1)"
          >全选</el-checkbox>
          <!-- <div style="height:20px;"></div> -->
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox 
              v-for="city in cities" 
              :label="city" 
              :key="city"
              :disabled="!(isEdit.indexOf(phaseState)>-1)"
            >{{city}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class='inbox' v-if='item.source_type==2'>
          <el-checkbox 
            :indeterminate="isIndeterminate" 
            v-model="checkAll" 
            @change="handleCheckAllChange"
            :disabled="!(isEdit.indexOf(phaseState)>-1)"
          >全选</el-checkbox>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox 
              v-for="city in sourceList" 
              :label="city.key" 
              :key="city.key"
              :disabled="!(isEdit.indexOf(phaseState)>-1)"
            >{{city.value}}</el-checkbox>
          </el-checkbox-group>
        </div>
    </div>
</template>
<script>
import * as requestMethod from '@/modules/apps/api/serviceCatalog/openstack/actionSet.js'
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
        mounted() {   
          this.checkedCities=this.item.value.split(',');
          this.cities=this.item.pro_source_json.concat();
          if(this.item.source_type==2){
            this.requireSourceData();
          }
        },
        data() {
            return {
              checkAll: false,
              checkedCities: [],
              cities: [],
              isIndeterminate: true,
              sourceList:[]
            }
        },
        watch:{
          
        },
        methods:{
          handleCheckAllChange(val) {
            this.checkedCities = val ? this.item.pro_source_json.concat() : [];
            this.isIndeterminate = false;
            this.changgevalue(this.checkedCities)
          },
          handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
            this.changgevalue(this.checkedCities)
          },
          changgevalue(val){
              this.item.value=val.join(',')
                this.$emit('changeForms', {
                    index: this.ActionSetFromIndex,
                    value: val,
                    key_uuid:val.key_uuid,
                    ref_key_uuid:val.ref_key_uuid,
                    isUpload:false
                })
            },
            requireSourceData(){
                var params = {
                    service_type: 'oc',
                    item: this.item.pro_source_json[0],
                };
                requestMethod.enumSearech('get', params, `/v1/api/oc/search_items`).then(res => {
                    if (res.code === 200) {
                        this.sourceList = res.data.items;
                    } else {
                        this.$message.warning(`${res.message}`)
                    }
                });
            }
        },
    }
</script>
<style src="./common.less" lang="less" scoped></style>
<style lang="less" scoped>
</style>