<template>
    <div class="app-overview">
        <!-- ------------------------引入头部公共组件 --------------------->
        <pageHeader :title="addor=='edit' ? '编辑角色' : '新建角色'" back @handleBack="goBack" :rightWidth="8">
            <template v-slot:right>
                <div class="nav-c">
                    <Steps :stepsList="stepsList" :step="active+1"></Steps>
                </div>
            </template>
        </pageHeader>
        <div class="ts-content-form" v-if="active===0">
            <div class="header">
                <span>基本信息</span>
            </div>
            <div class="form-c">
                <el-form :label-position="labelPosition" ref="roleForm" :model="roleForm" :rules="rules"
                         :label-width="formLabelWidth">
                    <div class="authorization_object"
                         :active="active">
                        <el-form-item label="角色名称" prop="role_name">
                            <el-input v-model="roleForm.role_name" autocomplete="off"
                                      id="rbac_addRole_role_name"></el-input>
                        </el-form-item>
                        <el-form-item label="描述" prop="remarks">
                            <el-input type="textarea" v-model="roleForm.remarks" placeholder="备注"
                                      id="rbac_addRole_remarks"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <div class="footer">
                <div class="btn-c" :active="active">
                    <el-button @click="goBack" id="rbac_addRole_cancel">取消</el-button>
                    <el-button type="primary" @click="next('roleForm')"
                               :loading="submitLoading"
                               id="rbac_addRole_submit"
                    >{{submitLoading ? '提交中': '下一步'}}
                    </el-button>
                </div>
            </div>
        </div>
        <div class="ts-sub-part" v-if="active===1">
            <div class="header">
                <span>权限范围</span>
                <el-button type="text" @click="drawer=true" icon="el-icon-circle-plus-outline" id="rbac_addRole_config">
                    配置权限
                </el-button>
            </div>
            <div class="list-c">
                <div class="config_permissions" :active="active">
                    <div class="config_content">
                        <auth-list
                                :role-id="role_id"
                                :tableData="tableData"
                                :loading="loading"
                                @role-menus-list="getRoleMenusList"></auth-list>
                    </div>
                </div>
            </div>
            <div class="footer">
                <div class="btn-c" :active="active">
                    <el-button @click="addRoleHandleClose">取消</el-button>
                    <el-button @click="previous">上一步</el-button>
                    <el-button type="primary" @click="addRoleHandleClose">确定</el-button>
                </div>
            </div>
        </div>
        <auth-config
                v-if="drawer"
                :drawer="drawer"
                :check-list="checkList"
                :role-id="role_id"
                :table-data="tableData"
                @close-dialog="setDrawer"
                @role-menus-list="getRoleMenusList"
        >
        </auth-config>
    </div>
