<template>
  <!------------------ 修改密码 ------------------->
  <div class="forgetPass_modify">
    <div class="content">
      <div class="title">
        <span>修改密码</span>
      </div>
      <div class="logo">
        <img :src="imgUrl" />
      </div>
      <div class="form">
        <div class="input">
          <el-form
            :label-position="labelPosition"
            :label-width="formLabelWidth"
            ref="passForm"
            :model="passForm"
            :rules="rules"
          >
            <el-form-item prop="new_pwd" label="新密码">
              <el-input
                v-model.trim="passForm.new_pwd"
                autocomplete="off"
                placeholder="请输入新密码"
                id="rbac_forgetPass_new_pwd"
                type="password"
              ></el-input>
              <div class="infut_info">必须包含大写字母，小写字母和数字，8-16个字符</div>
            </el-form-item>
            <el-form-item prop="sure_pwd" label="再次确认">
              <el-input
                v-model.trim="passForm.sure_pwd"
                autocomplete="off"
                placeholder="请再次输入新密码"
                id="rbac_forgetPass_sure_pwd"
                type="password"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="button">
          <el-button type="primary" id="rbac_forgetPass_modifyPass" @click="modifyPass">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as requestMethod from "@/request/api/forgetPass/forgetPass.js";
import validate from "@/utils/validate";
import { btoaPassword, getQueryVariable } from "@/utils/utils";

export default {
  name: "forgetPass_find",
  props: {
    //头部标题
    title: String
    //有无返回按钮和面包屑
  },
  data() {
    return {
      //路由参数
      tag: null,
      imgUrl: require("@/commons/images/g_pwd_forget.svg"),
      email_key: null,
      labelPosition: "right",
      formLabelWidth: "80px",
      passForm: {
        new_pwd: "",
        sure_pwd: ""
      },
      rules: {
        new_pwd: [
          {
            required: true,
            message: "密码是必填项！",
            trigger: "blur"
          },
          {
            validator: function(rule, value, callback) {
              if (validate.password.test(value) == false) {
                callback(new Error("密码格式错误"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        sure_pwd: [
          {
            required: true,
            message: "再次确认密码是必填项！",
            trigger: "blur"
          }
        ]
      }
    };
  },
  async mounted() {
    const { tag } = getQueryVariable("tag");
    const { email_key } = getQueryVariable("email_key");
    this.tag = tag ? tag : null;
    this.email_key = email_key;
  },
  methods: {
    modifyPass() {
      this.$refs["passForm"].validate(async valid => {
        if (valid) {
          const { sure_pwd, new_pwd } = this.form;
          if (sure_pwd !== new_pwd) {
            this.$message.error("确认密码输入不正确");
          } else {
            this.submitLoading = true;
            const new_pwd = btoaPassword(this.passForm.new_pwd);
            const res = await requestMethod.modifyEmailPass("patch", {
              email_key: this.email_key,
              new_pwd
            });
            if (res.code === 200) {
              this.$message.success(res.message || "密码修改成功");
              this.$router.push("/modifySuccess");
            } else {
              this.$message.error(res.message || "密码修改失败");
            }
            this.submitLoading = false;
          }
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.forgetPass_modify {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    width: 45%;
    height: 80%;
    text-align: center;
    // display: flex;
    // flex-flow: column;
    // justify-content: center;
    // align-items: center;
    .title {
      height: 10%;
      font-size: 24px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      //color: rgba(51, 42, 124, 1);
    }
    .logo {
      height: 45%;
      img {
        width: 50%;
      }
      //margin-bottom: 45px;
    }
    .form {
      height: 45%;
      .input {
        height: 80%;
        padding-right: 12%;
        .infut_info {
          color: rgba(51, 42, 124, 0.45);
          font-size: 10px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
        }
      }
      .button {
        height: 20%;
        .el-button {
          width: 50%;
        }
      }
    }
  }
}
</style>
