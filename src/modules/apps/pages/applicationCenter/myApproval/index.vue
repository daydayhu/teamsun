<template>
    <div class="myDone">
        <!-- ------------------------引入头部公共组件 --------------------->
        <pageHeader title="我的审批"></pageHeader>
        <!-- <el-alert
          title=""
          type="ts-description"
          description="可支持用户管理。可以支持用户的创建、删除、修改、查询、禁用、重置密码等操作，并且可以限定每个用户可以操作的资源范围；用户忘记密码后，可以通过管理平台通过用户的邮箱或者手机来找回密码。">
        </el-alert>-->
        <div class="ts-middle-part">
            <enumSearch
                :theItems="'approve'"
                :theUrl="'/v1/api/app/search_items'"
                @toSearch="toSearch"
                @searchContdition="searchContdition"
                :defaultSearch="defaultSearch">
            </enumSearch>
        </div>
            <div class="ts-body-part">
                <el-table
                    :data="approvalList"
                    v-loading="approvalLoading"
                    style="width: 100%">
                    <template slot="empty">
                      <empty-in-table></empty-in-table>
                    </template>
                    <el-table-column
                        prop="flow_sn"
                        label="审批编号"
                        class="ts-column-blue">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                @click="goDetail(scope.row)">
                                {{scope.row.flow_sn}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="审批主题"
                        prop="title">
                    </el-table-column>
                    <el-table-column label="报告">
                        <template slot-scope="scope">
                            <el-button type="text" @click="checkReport(scope.row)">查看报告</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="状态"
                        prop="approval_status">
                        <template slot-scope="scope">
                            <el-popover
                                width="540"
                                trigger="hover"
                                :close-delay="200"
                                placement="right-end">
                                <approvalHistory
                                    :instance_id="scope.row.instance_id"
                                ></approvalHistory>
                                <span slot="reference"><div class="statusClass"></div>{{scope.row.approval_status.value}}</span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="申请者"
                        prop="create_user_name">
                    </el-table-column>
                    <el-table-column
                        label="申请日期"
                        prop="create_time">
                        <template slot-scope="scope">
                            {{scope.row.create_time[0]}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="审批结果"
                        prop="result">
                        <template slot-scope="scope">
                            {{scope.row.approval_comment.value}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                v-if="scope.row.approval_status.key !== 2"
                                @click="onVerify(scope.row)"
                                type="text"
                                size="small"
                                :disabled="false"
                                style="padding-right: 16px">
                                审批
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination
                    :paginationData="pagination"
                    @handleCurrentChange="handleCurrentChange"
                    @handleSizeChange="handleSizeChange">
                </pagination>
            </div>

        <approvalDialog
            :dialogTableVisible="dialogTableVisible"
            :instance_id="instance_id"
            :ticket_id="ticket_id"
            @approveCancel="approveCancel"
            @updateData="searchContdition"
            :from="'approve'">
        </approvalDialog>

        <checkReport
          :defaultConfig="defaultConfig"
          @handleClose="handleClose">
        </checkReport>
    </div>
</template>
<style src="./index.less" lang="less" scoped></style>
