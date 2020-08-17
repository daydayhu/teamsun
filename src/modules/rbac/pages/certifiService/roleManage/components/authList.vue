<template>
    <div class="table-container">
      <el-table
        :data="tableData"
      >
        <el-table-column
          v-for="(item,index) in tableHeader"  :key="index"
          :prop="item.key"
          :label="item.label"
        >
          <template slot-scope="scope">
            <span v-if="item.key === 'previous_server'" @click="clickUserGroupsName(scope.row)" type="text" size="small" id="rbac_authList_details">{{ scope.row[item.key].name }}</span>
            <span v-else>{{ scope.row[item.key]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClickDelete(scope.$index, scope.row)" type="text" id="rbac_authList_delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>
<script>
    import * as requestMethod from "@/modules/rbac/api/certifiService/roleManageApi";

    export default {
        props:{
            roleId:{},
            tableData:{
                type:Array
            },
            loading:{
                type:Boolean
            }

        },
        data() {
            return {
                // loading: true,
                tableHeader:[{
                    label:'操作',
                    key:'previous_menu',
                    width:'120'
                },{
                    label:'所属菜单',
                    key:'menu_name',
                    width:'120'
                },{
                    label:'所属服务',
                    key:'previous_server',
                }],
                // tableData:[],
                role_id: null,
            }
        },
        components: {
            // addCertOrgan,
            // searchSection,
        },
        created(){
          this.getRoleId();
          this.$emit('role-menus-list',this.role_id);
        },
        methods: {
            getRoleId() {
              this.role_id = this.roleId ? this.roleId : this.$route.query.role_id
            },
            handleClickDelete(index, data){
                const menu_ids = [data.menu_id];
                requestMethod.deleteRoleMenus('delete',{role_id:this.role_id,menu_ids}).then(res=>{
                    if(res.code === 200){
                        this.$message.success(res.message);
                        this.$emit('role-menus-list',this.role_id);
                    }else{
                        this.$message.error(res.message);
                    }
                })
            }
        },

    }
</script>
<style lang="less" scoped>
  .table-container{
    width: 100%;
  }
</style>
