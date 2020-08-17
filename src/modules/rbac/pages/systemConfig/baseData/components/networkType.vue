<template>
    <div class="networkTypePage">
        <div class="headerC">
            <div class="title">网络类型</div>
        </div>
        <div class="contentC">
            <ul class="networkTypeListC">
                <li v-for="(item,index) in networkTypeList" :key="index">
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
        networkTypeList: []
      }
    },
    created() {
      this.networkTypeList = this.paneData
    },
  };
</script>

<style lang="less" scoped>
    .networkTypePage {
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
            .networkTypeListC {
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

