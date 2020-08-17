<template>
    <section>
        <vmAndOpsTable @setConfig="setConfig" :dataType="'ops'"></vmAndOpsTable>
    </section>
</template>
<script>
import vmAndOpsTable from "./vmAndOpsTable"
export default {
    data() {
        return {
            config:{
                obj_ids: [],
                obj_type: "",
                node_ids: [],
            }
        }
    },
    components: {
        vmAndOpsTable
    },
    methods: {
        setConfig(val) {
            this.config = val
        }
    }
}
</script>
<style lang="less" scoped>

</style>
