<template>
  <div class="role-manage">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="基本信息">
    </pageHeader>
    <div class="ts-content-form">
      <div class="form-c">
        <el-form :label-position="labelPosition"  :label-width="formLabelWidth" ref="roleForm" :model="form" :rules="rules" >

            <el-form-item label="用户名">
              <span style="display: inline-block;">{{user_name}}</span>
            </el-form-item>

            <el-form-item label="姓名" prop="alias_name">
              <el-input v-model.trim="form.alias_name" id="rbac_baseInfo_alias_name" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="描述" prop="remarks">
              <el-input type="textarea" v-model="form.remarks" id="rbac_baseInfo_remarks" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="phone">
              <el-input v-model.trim="form.phone"  id="rbac_baseInfo_phone" placeholder="请输入手机号"></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model.trim="form.email" id="rbac_baseInfo_email" placeholder="请输入邮箱地址"></el-input>
            </el-form-item>
      </el-form>
      </div>
      <div class="footer">
        <div class="btn-c">
          <el-button type="primary" @click="saveUserInfo" id="rbac_baseInfo_saveUserInfo" :loading="submitLoading">{{submitLoading ? '正在更新信息': '更新信息'}}</el-button>
        </div>
      </div>
      <div style="margin-left: 368px" v-if="source_type == 0">
      </div>
    </div>
  </div>
</template>
<style src="./index.less" lang="less" scoped></style>
<script>
  import pageHeader from "@/components/pageHeader.vue"
  import * as requestMethod from "@/modules/rbac/api/certifiService/myInfo";
  import validate from "@/utils/validate"
  export default {
    props: {
    },
    components: {
      pageHeader,
    },
    data() {
      return {
        dialogVisible: this.dialogFormVisible,
        labelPosition: 'right',
        formLabelWidth: '100px',
        submitLoading:false,
        source_type:null,
        form: {
          alias_name: "",
          password: "",
          remarks:'',
          phone:'',
          email:''
        },
        user_name: "",
        rules: {
          phone:[{
            validator: function(rule, value, callback) {
              if (validate.phone.test(value) == false) {
                callback(new Error("手机号格式错误"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }],
          email: [
            {
              required: true,
              message: '邮箱是必填项！',
              trigger: 'blur'
            },
            {
              validator: function(rule, value, callback) {
                if (validate.email.test(value) == false) {
                  callback(new Error("邮箱格式错误"));
                } else {
                  callback();
                }
              },
              trigger: "blur"
            }
          ],
        },
      };
    },
    created() {
    },
    async mounted() {
      this.getUserInfo();
      this.source_type = localStorage.getItem('source_type');
    },
    watch: {
    },
    methods: {
      async getUserInfo(){
        const res = await requestMethod.userInfo('get');
        if(res.code === 200){
          const {user_name,alias_name, phone, remarks,email} = res.data.user;
          this.user_name = user_name;
          this.form.alias_name = alias_name;
          this.form.phone = phone;
          this.form.remarks = remarks;
          this.form.email = email;
        }else{
          this.$message.error(res.message || '用户信息获取失败');
        }

      },
      saveUserInfo(){
        this.$refs['roleForm'].validate(async valid => {
          if (valid) {
            this.submitLoading = true;
            const params = this.form;
            const res = await requestMethod.saveUserInfo('post',{user_data:params});
            if(res.code === 200){
              this.$message.success(res.message || '信息更新成功');
            }else{
              this.$message.error(res.message || '信息更新失败');
            }
            this.submitLoading = false;
          }
        })
      }

    },
  };
</script>

