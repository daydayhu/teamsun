<template>
  <div class="main">
    <pageHeader title="模板管理" >
    </pageHeader>
    <div class="ts-middle-part">
      <enumSearch
        :theItems="'templates'"
        :theUrl="'/v1/api/app/search_items'"
        @toSearch="toSearch"
        @searchContdition="searchContdition"
      ></enumSearch>
    </div>
    <div class="ts-body-part">
        <div v-loading="serviceListLoading" class="main-content">
          <el-row>
            <el-col :span="6" v-for="(item, key) in serviceList" :key="key" class="col">
              <div class="card-wrapper g_serviceItem_base">
                <div class="service-wrap" @click="applyTo(item)">
                  <div class="item">
                    <el-avatar style="padding:10px;box-shadow: 0px 5px 8px 0px rgba(51,42,124,0.15);" :size="56" :src="defaultIconUrl"></el-avatar>
                  </div>
                  <div class="item right">
                    <span>{{item.template_name}}</span>
<!--                    <p class="step">{{item.ticket_step_type.value || ''}}</p>-->
                    <p class="remarks">描述：{{item.remarks || ''}}</p>
                  </div>
                  <div class="status-c">
                    <img :src="productStatusInfo[item.template_status.key].url" alt="">
                    <div class="text g_serviceItem_status_font_color"><span>{{item.template_status.value}}</span>
                    </div>
                  </div>
                </div>
                <div class="footer">
                  <div class="footer-content" v-if="item.template_status.key != 2">
                    <div class="item" @click="handleExport(item)" v-if="item.template_status.key === 1">
                      <svg-icon icon-class="template-export"></svg-icon>
                      <span>导出</span>
                    </div>
                    <div class="item" @click="handleDownload(item)" v-if="item.template_status.key === 1">
                      <svg-icon icon-class="ops_service_falling"></svg-icon>
                      <span>下架</span>
                    </div>
                    <div class="item" @click="handlePublic(item)" v-if="item.template_status.key === 0" style="border-right: 0">
                      <svg-icon icon-class="ops_service_publish"></svg-icon>
                      <span>发布</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col v-if="serviceList.length === 0" style="text-align:center;margin-top:100px;">
              <img src="@/commons/images/g_empty.svg" />
              <div>暂无数据</div>
            </el-col>

          </el-row>
        </div>
    </div>
  </div>
</template>

<style src="./index.less" lang="less" scoped></style>
