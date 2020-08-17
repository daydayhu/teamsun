<template>
  <div class="certOrgan">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="组织">
      <template v-slot:right>
        <el-button
          @click="addCertOrganDialog({is_top_root: 'root'})"
          type="primary"
          icon="el-icon-circle-plus-outline"
          size="medium"
          :disabled="!$_hasAuth('rbac_front_auth_action_dep_add')"
          id="rbac_certOrgan_addCertOrgan"
        >新建组织
        </el-button>
      </template>
    </pageHeader>

    <div class="ts-middle-part">
      <enumSearch :theItems="'department'" :serviceType="'rbac'" @toSearch="toSearch" @searchContdition="searchContdition"></enumSearch>
    </div>
    <div class="ts-body-part">
      <el-table>
        <el-table-column
          label="名称"
        >
        </el-table-column>
        <el-table-column
          label="组织管理员"
        >
        </el-table-column>
        <el-table-column
          label="描述"
        >
        </el-table-column>
        <el-table-column
          label="用户数">
        </el-table-column>
        <el-table-column
          label="操作"
        >
        </el-table-column>
      </el-table>
      <el-tree
        :data="sortData"
        node-key="dep_id"
        :expand-on-click-node="false"
        :indent="16"
        v-loading="loading"
        @node-expand="nodeExpand"
      >
          <span class="custom-tree-node" slot-scope="{ node, data }" style="width:calc(100% - 25px);cursor:default;">
            <span
              @click="$_hasAuth('rbac_front_auth_action_dep_detail') ? showCertOrganDetails(data) : ''"
              class="ts-organization-level ts-organ-coll treePar"

              :level="`${data.dep_level}`"

              id="rbac_certOrgan_details"
            >
              <!-- <svg-icon icon-class='organ_icon' class='iconCss'></svg-icon> -->
               <el-tooltip class="item" effect="dark" :content="data.dep_name" placement="bottom-start">
                 <span
                :class="$_hasAuth('rbac_front_auth_action_dep_detail') ? 'showLink' : 'showDefaultLink'"
              >{{ data.dep_name }}</span>
              </el-tooltip>
            </span>
            <span class="ts-organ-coll">
<!--                  <svg-icon icon-class='ts-manager' class='iconCss' v-if="data.is_root == 1"></svg-icon> -->
                {{ data.is_root == 1 && data.user_name ? data.alias_name : '-' }}
                </span>
            <span class="ts-organ-coll treePar" :title='data.remarks'>
              {{ data.remarks ? data.remarks : '-' }}
            </span>
            <span class="ts-organ-coll">
               <!--  <svg-icon icon-class='ts-people-num' class='iconCss'></svg-icon> -->
                {{ data.user_count }}
            </span>
            <span class="ts-organ-coll">
                <el-button @click="addCertOrganDialog(data)" type="text" size="small" :disabled="!$_hasAuth('rbac_front_auth_action_dep_add')"
                >添加部门</el-button>
              <el-dropdown
                trigger="click"
                placement="bottom-start"
                @command="handleCommand"
              >
                <el-button type="text" size="small">更多</el-button>
                <el-dropdown-menu slot="dropdown" class="ts-dropdown">
                  <el-dropdown-item :command="beforeHandleCommand(data,'edit',node)"
                                    :disabled="!$_hasAuth('rbac_front_auth_action_dep_edit')"
                                    id="rbac_certOrgan_editBtn"
                  >编辑</el-dropdown-item>
                  <el-dropdown-item :command="beforeHandleCommand(data,'delete',node)"
                                    :disabled="!$_hasAuth('rbac_front_auth_action_del')"
                                    id="rbac_certOrgan_deleteBtn"
                  >删除</el-dropdown-item>
                </el-dropdown-menu>
                </el-dropdown>
            </span>
          </span>
      </el-tree>
    </div>
    <add-cert-organ v-if="organDialogObj.show" :isShow="organDialogObj.show" :organDialogObj="organDialogObj" @initMsg="getDataList" @closeDialog="closeDialog">
    </add-cert-organ>
  </div>
</template>
<style src="./index.less" lang="less" scoped></style>
