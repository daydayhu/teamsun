<template>
  <div class="app-content">
     <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="LDAP注册">
      <template v-slot:right>
        <el-button
          v-if="$_hasAuth(authId.add.id)"
          icon="el-icon-circle-plus-outline"
          @click="add"
          type="primary"
          size="medium"
          :disabled="false"
        >新建LDAP认证</el-button>
      </template>
    </pageHeader>
    <div class="ts-body-part">
      <el-table
        ref="refTable"
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        :row-key="getRowKeys">
        <el-table-column v-for="(item,index) in tableHeader"
                         :key="index"
                         :prop="item.key"
                         :label="item.label">
          <template slot-scope="scope">
            <span>{{
                   (function() { let arr = item.key.split('.')
                            let val = scope.row;
                            arr.forEach(value => {
                            val = val[value]
                        })
                        return val
                    })()
              }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button  @click="userImport(scope.row)" v-if="$_hasAuth(authId.import.id)" type="text">用户导入</el-button>
            <el-dropdown
              trigger="click"
              placement="bottom-start"
              @command="handleCommand">
              <el-button type="text" size="small">更多</el-button>
              <el-dropdown-menu
                slot="dropdown">
                <el-dropdown-item v-if="$_hasAuth(authId.edit.id)" :command="beforeHandleCommand(scope.row,'edit')">编辑</el-dropdown-item>
                <el-dropdown-item v-if="$_hasAuth(authId.delete.id)" :command="beforeHandleCommand(scope.row,'del')">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :paginationData="pagination"
                  @handleSizeChange="handleSizeChange"
                  @handleCurrentChange="handleCurrentChange"></Pagination>
    </div>
    <registerForm
      v-if="isShow"
      :ldap_id="ldap_id"
      @get-ldap-list="getLdapList"
      @close-dialog="closeDialog">
    </registerForm>
    <el-drawer v-if="userDrawer"
               :visible.sync="userDrawer"
               title="用户导入"
               size="50%">
        <list ref="listTable" :table-info="userTableData" :loading="userLoading" @checkbox-info="setCheckBoxInfo">
        <template v-slot:search>
          <div class="search">
              <el-input type="text" placeholder="支持搜索用户名称" v-model="keywords" @keyup.enter.native="handleSearch">
                <div slot="suffix" class="icons">
                      <i class='el-input__icon el-icon-error' @click='clearInput'></i>
                      <i class='el-input__icon el-icon-search' @click='handleSearch'></i>
                </div>
              </el-input>
              <!-- <div class="icons-search">
                <span @click='clearInput'><i class='el-icon-error'></i></span>
                <span  @click="handleSearch"><i class="el-icon-search"></i></span>
              </div> -->
          </div>
        </template>
        <template v-slot:button>
          <div class="drawer_footer">
              <el-button @click="userDrawer = false">取 消</el-button>
              <el-button type="primary" @click="handelOk()" >
                确定
              </el-button>
            </div>
        </template>
      </list>
    </el-drawer>
  </div>
</template>
<style src="./index.less" lang="less" scoped></style>

