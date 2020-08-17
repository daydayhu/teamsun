<template>
  <div class="applyService" ref="driverWrap">
    <!-----------------------样式修改后--------顶部---------------------------------->
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader :title="'申请'+pageTitle" back :rightWidth="12" @handleBack="goBack">
      <template v-slot:right>
        <el-steps class="ts-custom-steps" :active="active" finish-status="success">
          <el-step title="基本信息"></el-step>
          <el-step title="部署视图"></el-step>
          <el-step title="交付计划"></el-step>
        </el-steps>
      </template>
    </pageHeader>
      <!-- ------------------------切换步骤视图 --------------------->
      <router-view @stepChange="applyServiceStepChange" @changeTitle="changeTitle"></router-view>

    <!-- <div class="baseForm_card">
    <el-card >
      <div slot="header" class="clearfix">
        <span>部署视图</span>
      </div>
      <div class="baseForm_wrap">
        <div class="baseForm_content">

          <div class="canvasBox">
            画布区域
            <br/>
            画布区域
            <br/>
            画布区域
            <br/>
            画布区域
            <br/>
            画布区域
            <br/>
            画布区域
          </div>

          <div class="formList">
            <div class="card-info" :style="'top:'+height">
              <div class="formList_title">
                <b>VM1</b>
                <el-divider direction="vertical"></el-divider>
                <span>交付次序</span>
                <div style="float: right;">
                  <el-button @click="save" type="primary">保存</el-button>
                  <el-button @click="changeHeight(40)" type="text">40%</el-button>
                    <el-button @click="changeHeight(60)" type="text">60%</el-button>
                    <el-button @click="changeHeight(70)" type="text">70%</el-button>
                </div>
              </div>
              <div v-if="step === 'deploy'">
                <component
                    v-for="(item, index) in formList"
                    :key="index"
                    :is="item"
                    :ref="item.name">
                </component>
              </div>
              <deliverPlan v-else></deliverPlan>
            </div>
          </div>
        </div>
        <div class="baseForm_footer">
          <el-button @click="cancalBack">取消</el-button>
            <el-button
                v-if="step === 'deploy'"
                @click="changeStep"
                type="primary"
                style="float:right">
                下一步：交付计划
            </el-button>
            <div v-else>
                <el-button @click="lastStep">上一步</el-button>
                <el-button type="primary">确定</el-button>
            </div>
        </div>
      </div>
    </el-card>
    </div> -->

    <!-------------------------------底部---------------------------------->
    <!-- <div class="ts-content-wrap">
			<div class="table-container">
				<div class="htBox">
                    <div class='thetitle'>部署视图</div>
                    <div class="canvasBox">
                    </div>
                </div>
                <el-card class="card-info" :style="'top:'+height">
                    <div slot="header">
                        <span>表单信息</span>
                        <div style="float: right;">
                            <el-button @click="changeHeight(40)" type="text">40%</el-button>
                            <el-button @click="changeHeight(60)" type="text">60%</el-button>
                            <el-button @click="changeHeight(70)" type="text">70%</el-button>
                        </div>
                    </div>
                    <component
                        v-for="(item, index) in formList"
                        :key="index"
                        :is="item">
                    </component>
                </el-card>
			</div>
		</div>
        <el-card class="card-footer" ref="cardFooter" :style="'width:'+width">
            <el-button @click="cancalBack">取消</el-button>
            <el-button
                v-if="step === 'deploy'"
                @click="changeStep"
                type="primary"
                style="float:right">
                下一步：交付计划
            </el-button>
            <div v-else style="float:right">
                <el-button @click="lastStep">上一步</el-button>
                <el-button type="primary">确定</el-button>
            </div>
        </el-card> -->
  </div>
