<template>
  <div class="role-manage">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="修改密码">
    </pageHeader>
    <div class="ts-content-form">
      <div class="form-c">
        <el-form :label-position="labelPosition"  :label-width="formLabelWidth" ref="form" :model="form" :rules="rules" >
            <el-form-item label="原密码" prop="old_pwd"  id="rbac_modifyPass_old_pwd">
              <el-input v-model.trim="form.old_pwd" type="password" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="新密码" prop="new_pwd"  id="rbac_modifyPass_password">
              <el-input v-model.trim="form.new_pwd" type="password" autocomplete="off"></el-input>
              <span>说明：必须包含大写字母，小写字母和数字，8-16个字符</span>
            </el-form-item>

            <el-form-item label="确认密码" prop="sure_pwd"  id="rbac_modifyPass_sure_pwd">
              <el-input v-model.trim="form.sure_pwd" type="password" autocomplete="off"></el-input>
            </el-form-item>
      </el-form>
      </div>
      <div class="footer">
        <div class="btn-c">
           <el-button type="primary" @click="onSubmit" id="rbac_modifyPass_onSubmit">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style src="./index.less" lang="less" scoped></style>
<script>
  import pageHeader from "@/components/pageHeader.vue"
  import { btoaPassword } from "@/utils/utils";
  import * as requestMethod from "@/modules/rbac/api/certifiService/myInfo";
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
        cloud_id: 0,
        form: {
          old_pwd:'',
          new_pwd:'',
          sure_pwd:'',
        },
        user_id:0,
        submitLoading:false,
        rules: {
          old_pwd: [
            {
              required: true,
              message: '原来密码是必填项！',
              trigger: 'blur'
            },
          ],
          new_pwd: [
            {
              required: true,
              message: '新密码是必填项！',
              trigger: 'blur'
            },
          ],
          sure_pwd:[
            {
              required: true,
              message: '确认密码是必填项！',
              trigger: 'blur'
            },
          ]

        },
      };
    },
    created() {
    },
    watch: {
    },
    async mounted() {
      this.getUserInfo();
    },
    methods: {
      async getUserInfo(){
        const res = await requestMethod.userInfo('get');
        if(res.code === 200){
          const {user_id} = res.data.user;
          this.user_id = user_id;
        }else{
          this.$message.error(res.message || '用户信息获取失败');
        }

      },
      onSubmit(){
        this.$refs['form'].validate(async valid => {
          if (valid) {
            const {sure_pwd, new_pwd} = this.form;
            if(sure_pwd !== new_pwd){
              this.$message.error('确认密码输入不正确');
            }else{
              this.submitLoading = true;
              const new_pwd = btoaPassword(this.form.new_pwd);
              const old_pwd = btoaPassword(this.form.old_pwd);
              if(this.form.new_pwd === this.form.old_pwd){
                  this.$message.error('新密码与原密码不能相同！');
                  return  false;
              }
              const res = await requestMethod.changePwd('patch',{new_pwd,old_pwd});
              if(res.code === 200){
                this.$message.success(res.message || '密码修改成功');
              }else{
                this.$message.error(res.message || '密码修改失败');
              }
              this.submitLoading = false;
            }

          }

        })
      }
    },
  };
</script>

