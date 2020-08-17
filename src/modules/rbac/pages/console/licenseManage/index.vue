<template>
    <div class="app-overview">
      <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="许可证管理"></pageHeader>
    <div class="ts-body-part">
        <div class="table-container">
          <div class="row-header">
                <strong style="font-size: 20px">基本信息</strong>
                <el-button
                    style="float: right;"
                    type="text"
                    @click="updateLicense">
                    更新许可证
                </el-button>
            </div>
            <el-row>
                <el-col>
                    <span class="col-height">许可类型</span>
                </el-col>
                <el-col>
                    <span class="col-height">{{type}}</span>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <div class="row-header">
                <strong style="font-size: 20px">有效期</strong>
            </div>
            <el-row>
                <el-col :span="12">
                    <span class="col-height">签发日期</span>
                </el-col>
                <el-col :span="12">
                    <span class="col-height">到期日期</span>
                </el-col>
                <el-col :span="12">
                    <span class="col-height">{{produce_time}}</span>
                </el-col>
                <el-col :span="12">
                    <span class="col-height">{{expire_time}}</span>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <div class="row-header">
                <strong style="font-size: 20px">许可范围</strong>
            </div>
            <el-row>
                <el-col :span="12">
                    <span class="col-height">PowerKVM计算节点</span>
                </el-col>
                <el-col :span="12">
                    <span class="col-height">PowerVM计算节点</span>
                </el-col>
                <el-col :span="12">
                    <span class="col-height">{{auth_num.powerkvm_hypervisor_count ? auth_num.powerkvm_hypervisor_count : 0 + "台"}}</span>
                </el-col>
                <el-col :span="12">
                    <span class="col-height">{{auth_num.powervm_hypervisor_count ? auth_num.powervm_hypervisor_count : 0 + "台"}}</span>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-col :span="12">
                    <span class="col-height">ESXI主机</span>
                </el-col>
                <el-col :span="12">
                    <span class="col-height">x86裸机</span>
                </el-col>
                <el-col :span="12">
                    <span class="col-height">{{auth_num.vmware_hypervisor_count ? auth_num.vmware_hypervisor_count : 0 + "台"}}</span>
                </el-col>
                <el-col :span="12">
                    <span class="col-height">{{auth_num.ironic_count ? auth_num.ironic_count : 0 + "台"}}</span>
                </el-col>
            </el-row>
            <el-divider></el-divider>
        </div>
    </div>
    <updateLicense
        :drawer="drawer"
        @closeDrawer="closeDrawer">
    </updateLicense>
    </div>
</template>
<style src="./index.less" lang="less" scoped></style>