</template>
<script>
  import {userApi} from '@/request/api/certifiservice';
  import * as requestMethod from '@/modules/rbac/api/certifiService/userGroupApi';
  import * as roleRequestMethod from '@/modules/rbac/api/certifiService/roleManageApi';
  import {filterData} from '@/utils/utils';
  import authList from './authList';
  import roleList from '../../components/role/roleList';
  import authConfig from './authConfig';
  //引入公共头部组件
  import pageHeader from '@/components/pageHeader.vue';

  export default {
    props: {},
    components: {
      pageHeader,
      authList,
      roleList,
      authConfig,
    },
    data() {
      let validateDepName = (rule, value, callback) => {
        if (value == '' || typeof value == 'undefined') {
          callback(new Error('请输入角色名称!'));
        } else if (/^\s+$/gi.test(value)) {
          callback(new Error('不能纯输入空格!'));
          return;
        } else {
          callback();
        }
      };
      return {
        addor: '',
        roleForm: {
          role_name: '',
          ids: [],
          remarks: '',
        },
        options: [],
        allOptions: [],
        rules: {
          role_name: [
            {required: true, validator: validateDepName, trigger: 'change'},
            {max: 64, message: '不超过64个字符', trigger: 'blur'},
          ],
        },
        drawer: false,
        checkList: [],
        labelPosition: 'right',
        direction: 'rtl',
        formLabelWidth: '150px',
        active: 0,
        radio: 0,
        radioTypeList: {
          user: 0,
          userGroup: 1,
        },
        radioTypeToTag: {
          0: 'user',
          1: 'group',
        },
        role_id: null,
        tableData: [],
        submitLoading: false,
        loading: false,
        per_page: 10000,  //每页显示多少条
        stepsList: [
          {
            step: 1,
            name: '基本信息',
          },
          {
            step: 2,
            name: '权限范围',
          },
        ],
        step: 1
      };
    },
    computed: {
      s_selectOptions() {
        if (this.roleForm.ids.length) {
          let selectList = this.roleForm.ids;
          return this.options.map(item => {
            if (selectList.includes(item.value)) {
              return {
                ...item,
                checked: true,
              };
            } else {
              return item;
            }
          });
        }
        return this.options;
      },
    },
    mounted() {
      this.role_id = this.$route.query.role_id || this.role_id;
      this.addor = this.$route.params.bj;
      this.getRoleDetail();
      if (this.role_id == null) {
        this.getUser();
      }
    },
    methods: {
      confirm(res, obj) {
        this.$emit('close-dialog', res, obj);
      },
      close() {
        this.confirm(false, {});
      },
      setDrawer() {
        this.drawer = false;
      },
      next(roleForm) {
        this.$refs[roleForm].validate((valid) => {
          if (valid) {//表单数据验证完成之后，提交数据;
            this.submitLoading = true;
            // const objects = this.handelIds();
            const {role_name, remarks} = this.roleForm;
            const fromData = {role_info: {role_name, remarks}};//, objects
            let type;
            if (this.role_id !== null) {
              type = 'put';
              fromData.role_id = this.role_id;
            } else {
              type = 'post';
            }
            this.saveRole(type, fromData);
          }
        });
      },
      handelIds() {
        let tag = this.radioTypeToTag[this.radio];
        return [{type: tag, ids: this.roleForm.ids}];
      },
      saveRole(type, fromData) {
        roleRequestMethod.editRole(type, fromData).then(res => {
          if (res.code === 200) {
            this.role_id = res.data.role_id || this.role_id;
            this.$message.success(res.message || '添加成功');
            if (this.active++ > 1) this.active = 0;
            /* var _this=this;
            var t=setTimeout(function(){
              _this.drawer=true;
              clearTimeout(t)
            }, 2000); */

          } else {
            this.$message.error(res.message || '添加失败');
          }
          this.submitLoading = false;
        });
      },
      getRoleMenusList(role_id) {
        this.loading = true;
        roleRequestMethod.roleMenusList('get', {role_id}).then(res => {
          if (res.code === 200) {
            this.tableData = res.data.menus_list;
          } else {
            this.$message.error(res.message);
          }
          this.loading = false;
        });
      },
      getRoleDetail() {
        if (this.role_id) {
          roleRequestMethod.roleDetail('get', {role_id: this.role_id}).then(res => {
            if (res.code === 200) {
              const {remarks, role_name} = res.data.data;
              this.roleForm.remarks = remarks;
              this.roleForm.role_name = role_name;
              this.getType(res.data.data);
            }
          });
        }
      },
      getType(data) {
        const {objects} = data;
        let count = 0;
        objects && objects.forEach(item => {
          // 同时为0的情况下，默认加载用户
          if (item.ids.length == 0) {
            count++;
          }
          if (item.type === 'user' && item.ids.length > 0) {
            this.roleForm.ids = item.ids;
            this.radio = this.radioTypeList.user;
            this.getUser();
          } else if (item.type === 'group' && item.ids.length > 0) {
            this.roleForm.ids = item.ids;
            this.radio = this.radioTypeList.userGroup;
            this.getUserGroup();
          }
        });
        if (count == 2) {
          this.getUser();
        }
      },
      previous() {
        this.getRoleDetail();
        if (this.active-- < 0) this.active = 0;
      },
      addRoleHandleClose() {
        this.$router.push({name: 'roleManage'});
      },
      onRadio(val) {
        let radioTypeList = this.radioTypeList;
        this.roleForm.ids = [];
        switch (val) {
          case radioTypeList.user:
            this.getUser();
            break;
          case radioTypeList.userGroup:
            this.getUserGroup();
            break;
          default:
            break;
        }
      },
      remoteMethod(query) {
        const data = this.allOptions.filter(item => item.label.indexOf(query) > -1);
        if (data.length) {
          this.options = data;
        }
      },
      getUser(data = {}) {
        data.per_page = this.per_page;
        data.query_fields = JSON.stringify(['user_id', 'user_name']);
        userApi('get', data).then(res => {
          if (res.code === 200) {
            const data = filterData(res.data.items, 'user_id', 'alias_name');
            const allData = this.setChecked(data);
            this.options = allData;
            this.allOptions = allData;
          }
        });
      },
      getUserGroup(data = {}) {
        data.per_page = this.per_page;
        requestMethod.userGroupList('get', data).then(res => {
          if (res.code === 200) {
            const data = filterData(res.data.items, 'group_id', 'group_alias');
            const allData = this.setChecked(data);
            // this.options = allData.slice(0,1);
            this.options = allData;
            this.allOptions = allData;
          }
        });
      },
      setChecked(data) {
        data.forEach(item => {
          item.checked = false;
        });
        return data;
      },
      handleCheckboxChange(obj) {
        let {value, checked} = obj;
        if (checked) {
          this.roleForm.ids = this.roleForm.ids.filter(state => state !== value);
        } else {
          this.roleForm.ids.push(value);
        }
      },
      goBack() {
        this.$router.push({name: 'roleManage'});
      },
    },
  };
</script>
<style lang="less" scoped>
    .ts-content-form {
        .form-c {
            .config_permissions {
                padding-left: 24px;
                margin-top: -20px;
            }
        }
    }
</style>
