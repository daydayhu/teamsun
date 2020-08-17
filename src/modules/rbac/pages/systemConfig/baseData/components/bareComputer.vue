<template>
    <div class="bareComputerPage">
        <div class="headerC">
            <div class="title">裸机驱动</div>
        </div>
        <div class="contentC">
            <ul class="bareComputerListC">
                <li v-for="(item,index) in bareComputerList" :key="index">
                    <div class="infoC">
                        <div class="name">{{item.config_tag}}</div>
                        <div class="param">{{item.value_json}}</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'bareComputer',
    props: {
      paneData: {
        type: Array,
        deep: true
      },
    },
    data() {
      return {
        bareComputerList: []
      }
    },
    created() {
      this.bareComputerList = this.paneData
    },
  };
</script>

<style lang="less" scoped>
    .bareComputerPage {
        padding: 0 30px;
        .headerC {
            height: 50px;
            display: flex;
            align-items: center;
            .title {
                font-weight: 600;
                font-size: 16px;
            }
        }
        .contentC {
            .bareComputerListC {
                & > li {
                    display: flex;
                    align-items: center;
                    padding-left: 10px;
                    height: 80px;
                    background-color: #ffffff;
                    .infoC {
                        .name {
                            font-weight: bold;
                            font-size: 13px;
                            color: @g-font-color-c;
                        }
                        .param {
                            margin-top: 10px;
                            color: @g-font-color-q;
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

