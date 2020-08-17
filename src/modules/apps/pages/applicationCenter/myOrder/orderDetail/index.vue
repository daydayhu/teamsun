<template>
  <div class="systemOrderDetail">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="订单详情" back @handleBack="goBack" :rightWidth="8">
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
    <orderDetail :ticket_id="ticketId"></orderDetail>
  </div>
</template>

<script>
//引入公共头部组件
import pageHeader from "@/components/pageHeader.vue";
//引入订单详情组件
import orderDetail from "../../components/orderDetail";
//引入API
//import * as requestMethod from "../../../../../api/applicationCenter/applicationSystem"
export default {
  name: "systemOrderDetail",
  components: {
    pageHeader,
    orderDetail
  },
  data() {
    return {
      //面包屑数据
      breadCrumbData: [
        {
          name: "我的订单",
          path: "/applicationCenter/myOrder"
        },
        {
          name: "订单详情",
          path: ""
        }
      ],
      //订单id
      ticketId: null,
      from: null
    };
  },
  created() {
    this.ticketId = this.$route.query.ticket_id;
    this.from = this.$route.query.from;
    if (this.from == "myOrder") {
      this.breadCrumbData = [
        {
          name: "我的订单",
          path: "/applicationCenter/myOrder"
        },
        {
          name: "订单详情",
          path: ""
        }
      ];
    } else {
      this.breadCrumbData = [
        {
          name: "应用系统",
          path: "/applicationCenter/applicationSystem"
        },
        {
          name: "订单详情",
          path: ""
        }
      ];
    }
  },
  mounted() {},
  methods: {
    //返回点击事件
    goBack() {
      // console.log("返回");
      // this.$router.push({
      //   path: "/applicationCenter/myOrder",
      //   query: {
      //     menu_id: this.$route.query.menu_id
      //   }
      // });
      window.history.back();
    }
  }
};
</script>

<style lang="less" scoped>
.systemOrderDetail {
}
</style>
