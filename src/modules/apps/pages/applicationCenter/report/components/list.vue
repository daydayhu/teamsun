<template>
  <div class="app-overview">
    <div class="ts-content-wrap">
      <slot name="search"></slot>
      <!--      <deliverPlan :canvas-text="tableInfo.canvas_text"></deliverPlan>-->
      <div class="table-container">
        <el-table
          ref="multipleTable"
          :data="tableInfo.tableData"
          tooltip-effect="dark"
          style="width: 100%"
          v-loading="loading"
          :border="true"
          @select="handleSelectionChange"
          @select-all="handleSelectionChange">
          <el-table-column
            v-for="(item,index) in tableInfo.tableHeader"
            :key="index"
            :prop="item.key"
            :label="item.label"
            :width="item.width">
            <template slot-scope="scope">
              <span>{{getTable(item,scope)}}</span>
            </template>
          </el-table-column>
          <slot name="operate"></slot>
        </el-table>
        <slot name="button"></slot>
      </div>
    </div>
  </div>
</template>

<script>
    import deliverPlan from "./deliverPlan";
    export default {
        props: {
            tableInfo: {},
            currentTable: {
                type: Array,
                default() {
                    return []
                }

            },
            tagKey: {},
            isMultiple: {
                type: Boolean,
                default: true
            },
            loading: {
                type: Boolean
            },
            drawerChecked: {
                type: Array
            }
        },
        components:{
            deliverPlan
        },
        data() {
            return {
                multipleSelection: [2],
                maxHeight: '300px'
            }
        },
        mounted: function () {
        },
        destroyed() {
            // window.onresize = null;
        },
        methods: {
            showUserDetails(data) {
                let res = JSON.stringify({user_id: data.user_id})
                this.$router.push({
                    name: 'userDetails',
                    query: {res}
                })
            },
            clickRoleName(data) {
                const {role_id} = data;
                this.$router.push({
                    name: 'roleDetails',
                    query: {role_id}
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.$emit('checkbox-info', val);
            },
            getTable(item,scope){
                let arr = item.key.split('.')
                let val = JSON.parse(JSON.stringify(scope.row));
                arr.forEach(value => {
                    if(val[value]){
                        val = val[value]
                    } else {
                        val = ''
                    }
                })
                return val
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
