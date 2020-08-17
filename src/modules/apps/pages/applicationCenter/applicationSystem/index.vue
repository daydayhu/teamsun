<template>
  <div class="applicationSystem">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="应用系统">
      <template v-slot:right>
        <el-button
          icon="el-icon-circle-plus-outline"
          @click="addSystem"
          type="primary"
          size="medium"
          :disabled="false"
        >新建应用系统</el-button>
      </template>
    </pageHeader>

    <!-- <el-alert
			title=""
			type="ts-description"
			description="可支持用户管理。可以支持用户的创建、删除、修改、查询、禁用、重置密码等操作，并且可以限定每个用户可以操作的资源范围；用户忘记密码后，可以通过管理平台通过用户的邮箱或者手机来找回密码。">
    </el-alert>-->

    <div class="ts-middle-part">
      <el-dropdown trigger="click" @command="handleCommandBatch" class="operate-dropdown">
        <el-button type="default">
          批量操作<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="batchBind" :disabled="!$_hasAuth('frontend_app_center_tags_batch_bind')">绑定标签</el-dropdown-item>
          <el-dropdown-item command="batchUnBind" :disabled="!$_hasAuth('frontend_app_center_tags_batch_unbind')">移除标签</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <tagInList
        @searchContdition="searchContdition"
        :theTagObj="theTagObj"
      ></tagInList>
      <enumSearch :theItems="'apps'"  @toSearch="toSearch" @searchContdition="searchContdition('list')"  :theUrl="'/v1/api/app/search_items'"></enumSearch>
    </div>
    <tagInResult @searchContdition="searchContdition"></tagInResult>
    <div class="ts-body-part">
      <el-table :data="appMemberList" ref="multipleTable" v-loading="loading" style="width: 100%;overflow:auto" v-infinite-scroll="true" empty-text=" "
                @selection-change="handleSelectionChange"
      >
        <template slot="empty">
          <empty-in-table v-if="appMemberList.length<1&&!loading"></empty-in-table>
        </template>
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="alias_name" label="名称" >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.app_name" placement="bottom-start">
              <el-button
                type="text"
                size="small"
                @click="showDetails(scope.row, 'list')"
              >{{ scope.row.app_name }}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="应用架构图">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="showDetails(scope.row, 'frame')"
            >查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="部署视图">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="showDetails(scope.row, 'view')"
            > 查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="业务组" prop="bus_name"></el-table-column>
        <el-table-column label="应用类型" prop="app_base_type"></el-table-column>
        <el-table-column label="所属环境" prop="app_base_env"></el-table-column>
        <el-table-column label="所属组织" prop="org_name"></el-table-column>
        <el-table-column label="标签" prop="tags" show-tooltip-when-overflow>
          <template slot-scope="scope">
            <span
              v-for="item in scope.row.tags"
              :key="item.instance_id"
              style="white-space: nowrap"
            >
              键：{{item.tag_key}} 值：{{item.tag_value}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="host_status" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="showDetails(scope.row, 'list')"
              type="text"
              size="small"
              :disabled="false"
            >订单</el-button>
            <el-dropdown
              trigger="click"
              placement="bottom-start"
              @command="handleCommand"
            >
              <el-button type="text" size="small" id="rbac_user_moreBtn1">更多</el-button>
              <el-dropdown-menu slot="dropdown" class="ts-dropdown">
                <el-dropdown-item :command="beforeHandleCommand(scope.row,'delete')" id="app1"
                                  :disabled="!$_hasAuth('frontend_app_center_system_del')"
                >
                  删除
                </el-dropdown-item>
                <el-dropdown-item :command="beforeHandleCommand(scope.row,'addTags')" id="app2"
                                  :disabled="!$_hasAuth('frontend_app_center_tags_bind')"
                >
                  添加标签
                </el-dropdown-item>
                <el-dropdown-item :command="beforeHandleCommand(scope.row,'removeTags')" id="app3"
                                  :disabled="!$_hasAuth('frontend_app_center_tags_unbind')"
                >
                  移除标签
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :paginationData="pagination"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination>
      <!-- <empty-in-table v-if="appMemberList.length==0&&!loading"></empty-in-table> -->
      <!--    标签   -->
      <tag-in-multiple
        v-if="tagMultipleObj.show"
        :isShow="tagMultipleObj.show"
        @closeDialog="closeDialog"
        @loadList="loadList"
        :appId="tagMultipleObj.app_id"
        :tagList="tagMultipleObj.tagList"
        :multipleSelection="tagMultipleObj.multipleSelection"
      ></tag-in-multiple>
      <tag-in-details
        v-if="tagAddObj.show"
        :isShow="tagAddObj.show"
        @closeDialog="closeDialog"
        @loadList="loadList"
        :appId="tagAddObj.app_id"
        :tagList="tagAddObj.tagList"
      ></tag-in-details>
      <tag-in-delete
        v-if="tagRemoveObj.show"
        :isShow="tagRemoveObj.show"
        @closeDialog="closeDialog"
        @loadList="loadList"
        :appId="tagRemoveObj.app_id"
        :tagList="tagRemoveObj.tagList"
      >
      </tag-in-delete>
    </div>
  </div>
</template>
<style src="./index.less" lang="less" scoped></style>
