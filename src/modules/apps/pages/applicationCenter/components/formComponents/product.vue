<template>
  <div>
    <div class="content" v-if="productInfo.length!=0">
    <el-collapse v-model="activeNames">
      <el-collapse-item v-for="(item,index) in productInfo" :key="index" :name="item.table_name">
        <template slot="title">
          <div class="formTit">
            {{item.table_name}}
            <div class="line"></div>
          </div>
        </template>
        <div class="formBody" style="width:90%" v-if="item.is_multi_line==0 && item.is_column==1">
          <component
                      ref='mychildInput'
            :ActionSetFromIndex="index"
            v-for="(li, index2) in item.para_infos[0]"
            :key="index2"
            :is="li.form_type"
            :item="li"
            :serial="index2"
            :theIndex='theIndex'
            :tabIndex='index'
            :paraIndex1='index2'
            :phaseState="phaseState"
            :isEdit="li.ticket_step_type"
            @changeForms="changeForms"
          ></component>
        </div>
        <!-- item.is_column==1 -->
        <div class="thecontent" v-if="item.is_column==1 && item.is_multi_line==1">
          <ul class="theul clearFloat">
            <li class="theTit">
              <div
                class="titContent"
                v-for="(ac, index2) in item.para_infos[0]"
                :key="index2"
              >
               <el-tooltip class="item" effect="dark" :content="ac.pro_para_name" placement="top">
                <span>{{ac.pro_para_name}}</span>
                </el-tooltip>
                <span
                  style="color:#f56c6c;position:absolute;left:5px"
                  v-if="ac.is_required==1"
                >*</span>
              </div>
            </li>
            <li v-for="(ac, index2) in item.para_infos" :key="index2" style="position:relative">
              <span class="deleteBox" @click="deleteColumn(index, index2)" v-if="index2!=0"><i class="el-icon-delete" style="font-size:16px"></i>删除当前列</span>
              <div v-for="(ac1, index3) in ac" :key="index3">
                <component
                             ref='mychildInput'
                  :ActionSetFromIndex="index"
                  :is="ac1.form_type"
                  :item="ac1"
                  :serial="index3"
                  :isTitle="false"
                  :theIndex='theIndex'
                  :tabIndex='index'
                  :paraIndex='index2'
                  :paraIndex1='index3'
                  :phaseState="phaseState"
                  :isEdit="ac1.ticket_step_type"
                  @changeForms="changeForms"
                ></component>
              </div>
            </li>
          </ul>
        </div>
        <div
          v-if="item.is_multi_line==1 && item.is_column==1 && (phaseState=='1' || phaseState=='3' || phaseState=='5')"
          class="createBox"
          @click="addColumn(index)"
        >
          增加多列
          <i class="el-icon-circle-plus-outline"></i>
        </div>
        <!-- item.is_column==0 -->
        <div class="thecontent" v-if="item.is_column==0">
          <div class="inbox formBodyC" style="width:865px">
            <table>
              <thead>
                <tr>
                  <th style="text-align:center;padding-right:10px" v-if="item.para_infos.length>1">操作</th>
                  <th
                    style="position:relative"
                    v-for="(ac, index2) in item.para_infos[0]"
                    :title="ac.pro_para_name"
                    :key="index2"
                  >
                    {{ac.pro_para_name}}
                    <span
                      style="color:#f56c6c;position:absolute;left:13px"
                      v-if="ac.is_required==1"
                    >*</span>
                  </th>
                </tr>
              </thead>
              <tbody style="border-bottom:1px solid rgba(25, 34, 59, 0.03);">
                <tr v-for="(ac, index2) in item.para_infos" :key="index2" >
                  <td style="position:relative" v-if="item.para_infos.length>1">
                    <el-tooltip class="item" effect="dark" content="删除当前行" placement="top">
                    <span class="deleteBox" @click="deleteColumn(index, index2)" v-if="index2!=0"><i class="el-icon-delete" style="font-size:16px"></i></span>
                   </el-tooltip>
                   </td>
                  <td v-for="(ac1, index3) in ac" :key="index3">
                    <component
                                ref='mychildInput'
                      :ActionSetFromIndex="index"
                      :is="ac1.form_type"
                      :item="ac1"
                      :serial="index3"
                      :isTitle="false"
                      :theIndex='theIndex'
                      :tabIndex='index'
                      :paraIndex='index2'
                      :paraIndex1='index3'
                      :phaseState="phaseState"
                      :isEdit="ac1.ticket_step_type"
                      @changeForms="changeForms"
                    ></component>
                  </td>

                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div
          v-if="item.is_multi_line==1 && item.is_column==0 && (phaseState=='1' || phaseState=='3'|| phaseState=='5')"
          class="createBox"
          @click="addColumn(index)"
        >
          增加多行
          <i class="el-icon-circle-plus-outline"></i>
        </div>
        <upLoad
          @changeForms="changeForms"
          :fileList="item.file_list"
          :ActionSetFromIndex="index"
          v-if="item.is_allow_upload==1 && (phaseState=='1' || phaseState=='3'|| phaseState=='5')"
          style="width:100%;margin:0 auto;"
        ></upLoad>
      </el-collapse-item>
    </el-collapse>
  </div>
  <div class="content" v-if="productInfo.length===0">
     <el-col style="text-align:center;margin-top:60px;">
                <img src="@/commons/images/ico_kzt.png" />
                <div style="margin-top: 24px">暂无内容</div>
      </el-col>
  </div>
  </div>
