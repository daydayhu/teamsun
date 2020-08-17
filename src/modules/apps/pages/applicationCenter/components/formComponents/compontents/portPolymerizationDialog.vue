<template>
    <el-tabs v-model="activeName" @tab-click="changeTab">
        <el-tab-pane
            v-for=" (parentHeader) in portTabHeader "
            :key="parentHeader.key"
            :name="parentHeader.key"
            :label="parentHeader.label">
            <el-table
                :data="tableData">
                <el-table-column
                    v-for=" (subHeader,index) in  parentHeader.subHeader"
                    :prop="subHeader.key"
                    :label="subHeader.label"
                    :key="subHeader.key + index">
                </el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
import * as requestMethod from "@/modules/apps/api/serviceCatalog/openstack/openstackApply.js";
import { portTabHeader } from "../untils/config"
export default {
    props: {
        uuid:{
            type: String
        }
    },
    data() {
        return {
            portTabHeader,
            activeName:"port",
            tableData: []
        }
    },
    methods: {
        changeTab(tag) {
            let tagName = tag.paneName
            switch (tagName) {
                case "port":
                    this.getPortData()
                    break;
                case "portArr":
                    this.getPortGroupData()
                    break;
            }
        },
        async getPortGroupData() {
            let res = await requestMethod.getPortGroupData("get",this.uuid)
            if(res.code === 200) {
                this.tableData = res.data.port_groups
            }
        },
        async getPortData() {
            let res = await requestMethod.getPortData("get",this.uuid)
            if(res.code === 200) {
                this.tableData = res.data.ports
            }
        },
    },
    mounted() {
        this.getPortData()
    }
}
</script>
<style lang="less" scoped>

</style>
