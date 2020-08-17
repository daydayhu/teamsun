<template>
    <div class="menu-view">
        <div
                class="menu-item"
                :class="firstIndex !== menuDataList.length-1 ? 'menu-border  menu-height' : ''"
                v-for="(firstData, firstIndex) in menuDataList"
                :key="`firstIndex+${firstIndex}`"
                v-show="allowShowMenuType[firstData.menu_type]">
            <div class="cell" @click="toggleNode(firstData)">
                <svg-icon
                        v-if="firstData.is_enable"
                        :icon-class="firstData.is_fold ? 'reduce_solid' : 'add'"
                        class="icon-position"
                ></svg-icon>
                <span class="label-text" v-if="firstData.is_enable">{{firstData.menu_name}}</span>
            </div>
            <!-- 第二层菜单 -->
            <div v-if="firstData.children.length && firstData.is_fold">
                <div
                        class="second-item"
                        :class="secondIndex !== firstData.children.length-1 ? 'menu-border  menu-height' : ''"
                        :style="{ marginLeft: marginWidth * 2 + 'px', marginTop: secondIndex === 0 ? '15px' : '' }"
                        v-for="(secondData,secondIndex) in firstData.children"
                        :key="`secondIndex+${secondIndex}`"
                        v-show="allowShowMenuType[secondData.menu_type]">
                    <div class="cell" @click="toggleNode(secondData)">
                        <svg-icon
                                :icon-class="secondData.children.length && !secondData.is_fold ? 'add' : 'reduce_solid' "
                                class="icon-position"
                        ></svg-icon>
                        <span class="label-text">{{secondData.menu_name}}</span>
                    </div>
                    <!-- 第三层菜单 -->
                    <div v-if="secondData.children.length && secondData.is_fold">
                        <div
                                class="second-item"
                                :class="thirdIndex !== secondData.children.length-1 ? 'menu-border menu-height ' : ''"
                                :style="{marginLeft: marginWidth * 2 + 'px', marginTop: thirdIndex === 0 ? '15px' : ''}"
                                v-for="(thirdData,thirdIndex) in secondData.children"
                                :key="`thirdIndex+${thirdIndex}`" v-show="allowShowMenuType[thirdData.menu_type]">
                            <div class="cell" @click="toggleNode(thirdData)">
                                <svg-icon
                                        :icon-class="thirdData.children.length && !thirdData.is_fold ?  'add' : 'reduce_solid'"
                                        class="icon-position"
                                ></svg-icon>
                                <span class="label-text">{{thirdData.menu_name}}</span>
                            </div>
                            <!-- 第四层菜单 -->
                            <div v-if="thirdData.children.length && thirdData.is_fold">
                                <div
                                        class="second-item"
                                        :class="fourIndex !== thirdData.children.length-1 ? 'menu-border menu-height ' : ''"
                                        :style="{marginLeft: marginWidth * 2 + 'px', marginTop: fourIndex === 0 ? '15px' :''}"
                                        v-for="(fourData,fourIndex) in thirdData.children"
                                        :key="`fourIndex+${fourIndex}`"
                                        v-show="allowShowMenuType[fourData.menu_type]">
                                    <div class="cell">
                                        <svg-icon icon-class="reduce_solid" class="icon-position"></svg-icon>
                                        <span class="label-text">{{fourData.menu_name}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    props: {
      menuData: {
        type: Array,
      },
    },
    watch: {
      menuData: {
        handler(newVal, oldVal) {
          this.menuDataList = JSON.parse(JSON.stringify(this.menuData));
          this.menuDataList = this.filterData(this.menuDataList);
          console.log('this.menuDataList', this.menuDataList);
        },
        deep: true,
      },
    },
    data() {
      return {
        marginWidth: 16,
        menuDataList: [],
        allowShowMenuType: {
          1: true,   // 为url页面
          2: false,  // 为json数据请求
          3: false,  // 按钮
          4: false,  // 业务节点
          5: true,   // 服务分类
          6: true,    // 服务
        },
      };
    },
    methods: {
      filterData(data) {
        var newData = data.filter(x => x.is_enable);
        newData.forEach(
          x => x.children && (x.children = this.filterData(x.children)),
        );
        return newData;
      },
      traverseTree(treeData) {
        if (treeData.length > 0) {
          for (let i = 0; i < treeData.length; i++) {
            treeData[i].is_fold = true;
            if (treeData[i].children.length > 0) {
              this.traverseTree(treeData[i].children);
            }
          }
        }
      },
      toggleNode(node) {
        node.is_fold = !node.is_fold;
      },
    },
  };
</script>
<style lang="less" scoped>
    .menu-view {
        width: 100%;
        .menu-height {
            padding-bottom: 20px;
        }
        .menu-border {
            border-left: 1px dashed #ccc;
        }
        .menu-item {
            position: relative;
            .icon-position {
                display: inline-block;
                position: absolute;
                background-color: #fff;
                left: -7px;
                z-index: 11;
                color: #d8d8d8;
                cursor: pointer;
            }
            .label-text {
                padding-left: 20px;
                cursor: pointer;
            }
        }
        .second-item {
            position: relative;
        }
    }
</style>
