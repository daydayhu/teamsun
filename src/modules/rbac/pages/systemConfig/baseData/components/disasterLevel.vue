<template>
    <div class="disasterLevelPage">
        <div class="headerC">
            <div class="title">灾备等级</div>
        </div>
        <div class="contentC">
            <ul class="disasterLevelListC">
                <li v-for="(item,index) in disasterLevelList" :key="index">
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
    name: 'disasterLevel',
    props: {
      paneData: {
        type: Array,
        deep: true
      },
    },
    data() {
      return {
        disasterLevelList: []
      }
    },
    created() {
      this.disasterLevelList = this.paneData
    },
  };
</script>

<style lang="less" scoped>
    .disasterLevelPage {
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
            .disasterLevelListC {
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
                    }
                }
                & > li:nth-child(2n + 1) {
                    background-color: rgba(247, 248, 248, 1);
                }
            }
        }
    }
</style>

