<template>
  <div class="authContent">
    <el-drawer
      title="配置权限"
      :visible.sync="drawer"
      :direction="direction"
      custom-class="add-roleManage"
      size="50%"
      :before-close="close">
      <div class="ts-drawer-content">
        <el-form :label-position="labelPosition" ref="form" :model="authConfigForm" :rules="rules">
          <div class="authorization_object">
            <el-form-item label="服务分类" :label-width="formLabelWidth" prop="servicesValue" class="ts-form-label ts-label-required">
              <el-select v-model="authConfigForm.servicesValue"  @change="onSelect" placeholder="请选择" id="rbac_authConfig_servicesValue">
                <el-option
                  v-for="item in servicesOptions"
                  :key="item.menu_id"
                  :label="item.menu_name"
                  :value="item.menu_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="配置操作" prop="remarks" :label-width="formLabelWidth" class="ts-form-label ts-mt36">
<!--              <treeselect-->
<!--                         v-if="currentAuthMethod === authMethod.treeSelect"-->
<!--                         v-model="treeValue"-->
<!--                         :multiple="true"-->
<!--                         :options="treeOptions"-->
<!--                         :max-height="200"-->
<!--                         id="rbac_authConfig_treeSelect"-->
<!--                         value-consists-of="ALL_WITH_INDETERMINATE"/>-->
              <!--TODO: 增加方案二-->
              <div class="el-tree-c">
                <el-tree
                        v-if="currentAuthMethod === authMethod.onlyTree"
                        :data="treeOptions"
                        :default-expanded-keys="expandedKeys"
                        show-checkbox
                        ref="tree"
                        id="rbac_authConfig_onlyTree"
                        node-key="id">
                </el-tree>
              </div>

            </el-form-item>
          </div>

        </el-form>
      </div>
      <div class="drawer_footer">
            <el-button style="margin-top: 12px;" @click="close" id="rbac_authConfig_cancel">取消</el-button>
            <el-button type="primary" style="margin-top: 12px;" @click="saveRoleMenus" :loading="submitLoading" id="rbac_authConfig_submit">{{submitLoading ? '提交中...' : '确定'}}</el-button>

          </div>
    </el-drawer>
  </div>
</template>
<script>
    import { userApi } from "@/request/api/certifiservice"
    import * as requestMethod from "@/modules/rbac/api/certifiService/roleManageApi";
    import { filterData,filterDataArr,t } from "@/utils/utils";
    import Treeselect from '@riophae/vue-treeselect';
    import '@riophae/vue-treeselect/dist/vue-treeselect.css';
    export default {
        props:{
            drawer:{
                type:Boolean
            },
            tableData:{
                type:Array
            },

            roleId:{}
        },
        components: {
            Treeselect
        },
        data() {
            return {
                authConfigForm: {
                    servicesValue:''
                },
                role_id: null,
                servicesOptions: [],
                treeOptions: [],
                treeValue: null,
                treeOriginData: [],
                labelPosition: 'right',
                direction: 'rtl',
                formLabelWidth: '106px',
                submitLoading: false,
                currentAuthMethod: 0, // 授权方式 0 只展示tree  1 展示tree和文本框
                authMethod: {
                  onlyTree: 0,
                  treeSelect: 1
                },
                expandedKeys: [],
                rules: {
                    servicesValue: [
                        {required: true,  message: '服务分类为必填项', trigger: 'change'},
                    ]
                },
            }
        },
        mounted() {
          this.getRoleId();
          this.getServicesList();
        },
        methods:{
          getRoleId() {
            this.role_id = this.roleId ? this.roleId : this.$route.query.role_id
          },
          getServicesList() {
            requestMethod.servicesList('get').then(res=>{
              if(res.code === 200){
                this.servicesOptions = res.data.services;
              }
            })
          },
          getServiceMenusList(menu_id) {
            requestMethod.serviceMenusList('get',{menu_id, role_id:this.role_id}).then(res=>{
              if(res.code === 200){
                const data = filterData(res.data.menus, 'menu_id', 'menu_name', 'id');
                this.treeOptions = data
                if (res.data.role_menus.length) {
                  let role_menus = res.data.role_menus;
                  if (this.currentAuthMethod === this.authMethod.onlyTree) {
                    this.expandedKeys = [];
                    this.$nextTick(()=>{
                      role_menus.forEach(id => {
                        let node = this.$refs.tree.getNode(id);
                        if(node.isLeaf){
                          this.$refs.tree.setChecked(node, true);
                        }
                        if(node.level === 1) {
                          this.expandedKeys.push(id)
                        }
                      })
                    })
                  }else {
                    this.treeValue = role_menus;
                  }
                  this.treeOriginData = JSON.parse(JSON.stringify(res.data.role_menus));
                  this.treeOriginData.push(menu_id);
                }else {
                  this.treeValue = null;
                  this.treeOriginData = [];
                }
              }
            })
          },
          getHalfCheckedKeys() {
            return this.$refs.tree.getHalfCheckedKeys()
          },
          getCheckedKeys() {
            return this.$refs.tree.getCheckedKeys()
          },
          saveRoleMenus() {
              console.log(2222);
              this.$refs['form'].validate((valid) => {
                  if (valid) {//表单数据验证完成之后，提交数据;
                      if (this.currentAuthMethod === this.authMethod.onlyTree) {
                          this.treeValue = [].concat(this.getHalfCheckedKeys(),this.getCheckedKeys())
                      }
                      let treeValue = this.treeValue !== null ? JSON.parse(JSON.stringify(this.treeValue)) : [];
                      treeValue.push(this.authConfigForm.servicesValue);
                      let add_menus = this.getAddMenus(this.treeOriginData,treeValue);
                      let delete_menus = this.getDeleteMenus(this.treeOriginData,treeValue);
                      let data = {
                          add_menus:add_menus,
                          delete_menus:delete_menus,
                          role_id:this.role_id
                      };
                      this.submitLoading = true;
                      requestMethod.saveRoleMenusData('post',data).then(res=>{
                          if(res.code === 200){
                              this.$message.success(res.message);
                              this.$emit('role-menus-list', this.role_id);
                              this.$emit('close-dialog');
                          }else{
                              this.$message.error(res.message);
                          }
                          this.submitLoading = false;
                      })
                  }
              })

          },
          getAddMenus(originArr,changeArr) {
            return changeArr.filter(val => !originArr.includes(val))
          },
          getDeleteMenus(originArr,changeArr) {
            return originArr.filter(val => !changeArr.includes(val))
          },
          onSelect(val) {
            this.treeValue = null;
            this.treeOptions = [];
            this.treeOriginData = [];
            this.getServiceMenusList(val);
          },
          close() {
            this.$emit("close-dialog", false);
          }
        }
    }
</script>
<style lang="less" scoped>
  .authContent{
    .authorization_object{
      padding-left: 20px;
      .el-tree-c {
        max-height: 460px;
        margin-top: 4px;
        overflow-y: scroll;
        padding-bottom: 20px;
        /deep/ .el-tree__empty-text {
          position: absolute;
          left: 0;
          top: -4px;
          transform: inherit;
        }
      }
      & /deep/ .vue-treeselect__control .vue-treeselect__multi-value{
        max-height: 200px!important;
        overflow: scroll!important;
      }
    }
  }

</style>
