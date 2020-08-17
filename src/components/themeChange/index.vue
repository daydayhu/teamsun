<template>
    <div class="themeChangeLayer">
        <div class="theme-c">
            <span @click="handleThemeChange('1')" class="default"></span>
            <span @click="handleThemeChange('2')" class="dark"></span>
        </div>
    </div>
</template>

<script>
  const THEME_SET = {
    DEFAULT: '1',
    DARK: '2',
  };
  const THEME_MAP_CLASS = {
    '1': 'theme_default',
    '2': 'theme_dark'
  };
  export default {
    name: 'index',
    data() {
      return {
        currentTheme: THEME_SET.DEFAULT,
      };
    },
    created() {
      this.getCurrentTheme();
    },
    methods: {
      getCurrentTheme() {
        this.currentTheme = localStorage.getItem('CURRENT_THEME') || THEME_SET.DEFAULT;
        document.getElementsByTagName('body')[0].className = THEME_MAP_CLASS[this.currentTheme];
      },
      handleThemeChange(theme = THEME_SET.DEFAULT) {
        if (this.currentTheme !== theme) {
          this.currentTheme = theme;
          document.getElementsByTagName('body')[0].className = THEME_MAP_CLASS[this.currentTheme];
          localStorage.setItem('CURRENT_THEME', this.currentTheme)
        }
      },
    },
  };
</script>

<style lang="less" scoped>
    .themeChangeLayer {
        width: 100%;
        height: 30px;
        /*background-color: cyan;*/
        .theme-c {
            @flex();
            justify-content: space-between;
            padding: 0 12px;
            & > span {
                width: 10px;
                height: 10px;
                border: 1px solid #fff;
                border-radius: 10px;
                outline: 0;
                cursor: pointer;
            }
            & > span.default {
                background-color: #fff;
            }
            & > span.dark {
                background-color: #000;
            }
        }
    }
</style>
