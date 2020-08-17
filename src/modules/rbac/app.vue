<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
  import Bus from '@/commons/js/bus'
  export default {
    name: 'app',
    created() {
      Bus.$on('goBack', () => {
        this.$router.push('/login');
      })
    },
    methods: {
      login(){
        this.$router.push('/login');
      }
    }
  }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        position: relative;
        overflow: hidden;
    }
</style>