</template>
<script>
// import opsForm from './formComponents/ops'
// import vmwareForm from './formComponents/vmware.vue'
// import productForm from './formComponents/product.vue'
// import quickApplyOpenstack from './formComponents/quickApplyOpenstack'
// import deliverPlan from './formComponents/deliverPlan'
//引入公共头部组件
import pageHeader from "@/components/pageHeader.vue"
export default {
  name: 'applyService',
  components: {
    pageHeader,
    // opsForm,
    // vmwareForm,
    // productForm,
    // quickApplyOpenstack,
    // deliverPlan
  },
  data() {
    return {
      //页面标题名称
      pageTitle: "VMwarVM+Tomcat+Apache",
      //step值
      active: 0,
      // formList:[vmwareForm,productForm],
      // width:'0px',
      // height: '60%',
      // step:'deploy',
      //  observer:null,
    };
  },
  computed: {

  },
  mounted() {
    this.pageTitle=this.$route.query.pageTitle
    //获取面包屑标题
    // this.breadCrumbData[1].name = "申请" + this.pageTitle
    // console.log(this.$refs.cardFooter.style)
    //    this.width = this.$refs.driverWrap.offsetWidth + 'px'
    //   this.$refs.cardFooter.style
    //监控内容部分的宽度
    // this.observerWidth()
  },
  methods: {
    //监听step变化
    applyServiceStepChange(val) {
      this.active = val
    },
     //监听标题变化
    changeTitle(val){
     // this.pageTitle=val
    },
    //头部返回按钮事件
    goBack() {
      history.back()
    },
    // changeHeight(value) {
    //     this.height = (100 - value) + "%"
    // },
    // changeStep() {
    //     this.step = 'deliverPlan'
    // },
    // lastStep() {
    //     this.step = 'deploy'
    // },
    // cancalBack() {
    //     if(this.step === 'deploy') {
    //         this.$router.push({
    //             name:'serviceCatalog'
    //         })
    //     } else {
    //         this.$router.push({
    //             name:'applicationSystem'
    //         })
    //     }
    // }
    // observerWidth() {
    //     let that = this
    //     let MutationObserver = window.MutationObserver
    //     let el = document.querySelector(".driver-wrap")
    //     this.observer = new MutationObserver(function (mutations) {
    //         that.width = that.$refs.driverWrap.offsetWidth + 'px'
    //     });

    //     let config = {
    //         // "childList" : true,//子节点的变动
    //         "attributes" : true,//属性的变动
    //         // "characterData" : true,//节点内容或节点文本的变动
    //         "subtree" : true,//所有后代节点的变动
    //         // "attributeOldValue" : true,//表示观察attributes变动时，是否需要记录变动前的属性
    //         // "characterDataOldValue" : true//表示观察characterData变动时，是否需要记录变动前的值
    //     }

    //     this.observer.observe(el, config);
    // },
    //  save(){
    //     this.$refs.quickApplyOpenstack[0].createIronicTicketPost()
    // }
  },
  // beforeDestroy() {
  //     this.observer.disconnect()
  // }
};
</script>

<style lang="less" scoped>
//样式修改后-顶部
.applyService {
  height: 100%;
  // /deep/.baseForm_card {
  //   height: 100%;
  //   padding-bottom: 60px;
  // }

  // .formList_title{
  //   padding: 20px;
  // }
}
.main-container {
  overflow-y: hidden !important;
}
//底部
// .driver-wrap {
//     position: relative;
//     height: 100%;
//     width: 100%;
//     .ts-header {
//         @flex();
//         height: 24px;
//         & > b {
//             font-weight: 700;
//             font-size: 16px;
//             line-height: 32px;
//             float: left;
//         }
//         & > div{
//             margin-left: auto;
//             .ts-guide{
//                 margin-right: 14px;
//             }
//             button{
//                 padding: 8px 22px;
//             }
//         }
//     }
//     .ts-content-wrap {
//         margin-top: 24px;
//         background: rgba(255,255,255,1);
//         box-shadow: 0 4px 12px 0 rgba(52,69,99,0.04);
//         border-radius: 4px;
//         overflow: hidden;
//         .table-container {
//             .htBox{
//                 height:550px;
//                 .canvasBox{
//                     height:490px;
//                     margin: 10px 40px;
//                     border:1px solid #ccc
//                 }
//             }
//             .formBox{
//                 .formComBox{
//                     margin: 10px 40px;
//                 }

//             }
//             .thetitle{
//                 height:50px;
//                 border-bottom: 1px solid grey;
//                 line-height:60px;
//                 text-indent: 40px;
//                 font-size:14px;
//                 font-weight:700;
//             }
//         }
//     }
// }

// .card-footer {
//     position: fixed;
//     bottom: 0;
// }

// .card-info {
//     position: absolute;
//     width: 100%;
//     margin-bottom: 60px;
//     min-height: 50%;
// }
</style>
