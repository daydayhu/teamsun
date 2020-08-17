<template>
    <div class="mirrorFormatPage">
        <div class="headerC">
            <div class="title">镜像格式</div>
        </div>
        <div class="contentC">
            <ul class="mirrorListC">
                <li v-for="(arr,index) in mirrorList" :key="index">
                    <div class="name">{{arr[0]}} - {{arr[1]}}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'mirrorFormat',
    props: {
      paneData: {
        type: Array,
        deep: true
      },
    },
    data() {
      return {
        mirrorList: []
      }
    },
    created() {
      this.mirrorList = Object.entries(this.paneData[0].value_json.name)
    },
  };
</script>

<style lang="less" scoped>
    .mirrorFormatPage {
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
            .mirrorListC {
                & > li {
                    display: flex;
                    align-items: center;
                    height: 50px;
                    padding-left: 10px;
                    font-family: 'Roboto';
                    font-weight: 400;
                    font-style: normal;
                    font-size: 13px;
                    margin-bottom: 5px;
                }
                & > li:nth-child(2n + 1) {
                    background-color: rgba(247, 248, 248, 1)
                }
            }
        }
    }
</style>



