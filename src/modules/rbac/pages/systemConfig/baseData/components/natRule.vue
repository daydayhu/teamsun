<template>
    <div class="natRulePage">
        <div class="headerC">
            <div class="title">NAT规则</div>
            <div class="btnC">
                <el-button @click="showNatDrawer" type="primary">添加</el-button>
            </div>
        </div>
        <div class="contentC">
            <ul class="natListC">
                <li v-for="(item,index) in natList" :key="index">
                    <div class="infoC">
                        <div class="name">{{item.name}}</div>
                        <div class="regExpC">
                            <div class="regExpValue">{{item.regular}}</div>
                            <div class="regExpContent">{{item.replace}}</div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <natDrawer v-if="natDrawerFlag" :drawerInfo="drawerInfo" @closeNatDrawer="closeNatDrawer" @getBaseDataForType="getBaseDataForType"></natDrawer>
    </div>
</template>

<script>
  import natDrawer from './natDrawer';
  import * as requestMethod from '@/modules/rbac/api/systemConfig/baseData.js';
  export default {
    name: 'natRule',
    props: {
      paneData: {
        type: Array,
        deep: true
      },
    },
    data() {
      return {
        natList: [],
        natDrawerFlag: false,
        drawerInfo: {
          status: 'add',
          natForm: null
        },
      }
    },
    created() {
      this.getBaseDataForType();
    },
    methods: {
      getBaseDataForType() {
        let param = {
          config_type: 22
        };
        requestMethod.getBaseDataForType('get',param).then(res => {
          if (res.code === 200) {
            this.drawerInfo.natForm = {
              config_type: 22,
              id: res.data.items[0].config_id
            };
            let natList = res.data.items.splice(1);
            this.natList = natList.map(item => {
              return JSON.parse(item.value_json);
            });
          }
        });
      },
      showNatDrawer() {
        this.natDrawerFlag = true;
      },
      closeNatDrawer() {
        this.natDrawerFlag = false;
      }
    },
    components: {
      natDrawer
    }
  };
</script>

<style lang="less" scoped>
    .natRulePage {
        padding: 0 30px;
        .headerC {
            height: 50px;
            display: flex;
            align-items: center;
            .title {
                font-weight: 600;
                font-style: normal;
                font-size: 16px;
            }
            .btnC {
                margin-left: auto;
            }
        }
        .contentC {
            .natListC {
                margin-top: 20px;
                & > li {
                    height: 92px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #EBEEF5;
                    padding: 0 10px;
                    .infoC {
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        .name {
                            color: @g-font-color-c;
                            font-weight: bold;
                        }
                        .regExpC {
                            margin-top: 10px;
                            height: 30px;
                            @flex();
                            color: @g-font-color-q;
                            .regExpContent {
                                margin-left: 20px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
