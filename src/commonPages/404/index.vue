<template>
    <div class="notFoundPage">
        <div class="header"></div>
        <div class="content">
            <img :src="notFoundImgUrl" alt="">
        </div>
    </div>
</template>

<script>
  export default {
    name: 'notFound',
    data() {
      return {
        notFoundImgUrl: require('@/commons/images/404@2x.png'),
      }
    }
  };
</script>

<style lang="less" scoped>
    .notFoundPage {
        width: 100vw;
        height: 100vh;
        background-color: @g-bg-color;
        .header {
            height: 50px;
            background: rgba(24,31,71,1);
        }
        .content {
            @flex();
            justify-content: center;
            margin-top: 24px;
            background: #fff;
            height: 100%;
            & > img {
                width: 280px;
                height: 153px;
            }
        }
    }
</style>
