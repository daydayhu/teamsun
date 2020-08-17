<!--
1.theItems ，serviceType（对应模块下对应功能点）比如：theItems(vmware)-，serviceType（对应模块下对应功能点）
比如：theItems(cloud)用来获取搜索条件的列表
2.isSave搜索的条件是否需要保存，默认是保存（true），也就是搜索结束之后页面刷新搜索条件不消失除非路由跳转；
3.toSearch 搜索条件变化的时候给父组件传值。如果要isSave是true，搜索条件取得session中的值，如果是false则取传的值；参见VMware-资源池
创建和详情弹框中资源池的搜索
4.setID 该值必须唯一，默认为null，主要应用场景就是同一路由下多次引用该组件，造成多输入框使用同一session的值。
取值参见 addSource 对应的setID
 if(getSession('searchFreshArr') && getSession('searchFreshArr')['addSource'] && getSession('searchFreshArr')['addSource'].searchInput.length!=0){
   var thekeyword=JSON.stringify(getSession('searchFreshArr')['addSource'].keyword);
 }else{
   var thekeyword=''
 }
5.有的模块下搜索条件的数据获取必须先于列表数据的获取否则页面会报错。参见：searchContdition（产品管理-表单设计）
6.theUrl 下拉的服务地址有特殊情况传该值。
7.设置默认搜索的值（暂定只支持默认值valueType=1的）
用法：  引用的组件中 :defaultSearch="defaultSearch"
       定义变量    defaultSearch:{
                    isInput: true,
                    isSave: true,
                    isShuxing: false,
                    isShuxingzhi: true,
                    shuxing: "云控制器名称",
                    shuxingzhi: "问问",
                    valueType: 1
                  },