</template>
<script>
import checkBox from "../formComponents/productForms/checkbox";
import dateTime from "../formComponents/productForms/dateTime";
import inPut from "../formComponents/productForms/input";
import dropDown from "../formComponents/productForms/dropdown";
import textArea from "../formComponents/productForms/textarea";
import raDio from "../formComponents/productForms/radio";
import richText from "../formComponents/productForms/richText";
import upLoad from "../formComponents/productForms/upload";
import numInput from "../formComponents/productForms/numInput";
import * as requestMethod from "@/modules/apps/api/serviceCatalog/openstack/actionSet.js";
export default {
  name: "product",
  components: {
    checkBox,
    dateTime,
    inPut,
    dropDown,
    textArea,
    raDio,
    richText,
    upLoad,
    numInput
  },
  data() {
    return {
      thedata: [
        {
          description: "xxx"
        },
        {
          description: "yyy"
        },
        {
          description: "zzz"
        }
      ],
      activeNames: 0
    };
  },
  props: {
    productInfo: {
      type: Array
    },
    canvasObj: {
      type: Object
    },
    phaseState: {
      type: String
    },
    operationSet:{
      type:Number
    },
    theIndex:{
      type:Number
    },
    alias_name:{ //操作集名称
      type:String
    }
  },
  mounted() {
    //this.activeNames=this.productInfo[0].formName
  },
  watch: {},
  methods: {
    deleteColumn(index,index2){
      this.$confirm("确认删除该数据吗?", "提示", {
        type: "warning"
      }).then(() => {
          this.productInfo[index].para_infos.splice(index2,1);
          this.delOraddColumn(index)
      })
      .catch(() => {});
    },
    addColumn(index) {
      // var obj=Object.assign({}, this.productInfo)
      var obj = JSON.parse(JSON.stringify(this.productInfo[index]));
      var arr2 = obj.para_infos[0];
      this.productInfo[index].para_infos.push(arr2);
      this.delOraddColumn(index)
    },
    delOraddColumn(index){
      var obj = {
        table_id: this.productInfo[index].service_table_id,
        file_list: this.productInfo[index].file_list,
        para_infos: this.productInfo[index].para_infos
      };
      this.saveForm(obj);
    },
    forComponentContent() {
      return this.submitForm();
    },
    SaveOperationSet(){
      var params={
        node_set_id:this.operationSet,
        tables:this.productInfo,
        alias_name:this.alias_name
      }
      var sj={
        flag:true,
        mess:""
      }
      return new Promise((resolve, reject) => {
          requestMethod.SaveAntoFormsSets(params).then(res => {
            if(res.code == 200) {
              sj.flag=true;
              sj.mess=res.message
            }else{
              sj.flag=false;
              sj.mess=res.message
            }
            resolve(sj)
          });
      })
    },
    saveForm(params) {
      requestMethod.SaveSingleForm(params).then(res => {
        /* if (res.code == 200) {
          //this.$message.success(`${res.message}`);
          this.$notify.success({
            title: "成功",
            message: `${res.message}`,
            position: "bottom-right",
            duration: 3000
          });
        } else {
          //this.$message.error(`${res.message}`);
          this.$notify.error({
            title: "成功",
            message: `${res.message}`,
            position: "bottom-right",
            duration: 3000
          });
        } */
        if (res.code != 200) {
          this.$notify.error({
            title: "失败",
            message: `${res.message}`,
            position: "bottom-right",
            duration: 3000
          });
        }
      });
    },
    toDeleteFile(path) {
      requestMethod.DeleteFileOfForm(path).then(res => {
        if(res.code!=200){
          this.$notify.error({
            title: "失败",
            message: `${res.message}`,
            position: "bottom-right",
            duration: 3000
          });
        }
      });
    },
    changeForms(val) {
      if (val.isUpload) {
        if (typeof val.value == "string") {
          //删除文件
          this.toDeleteFile(val.value);
          for (
            let i = 0;
            i < this.productInfo[val.index].file_list.length;
            i++
          ) {
            if (
              val.value == this.productInfo[val.index].file_list[i].storage_path
            ) {
              this.productInfo[val.index].file_list.splice(i, 1);
            }
          }
        } else {
          //新上传文件
          this.productInfo[val.index].file_list.push(val.value);
        }
      }else{//参数引用的更改
      for (var z = 0; z < this.productInfo.length; z++) {
        var formItems = this.productInfo[z].para_infos;
        for (var i = 0; i < formItems.length; i++) {
          for (var j = 0; j < formItems[i].length; j++) {
            if(val.ref_key_uuid){
              if(val.ref_key_uuid==formItems[i][j].key_uuid){
                  this.productInfo[z].para_infos[i][j].value=val.value
              }
            }else{
              if(val.key_uuid==formItems[i][j].ref_key_uuid){
                this.productInfo[z].para_infos[i][j].value=val.value
              }
            }
          }
        }
      }
      }
      var obj = {
        table_id: this.productInfo[val.index].service_table_id,
        file_list: this.productInfo[val.index].file_list,
        para_infos: this.productInfo[val.index].para_infos
      };
      this.saveForm(obj);
    },
    submitForm() {
      var obj = { flag: true, mess: "" };
      for (var z = 0; z < this.productInfo.length; z++) {
        var formItems = this.productInfo[z].para_infos;
        for (var i = 0; i < formItems.length; i++) {
          for (var j = 0; j < formItems[i].length; j++) {
            if (
              formItems[i][j].is_required === 1 &&
              (formItems[i][j].value == null || formItems[i][j].value == "")
            ) {
              obj.flag = false;
              obj.mess = "带*号的为必填项";
              if(formItems[i][j].form_type==='inPut'){
                this.$refs.mychildInput[j].forParent(formItems[i][j]);
              }
              return obj;
            }
            if (
              formItems[i][j].regular_text != "" &&
              formItems[i][j].value != ""
            ) {
              try {
                var reg = eval(formItems[i][j].regular_text).test(
                  formItems[i][j].value
                );
                if (!reg) {
                  obj.flag = false;
                  obj.mess = `输入的值不合规范,请重新输入`;
                  if(formItems[i][j].form_type==='inPut'){
                    this.$refs.mychildInput[j].forParent(formItems[i][j]);
                  }
                  //obj.mess=`输入的值不为${formItems[i][j].field_format.name},请重新输入`
                }
                return obj;
              } catch (err) {}
            }
          }
        }
      }
      return obj
    }
  }
};
</script>
<style lang="less" scoped>
.content {
  position: relative;
  /deep/ .el-collapse-item__arrow {
    position: absolute;
    left: 45px;
  }
  /deep/ .el-collapse-item {
    margin-bottom: 0px;
    padding: 0px 20px;
    border: 0px !important;
  }
  /deep/ .el-collapse-item__header {
    background: #fff !important;
    border-bottom: 1px solid #e7edf3;
  }
  /deep/ .el-collapse-item__content{
    padding-bottom: 0px;
  }
  .morePara {
    float: right;
    margin-right: 20px;
    line-height: 30px;
    cursor: pointer;
    color: #306bff;
    width: 80px;
  }
  .formBody {
    margin-top: 5px;
    margin-left: 120px;
  }
  .formTit {
    padding-left: 60px;
    padding-right: 20px;
    font-size: 14px;
    width: 100%;
    /deep/ .el-collapse-item__heade {
      padding-left: 0px;
    }

    .line {
      float: right;
      margin-right: 200px;
      height: 1px;
      background: #ccc;
      margin-top: 25px;
      display: none;
      width: calc(100% - 290px);
    }
  }
  .createBox {
    cursor: pointer;
    color: rgb(64, 158, 255);
    font-size: 12px;
    border: 1px dashed #ccc;
    text-align: center;
    height: 32px;
    line-height: 32px;
    margin: 0 auto;
    margin-bottom: 10px;
    margin-top: 20px;
    width: 100%;
  }
  .thecontent {
    .formBodyC {
      font-size: 14px;
      width: 700px;
      table {
        font-size: 14px;
        color: #19223b;
        table-layout: fixed;
        border-collapse: collapse;
        border-spacing: 0;
      }

      table thead {
        background: rgba(48, 107, 255, 0.03);
        border-radius: 4px;
        height: 30px;
        line-height: 30px;
      }
      table thead tr th {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #666;
        text-align: left;
        height: 50px;
        border-right: 2px solid #fff;
        line-height: 52px;
        max-width: 150px;
        padding-left: 20px;
      }
      /* table tbody tr {
          padding: 20px 0px;
          border-bottom: 1px solid rgba(216, 222, 233, 1);
        } */
      table tbody tr .deleteBox{
          position: absolute;
          margin-top:-10px;
          cursor: pointer;
          color:#306bff;
       }
      table tbody tr td {
        text-align: center;
        color: #666;
        font-size: 12px;
        padding: 10px;
      }
      table tbody tr td .inputBox {
        height: 30px;
        line-height: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    width: 100%;
    margin: 0 auto;
    overflow-x: auto;
    padding: 10px;
    margin-top: 10px;
    border-bottom: 1px solid #e7edf3;
    .theul {
      width: max-content;
      .theTit {
        width: 160px;
        .titContent {
          overflow: hidden;
          text-overflow: ellipsis;
          padding-left: 12px;
          white-space: nowrap;
          min-height: 60px;
          line-height: 60px;
          position: relative;
        }
      }
      li {
        float: left;
        padding: 5px;
        .deleteBox{
          position: absolute;
          top:-8px;
          cursor: pointer;
          color:#306bff;
        }
      }
    }
  }
}
</style>
