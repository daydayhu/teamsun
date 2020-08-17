<template>
  <div class="systemMessageDetail">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader :title="'应用系统消息详情——'+pageTitle" back @handleBack="goBack" :rightWidth="8">
      <template v-slot:right>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="item in breadCrumbData"
            :key="item.name"
            :to="{path:item.path}"
          >{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
      </template>
    </pageHeader>
    <!-------------------------------引入详情头部公共组件----------------------------->
    <detailTitle :title="messageDetailData.name" v-model="messageDetailData">
      <template v-slot:content>
        <el-row type="flex" justify="space-between">
          <el-col>
            <el-row type="flex" justify="space-between">
              <el-col :span="8">
                <div class="detail_title_item detail_title_label">发送人</div>
                <div class="detail_title_item detail_title_label">发送时间</div>
              </el-col>
              <el-col>
                <div class="detail_title_item">{{ messageDetailData.send_user.send_user_name }}</div>
                <div class="detail_title_item">{{ messageDetailData.creationTime }}</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col>
            <el-row type="flex" justify="space-between">
              <el-col :span="8">
                <div class="detail_title_item detail_title_label">消息级别</div>
                <div class="detail_title_item detail_title_label">消息类型</div>
              </el-col>
              <el-col>
                <div class="detail_title_item">{{ messageDetailData.creator }}</div>
                <div class="detail_title_item">{{ messageDetailData.message_type.value}}</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col>
            <el-row type="flex" justify="space-between">
              <el-col :span="8">
                <div class="detail_title_item detail_title_label">状态</div>
              </el-col>
              <el-col>
                <div class="detail_title_item">{{ messageDetailData.state }}</div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
    </detailTitle>
    <!-------------------------------- 消息内容 --------------------------------------->
    <div class="content"></div>
  </div>
</template>

<script>
//引入公共头部组件
import pageHeader from "@/components/pageHeader.vue";
//引入公共详情头部组件
import detailTitle from "@/components/detailTitle.vue";
//引入API
import * as requestMethod from "../../../../api/applicationCenter/myMessage";
export default {
  name: "systemOrderDetail",
  components: {
    pageHeader,
    detailTitle
  },
  data() {
    return {
      pageTitle: "测试名称",
      //面包屑数据
      breadCrumbData: [
        {
          name: "我的消息",
          path: "/applicationCenter/myNews"
        },
        {
          name: "消息详情",
          path: ""
        }
      ],
      //详情数据
      messageDetailData: {
        name: "测试名称",
        send_user: {},
        message_type: {},
        creationTime: ""
      }
    };
  },
  mounted() {
    //this.pageTitle=this.$route.query.title
  },
  methods: {
    //返回点击事件
    goBack() {
      console.log("返回");
      history.back();
    }
  }
};
</script>

<style lang="less" scoped>
.systemMessageDetail {
  .content {
    min-height: 500px;
    background-color: #fff;
    padding: 20px;
  }
}
</style>
