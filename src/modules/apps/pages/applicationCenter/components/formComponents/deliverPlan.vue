<template>
    <div>
        <el-table 
            :data="softwareList"
            v-loading="loading"
            style="width: 100%">
            <el-table-column 
                v-for="(item) in tableHeader"
                :key="item.prop"
                :label="item.label" 
                :prop="item.prop">
            </el-table-column>
            <el-table-column
                label="启动策略"
                prop="launchPolicy"> 
                <template slot-scope="scope">
                    <el-select size="mini" v-model="scope.row.launchPolicy">
                        <el-option :label="'自动'" :value="'自动'"></el-option>
                        <el-option :label="'手动'" :value="'手动'"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column
                label="交付负责人"
                prop="deliverPerson"> 
                <template slot-scope="scope">
                    <el-select size="mini" v-model="scope.row.deliverPerson">
                        <el-option :label="'用户组1'" :value="'用户组1'"></el-option>
                        <el-option :label="'用户组2'" :value="'用户组2'"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column
                label="复核人"
                prop="reviewPerson"> 
                <template slot-scope="scope">
                    <p v-if="scope.row.timeBox === '每小时'">--</p>
                    <el-select size="mini" v-model="scope.row.reviewPerson" v-else>
                        <el-option :label="'张三'" :value="'张三'"></el-option>
                        <el-option :label="'李四'" :value="'李四'"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column
                label="复核策略"
                prop="reviewStrategy"> 
                <template slot-scope="scope">
                    <el-select size="mini" v-model="scope.row.reviewStrategy">
                        <el-option :label="'策略1'" :value="'策略1'"></el-option>
                        <el-option :label="'策略2'" :value="'策略2'"></el-option>
                    </el-select>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>

export default {
    data() {
        return {
            loading:false,
            tableHeader: [
                {
                    prop: "serviceInstance",
                    label: "服务实例"
                },
                {
                    prop: "dependentServiceInstance",
                    label: "依赖服务实例"
                },
                {
                    prop: "operationName",
                    label: "操作名称"
                },
                {
                    prop: "timeBox",
                    label: "时间窗口"
                },
            ],
            softwareList:[
                {
                    serviceInstance:'VMWare',
                    dependentServiceInstance:'',
                    operationName:'申请VM',
                    timeBox:'零点',
                    launchPolicy:'',
                    deliverPerson:'',
                    reviewPerson:'',
                    reviewStrategy:'',
                },
                {
                    serviceInstance:'VMWare',
                    dependentServiceInstance:'VM',
                    operationName:'OS配置',
                    timeBox:'每小时',
                    launchPolicy:'',
                    deliverPerson:'',
                    reviewPerson:'',
                    reviewStrategy:'',
                },
                {
                    serviceInstance:'Tomcat',
                    dependentServiceInstance:'VM, OS',
                    operationName:'Tomcat部署',
                    timeBox:'每天2点',
                    launchPolicy:'',
                    deliverPerson:'',
                    reviewPerson:'',
                    reviewStrategy:'',
                },
                {
                    serviceInstance:'Apache',
                    dependentServiceInstance:'VM, OS',
                    operationName:'Apache部署',
                    timeBox:'每天2点',
                    launchPolicy:'',
                    deliverPerson:'',
                    reviewPerson:'',
                    reviewStrategy:'',
                },
            ]
        }
    }
}
</script>
<style lang="less" scoped>
</style>