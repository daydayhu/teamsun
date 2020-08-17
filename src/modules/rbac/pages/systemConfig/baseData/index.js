import template from './index.vue';

import * as requestMethod from '@/modules/rbac/api/systemConfig/baseData.js';

import cloudPlatformType from './components/cloudPlatformType';
import mirrorFormat from './components/mirrorFormat';
import networkArea from './components/networkArea';
import operationSystem from './components/operationSystem';
import poolType from './components/poolType';
import resourceEnv from './components/resourceEnv';
import serviceAddress from './components/serviceAddress';
import serviceType from './components/serviceType';
import virtualType from './components/virtualType';
import cpuType from './components/cpuType';
import productClassify from './components/productClassify';
import serviceClassify from './components/serviceClassify';
import appType from './components/appType';
import businessClassify from './components/businessClassify';
import disasterLevel from './components/disasterLevel';
import tableClassify from './components/tableClassify';
import servicePath from './components/servicePath';
import networkType from './components/networkType';
import natRule from './components/natRule';
import msgType from './components/msgType';
import bareComputer from './components/bareComputer';
import emailConfig from './components/emailConfig';
import thirdPartyDocking from './components/thirdPartyDocking';
import vmwareTableSetting from './components/vmwareTableSetting';
//引入公共头部组件
import pageHeader from '@/components/pageHeader.vue';

export default {
  ...template,
  data() {
    return {
      tabPosition: 'left',
      keyMapType: {
        'os': 'operationSystem',
        'area': 'networkArea',
        'image': 'mirrorFormat',
        'virtual_type': 'virtualType',
        'server_type': 'serviceType',
        'platform': 'cloudPlatformType',
        'source_type': 'poolType',
        'env': 'resourceEnv',
        'cpu': 'cpuType',
        'soft_url': 'serviceAddress',
        'product': 'productClassify',
        'server_classify': 'serviceClassify',
        'business_classify': 'businessClassify',
        'table_classify': 'tableClassify',
        'app_type': 'appType',
        'disaster_level': 'disasterLevel',
        'server_url': 'servicePath',
        'network_type': 'networkType',
        'nat_strategy': 'natRule',
        'msg_type': 'msgType',
        'bare_machine_drive': 'bareComputer',
        'mail_setting': 'emailConfig',
        'third_party_docking': 'thirdPartyDocking',
        'vmware_table_setting': 'vmwareTableSetting'
      },
      activeName: 'os',
      originDataTree: [],
      showDataTree: [],
      searchValue: ''
    };
  },
  created() {
    this.resetActiveName();
    this.getBaseDataInfo();
  },
  methods: {
    resetActiveName() {
      this.activeName = this.$route.query.type || 'os';
      if (!this.keyMapType[this.activeName]) {
        this.activeName = 'os';
      }
    },
    getBaseDataInfo() {
      requestMethod.getBaseDataList('get').then(res => {
        if (res.code === 200) {
          this.originDataTree = this.convertToTreeData(JSON.parse(JSON.stringify(res.data.items)), null);
          this.showDataTree = this.convertToTreeData(JSON.parse(JSON.stringify(res.data.items)), null);
          console.log('this.showDataTree', this.showDataTree);
        }
      });
    },
    handleTabClick(tab, event) {
      this.$router.push({
        path: './baseData',
        query: {
          type: this.activeName
        }
      });
    },
    filterBaseDataTree(treeArr) {
      return treeArr;
      // return treeArr.filter(node => node.config_key !== 'soft_url')
    },
    convertToTreeData(data, pid) {
      const result = [];
      let temp = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].parent_id === pid) {
          temp = this.convertToTreeData(data, data[i].config_id);
          if (temp.length > 0) {
            data[i].children = temp;
          } else {
            data[i].children = [];
          }
          result.push(data[i]);
        }
      }
      return result;
    },
    handleSearchChange() {
      this.showDataTree = this.originDataTree.filter(item => {
        return item.value_json.indexOf(this.searchValue) >= 0;
      })
    }
  },
  computed: {},
  components: {
    pageHeader,
    cloudPlatformType,
    mirrorFormat,
    networkArea,
    operationSystem,
    poolType,
    resourceEnv,
    serviceAddress,
    serviceType,
    virtualType,
    cpuType,
    productClassify,
    serviceClassify,
    appType,
    businessClassify,
    disasterLevel,
    tableClassify,
    servicePath,
    networkType,
    natRule,
    msgType,
    bareComputer,
    emailConfig,
    thirdPartyDocking,
    vmwareTableSetting
  },
};
