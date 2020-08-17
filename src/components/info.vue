<template>
  <!------------------ info样式：应用事例（vmware-计算-宿主机详情-硬件信息） ------------------->
  <div class="info g_info">
    <!--------------- 一列展示 ----------------->
    <div class="one" v-if="column==1">
      <table border="0" border-collapse="collapse">
        <tbody ref="tbody">
          <tr v-for="(item,index) in infoData" :key="index">
            <td class="td" style="width:20%">
              <el-row class="oneContent">
                <el-col>{{item.label}}</el-col>
              </el-row>
            </td>
            <td>
              <el-row>
                <el-col class="oneContent">{{item.value}}</el-col>
              </el-row>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--------------- 两列展示 ----------------->
    <div class="two" v-if="column==2">
      <table border="0" border-collapse="collapse">
        <tbody ref="tbody">
          <tr v-for="(item,index) in dataList" :key="index">
            <td class="td" style="width:50%">
              <el-row>
                <el-col :span="12" class="center">{{item.left.label}}</el-col>
                <el-col :span="12" class="center">{{item.left.value}}</el-col>
              </el-row>
            </td>
            <td>
              <el-row>
                <el-col v-if="item.right" :span="12" class="center">{{item.right.label}}</el-col>
                <el-col v-if="item.right" :span="12" class="center">{{item.right.value}}</el-col>
              </el-row>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "pageHeader",
  props: {
    //一行还是两行展示
    column: {
      type: Number,
      default: 1,
    },
    infoData: {
      type: Array,
      default() {
        return [
          {
            label: "平台类型",
            value: "12222",
          },
        ];
      },
    },
  },
  data() {
    return {
      //两列展示的数据
      dataList: [],
    };
  },
  mounted() {
    this.handleData();
    this.handleStyle();
  },
  methods: {
    //两列展示的数据处理
    handleData() {
      let length = Math.ceil(this.infoData.length / 2);
      let arr = [];
      for (let i = 0; i < length; i++) {
        arr.push({
          left: this.infoData[i],
          right: this.infoData[length + i],
        });
      }
      this.dataList = arr;
    },
    //表格tr背景颜色处理
    handleStyle() {
      let trList = this.$refs.tbody.children;
      console.log("tbody", trList);
      this.$nextTick((e) => {
        for (let i = 0; i < trList.length; i++) {
          if (i % 2 == 0) {
            // 偶数
            trList[i].className = "odd";
          } else {
            // 奇数
          }
        }
      });

      console.log("tbody", trList);
    },
  },
};
</script>
<style lang="less" scoped>
.info {
  width: 100%;
  height: 100%;
  display: flex;
  box-shadow: 0px 6px 15px 0px rgba(51, 42, 125, 0.1);
  .one {
    width: 100%;
    .oneContent {
      padding-left: 24px;
    }
  }
  .two {
    width: 100%;
  }
  // border-radius: 14px;
  table {
    border-collapse: collapse;
    width: 100%;
    border-radius: 14px;
    tr {
      height: 52px;
    }
    .center {
      text-align: center;
    }
    .td {
      border-right: 1px solid rgba(231, 237, 243, 1);
    }
  }
  .odd {
    background-color: rgba(51, 42, 124, 0.04);
  }
}
</style>
