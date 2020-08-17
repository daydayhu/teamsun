<template>
    <div class="virtualTypePage">
        <div class="headerC">
            <div class="title">虚拟化类型</div>
        </div>
        <div class="contentC">
            <ul class="virtualTypeListC">
                <li v-for="(item,index) in virtualTypeList" :key="index">
                    <div class="infoC">
                        <div class="name">{{item.value_json}}</div>
                        <div class="status">{{item.is_enable ? '已启用' : '未启用'}}</div>
                    </div>
                    <div class="switchC">
                        <el-switch
                                v-model="item.is_enable"
                                active-color="#409eff"
                                inactive-color="#DCDFE6"
                                @change="switchChangeHandler(item)"
                        ></el-switch>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
  import * as requestMethod from '@/modules/rbac/api/systemConfig/baseData.js';
  export default {
    name: 'virtualType',
    props: {
      paneData: {
        type: Array,
        deep: true
      },
    },
    data() {
      return {
        virtualTypeList: []
      }
    },
    created() {
      this.virtualTypeList = this.paneData.map(item => {
        item.is_enable = item.is_enable === 1;
        return item
      })
    },
    methods: {
      switchChangeHandler(item) {
        let param = {
          "menu_ids": [item.config_id],
          "on_off": item.is_enable
        };
        requestMethod.baseDataSwitch('put',param).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message);
          }else {
            this.$message.error(res.message);
            item.is_enable = !item.is_enable
          }
        });
      }
    },
  };
</script>

<style lang="less" scoped>
    .virtualTypePage {
        padding: 0 30px;
        .headerC {
            height: 50px;
            display: flex;
            align-items: center;
            .title {
                font-weight: 600;
                font-style: normal;
                font-size: 16px;
                color: #000000;
            }
        }
        .contentC {
            .virtualTypeListC {
                & > li {
                    display: flex;
                    align-items: center;
                    padding-left: 10px;
                    height: 50px;
                    background-color: #ffffff;
                    .infoC {
                        .name {
                            font-family: 'PingFang SC Bold', 'PingFang SC';
                            font-weight: 700;
                            font-size: 13px;
                            color: #000000;
                        }
                        .status {
                            margin-top: 8px;
                            font-size: 12px;
                            color: #7F7F7F;
                        }
                    }
                    .switchC {
                        margin: 0 20px 0 auto;
                    }
                }
                & > li:nth-child(2n + 1) {
                    background-color: rgba(247, 248, 248, 1);
                }
            }
        }
    }
</style>
