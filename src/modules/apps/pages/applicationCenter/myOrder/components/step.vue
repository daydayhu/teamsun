<template>
    <el-steps  :active="active" finish-status="success">
        <el-step
            v-for="(item,index) in ticket_step_type"
            :key="item+index+active"
            :title="item"
        ></el-step>
    </el-steps>
</template>
<script>
export default {
    name:"displayStep",
    props:{
        rowData:{
            type:Object
        }
    },
    data(){
        return {
            active: null,
            ticket_step_type: [],
        }
    },
    watch:{
        rowData:{
            handler(newVal,oldVla) {
                this.active  = newVal.active
                this.ticket_step_type  = newVal.ticket_step_type
            },
            immediate:true,
            deep:true
        }
    },
}
</script>
<style lang="less" scoped>

</style>