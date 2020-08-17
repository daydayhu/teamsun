<template>
    <div class="cloudPlatformTypePage">
        <div class="headerC">
            <div class="title">云平台类型及版本</div>
        </div>
        <div class="contentC">
            <ul class="cloudTypeListC">
                <li v-for="(item,index) in cloudTypeList" :key="index">
                    <div class="iconC">
                        <svg-icon :icon-class='`base_${keySet[item.config_key]}`'></svg-icon>
                    </div>
                    <div class="infoC">
                        <div class="name">{{item.config_tag}}</div>
                        <div class="version">版本号：{{item.value_json}}</div>
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
        cloudTypeList: [],
        keySet: {
          1: "OpenStack",
          2: "PowerVM",
          3: "PowerKVM",
          4: "OpenPOWER",
          5: "POWER",
          6: "vCenter",
          7: "VMware Integrated OpenStack",
          8: "H3C VCFC",
          9: "阿里云",
          10: "AWS",
          11: "腾讯云",
          12: "Hyper-V"
        }
      }
    },
    created() {
      this.cloudTypeList = this.paneData.map(node => {
        let _node = JSON.parse(JSON.stringify(node));
        _node.value_json = _node.value_json.version.join('，');
        return _node
      })
    },
  };
</script>

<style lang="less" scoped>
    .cloudPlatformTypePage {
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
        }
        .contentC {
            .cloudTypeListC {
                & > li {
                    height: 92px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #EBEEF5;
                    .iconC {
                        width: 46px;
                        height: 46px;
                        .svg-icon {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .infoC {
                        margin-left: 20px;
                        font-size: 14px;
                        .name {
                            font-weight: 600;
                        }
                        .version {
                            margin-top: 5px;
                            color: rgba(0, 0, 0, 0.45);
                        }
                    }
                }
            }
        }
    }
</style>
