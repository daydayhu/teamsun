<template>
        <el-drawer
        title="导入用户"
        :before-close="cancelForm"
        :visible.sync="importUser"
        direction="rtl"
        custom-class="import-user-drawer"
        ref="drawer"
        >
        <div class="ts-drawer__content">
            <el-form :model="form" :label-position="labelPosition">
                <el-form-item label="用户名" :label-width="formLabelWidth" class="ts-form-label ts-mt36">
                    <el-input v-model="form.name" autocomplete="off" class="ts-input"></el-input>
                    <span class="ts-input-tips">不超过64个字符</span>
                </el-form-item>
                <el-form-item label="姓名" :label-width="formLabelWidth" class="ts-form-label ts-label-required">
                    <el-input v-model="form.name" autocomplete="off" class="ts-input"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth" class="ts-form-label ts-mt36">
                    <el-input type="textarea" v-model="form.desc" class="ts-input"></el-input>
                </el-form-item>
                    <el-form-item label="密码" prop="pass" :label-width="formLabelWidth" class="ts-form-label ts-label-required">
                    <el-input type="password" v-model="form.pass" autocomplete="off" class="ts-input"></el-input>
                </el-form-item>
                    <el-form-item label="确认密码" prop="pass" :label-width="formLabelWidth" class="ts-form-label ts-label-required">
                    <el-input type="password" v-model="form.pass" autocomplete="off" class="ts-input"></el-input>
                </el-form-item>
                <el-form-item label="所属组织" :label-width="formLabelWidth" class="ts-form-label ts-label-required">
                    <el-input v-model="form.name" autocomplete="off" class="ts-input"></el-input>
                </el-form-item>
                <el-form-item label="所属部门" :label-width="formLabelWidth" class="ts-form-label">
                    <el-input v-model="form.name" autocomplete="off" class="ts-input"></el-input>
                </el-form-item>
                <el-form-item label="活动区域" :label-width="formLabelWidth" class="ts-form-label">
                    <el-select v-model="form.region" placeholder="请选择活动区域" class="ts-input">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号" :label-width="formLabelWidth" class="ts-form-label">
                    <el-input v-model="form.name" autocomplete="off" class="ts-input"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth" class="ts-form-label ts-label-required">
                    <el-input v-model="form.name" autocomplete="off" class="ts-input"></el-input>
                </el-form-item>
            </el-form>

        </div>
        <div class="drawer_footer">
                <el-button type="primary" @click="$refs.drawer.closeDrawer()">确 定</el-button>
                <el-button @click="cancelForm">取 消</el-button>
            </div>
    </el-drawer>
</template>

<script>
export default {
    props:{
        carrier: Object,
        importUser:{
            type: Boolean
        },
        addUserObj: {
            type: Object
        },

    },
        mounted: {

    },
    data() {
        return {
            // organDialog: this.organDialog,
        multiple: {multiple: true},
        options: [{
          value: 1,
          label: '东南',
          children: [{
            value: 2,
            label: '上海',
            children: [
              { value: 3, label: '普陀' },
              { value: 4, label: '黄埔' },
              { value: 5, label: '徐汇' }
            ]
          }, {
            value: 7,
            label: '江苏',
            children: [
              { value: 8, label: '南京' },
              { value: 9, label: '苏州' },
              { value: 10, label: '无锡' }
            ]
          }, {
            value: 12,
            label: '浙江',
            children: [
              { value: 13, label: '杭州' },
              { value: 14, label: '宁波' },
              { value: 15, label: '嘉兴' }
            ]
          }]
        }, {
          value: 17,
          label: '西北',
          children: [{
            value: 18,
            label: '陕西',
            children: [
              { value: 19, label: '西安' },
              { value: 20, label: '延安' }
            ]
          }, {
            value: 21,
            label: '新疆维吾尔族自治区',
            children: [
              { value: 22, label: '乌鲁木齐' },
              { value: 23, label: '克拉玛依' }
            ]
          }]
        }],

            rules: {
                userName :[
                    {required: true,trigger: 'blur'}
                ]
            },
            form: {
                name: this.carrier.name,
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            formLabelWidth: '106px',
            labelPosition: 'left',
            timer: null,
        }
    },
    methods:{
        validateName(rule, value, callback) {
            if (value == "") {
                return callback(new Error("名称不能为空"));
            } else {
                return callback();
            }
        },
        cancelForm() {
            this.$emit('closeDialog');
        },
    }
}
</script>
