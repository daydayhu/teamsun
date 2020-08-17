<template>
    <div class="resourceEnvPage">
        <div class="headerC">
            <div class="title">资源环境</div>
        </div>
        <div class="contentC">
            <ul class="resourceEnvListC">
                <li v-for="(item,index) in resourceEnvList" :key="index">
                    <div class="infoC">
                        <div class="name">{{item.value_json}}</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'serviceType',
    props: {
      paneData: {
        type: Array,
        deep: true
      },
    },
    data() {
      return {
        resourceEnvList: []
      }
    },
    created() {
      this.resourceEnvList = this.paneData;
    },
  };
</script>

<style lang="less" scoped>
    .resourceEnvPage {
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
            .resourceEnvListC {
                & > li {
                    display: flex;
                    align-items: center;
                    padding-left: 10px;
                    height: 50px;
                    background-color: #ffffff;
                    .infoC {
                        .name {
                            font-weight: 700;
                            font-size: 13px;
                            color: #000000;
                        }
                    }
                }
                & > li:nth-child(2n + 1) {
                    background-color: rgba(247, 248, 248, 1);
                }
            }
        }
    }
</style>