-->
<template>
    <div class="thesearchContent" ref='thesearchContent' v-clickoutside="handleClose">
        <div class="searchBox" ref='searchBox' @click='toFocus'>
            <div class="selectBox" ref='xialakuang' style='display:none'>
                <div class="choicebox">
                    <div class="thetop">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
                            全选
                        </el-checkbox>
                        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="city in cities" :label="city" :key="city" style='width:100px;'>
                                {{city}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <div class="thebottom">
                        <el-button size="mini" round @click.stop="sureSelect">确认</el-button>
                        <el-button size="mini" round @click.stop.prevent='cancelSelect'>取消</el-button>
                    </div>
                </div>

            </div>

            <div class="searchTag" ref="searchTag" v-for="(item,index) in choiceArr" :key="index"
                 :class="{ edit: item.isSave==false, 'noedit':item.isSave==true  }">
                <span class='thespan' v-if="item.isSave==true" @click.stop.prevent="clickTag(index,item)">{{item.shuxing}}:{{item.shuxingzhi}}</span>
                <span class='theiconbox' v-if="item.isSave==true" @click.stop.prevent='closeItem(index,item)'>
                <svg-icon icon-class='close' class='theicon'></svg-icon>
            </span>
                <div class="hqwidth" ref='hqwidth'>
                    <span ref='hqsxWidth'>{{item.shuxing}}</span>:
                    <span ref='hqsxzWidth'> {{item.shuxingzhi}}</span>
                </div>
                <span class="inputbox" v-show="item.isSave==false">
              <el-tooltip class="item" effect="dark" content="输入框内点击Enter确认搜索" placement="top-start">
                <input type='text' class="attrInput" ref='sxInput' :disabled='item.isShuxingzhi==true' v-model="item.shuxing"
                       @input="sxChange(index,item)" @focus.prevent="thefocusSX(index,item.shuxing)"
                       @keyup.enter="SXenterFu(index,item)"/>
              </el-tooltip>
              <span v-if="item.isInput==true">:</span>

              <div class="selectBox" v-show='item.isShuxing==true'>
                <ul>
                  <li style="color: #bbb;">选择资源属性进行过滤</li>
                  <li class='theli'
                          v-for="(item1,index1) in selectArr" :key="item1.key"
                          @click="choicEnum(item1,index,index1)"
                          v-show=" ((item1.value.indexOf(item.shuxing)>-1 && item1.is_select==false) || item1.value==item.shuxing)"
                  >{{item1.value}}</li>
                </ul>
              </div>
              <span style="position:relative">
                  <input type="text" class="attrValueInput" v-show="item.isInput==true" ref='sxzInput' v-model="item.shuxingzhi"
                         @input="sxzChange(index,item)" @keyup.enter="theenterFu(item.shuxingzhi)"
                         @focus.prevent="thefocusSXZ(index,item)"/>
                  <div class='refbox' ref='refbox'>

                  </div>
              </span>
            </span>
            </div>
            <div class="theplaceholder" ref='theplaceholder' style='width:calc(100% - 80px)'>多个关键字用竖线 “|”
                分隔，多个过滤标签用回车键分隔
            </div>
        </div>
        <div class="tipbox">
            <span @click='clearInput'><svg-icon icon-class='close' class='theicon' v-if='choiceArr.length>1'></svg-icon></span>
            <span @click='startSearch'><svg-icon icon-class='search' class='theicon'></svg-icon></span>
            <el-tooltip class="item" effect="dark" content="多个关键字用竖线 “|” 分隔，多个过滤标签用回车键分隔" placement="top">
                <span v-show="isTip==true"><svg-icon icon-class='tip' class='theicon'></svg-icon></span>
            </el-tooltip>
        </div>
    </div>
</template>

<script>

  import {enumSearech} from '@/request/api/searchCom/search.js';
  import {setSession, getSession} from '@/commons/js/searchFresh.js';
  import {clickoutside} from '@/directive/clickoutside.js';

  export default {
    props: {
      theItems: {
        type: String,
      },
      serviceType: {
        type: String,
      },
      setId: {
        type: String,
        default: null,
      },
      isSave: {
        type: Boolean,
        default: true,
      },
      theUrl: {
        type: String,
        default: '/v1/api/search_items',
      },
      defaultSearch:{
        type:Object,
        default:null
      }
    },
    data() {
      return {
        isTip: false,
        checkAll: false,
        checkedCities: [],
        checkedCitiesBF:'',
        cities: [],
        isIndeterminate: false,
        cityOptions: [],

        disabled: false,
        choiceArr: [],
        selectArr: [],
        tpzz: [],
        clickIndex: -1,
        isedit: false,
        zjenter: '',
        cancelObj: {
          shuxing: '', shuxingzhi: '', valueType: 1,
        },
        editIndex: -1,
        focusIndex: -1,
        enumIndex: -1,
        isSearch:false,
        isfocus:true
      };
    },
    directives: {clickoutside},
    watch: {},
    mounted() {
      this.getListData();
      if (!(this.$route.query.menu_id == getSession('bjid'))) {
        if (this.setId == null && this.isSave) {
          var obj = {
            keyword: {},
            searchInput: [],
            pageNo: 1,
            pageSize: 10,
          };
          setSession('searchFresh', obj);
          sessionStorage.removeItem('searchFreshArr');
        } else if (this.setId != null && this.isSave) {
          var obj = {
            keyword: {},
            searchInput: [],
            pageNo: 1,
            pageSize: 10,
          };
          setSession('searchFreshArr', obj, this.setId);
        }
      }

      setSession('bjid', this.$route.query.menu_id);

    },
    updated() {
    },
    methods: {
      handleClose(e) {
        this.isTip = false;
        if (this.focusIndex != -1) {
          if(this.choiceArr[this.focusIndex].shuxing!=''&&this.choiceArr[this.focusIndex].shuxingzhi==''){
            this.cancelSelect();
          }
          this.choiceArr[this.focusIndex].isShuxing = false;
          if (this.choiceArr[this.focusIndex].shuxingzhi == '' && this.choiceArr[this.focusIndex].shuxing == '') {
            this.choiceArr[this.focusIndex].isShuxing = false;
            this.choiceArr[this.focusIndex].isShuxingzhi = false;
            this.choiceArr[this.focusIndex].isSave = false;
            this.choiceArr[this.focusIndex].isInput = false;
          }
          //this.focusIndex = -1;
        }
        if (e.target.className != 'thespan') {
          this.$refs.xialakuang.style.display = 'none';
        }

      },
      toFocus() {
        if(this.isfocus){
          this.$nextTick(function () {
          //this.$refs.sxInput[this.choiceArr.length-1].focus();
          if (this.choiceArr[this.choiceArr.length - 1].shuxing == '') {
            this.$refs.sxInput[this.choiceArr.length - 1].focus();
          } else {
            this.$refs.sxzInput[this.choiceArr.length - 1].focus();
          }

        });
        }
      },
      sxChange(index, val) {
        this.$nextTick(function () {
          this.$refs.sxInput[index].style.width = (4 + this.$refs.hqsxWidth[index].offsetWidth) + 'px';
          this.widthChange(index);
        });
      },
      widthChange(index) {
        var owidth = 0;
        for (var q = 0; q < index; q++) {
          owidth += parseInt(this.$refs.searchTag[q].offsetWidth);
        }
        var sx = parseInt(this.$refs.hqsxWidth[index].offsetWidth);
        var sxz = parseInt(this.$refs.hqsxzWidth[index].offsetWidth);
        //var szWidth=this.$refs.searchBox.offsetWidth-owidth-140-sx-sxz;
        var szWidth = owidth + 140 + sx + sxz;
        this.$refs.theplaceholder.style.width = `calc(100% - ${szWidth}px)`;
        if (this.$refs.theplaceholder.offsetWidth <= 360) {
          this.$refs.theplaceholder.style.width = '360px';
        }
        /* if(this.$refs.searchBox.offsetWidth<=760){
          this.$refs.theplaceholder.style.display='none'
        }else{
          this.$refs.theplaceholder.style.display='inline-block'
        } */
      },
      sxzChange(index, item) {
        var str = item.shuxingzhi.split('|');
        if (item.valueType == 3) {
          //if(this.checkedCities.length==0) return

          this.checkedCities = [];
          for (var i = 0; i < str.length; i++) {

            if (this.cityOptions.indexOf(str[i]) > -1) {
              this.checkedCities.push(str[i]);
            }
          }
          //this.choiceArr[index].shuxingzhi=this.checkedCities.join("|")
          this.choiceArr[index].shuxingzhi = this.checkedCities.join('|');
        }
        this.$nextTick(function () {
          this.setInputWidth(index);
          this.widthChange(index);
        });
      },
      placeWidth() {
        this.$nextTick(function () {
          var len = this.$refs.searchTag.length;
          var owidth = 0;
          for (var q = 0; q < len; q++) {
            owidth += parseInt(this.$refs.searchTag[q].offsetWidth);
          }
          var szWidth = owidth + 100;
          this.$refs.theplaceholder.style.width = `calc(100% - ${szWidth}px)`;
          if (this.$refs.theplaceholder.offsetWidth <= 360) {
            this.$refs.theplaceholder.style.width = '360px';
          }
          /* if(this.$refs.searchBox.offsetWidth<=760){
            this.$refs.theplaceholder.style.display='none'
          }else{
            this.$refs.theplaceholder.style.display='inline-block'
          } */

        });
      },
      SXenterFu(index, item) {
        if (item.shuxing == '') return;
        this.zjenter = item.shuxing;
        var result = this.selectArr.find(val => {
          return val.value == this.zjenter;
        });
        if (result == undefined) {
          var aa = this.searchOptionStr();
          if (aa == undefined) {
            this.$message({
              message: '请选择属性值',
              type: 'warning',
            });
            return;
          }
          this.choiceArr[index].shuxing = aa;

          this.choiceArr[index].shuxingzhi = this.zjenter;
          this.zjenter = this.choiceArr[index].shuxing;
          this.theenterFu(this.zjenter);
        } else {
          this.choiceArr[index].shuxing = this.zjenter;

          this.$nextTick(function () {
            this.$refs.sxzInput[index].focus();
            this.setInputWidth(index);
          });
        }
      },
      searchOptionStr() {
        for (var i = 0; i < this.selectArr.length; i++) {
          if (this.selectArr[i].is_select == false && this.selectArr[i].valueType == 1) {
            return this.selectArr[i].value;
          }
        }
      },
      isFull(val) {
        for (var i = 0; i < val.length; i++) {
          if (val[i].shuxing == '' && val[i].shuxingzhi == '') {
            return false;
          }
        }
        return true;
      },
      setSeData(obj) {
        if (this.isSave) {
          if (this.setId != null) {
            setSession('searchFreshArr', obj, this.setId);
          } else {
            setSession('searchFresh', obj);
          }
        }

      },
      closeItem(index, val) {
        if (this.isFull(this.choiceArr)) {
          var obj = {
            shuxing: '',
            shuxingzhi: '',
            isShuxing: false,
            isShuxingzhi: false,
            isSave: false,
            isInput: false,
          };
          this.choiceArr.push(obj);
        }
        this.choiceArr.splice(index, 1);
        var a = this.dealData(this.choiceArr);
        var obj = {
          keyword: a,
          searchInput: this.choiceArr,
          pageNo: 1,
        };
        //setSession('searchFresh',obj)
        this.setSeData(obj);
        this.$emit('toSearch', a);
        this.$refs.xialakuang.style.display = 'none';
        var len = this.choiceArr.length;
        if (len == this.tpzz.length) {
          this.$nextTick(function () {
            if (this.$refs.sxInput[len - 1] != undefined) {
              this.$refs.sxInput[len - 1].style.width = 4 + 'px';
            }
          });
        } else if (len - 1 == index) {
          this.$nextTick(function () {
            if (this.$refs.sxInput[index] != undefined) {
              this.$refs.sxInput[index].style.width = 4 + 'px';
            }
          });
        } else {
          this.$nextTick(function () {
            if (this.$refs.sxInput[index + 1] != undefined) {
              this.$refs.sxInput[index + 1].style.width = 4 + 'px';
            }
          });
        }

        for (var i = 0; i < this.tpzz.length; i++) {
          if (this.tpzz[i].value == val.shuxing) {
            this.tpzz[i].is_select = false;
          }
        }
      },
      clearInput() {
        this.choiceArr = [
          {
            shuxing: '',
            shuxingzhi: '',
            isShuxing: false,
            isShuxingzhi: false,
            isSave: false,
            isInput: false,
          }];
        this.focusIndex = -1;
        this.$refs.xialakuang.style.display = 'none';
        this.$refs.sxInput[0].style.width = 4 + 'px';
        for (var i = 0; i < this.selectArr.length; i++) {
          this.selectArr[i].is_select = false;
        }
        var a = this.dealData(this.choiceArr);
        var obj = {
          keyword: a,
          searchInput: this.choiceArr,
          pageNo: 1,
        };
        //setSession('searchFresh',obj)
        this.setSeData(obj);
        this.$emit('toSearch', a);

      },
      startSearch() {
        this.$nextTick(function () {
          if (this.choiceArr[this.choiceArr.length - 1].shuxing == '') {
            this.$refs.sxInput[this.choiceArr.length - 1].focus();
          } else {
            this.$refs.sxzInput[this.choiceArr.length - 1].focus();
            this.theenterFu(this.$refs.sxzInput[this.choiceArr.length - 1].value);
          }

        });
        //this.toFocus();
        /* var a=this.dealData(this.choiceArr);
        var obj={
            keyword:a,
            searchInput:this.choiceArr,
            pageNo:1
        }
        //setSession('searchFresh',obj)
        this.setSeData(obj)
        this.$emit('toSearch',a); */
      },
      choicEnum(item, index, index1) {
        this.choiceArr[index].isInput = true;
        this.choiceArr[index].shuxing = item.value;
        this.choiceArr[index].valueType = item.valueType;
        this.choiceArr[index].isShuxing = false;
        this.enumIndex = index1;

        if (item.valueType == 3) {
          this.checkAll = false;
          this.checkedCities = [];
          this.isIndeterminate = false;
          this.cities = item.options.slice();
          this.cityOptions = item.options.slice();
        }

        this.$nextTick(function () {
          this.$refs.sxzInput[index].focus();
          this.setInputWidth(index);
          this.widthChange(index);
        });
      },
      theenterFu(val) {
        this.isTip = false;
        if (val == '') return;
        if (this.zjenter != '') {
          for (var i = 0; i < this.selectArr.length; i++) {
            if (this.selectArr[i].value == this.zjenter) {
              this.selectArr[i].is_select = true;
            }
          }
        }
        if (this.choiceArr.length < this.tpzz.length && this.isedit == false) {
          var obj = {
            shuxing: '',
            shuxingzhi: '',
            isShuxing: false,
            isShuxingzhi: false,
            isSave: false,
            isInput: false,
          };
          this.choiceArr.push(obj);
        }
        for (var i = 0; i < this.choiceArr.length; i++) {
          if (this.choiceArr[i].shuxingzhi != '' && this.choiceArr[i].shuxing != '') {
            this.choiceArr[i].isSave = true;
            this.choiceArr[i]['isShuxingzhi'] = true;
          }
        }
        this.isedit = false;
        this.zjenter = '';
        if (this.enumIndex != -1) {
          this.selectArr[this.enumIndex].is_select = true;
        }
        this.enumIndex = -1;
        var a = this.dealData(this.choiceArr);
        var obj = {
          keyword: a,
          searchInput: this.choiceArr,
          pageNo: 1,
        };
        //setSession('searchFresh',obj)
        this.setSeData(obj);
        this.$emit('toSearch', a);
      },
      dealDataBF(val) {
        var arr = [];
        for (var i = 0; i < val.length; i++) {
          var obj = {};
          for (var j = 0; j < this.selectArr.length; j++) {
            if (this.selectArr[j].value == val[i].shuxing && this.selectArr[j].valueType == 1) { //str
              obj[this.selectArr[j].key] = val[i].shuxingzhi;
              obj.valueType = 1;
            } else if (this.selectArr[j].value == val[i].shuxing && this.selectArr[j].valueType == 3) {//select
              obj.valueType = 3;
              var a = val[i].shuxingzhi.split('|');
              var b = this.selectArr[j].options;
              var d = this.selectArr[j].optionsValue;
              var c = '';
              for (var z = 0; z < a.length; z++) {
                for (var x = 0; x < b.length; x++) {
                  if (a[z] == b[x]) {
                    c += d[x] + '|';
                  }
                }
              }
              var e = c.substring(0, c.length - 1);
              obj[this.selectArr[j].key] = e;
            }
          }
          arr.push(obj);
        }
        return arr;
      },
      dealData(val) {
        this.placeWidth();
        var obj = {};
        var DataList=getSession('searchFresh').keyword;
        for(z in DataList){
          if(z=='key_json'){
            obj.key_json=DataList[z];
          }
        }
        for (var i = 0; i < val.length; i++) {
          for (var j = 0; j < this.selectArr.length; j++) {
            if (this.selectArr[j].value == val[i].shuxing && this.selectArr[j].valueType == 1) { //str
              obj[this.selectArr[j].key] = val[i].shuxingzhi.replace('｜', '|');
            } else if (this.selectArr[j].value == val[i].shuxing && this.selectArr[j].valueType == 3) {//select
              var a = val[i].shuxingzhi.split('|');
              var b = this.selectArr[j].options;
              var d = this.selectArr[j].optionsValue;
              var c = '';
              for (var z = 0; z < a.length; z++) {
                for (var x = 0; x < b.length; x++) {
                  if (a[z] == b[x]) {
                    c += d[x] + '|';
                  }
                }
              }
              var e = c.substring(0, c.length - 1);
              obj[this.selectArr[j].key] = e;
            }
          }

        }
        return obj;
        //return arr;
      },

      clickTag(index, val) {
        this.isSearch=true
        this.focusIndex=index;
        /* this.editIndex=index; */
        this.clickIndex = index;
        this.isedit = true;
        this.choiceArr[index].isSave = false;
        this.checkboxChange(val, index);

      },
      checkboxChange(val, index) {
        var sx = val.shuxing;
        var theindex = -1;
        var arr = [];
        for (var i = 0; i < this.selectArr.length; i++) {
          if (sx == this.selectArr[i].value) {
            arr = this.selectArr[i].options;
            theindex = i;
            break;
          }
        }
        var str = val.shuxingzhi;

        if (str == '') {
          this.checkedCities = [];
        } else {
          var str1 = str.split('|');
          this.checkedCities = str1.slice();
          this.checkedCitiesBF=str;
        }
        this.cityOptions = this.selectArr[theindex].options.slice();
        this.cities = this.selectArr[theindex].options.slice();
        let checkedCount = this.checkedCities.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        this.$nextTick(function () {
          if (val.valueType != 3) {
            this.$refs.xialakuang.style.display = 'none';
          } else {
            this.$refs.xialakuang.style.display = 'block';
            this.$refs.refbox[index].appendChild(this.$refs.xialakuang);
            this.isfocus=false
          }

          this.$refs.sxzInput[index].focus();
          this.setInputWidth(index);
        });
      },
      thefocusSXZ(index, item) {
        this.isTip = true;
        this.clickIndex = index;
        this.checkboxChange(item, index);
        /*this.$nextTick(function(){
           if(item.valueType==3){
            var sx=item.shuxing;
             var theindex=-1;
            var arr=[];
            for(var i =0;i<this.selectArr.length;i++){
                if(sx==this.selectArr[i].value){
                  arr=this.selectArr[i].options;
                  theindex=i;
                  break;
                }
            }
        var str=item.shuxingzhi;
        var str1=str.split("|");
        this.checkedCities=str1.slice();
        this.cityOptions=this.selectArr[theindex].options.slice();
        this.cities=this.selectArr[theindex].options.slice();
        let checkedCount = this.checkedCities.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;

            this.$refs.xialakuang.style.display='block'
            this.$refs.refbox[index].appendChild(this.$refs.xialakuang);
          }
        })*/
      },
      thefocusSX(index, val) {
        this.isTip = true;
        this.focusIndex = index;
        for (var i = 0; i < this.choiceArr.length; i++) {
          this.choiceArr[i].isShuxing = false;
        }
        this.choiceArr[index].isShuxing = true;
      },
      setInputWidth(index) {
        this.$nextTick(function () {
          if (this.$refs.sxInput[index] != undefined) {
            this.$refs.sxInput[index].style.width = (4 + this.$refs.hqsxWidth[index].offsetWidth) + 'px';
          }
          if (this.$refs.sxzInput[index] != undefined) {
            this.$refs.sxzInput[index].style.width = (4 + this.$refs.hqsxzWidth[index].offsetWidth) + 'px';
          }
        });
      },
      cancelSelect() {
        this.isfocus=true
        if(this.isSearch==false){ //未搜索
          this.choiceArr[this.focusIndex].isInput=false;
          this.choiceArr[this.focusIndex].isSave=false;
          this.choiceArr[this.focusIndex].isShuxing=false;
          this.choiceArr[this.focusIndex].isShuxingzhi=false;
          this.choiceArr[this.focusIndex].shuxing='';
          this.choiceArr[this.focusIndex].shuxingzhi='';
          this.choiceArr[this.focusIndex].valueType=1;
        }else{                    //已搜索
          this.choiceArr[this.focusIndex].isInput=true;
          this.choiceArr[this.focusIndex].isSave=true;
          this.choiceArr[this.focusIndex].isShuxing=false;
          this.choiceArr[this.focusIndex].isShuxingzhi=false;
          this.choiceArr[this.focusIndex].shuxingzhi=this.checkedCitiesBF;
          this.choiceArr[this.focusIndex].valueType=3;
        }
        this.setInputWidth(this.focusIndex);
        this.$refs.xialakuang.style.display = 'none';
        this.isSearch=false;
      },
      sureSelect() {
        this.isfocus=true
        var str = this.checkedCities.join('|');
        this.theenterFu(str);
      },
      handleCheckAllChange(val) {
        this.checkedCities = val ? this.cityOptions : [];
        this.isIndeterminate = false;
        this.selectMth();
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        this.selectMth();
      },
      selectMth() {
        var str = '';
        var len = this.checkedCities.length - 1;
        for (var i = 0; i < this.checkedCities.length; i++) {
          if (i == len) {
            str += this.checkedCities[i];
          } else {
            str += this.checkedCities[i] + '|';
          }
        }
        this.choiceArr[this.clickIndex].shuxingzhi = str;
        this.setInputWidth(this.clickIndex);
        this.widthChange(this.clickIndex);
      },
      getListData() {
        var params = {
          service_type: this.serviceType,
          item: this.theItems,
        };
        enumSearech('get', params, this.theUrl).then(res => {
          this.tpzz = res.data.items;
          this.selectArr = res.data.items;
          if (getSession('searchFresh') != null && getSession('searchFresh').searchInput.length != 0 && this.setId ==
            null) {
            this.choiceArr = getSession('searchFresh').searchInput;
          } else {
            if(this.defaultSearch!=null){   //默认值
                this.choiceArr=[]
                this.choiceArr.push(this.defaultSearch)
                var obj = {
                  shuxing: '',
                  shuxingzhi: '',
                  isShuxing: false,
                  isShuxingzhi: false,
                  isSave: false,
                  isInput: false,
                };
                this.choiceArr.push(obj);
                var a=this.dealData(this.choiceArr);
                var obj4={
                  keyword:a,
                  searchInput:this.choiceArr,
                  pageNo:1
                }
                this.setSeData(obj4)
            }else{
              this.choiceArr = [];
              var obj = {
                shuxing: '',
                shuxingzhi: '',
                isShuxing: false,
                isShuxingzhi: false,
                isSave: false,
                isInput: false,
              };
              this.choiceArr.push(obj);
            }
          }
          if (this.$listeners['searchContdition']) {
            this.$emit('searchContdition');
          }
          if (getSession('searchFreshArr') != null && this.setId != null) {
            if (getSession('searchFreshArr')[this.setId] &&
              getSession('searchFreshArr')[this.setId].searchInput.length != 0) {
              this.choiceArr = getSession('searchFreshArr')[this.setId].searchInput;
            } else {
              this.choiceArr = [];
              var obj = {
                shuxing: '',
                shuxingzhi: '',
                isShuxing: false,
                isShuxingzhi: false,
                isSave: false,
                isInput: false,
              };
              this.choiceArr.push(obj);
            }

          }
          for (var i = 0; i < this.choiceArr.length - 1; i++) {
            this.choiceArr[i]['isShuxing'] = false;
            this.choiceArr[i]['isSave'] = true;
            this.choiceArr[i]['isShuxingzhi'] = true;
            for (var j = 0; j < this.selectArr.length; j++) {
              if (this.selectArr[j].value == this.choiceArr[i].shuxing) {
                this.selectArr[j].is_select = true;
              }
            }
          }
          this.placeWidth();
        });

      },
    },
  };
</script>

<style lang="less" scoped>
    .thesearchContent {
        width: 100%;
        background: #fff;
        position: relative;
        /*min-height:50px;*/
        /*padding-top:10px;*/
        .tipbox {
            position:absolute;
            right:20px;
            top:50%;
            margin-top:-9px;
            .theicon {
                color: #666;
                cursor: pointer;
                font-size: 18px;
            }
        }
        .searchBox {
            position: relative;
            line-height: 30px;
            margin: 0;
            padding: 0 70px 0 4px;
            border-radius: 14px;
            border: 1px solid rgba(51,42,124,0.45);
            .selectBox {
                max-height: 300px;
                border: 1px solid #ddd;
                background-color: #fff;
                box-shadow: 0 2px 3px 0 rgba(0, 0, 0, .2);
                width: 150px;
                top: 20px;
                padding-top: 10px;
                left: 0px;
                position: absolute;
                z-index: 999;
                .choicebox {
                    max-height: 300px;
                    width: 135px;
                    margin-left: 15px;
                    position: relative;
                    .thetop {
                        max-height: 164px;
                        height: calc(100% - 36px);
                        overflow-y: auto;
                        overflow-x: hidden;
                    }
                    .thebottom {
                        border-top: 1px solid #d1d2d3;
                        height: 36px;
                        bottom: 0px;
                        left: 10px;
                        width: 130px;
                        padding-top: 2px;
                    }
                }
            }
            .searchTag {
                position: relative;
                color: #000;
                line-height: 22px;
                height: 22px;
                display: inline-block;
                margin: 0px 4px 0 0;
                /* overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                max-width: 500px; */
                vertical-align: middle;
                .inputbox {
                    .refbox {
                        position: absolute;
                        left: 0px;
                        top: 0px;
                    }
                    position: relative;
                    .selectBox {
                        max-height: 300px;
                        border: 1px solid #ddd;
                        background-color: #fff;
                        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
                        width: 175px;
                        top: 20px;
                        left: 0px;
                        position: absolute;
                        z-index: 999;
                        ul {
                            overflow-y: auto;
                            height: 100%;
                            li {
                                cursor: pointer;
                                font-size: 14px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                color: #333;
                                height: 30px;
                                line-height: 30px;
                                padding: 0px 10px;
                            }
                            :hover {
                                background: #eee;
                            }
                        }
                    }
                    input {
                        width: 4px;
                        border: 0px;
                        outline: none;
                        font-size: 14px;
                    }
                }
                .thespan {
                    font-size: 14px;
                }
                .theiconbox {
                    position: absolute;
                    right: 5px;
                    top: 0px;
                    cursor: pointer;
                    z-index: 666;
                    .theicon {
                        font-size: 16px;
                        color: #666;
                    }
                }

            }
            .edit {
                background-color: #fff;
            }
            .noedit {
                padding: 0px 25px 0px 10px;
                background-color: #e5e5e5;
            }
            .theplaceholder {
                line-height: 21px;
                font-size: 14px;
                margin-top: 4px;
                color: #bbb;
                display: inline-block;
                cursor: default;
            }
            .hqwidth {
                position: absolute;
                top: 0px;
                left: 0px;
                white-space: pre;
                font-size: 14px;
                background: #fff;
                opacity: 0;
                z-index: -1
            }

        }
    }
</style>
