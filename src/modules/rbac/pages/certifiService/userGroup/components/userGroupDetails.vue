<template>
  <div class="user-groups-details">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="用户组详情" back @handleBack="goBack" :rightWidth="5">
      <template v-slot:right>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="item in breadCrumbData"
            :key="item.name"
            :to="{path:item.path}"
          >{{item.name}}
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
          <h3>{{groupData.group_alias}}</h3>
        </div>
        <el-col :span="24" class="details-base-cell">
          <span class="ts-base-label">描述：</span>
          <span class="ts-base-value">{{groupData.remarks ? groupData.remarks : '-'}}</span>
        </el-col>
        <el-col :span="24" class="details-base-cell">
          <span class="ts-base-label">创建时间：</span>
          <span class="ts-base-value">{{groupData.create_time}}</span>
        </el-col>
      </el-col>
    </el-row>

    <div class="ts-content">
      <el-tabs v-model="activeName" @tab-click="handleClick" id="rbac_userGroupDetails_tabChange">
        <el-tab-pane label="角色"
                     v-for="(item,index) in tabPane"
                     :name="item.key"
                     :key="index">
                    <span slot="label">
                        {{item.name}}
                    </span>
          <div class="button-operate">
            <el-button v-if="getAuth(item.key, 'add')" type="primary" size="small" class="ts-add-user" @click="rolesListDrawer(item.key, index)">
              {{item.addName}}
            </el-button>
            <el-button v-if="getAuth(item.key, 'del')" size="small" @click="handleDeleteLists">{{item.deleteName}}</el-button>
          </div>
          <div class="table-container">
            <role-list  :table-info="item.tableInfo.currentTable" :loading="loading" @checkbox-info="setCheckBoxInfo">
              <template slot="operate">
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <el-button :disabled="!getAuth(item.key, 'del')"
                               @click="handleClickDeleteList(scope.$index, scope.row)" type="text"
                               id="rbac_userGroupDetails_remove"
                    >
                      移除
                    </el-button>
                  </template>
                </el-table-column>
              </template>
            </role-list>
          </div>
          <el-drawer
            v-if="item.tableInfo.drawerTable.drawer"
            :visible.sync="item.tableInfo.drawerTable.drawer"
            :title="item.addName"
            :before-close="handleHideDrawer"
            size="50%">
            <role-list
              ref="roleList"
              :table-info="item.tableInfo.drawerTable"
              :current-table="item.tableInfo.currentTable.tableData"
              :drawer-checkec="drawerChecked"
              :tag-key="item.key"
              :loading="loading"
              @checkbox-info="setCheckBoxInfo">
              <template v-slot:search>
                <div class="search-tools" v-if="item.key === 'user'">
                  <div class="groups-serach">
                    <input type="text" placeholder="支持搜索用户组名称/描述" v-model="keywords"/>
                    <span class="icons-search" @click="handleSearch">
                                <i class="el-icon-search"></i>
                    </span>
                  </div>
                </div>
              </template>
              <template v-slot:button>
                <div class="operate-btn-common">
                  <el-button @click="handleHideDrawer" id="rbac_userGroupDetails_cancel">取消</el-button>
                  <el-button type="primary" @click="handelAdd('post', item.key, index)" id="rbac_userGroupDetails_submit">确定</el-button>
                </div>
              </template>
            </role-list>
          </el-drawer>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import roleList from "../../components/role/roleList";
  import * as requestMethod from "@/modules/rbac/api/certifiService/userGroupApi";
  import {tabPane} from '../utils/utils';
  import authId from '../utils/config'
  //引入公共头部组件
  import pageHeader from "@/components/pageHeader.vue"

  export default {
    components: {
      roleList,
      pageHeader
    },
    data() {
      return {
        //面包屑数据
        breadCrumbData: [
          {
            name: " 用户组",
            path: "/certifiservice/usergroup"
          },
          {
            name: "用户组详情",
            path: ""
          }
        ],
        keywords: '',
        activeName: 'role',
        checkBoxInfo: [],
        drawerChecked: [],
        groupData: {},
        inputVisible: true,
        inputValue: '',
        tabPane,
        tableData: [],
        multipleSelection: [],
        loading: false,
        authId,
        logoUrl: require('@/commons/images/g_sys_userGroup.svg'),
      }
    },
    mounted: function () {
      this.getGroupInfo();
      if (this.activeName === 'role') {
        this.getGroupRoleInfo();
      } else if (this.activeName === 'user') {
        this.getUsersList();
      }
    },
    methods: {
      getGroupRoleInfo() {
        const {group_id} = this.$route.query;
        requestMethod.groupRoleInfo('get', {group_id}).then(res => {
          if (res.code === 200) {
            const index = this.getTagIndex();
            this.tabPane[index].tableInfo.currentTable.tableData = res.data.role_lists;
            this.tableData = res.data.role_lists;
            this.getDrawerChecked('role_id', res.data.role_lists);
          }
        })
      },
      getDrawerChecked(type, data) {
        const checkIds = []
        data.forEach(item => {
          checkIds.push(item[type]);
        })
        this.drawerChecked = checkIds;
      },
      saveGroupRoleInfo(type, param) {
        if (type == 'delete') {
          this.$confirm('确认删除选中数据吗?', '提示', {
            type: 'warning'
          })
            .then(() => {
              requestMethod.groupRoleInfo(type, param).then(res => {
                if (res.code === 200) {
                  this.$message.success('移除成功');
                  this.checkBoxInfo = [];
                  this.getGroupRoleInfo();
                }
              })
            })
            .catch(() => {
            })
        } else {
          requestMethod.groupRoleInfo(type, param).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message);
              this.checkBoxInfo = [];
              this.getGroupRoleInfo();
            }
          })
        }
      },
      getGroupRolesList() {
        this.loading = true;
        requestMethod.groupRolesList('get').then(res => {
          if (res.code === 200) {
            const index = this.getTagIndex();
            this.tabPane[index].tableInfo.drawerTable.tableData = res.data.role_lists;
          }
          this.loading = false;
        })
      },
      getGroupInfo() {
        this.loading = true;
        const {group_id} = this.$route.query;
        requestMethod.groupInfo('get', {group_id}).then(res => {
          if (res.code === 200) {
            this.groupData = res.data.group_list;
          }
          this.loading = false;
        })
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      getUsersList() {
        this.checkBoxInfo.length = 0
        const {group_id} = this.$route.query;
        requestMethod.users('get', {group_id}).then(res => {
          if (res.code === 200) {
            const index = this.getTagIndex(this.activeName);
            this.tabPane[index].tableInfo.currentTable.tableData = res.data.items;
          }
        })
      },
      getNcgUsersList() {
        const {group_id} = this.$route.query;
        requestMethod.ncgUsers('get', {group_id}).then(res => {
          if (res.code === 200) {
            const index = this.getTagIndex(this.activeName);
            this.tabPane[index].tableInfo.drawerTable.tableData = res.data.items;
          }
        })
      },
      handleClick(tab, event) {
        if (tab.name === 'role') {
          this.getGroupRoleInfo();
          // this.$refs['roleList'].getTableRow()
        } else if (tab.name === 'user') {
          this.getUsersList();
        }
      },

      handleDeleteLists() {
        if (this.activeName === 'role') {
          if (this.checkBoxInfo.length == 0) {
            this.$message.warning('请勾选需要移除的角色');
            return
          }
          this.saveGroupRole('delete');
        } else if (this.activeName === 'user') {
          if (this.checkBoxInfo.length == 0) {
            this.$message.warning('请勾选需要移除的用户');
            return
          }
          this.saveUser('delete');
        }
      },

      handleClickDeleteList(idx, row) {
        const {group_id} = this.$route.query;
        if (this.activeName === 'role') {
          const data = {role_id: [row.role_id], group_id};
          this.saveGroupRoleInfo('delete', data)
        } else if (this.activeName === 'user') {
          const data = {user_id: [row.user_id], group_id};
          this.saveUserInfo('delete', data)
        }
      },
      setCheckBoxInfo(data) {
        // const roles_id = data.map(res=> ({ 'role_id': res.role_id}));
        const ids = data.map(res => res[`${this.activeName}_id`]);
        this.checkBoxInfo = ids;
      },

      handleInputVisible() {
        this.inputVisible = true;
        this.inputValue = '';
      },
      modifySaveGroupName() {
        const {group_id, remarks} = this.groupData;
        requestMethod.addUserGroup('put', {group_id, group_alias: this.inputValue, remarks}).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message);
            this.inputVisible = true;
            this.groupData.group_alias = this.inputValue;  // 这块数据严格来说应该后端返回
          }
        })
      },
      handelAdd(type, tag) {
        if (tag === 'role') {
          this.saveGroupRole(type);
        } else if (tag === 'user') {
          this.saveUser(type);
        }
        this.setDrawer(false);


      },
      handleHideDrawer() {
        this.setDrawer(false)
        this.checkBoxInfo.length = 0
      },
      saveGroupRole(type) {
        const {group_id} = this.$route.query;
        const data = {role_id: this.checkBoxInfo, group_id, remarks: 'ddd'};
        this.saveGroupRoleInfo(type, data)
      },
      saveUser(type) {
        const {group_id} = this.$route.query;
        const data = {user_id: this.checkBoxInfo, group_id};
        this.saveUserInfo(type, data);

      },
      saveUserInfo(type, param) {
        requestMethod.userGroup(type, param).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message);
            this.getUsersList();
          }
        })
      },

      rolesListDrawer(tag, index) {
        this.activeName = tag;
        if (tag === 'role') {
          this.getGroupRolesList();
        } else if (tag === 'user') {
          this.getNcgUsersList();
        }
        this.setDrawer(true);
      },
      handleSearch() {
        // if(this.activeName === 'user'){
        //     const keyword = JSON.stringify({user_name:this.keywords});
        //     const index = this.getTagIndex();
        //     requestMethod.userGroupList('get',{keyword}).then(res=>{
        //         if(res.code === 200){
        //             this.tabPane[index].tableInfo.drawerTable.tableData = res.data.users;
        //         }
        //     })
        // }

        if (this.activeName === 'user') {
          const index = this.getTagIndex();
          const data = this.tabPane[index].tableInfo.drawerTable.tableData;
          const filterData = data.filter(item => ((item.user_name.indexOf(this.keywords) > -1) || (item.remarks !== null && item.remarks.indexOf(this.keywords) > -1)));
          if (filterData) {
            this.tabPane[index].tableInfo.drawerTable.tableData = filterData;
          }
        }
      },
      getTagIndex() {
        return this.tabPane.findIndex(item => item.key === this.activeName);
      },
      setDrawer(flag) {
        const index = this.getTagIndex();
        this.tabPane[index].tableInfo.drawerTable.drawer = flag;
      },
      goBack() {
        this.$router.push({name: 'userGroup'})

      },
      getAuth(key, tag) {
        if (key === 'role') {
          const flag = tag === 'add' ? 'detail_addrole' : 'detail_delrole';
          return this.$_hasAuth(this.authId[flag].id);
        } else if (key === 'user') {
          const flag = tag === 'add' ? 'detail_adduser' : 'detail_deluser';
          return this.$_hasAuth(this.authId[flag].id);
        }
      },

    }
  }
</script>

<style lang="less" scoped>
  .user-groups-details {
    @detail-overview();
    @custom-table();


    .operate-btn-common {
      @operate-btn-common();
    }

    .drawerTitle {
      display: inline-block;
      padding: 10px 10px;
      font-size: 20px;
      font-weight: 400;
    }

    .search-tools {
      padding: 10px 10px;
      height: 3em;
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      .groups-serach {
        flex-grow: 1;
        height: 32px;
        border: 1px solid #EBEEF5;
        line-height: 32px;
        position: relative;

        .icons-search {
          position: absolute;
          right: 0;
          cursor: pointer;
          text-align: center;
          width: 24px;
        }

        input {
          width: 100%;
          height: 26px;
          line-height: 26px;
          border: none;
          text-indent: 10px;
        }
      }
    }
  }
</style>
