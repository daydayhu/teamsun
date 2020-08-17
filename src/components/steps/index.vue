<template>
    <div class="steps-c">
        <ul class="steps-list">
            <li class="step-item" v-for="(item,index) in stepsList" :key="index">
                <div class="step-line" v-if="index"></div>
                <div class="step-wait" v-if="item.step > step">
                    <div class="icon">{{item.step}}</div>
                    <div class="name">{{item.name}}</div>
                </div>
                <div class="step-process" v-if="item.step === step">
                    <div class="icon">{{item.step}}</div>
                    <div class="name">{{item.name}}</div>
                </div>
                <div class="step-finish" v-if="item.step < step">
                    <div class="icon">
                        <i class="el-icon-check"></i>
                    </div>
                    <div class="name">{{item.name}}</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
  export default {
    name: 'steps',
    props: {
      stepsList: {
        type: Array
      },
      step: {
        type: Number
      }
    },
    data() {
      return {}
    },
    methods: {}
  };
</script>

<style lang="less" scoped>
    .theme_default .steps-c {
        .steps-list {
            @flex();
            & > li {
                @flex();
                height: 40px;
                .step-line {
                    margin: 0 16px;
                    width: 40px;
                    height: 1px;
                    background: #332A7C;
                    border: 0;
                }
                .step-wait {
                    @flex();
                    .icon {
                        width: 24px;
                        height: 24px;
                        line-height: 24px;
                        text-align: center;
                        background: rgba(255, 255, 255, 1);
                        border: 1px solid rgba(51,42,124,0.1);
                        font-size: 12px;
                        border-radius: 100%;
                        opacity: 0.55;
                    }
                    .name {
                        .step-name;
                        opacity: 0.45;
                    }
                }
                .step-process {
                    @flex();
                    height: 100%;
                    padding: 0 12px;
                    background: rgba(99,83,229,1);
                    box-shadow: 0 6px 16px 0 rgba(51,42,125,0.2);
                    border-radius: 20px;
                    .icon {
                        width: 24px;
                        height: 24px;
                        line-height: 24px;
                        text-align: center;
                        background: rgba(255, 255, 255, 1);
                        border-radius: 100%;
                        font-size: 12px;
                    }
                    .name {
                        .step-name;
                        color: #ffffff;
                        font-weight: bold;
                    }
                }
                .step-finish {
                    @flex();
                    height: 32px;
                    padding: 0 12px;
                    border: 1px solid rgba(51,42,124,0.85);
                    border-radius: 20px;
                    .icon {
                        width: 20px;
                        height: 20px;
                        line-height: 20px;
                        text-align: center;
                        border: 1px solid rgba(51,42,124,1);
                        border-radius: 100%;
                        font-size: 10px;
                        font-weight: bold;
                    }
                    .name {
                        .step-name;
                    }
                }
                .step-name {
                    margin-left: 8px;
                    font-size: 14px;
                }
            }
        }
    }
    /*TODO: 暗黑样式待设计*/
    .theme_dark .steps-c {
        .steps-list {
            @flex();
            & > li {
                @flex();
                height: 40px;
                .step-line {
                    margin: 0 16px;
                    width: 40px;
                    height: 1px;
                    background: #332A7C;
                    border: 0;
                }
                .step-wait {
                    @flex();
                    .icon {
                        width: 24px;
                        height: 24px;
                        line-height: 24px;
                        text-align: center;
                        background: rgba(255, 255, 255, 1);
                        border: 1px solid rgba(51,42,124,0.1);
                        font-size: 12px;
                        border-radius: 100%;
                        opacity: 0.55;
                    }
                    .name {
                        .step-name;
                        opacity: 0.45;
                    }
                }
                .step-process {
                    @flex();
                    height: 100%;
                    padding: 0 12px;
                    background: rgba(99,83,229,1);
                    box-shadow: 0 6px 16px 0 rgba(51,42,125,0.2);
                    border-radius: 20px;
                    .icon {
                        width: 24px;
                        height: 24px;
                        line-height: 24px;
                        text-align: center;
                        background: rgba(255, 255, 255, 1);
                        border-radius: 100%;
                        font-size: 12px;
                    }
                    .name {
                        .step-name;
                        color: #ffffff;
                        font-weight: bold;
                    }
                }
                .step-finish {
                    @flex();
                    height: 32px;
                    padding: 0 12px;
                    border: 1px solid rgba(51,42,124,0.85);
                    border-radius: 20px;
                    .icon {
                        width: 20px;
                        height: 20px;
                        line-height: 20px;
                        text-align: center;
                        border: 1px solid rgba(51,42,124,1);
                        border-radius: 100%;
                        font-size: 10px;
                        font-weight: bold;
                    }
                    .name {
                        .step-name;
                    }
                }
                .step-name {
                    margin-left: 8px;
                    font-size: 14px;
                }
            }
        }
    }
</style>
