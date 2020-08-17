<template>
  <!------------------ 发送邮箱 ------------------->
  <div class="forgetPass_find">
    <div class="content">
      <div class="title">
        <span>密码找回</span>
      </div>
      <div class="logo">
        <img :src="imgUrl" />
      </div>
      <div class="form">
        <div class="info">
          <span>请输入您需要找回登录密码的邮箱账户</span>
        </div>
        <div class="input">
          <el-form :label-position="labelPosition" ref="form" :model="form" :rules="emailRules">
            <el-form-item prop="email">
              <el-input
                v-model.trim="form.email"
                autocomplete="off"
                id="rbac_forgetPass_email"
                placeholder="请输入邮箱"
              ></el-input>
              <div class="infut_info" v-if="emailTip">此邮箱不存在，请确认后输入或与管理员联系</div>
            </el-form-item>
          </el-form>
        </div>
        <div class="button">
          <el-button type="primary" @click="onSubmit" id="rbac_forgetPass_onSubmit">立即找回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as requestMethod from "@/request/api/forgetPass/forgetPass.js";
import validate from "@/utils/validate";
export default {
  name: "forgetPass_find",
  props: {
    //头部标题
    title: String
    //有无返回按钮和面包屑
  },
  data() {
    return {
      labelPosition: "right",
      formLabelWidth: "100px",
      imgUrl: require("@/commons/images/g_pwd_forget.svg"),
      tag: null,
      emailTip: false,
      form: {
        email: ""
      },
      email_key: null,
      emailRules: {
        email: [
          {
            required: true,
            message: "邮箱是必填项！",
            trigger: "blur"
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
        ]
      }
    };
  },
  methods: {
    onSubmit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          const email = await this.getCheckedEmail();
          if (email.code == 200) {
            const res = await requestMethod.saveSendMail("post", {
              email: this.form.email
            });
            if (res.code === 200) {
              this.emailTip = false;
              this.$message.success(res.message || "邮箱发送成功");
              this.tag = "find";
            } else {
              this.emailTip = true;
              this.$message.error(res.message || "邮箱发送失败");
            }
          } else {
            this.emailTip = true;
            this.$message.error(email.message || "验证邮箱失败");
          }
        }
      });
    },
    async getCheckedEmail() {
      const res = await requestMethod.checkedEmail("get", {
        email: this.form.email
      });
      return res;
    }
  }
};
</script>
<style lang="less" scoped>
.forgetPass_find {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    width: 28%;
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
      height: 50%;
      img {
        width: 80%;
      }
      //margin-bottom: 45px;
    }
    .form {
      height: 40%;
      .info {
        height: 20%;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
      }
      .input {
        height: 60%;
        .infut_info {
          color: #ff0003;
          font-size: 10px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
        }
      }
      .button {
        height: 20%;
        .el-button {
          width: 70%;
        }
      }
    }
  }
}
</style>
