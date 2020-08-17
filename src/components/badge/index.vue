<template>
  <div class="z-badge" :class="type">
    {{title}}
  </div>
</template>
<script>
    export default {
        name: 'z-badge',
        props: {
            title: {
                type: String | Number,
                default: () => {
                    return '';
                }
            },
            type: {
                type: String,
                default: () => {
                    return 'default';
                }
            }
        }
    };
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .z-badge {
    padding: 3px;
    display: inline-block;
    border-radius: 5px;
    color: #fff;
    font-size: 16px;
    min-width: 5px;
    min-height: 5px;
    box-sizing: border-box;
    line-height: 5px;
    text-align: center;
    &.default {
      background: #ef4f4f;
    }
    &.grey{
      background: #BBBEC8;
    }
    &.primary {
      background: #1BB5F1;
    }
    &.pink{
      background: pink;
    }
    &.red{
      background: red;
    }
    &.yellow{
      background: yellow;
    }
    &.orange{
      background: #FAAD14;
    }
    &.cyan{
      background: cyan;
    }
    &.green{
      background: #52C41A;
    }
    &.blue{
      background: blue;
    }
    &.purple{
      background: purple;
    }
    &.magenta{
      background: magenta;
    }
    &.gold{
      background: gold;
    }
    &.lime{
      background: lime;
    }
    &.un_publish {
      background: #3389FF;
    }
    &.publish {
      background: #52C41A;
    }
    &.falling {
      background: #BBBEC8;
    }
  }
</style>
