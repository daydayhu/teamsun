<template>
  <div class="paramView">
    <el-collapse style="padding:15px 20px;" v-model="activeNames">
      <el-collapse-item v-for="(item,index) in dataInfo" :key="index" :name="item.key">
        <template slot="title">
          <div class="param-title">
            <h3>{{item.reportName}}</h3>
          </div>
        </template>
        <div>
          <!----------------返回参数是数组形式---------------->
          <el-row v-for="(value, key) in item.data" :key="key" v-if="Object.prototype.toString.call(item.data)== '[object Array]'">
            <div class="param-title-second">
              <h3>{{value.reportName}}</h3>
            </div>
            <!----------------自定义表单---------------->
            <div v-if="value.key === 'product'" class="param-info">
              <div v-for="(tableValue, tableKey) in value.data.tables" :key="tableKey">
                <div style="margin-left: 40px">
                  {{tableValue.table_name}}
                </div>
                <div v-for="(paraInfo, paraInfoKey) in tableValue.para_infos" :key="paraInfoKey" style="margin-left: 60px">
                  <p class="info-l"><span class="info-l-left">{{paraInfo.pro_para_name}}:</span><span>{{paraInfo.value}}</span></p>
                </div>
              </div>
            </div>
            <div v-else class="param-info">
              <!----------------特殊处理vmware表单---------------->
              <div v-if="value.key=== 'vmware'" >
                <div v-for="(r, s, t) in value.data" :key="t" >
                  <span style="margin-left:40px">{{getTitle(s, value.key)}}</span>
                  <div v-for="(u, v, w) in r " :key="w"  v-if="Object.prototype.toString.call(r)== '[object Object]'" class="param-title-third">
                    <p class="info-l" v-if="getValueTitle(v,s,value.key) !== null">
                      <span class="info-l-left">{{getValueTitle(v,s,value.key)}}:</span><span>{{u}}</span>
                    </p>
                  </div>
                  <div v-for="(vmValue, vmKey) in r " :key="vmKey" v-if="Object.prototype.toString.call(r)== '[object Array]'" style="margin-left:40px;padding-bottom: 30px;">
                    <!--                  <p  v-for="(x, y, z) in vmValue" style="margin-left:40px" v-if="getValueTitle(y, s, value.key) !== null">{{getValueTitle(y,s,value.key)}}:{{x}}</p>-->
                    <list v-if="vmValue.volume.length > 0" :table-info="{tableHeader: vmware[1].tableHeader,tableData:vmValue.volume}"></list>
                  </div>
                </div>
              </div>
              <div v-else-if="value.key === 'theVgLv'">
                <div v-for="(list, listKey, listTag) in value.data" :key="listTag" style="padding-bottom: 20px;">
                  <list :table-info="{tableHeader: getVgUser(value.key, listKey),tableData:list}"></list>
                </div>
              </div>
              <div v-else >
                <div v-if="getParamType(value.key) > -1" style="margin-left: 40px">
                  <p style="margin-left: 60px" v-for="(r, s, t) in value.data" :key="t" v-if="getParamTypeTitle(s,value.key) !== null" class="info-l">
                    <span>{{getParamTypeTitle(s,value.key).name}}:</span>
                    <span v-if="getParamTypeTitle(s,value.key).key == 'cidr_list'">
                      <span v-for="i in r" :key="i.cidr">{{i.cidr}}</span>
                    </span>
                    <span v-else>{{r}}</span>
                  </p>
                </div>
                <div v-else-if="getParamTableType(value.key) >-1" style="margin-left: 40px">
                  <list :table-info="{tableHeader: getTableHeaderType(value.key),tableData:value.data}"></list>
                </div>
              </div>
            </div>
          </el-row>
        </div>

      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
    //引入API
    //import * as requestMethod from "../../../../../api/applicationCenter/applicationSystem"
    import {paramKey,displayType,tableHeader,vmware,theVgLv,userGroup,network,networkPolicy,fourA,backUp,theLog,theMonitoring} from "../utils/config";
    import list from "./list";

    export default {
        name: "paramView",
        components: {
            list
        },
        props:{
            dataInfo:{
                type:Array,
                default(){
                    return [];
                }
            }
        },
        data() {
            return {
                paramKey,
                displayType,
                tableInfo:{
                    tableHeader,
                    tableData:[]
                },
                vmware,
                theVgLv,
                userGroup,
                network,
                fourA,
                networkPolicy,
                theMonitoring,
                backUp,
                theLog,
                paramType:['network'], //自定义表单类型 展示类型是基本信息类型的
                paramTableType:['networkPolicy','fourA','backUp','theLog', 'theMonitoring'],
                activeNames:[]
            };
        },
        watch:{
            dataInfo:{
                handler(newVal,oldVal){
                    if(newVal.length > 0){
                        this.getActiveNames(newVal);
                    }
                },
                deep: true,
                immediate: true
            }
        },
        mounted() {
        },
        methods: {
            getDisplayType(key, tag){
                return  displayType.find(item=>(item.key === key && item.type === tag)) ? true : false;
            },
            getTitle(s, key){
                let res = this.filterTitle(s, key);
                return res ? res.name : null
            },
            /**
             * v: 是每个表单的里的参数值
             * key:是表单标志  eg vmware、 networkPolicy、theMonitoring
             */
            getValueTitle(v,s, key){
                const res = this.filterData(v,s,key);
                return  res ? res.name : null;
            },
            getValueThird(k, r, s, x, y){
                const res = this.filterData(k, r, s);
                let info = null;
                if(res && res.content.length>0){
                    info = res.content.find(item => item.key === y);
                }
                return info ? info.name : '';
            },
            /**
             * 获取内置表单的tableHeader
             */
            getTableHeader(s,key){
                const res = this.filterTitle(s, key);
                return res ? res : [];
            },
            /**
             *
             * @param s
             * @param key
             */
            filterTitle(s,key){
                let res = null;
                if(this[key]){
                    res = this[key].find(item=>item.key === s);
                }
                return res;
            },
            filterData(v,s,key){
                let r = null;
                const title = this.filterTitle(s,key);
                if(title && title.content.length > 0){
                    r = title.content.find(m=>m.key === v);
                }

                return r;
            },

            /**
             * 处理自定以表单table表格头数据
             */
            getProductTableHeader(data){
                let tableHeader = [];
                if(data.length > 0){
                    tableHeader = data[0].para_infos.map((item)=> ({key:item.pro_para_name, lable:item.pro_para_name}));
                }
                return tableHeader
            },
            /**
             * 处理自定以表单table表格data数据
             */
            getProductTableData(data){
                let tableData = [];
                if(data.length > 0){
                    tableData = data[0].para_infos.map((item)=> ({key:item.pro_para_name, lable:item.pro_para_name}));
                }
                return tableData
            },
            getParamType(key){
                const index = this.paramType.findIndex(item=>item === key);
                return index


            },
            getParamTableType(key){
                const index = this.paramTableType.findIndex(item=>item === key);
                return index
            },
            getParamTypeTitle(key,paramType){
                const  res = this[paramType].find(item=>item.key === key);
                return res ? res : null;
            },
            getTableHeaderType(key){
                return this[key] ? this[key] : [];
            },
            getActiveNames(data){
                let arr = []
                data.forEach(item=>{
                    arr.push(item.key);
                });
                this.activeNames = arr;
            },
            /**
             * 获取theVgLv,userGroup的数据
             */
            getVgUser(key,listKey){
               return this[key][listKey].tableHeader;
            }

        }
    };
</script>

<style lang="less" scoped>
  .paramView {
    position: relative;
    /deep/ .el-collapse-item__arrow {
      position: absolute;
      left: -10px;
    }

    .info-l{
      line-height: 2;
      .info-l-left{
        padding-right:3px;
      }
    }
    .param-info{
      padding-bottom: 20px;
    }
    .param-title-second{
      padding-left:20px;
      margin-bottom: 10px;
    }
    .param-title-third{
      padding-left: 40px;
    }
    .param-title-third{
      margin-left:30px;
    }
    .info-content{
      line-height: 2;
    }
  }
</style>
