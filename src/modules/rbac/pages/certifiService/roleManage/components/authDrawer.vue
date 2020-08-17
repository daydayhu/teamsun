<template>
    <div class="ts-drawer-content">
        <el-steps :space="300" :active="active" finish-status="success">
          <el-step title="设置角色权限"></el-step>
          <el-step title="审阅角色权限"></el-step>
        </el-steps>
        <el-divider></el-divider>
        <div class="config_permissions" v-if="active===0" :active="active">
          <el-container>
            <el-aside width="200px">
              <h3>服务列表</h3>
              <template>
                <el-checkbox-group v-model="checkInfo.checkedList">
                  <el-checkbox label="访问控制"
                               v-for="item in checkInfo.checkList"
                               :key="item.value"
                               :label="item.label"
                                id="rbac_authDrawer_checkList"
                  >
                    {{item.value}}
                  </el-checkbox>
                </el-checkbox-group>
              </template>
            </el-aside>
            <el-main>
              <auth-list></auth-list>
            </el-main>
          </el-container>
          <div class="authorization_object_btn">
            <el-button style="margin-top: 12px;" @click="next" id="rbac_authDrawer_nextStep">下一步</el-button>
            <el-button style="margin-top: 12px;" @click="addRoleHandleClose" id="rbac_authDrawer_cancel">取消</el-button>
          </div>
        </div>

        <div class="config_permissions" v-if="active===1" :active="active">
          <el-container>
            <roleList :table-info="roleTable"></roleList>
          </el-container>
          <el-footer>
            <el-button type="primary" id="rbac_authDrawer_submit">确定</el-button>
            <el-button @click="previous" id="rbac_authDrawer_previous">上一步</el-button>
            <el-button  @click="addRoleHandleClose" id="rbac_authDrawer_cancelBtn">取消</el-button>
          </el-footer>
        </div>
    </div>
</template>
<script>
    import { userApi } from "@/request/api/certifiservice"
    import * as requestMethod from "@/modules/rbac/api/certifiService/userGroupApi";
    import { filterData } from "@/utils/utils";
    import authList from '../../components/role/authList';
    import roleList from '../../components/role/roleList';
    import {roleTable} from '../utils/utils'


    export default {
        props:{
            drawer:{
                type:Boolean
            },
        },
        components: {
            authList,
            roleList
        },
        data() {
            return {
                roleTable,
                labelPosition: 'left',
                direction: 'rtl',
                formLabelWidth: '106px',
                value1:[],
                user:{options: [],value:[]},
                active: 0,
                radio:0,
                checkInfo:{
                    checkList:[
                        {label:1, value:'访问控制'},
                        {label:2, value:'应用中心'},
                        {label:3, value:'服务运营'}],
                    checkedList:[]
                }

            }
        },
        mounted() {
            console.log(33333);
            if(this.radio === 0){
                this.getUser();
            }
        },
        methods:{
            confirm(res, obj) {
                this.$emit("close-dialog", res, obj);
            },
            close() {
                this.confirm(false, {});
            },
            next() {
                if (this.active++ > 1) this.active = 0;
            },
            previous() {
                if (this.active-- < 0) this.active = 0;
            },
            addRoleHandleClose() {
                this.active = 0;
            },
            onRadio(val){
                if(val === 0){
                    this.getUser();
                }else{
                    this.getUserGroup();
                }
            },
            getUser(){
                userApi('get').then(res => {
                    if(res.code === 200){
                        const data = filterData(res.data.users, 'user_id', 'user_name');
                        this.user.options = data;
                    }
                })
            },
            getUserGroup(){
                requestMethod.userGroupList('get').then(res=>{
                    if(res.code === 200){
                        const data = filterData(res.data.group_lists, 'group_id', 'group_name');
                        this.user.options = data;
                    }
                })
            }

        }
    }
</script>
<style lang="less" scoped>
  .ts-drawer-content{
    margin-left: 16px;

  }
  .config_permissions{
    .el-aside {
      height:100%;
      width: 130px;
      overflow: hidden;

      .el-checkbox-group{
        margin-top:20px;
        .el-checkbox{
          line-height:30px;
          width: 100%;
        }
      }
    }

    .el-main {
      border-left:1px solid #C9C9C9;
    }

    .el-footer {
      margin:20px 0px;
      line-height: 60px;
    }
  }
  .authorization_object{
    .authorization_object_btn{
      position: absolute;
      bottom:20px;
      left:20px;
    }
  }
</style>

