<template>
  <div class="role-details">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="角色详情" back @handleBack="goBack" :rightWidth="5">
      <template v-slot:right>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/certifiservice/rolemanage' }">
            角色管理
          </el-breadcrumb-item>
          <el-breadcrumb-item>角色详情
          </el-breadcrumb-item>
        </el-breadcrumb>
      </template>
    </pageHeader>

    <el-row class="details-base-info">
      <el-col :span="3">
        <div class="ts-avatar">
          <el-avatar :size="64" :src="logoUrl"></el-avatar>
        </div>
      </el-col>

      <el-col :span="21">
        <div class="ts-base-title">
          <h3>
            {{roleData.role_name}}
          </h3>
        </div>
        <el-col :span="24" class="details-base-cell">
          <el-col :span="12">
            <span class="ts-base-label">角色类型：</span>
            <span class="ts-base-value">{{roleData.role_type && roleData.role_type.name}}</span>
          </el-col>
          <el-col :span="12">
            <span class="ts-base-label">角色描述：</span>
            <span class="ts-base-value">{{roleData.remarks ? roleData.remarks : '-'}}</span>
          </el-col>
        </el-col>
        <el-col :span="24" class="details-base-cell">
          <span class="ts-base-label">创建时间：</span>
          <span class="ts-base-value">{{roleData.create_time}}</span>
        </el-col>
      </el-col>
    </el-row>

    <div class="ts-content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          label="角色"
          v-for="(item,index) in tabPane"
          :name="item.key"
          :key="index">
          <span slot="label">{{item.name}}</span>
          <div class="button-operate">
            <el-button
              type="primary"
              size="small"
              class="ts-add-user"
              v-if="getAuth(item.key,'add')"
              @click="showDrawer(item.key, index)"
              id="rbac_roleDetails_addUser"
              icon="el-icon-circle-plus-outline"
            >
              {{item.addName}}
            </el-button>
            <el-button v-if="getAuth(item.key,'del')" size="small" @click="handleDeleteLists" id="rbac_roleDetails_delete">
              {{item.deleteName}}
            </el-button>
          </div>
          <div class="table-container">
            <role-list :table-info="item.tableInfo.currentTable" :loading="loading" @checkbox-info="setCheckBoxInfo">
              <template slot="operate">
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <el-button :disabled="!getAuth(item.key,'del')" @click="handleClickDeleteList(scope.$index, scope.row)" type="text"
                               id="rbac_roleDetails_remove">
                      移除
                    </el-button>
                  </template>
                </el-table-column>
              </template>
            </role-list>
          </div>
          <authConfig
            v-if="item.key=='auth' && item.drawer"
            :drawer="item.drawer"
            :check-list="checkList"
            :role-id="role_id"
            :table-data="tableData"
            @role-menus-list="getRoleAuthMenus"
            @close-dialog="setDrawer"
          >
          </authConfig>
          <el-dialog
            v-if="item.key=='authObject' && item.drawer"
            :title="item.addName"
            :visible.sync="item.drawer">
            <object-dialog
              v-if="item.drawer"
              :role-id="role_id"
              :objects-data="objectsData"
              @set-drawer="setDrawer"
              @object-list="getAuthorizeObjects"
            ></object-dialog>
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import roleList from "./roleList";
  import authDrawer from "./authDrawer";
  import authConfig from "./authConfig";
  import objectDialog from "./objectDialog";
  import * as requestMethod
    from "@/modules/rbac/api/certifiService/roleManageApi";
  import {tabPane} from '../utils/utils';
  import authId from '../utils/config'
  //引入公共头部组件
  import pageHeader
    from "@/components/pageHeader.vue"

  export default {
    components: {
      pageHeader,
      roleList,
      authDrawer,
      objectDialog,
      authConfig
    },
    data() {
      return {
        keywords: '',
        activeName: 'auth',
        tabPane,
        roleData: {},
        checkBoxInfo: [],
        groupData: {},
        // inputVisible: true,
        loading: false,
        inputValue: '',
        role_id: 0,
        objectsData: [],
        checkList: [],
        tableData: [],
        authId,
        logoUrl: require('@/commons/images/g_sys_role.svg'),
      }
    },
    created() {
      this.role_id = this.$route.query.role_id;
    },
    mounted() {
      this.getRoleDetail();
      if (this.activeName === 'auth') {
        this.getRoleAuthMenus();
      } else {
        this.getAuthorizeObjects();
      }
    },
    methods: {
      getRoleDetail() {
        const {role_id} = this.$route.query;
        requestMethod.roleDetail('get', {role_id}).then(res => {
          if (res.code === 200) {
            this.roleData = res.data.data;
          }
        })
      },
      getRoleAuthMenus() {
        const {role_id} = this.$route.query;
        this.loading = true;
        requestMethod.roleMenusList('get', {role_id}).then(res => {
          if (res.code === 200) {
            const index = this.getTagIndex();
            this.tabPane[index].tableInfo.currentTable.tableData = res.data.menus_list;
          } else {
            this.$message.error(res.message);
          }
          this.loading = false;
        })
      },
      getAuthorizeObjects() {
        const {role_id} = this.$route.query;
        this.loading = true;
        requestMethod.authObjectsList('get', {role_id}).then(res => {
          if (res.code === 200) {
            const index = this.getTagIndex();
            this.tabPane[index].tableInfo.currentTable.tableData = res.data.objects;
            this.objectsData = res.data.objects;
          } else {
            this.$message.error(res.message);
          }
          this.loading = false;
        })
      },
      handleClick(tab, event) {
        this.activeName = tab.name;
        if (tab.name === 'auth') {
          this.getRoleAuthMenus();
        } else if (tab.name === 'authObject') {
          this.getAuthorizeObjects();
          // this.getUsersList();
        }
      },
      showDrawer(tag, index) {

        this.activeName = tag;
        // if(tag === 'role'){
        //     this.getGroupRolesList();
        // }else if(tag === 'user'){
        //     this.getNcgUsersList();
        // }
        this.setDrawer(true);
      },
      handleClickDeleteList(idx, row) {
        if (this.activeName === 'auth') {
          const menu_ids = [row.menu_id];
          const info = {
            role_id: this.role_id,
            menu_ids
          };
          this.$confirm('确定解除所选授权？', '提示', {
            type: 'warning'
          })
            .then(() => {
              this.saveRoleAuthMenus('delete', info)
            })
            .catch(() => {
            })
        } else if (this.activeName === 'authObject') {
          const data = [{
            ids: [row.id],
            type: row.type
          }];
          const info = {
            role_id: this.role_id,
            role_info: {objects: data}
          };
          this.$confirm('确定移除当前授权对象？', '提示', {
            type: 'warning'
          })
            .then(() => {
              this.saveRoleObject('delete', info)
            })
            .catch(() => {
            })
        }
      },
      // modifySaveGroupName() {
      //   const {role_id} = this.$route.query;
      //   const {role_name, role_type} = this.roleData;
      //   const param = {role_id, role_info: {role_name, role_type}};
      //   requestMethod.editRole('put', param).then(res => {
      //     if (res.code === 200) {
      //       this.$message.success(res.message);
      //       // this.inputVisible = true;
      //       this.roleData.role_name = this.inputValue;  // 这块数据严格来说应该后端返回
      //     }
      //   })
      // },
      // handleInputVisible() {
      //   this.inputVisible = true;
      //   this.inputValue = '';
      // },
      handleDeleteLists() {
        if (this.getMenuId().length == 0) {
          this.$message.warning('请选择操作项');
          return
        }
        if (this.activeName === 'auth') {
          let menu_ids = this.getMenuId();
          let data = {
            role_id: this.role_id,
            menu_ids: menu_ids
          }
          this.$confirm('确定解除所选授权？', '提示', {
            type: 'warning'
          })
            .then(() => {
              this.saveRoleAuthMenus('delete', data);
            })
            .catch(() => {
            })
        } else if (this.activeName === 'authObject') {
          const data = this.getObjectsData();
          this.$confirm('确定移除当前授权对象？', '提示', {
            type: 'warning'
          })
            .then(() => {
              this.saveRoleObject('delete', {
                role_id: this.role_id,
                role_info: {objects: data}
              });
            })
            .catch(() => {
            })
        }
      },
      getMenuId() {
        const menu_ids = [];
        this.checkBoxInfo.map(item => {
          menu_ids.push(item.id);
        })
        return menu_ids;
      },
      getObjectsData() {
        const userIds = [], groupIds = [];
        if (this.checkBoxInfo.length > 0) {
          const user = this.checkBoxInfo.filter(val => val.type === 'user');
          const group = this.checkBoxInfo.filter(val => val.type === 'group');
          user.forEach(v => {
            userIds.push(v.id)
          })
          group.forEach(v => {
            groupIds.push(v.id)
          })
        }
        return [{
          type: 'user',
          ids: userIds
        }, {
          type: 'group',
          ids: groupIds
        }];
      },
      saveRoleAuthMenus(type, data) {
        requestMethod.deleteRoleMenus(type, data).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message);
            this.getRoleAuthMenus();
          } else {
            this.$message.error(res.message);
          }
        })
      },
      saveRoleObject(type, data) {
        requestMethod.authObjects(type, data).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message);
            if (this.activeName === 'authObject') {
              this.getAuthorizeObjects();
            }
          }
        })
      },
      setCheckBoxInfo(data) {
        let ids = []
        if (this.activeName === 'auth') {
          ids = data.map(res => ({id: res.menu_id}));
        } else {
          ids = data.map(res => ({
            id: res.id,
            type: res.type
          }));
        }
        this.checkBoxInfo = ids;
      },
      getTagIndex() {
        return this.tabPane.findIndex(item => item.key === this.activeName);
      },
      setDrawer(flag) {
        const index = this.getTagIndex();
        this.tabPane[index].drawer = flag;
      },
      closeDialog(res, obj) {
        this.drawer = false;
      },
      getAuth(key, tag) {
        if (key === 'auth') {
          const flag = tag === 'add' ? 'role_detail_addauth' : 'role_detail_delauth';
          return this.$_hasAuth(this.authId[flag].id);
        } else if (key === 'authObject') {
          const flag = tag === 'add' ? 'role_detail_addauthobj' : 'role_detail_delauthobj';
          return this.$_hasAuth(this.authId[flag].id);
        }
      },
      // getRoleMenusList(role_id){
      //     requestMethod.roleMenusList('get',{role_id}).then(res=>{
      //         if(res.code === 200){
      //             this.tableData = res.data.menus_list;
      //             console.log('this.tableData',this.tableData)
      //         }else{
      //             this.$message.error(res.message);
      //         }
      //     })
      // },
      goBack() {
        this.$router.push({name: 'roleManage'})

      }
    }
  }
</script>

<style lang="less" scoped>
  .role-details {
    @detail-overview();
    @custom-table();
    .ts-base-title {
      display: flex;
      justify-content: space-between;
      /deep/.el-button {
        padding: 0;
      }
    }
  }

</style>
