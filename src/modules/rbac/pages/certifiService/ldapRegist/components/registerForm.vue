<template>
  <el-drawer
             :visible.sync="drawer"
             :before-close="handleCancel"
             :append-to-body="true"
             :modal-append-to-body="true"
             size="46%"
             direction="rtl"
             custom-class="add-user-drawer"
             ref="drawer"
             :title="(ldap_id === 0 ? '新建' :'编辑')+'LDAP认证'"
             >
    <!-- <template slot="title">
      {{ldap_id === 0 ? '新建' :'编辑'}}LDAP认证
    </template> -->
    <div class="ts-drawer__content">
      <el-form ref="form"
               :model="form"
               :rules="form_rules"
               :label-position="labelPosition">
        <el-row>
          <el-col :span="colSpan">
            <el-form-item label="LDAP控制器"
                          :label-width="formLabelWidth"
                          prop="source_name">
              <el-input v-model="form.source_name"
                        autocomplete="off"></el-input>
              <span>不超过64个字符</span>

            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="source-ip">
          <el-col :span="16">
            <el-form-item label="访问地址" :label-width="formLabelWidth" prop="source_ip">
              <el-input autocomplete="off" placeholder="输入IP地址" v-model="form.source_ip"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item  prop="source_port">
              <el-input v-model="form.source_port" placeholder="端口"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="colSpan">
            <el-form-item label="启动ssl"
                          prop="is_ssl"
                          :label-width="formLabelWidth">
              <el-radio-group v-model="form.is_ssl">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <el-col :span="colSpan">
              <el-form-item label="登录DN"
                            :label-width="formLabelWidth"
                            prop="user_name">
                <el-input v-model="form.user_name"
                          autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="colSpan">
            <el-form-item
              label="密码"
              prop="password"
              :label-width="formLabelWidth">
              <el-input type="password"
                        v-model="form.password"
                        autocomplete="off"
                        ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="colSpan">
            <el-form-item label="搜索DN"
                          prop="search_dn"
                          :label-width="formLabelWidth">
              <el-input v-model="form.search_dn"
                        autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="colSpan">
            <el-form-item prop="user_filter" :label-width="formLabelWidth">
              <span slot="label">
                用户过滤器
                <el-tooltip class="item" effect="dark" :content="tooltipContent.user_filter" placement="right-start">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="form.user_filter"
                        autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="colSpan">
            <el-form-item :label-width="formLabelWidth" prop="user_property">
              <span slot="label">
                用户属性映射
                <el-tooltip class="item" effect="dark" :content="tooltipContent.user_property" placement="right-start">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input type="textarea"
                        v-model="form.user_property"
                        autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="colSpan">
            <el-form-item label="描述"
                          :label-width="formLabelWidth"
                          prop="remarks">
              <el-input type="textarea"
                        v-model="form.remarks"
                        autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="colSpan">
            <el-form-item label="所属组织"
                          :label-width="formLabelWidth"
                          prop="org_id">
              <el-select v-model="form.org_id" placeholder="请选择" class="ts-input">
                <el-option
                  v-for="item in options"
                  :key="item.dep_id"
                  :label="item.dep_name"
                  :value="item.dep_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

    </div>
    <div class="drawer_footer">
        <el-button @click="handleCancel">取 消
        </el-button>
        <el-button type="primary"
                   @click="onSubmit('form')"
                   :loading="submitLoading">{{
          submitLoading ? '提交中 ...' : '确 定' }}
        </el-button>
      </div>
  </el-drawer>
</template>

<script>
    import * as requestMethod from "@/modules/rbac/api/certifiService/ldapRegist";
    import {form_rules,tooltipContent} from "../utils/utils";
    import { btoaPassword } from "@/utils/utils";
    export default {
        props: {
            ldap_id: {}
        },
        data() {
            return {
                multiple: {multiple: true},
                formLabelWidth: '150px',
                labelPosition: 'right',
                submitLoading: false,
                options:[],
                colSpan:20,
                drawer:true,
                tooltipContent,
                form: {
                    source_name: '',
                    source_ip:'',
                    source_port: '',
                    is_ssl: 1,
                    user_name: '',
                    password: '',
                    search_dn: '',
                    user_filter:'',
                    user_property:'',
                    org_id:'',
                    remarks: ''
                },
                form_rules,
            }
        },
        created() {
        },
        async mounted() {
            // form滚动条
            const that = this
            this.$nextTick(() => {
                let flowHeight = document.body.clientHeight - 150
                this.$refs.form.$el.style.cssText = `overflow-y:auto;height:${flowHeight}px`
            })
            window.onresize = () => {
                return (() => {
                    let flowHeight = document.body.clientHeight - 150
                    that.$refs.form.$el.style.cssText = `overflow-y:auto;height:${flowHeight}px`
                })()
            }
            if(this.ldap_id >0){
                await this.getLdapDetail();
            }
            await this.getOrgsList();
        },

        methods: {
            async getOrgsList(){
                const  pagination= {
                        current_page: 1, // 当前位于哪页
                        per_page: 10000, //每页显示多少条
                        total_page: 1
                };
                const res = await requestMethod.getOrgs('get',pagination);
                if(res.code === 200){
                    this.options = res.data;
                }
            },

            async getLdapDetail(){
                const res = await requestMethod.getLdapDetail('get',{ldap_id:this.ldap_id});
                if(res.code === 200){
                    this.form = res.data.ldap;
                }
            },
            onSubmit(){
                this.$refs['form'].validate(async valid => {
                    if(valid){
                        this.submitLoading = true;
                        const password = btoaPassword(this.form.password);
                        const newForm = JSON.parse(JSON.stringify(this.form));
                        newForm.password = password;
                        const data = await requestMethod.saveLdaps(this.getMethodsType(), {ldap_id:this.ldap_id,form:newForm});
                        if(data.code === 200){
                            this.$message.success(data.message || '保存成功');
                            this.handleCancel();
                            this.$emit('get-ldap-list');
                        }else{
                            this.$message.error(data.message || '保存失败');
                        }
                        this.submitLoading = false;
                    }

                })
            },
            getMethodsType(){
               return this.ldap_id === 0 ? 'post' : 'put';
            },
            handleCancel(){
                this.$refs['form'].resetFields();
                this.drawerFlag = false;
                this.$emit('close-dialog', 'isShow', false);
            }
        }
    }
</script>

<style lang="less" scoped>
 .source-ip{
    margin: 0!important;
  }



</style>
