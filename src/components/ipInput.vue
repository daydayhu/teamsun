

<template>
  <div class="ipAdress">
    <ul class="ipInput" :class="{isDisabled:isDisabled}" >
      <li :key='index' v-for="(item,index) in ipAdress">
        <input :tabindex="'ipInput'+(index+1)" :class="'ipAdress'+(index+1)" @blur="blurFocus(index)" autocomplete="off" :readonly="isDisabled" maxlength="3" type="tel" pattern="[0-9]{1,3}" @input="checkIpVal(item,index,$event)" :disabled="isDisabled" @keyup="turnIpPOS(item,index,$event)" @keydown="delteIP(item,index,$event)" v-model="item.value" ref="ipInput" />
        <span v-if="index<3">.</span>
      </li>
    </ul>
    
  </div>
</template>
 
<script>
  export default {
    data() {
      return {
        ipAdress: [{
          value: ''
        }, {
          value: ''
        }, {
          value: ''
        }, {
          value: ''
        }],
        //isWX:navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger"
      };
    },
    props: {
      ipStr: {
        trype: String,
        default: '1'
      },
      ipType: {
        type: String
      },
      isDisabled: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default:'100%'
      }
    },
    watch: {
      ipStr:{
        immediate:true,
        handler:function(vall) {
          let val = vall;
          let nArr = [];
          if(val && val.includes('.') && val.length > 0) {
            let valArr = val.split('.');
            let m = valArr.length;
            for(let i = 0; i < 4; i++) {
              if(valArr[i] == 'null' || valArr[i] == 'undefined'){
                valArr[i] = '';
              }
              if(i < m) {
                nArr.push({
                  value: valArr[i]
                });
              } else {
                nArr.push({
                  value: ''
                });
              }
            }
          } else {
            nArr = [{
              value: ''
            }, {
              value: ''
            }, {
              value: ''
            }, {
              value: ''
            }];
          }
          this.ipAdress = nArr;
        }
      } 
    },
    methods: {
      //methods
      blurFocus(index) {
        if(index == 3) {
          this.$emit('blur');
        }
      },
      checkIpVal(item,index,event) {
        let self = this;
        let isNo = /^[0-9]{1,3}$/g;
        if(/[^\d]/g.test(item.value)){
          let cache = JSON.parse(JSON.stringify(self.ipAdress));
          cache[index].value = item.value.replace(/[^\d]/g, "").replace(/[\.]/g, "");
          self.ipAdress = cache;
          return false;
        }
         
         
         
        if(item.value.replace(/[^\d]/g, "").length >= 3) {        
          let val = parseInt(item.value.replace(/[^\d]/g, ""), 10);
          if(isNaN(val)) {
            val = ''
          } else if(val > 255) {
            val = 255;
          } else {
            val = val < 0 ? 0 : val;
          }
          item.value = String(val);
          this.$set(this.ipAdress,index,item);
          if(index < 3 ) {         
            self.$refs.ipInput[index + 1].focus();                
          }
        }      
        let ns = '';
        this.ipAdress.forEach(item => ns += '.' + item.value);
        if(ns.length <= 4){
          this.$emit('getIP', "", this.ipType);
        }else{
          this.$emit('getIP', ns.slice(1), this.ipType);
        }
 
      },
      turnIpPOS(item, index, event) {
        let self = this;
        let e = event || window.event;
         
        if(e.keyCode == 37) {
          if(index != 0) {
            self.$refs.ipInput[index - 1].focus();
          }
        }
        //右箭头、回车键、空格键、冒号均向右跳转，右一不做任何措施
        if(e.keyCode == 39 || e.keyCode == 13 || e.keyCode == 32 || e.keyCode == 110 || e.keyCode == 46 || e.keyCode == 190 ) {
          e.preventDefault();
          e.returnValue = false;
          if(index < 3 ) {
            self.$refs.ipInput[index + 1].focus();
          }
          return false;
        }
         
      },
      delteIP(item, index, event) {  
        let self = this;
        let e = event || window.event;
         
        let val = parseInt(item.value.replace(/[^\d]/g, ""), 10);
        val = isNaN(val) ? '' : val;
        if(e.keyCode == 8 && index > 0 && val.length==0) {
            self.$refs.ipInput[index - 1].focus();
        }
      }
    },
    mounted(){
      
    }
  };
</script>
 
<style lang="less" scoped>
  @--border-color:#ccc;
  @--outline-color:transparent;
  @--font-color:#ccc;
  @base-font-size:14px;
  .ipInput {
    box-sizing: border-box;
    line-height: inherit;
    border: 1px solid @--border-color;
    overflow: hidden;
    border-radius: 14px;
    padding: 0;
    margin: 0;
    display: inline-block;
    vertical-align: middle;
    outline: @--outline-color;
    font-size:0;
    text-indent: 0;
    background: #fff;
    //width:250px;
    width:60%;
    min-width: 175px;
    height:32px;
    float: left;
    &.isDisabled {
      background: @--outline-color;
 
      li{
        cursor:not-allowed;
        input{
          cursor:not-allowed;
        }
      }
    }
    li {
      display: inline-block;
      width:25%;
      box-sizing: border-box;
      font-size:0;
      height:32px;
      position: relative;
      input {
        appearance: none; 
        padding:9px;
        width: calc(100% - 3px);
        text-align: center;
        outline: none;
        border: none;
        color: #333;
        box-sizing: border-box;
        font-size: @base-font-size;
        &:disabled {
          background: @--outline-color;
        }
      }
      span {
        display: inline-block;
        font-size:18px;
        font-weight:900;
        width: 3px;
        color:#999;
        position: absolute;
        right:0px;
        top:-4px
      }
    }
  }
</style>