<template>
  <div class="systemMemberAddEdit">
      <div class="form-c member_wrap">
        <div class="member_head">
          <el-button type="primary" size="small" @click="addMember">添加成员</el-button>
          <el-button type="primary" size="small" @click="mulDelete">批量删除</el-button>
        </div>
        <el-table ref="memberTable" :data="memberTableData" style="width: 100%" v-loading="memberTableLoading"  @selection-change="handleSelectionChange">
          <template slot="empty">
            <empty-in-table v-if="memberTableData.length<1&&!memberTableLoading"></empty-in-table>
          </template>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="user_name" label="成员名称" ></el-table-column>
          <!-- <el-table-column prop="role_name" label="成员角色" ></el-table-column> -->
          <el-table-column prop="email_address" label="邮箱" ></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button @click="onDelete(scope.row.user_id)" type="text" size="small">移除</el-button>
            </template>
         </el-table-column>
        </el-table>
      </div>
      <!-- <div class="footer" v-if="isAdd">
        <div class="btn-c">
          <el-button  size="small" @click="onCancel">取消</el-button>
          <el-button type="primary" size="small" @click="onBack">上一步</el-button>
          <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
        </div>
      </div> -->
    <el-drawer
    v-if="drawer"
      :title="drawerTitle"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose">
        <div class="content">
          <el-form ref="form" :rules="rules" :model="form" label-width="120px">
            <el-form-item label="成员名称" prop="user_id">
              <el-select id="app_systemAddEdit_user_id" filterable v-model="form.user_id"  placeholder="请选择成员名称" @change="memberSelectChange">
                <el-option
                  v-for="item in allMember"
                  :key="item.user_id"
                  :label="item.alias_name"
                  :value="item.user_id">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item v-if="isRole" label="成员角色" prop="role_id">
              <el-select id="app_systemAddEdit_role_id" v-model="form.role_id"  placeholder="请选择成员角色" @change="roleSelectChange">
                <el-option
                  v-for="item in memberRole"
                  :key="item.key"
                  :label="item.name"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="邮箱" prop="email">
              <el-input id="app_systemAddEdit_email" disabled v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="drawer_footer">
          <el-button  id="app_systemAddEdit_onCancelForm" @click="onCancelForm" >取 消</el-button>
          <el-button  id="app_systemAddEdit_onSubmitNext" type="primary" @click="onSubmitNext" :loading="drawerLoading" >{{drawerLoading ? '提交中 ...' : '继续添加' }}</el-button>
          <el-button  id="app_systemAddEdit_onSubmitForm" type="primary" @click="onSubmitForm" :loading="drawerLoading" >{{drawerLoading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
    </el-drawer>
  </div>
</template>

<script>
//引入API
import * as requestMethod from "../../../../api/applicationCenter/applicationSystem"
export default {
  name: "systemMemberAddEdit",
  props:{
    //判断是否是新增
    //isAdd:Boolean,
    //应用系统的id
    app_id:Number,
    //组织的id
    org_id:Number
  },
  data() {
    return {
      //成员表格
      memberTableLoading: false,
      memberTableData: [
      ],
      multipleSelection:[],
      //添加drawer
      drawerTitle:"添加成员",
      drawer:false,
      drawerLoading:false,
     // isRole:false,
      //获取所有成员
      allMember:[],
      //根据成员获取成员角色
      memberRole:[{
        name:'',
        key:''
      }],
      form: {
        user_id:null,
        user_name:"",
        // role_id:"",
        // role_name:"",
        app_id:null,
        email:""
      },
      //表单规则
      rules: {
          user_id: [
            { required: true, message: '请选择用户', trigger: 'blur' }
          ],
          // role_id: [
          //   { required: true, message: '请选择成员角色', trigger: 'change' }
          // ],
          // email: [
          //   { required: true, trigger: 'blur' }
          // ]
      }
    }
  },
  mounted(){
    this.form.app_id=this.app_id
    this.getMemberList(this.app_id)
    console.log("getMemberList this.app_id,org_id", this.app_id,this.org_id)
  },
  methods: {
    //----------------------------新建时事件-----------------------
    // //上一步按钮事件
    // onBack(){
    //  // history.back();
    //  this.$router.push({
    //     path: '/applicationCenter/applicationSystem/addSystem/addSystemFirst',
    //     query:{
    //       app_id:this.app_id,
    //       operation:'add'
    //     }
    //   })
    // },
    // //取消按钮事件
    // onCancel(){
    //   this.$router.push({
    //     path: '/applicationCenter/applicationSystem/'
    //   })
    // },
    // //确定下一步按钮事件
    // onSubmit(){
    //   this.$router.push({
    //     path: '/applicationCenter/applicationSystem/'
    //   })

    // },
    //----------------------------新建/编辑公用事件-----------------------
    //根据app_id获取成员列表
    getMemberList(app_id){
      this.memberTableLoading=true
      requestMethod.getMemberList('get',app_id)
      .then(res => {
        if (res.code === 200) {
          this.memberTableData=res.data.items
          // if(this.memberTableData.length===0){
          //   this.$message.warning("该应用没有成员，请添加成员");
          // }
          console.log("this.memberTableData",this.memberTableData)
        } else {
          this.$message.error(res.message);
        }
        this.memberTableLoading=false
      })
      .catch(err=>{
        this.$message.error(err.message);
        this.memberTableLoading=false
      })
    },
    //添加成员按钮点击事件
    addMember(){
      this.form= {
        user_id:null,
        user_name:"",
        // role_id:"",
        // role_name:"",
        app_id:this.app_id,
        email:""
      }
      this.drawerTitle="添加成员"
      this.drawer=true
      this.getAllMember(this.org_id)

    },
    //多选表格事件
    handleSelectionChange(val) {
      console.log("handleSelectionChange",val)
      this.multipleSelection = val.map(e=>{
        return e.user_id
      });
      console.log("multipleSelection",this.multipleSelection)
    },
    //mulDeleteMember
    mulDelete(){
      this.$confirm('确定要移除成员吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          requestMethod.mulDeleteMember('delete',{user_ids:this.multipleSelection})
          .then(res => {
          if (res.code === 200) {
            this.$message.success("移除成员成功");
          //刷新列表
            this.getMemberList(this.app_id)
          } else {
            this.$message.error(res.message);
          }
        })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消移除'
          });
        });

    },

    //删除按钮点击事件
    onDelete(app_user_id){
      this.$confirm('确定要移除此成员吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          requestMethod.deleteMember('delete',app_user_id)
          .then(res => {
          if (res.code === 200) {
            this.$message.success("移除成员成功");
          //刷新列表
            this.getMemberList(this.app_id)
          } else {
            this.$message.error(res.message);
          }
        })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消移除'
          });
        });
    },
    //添加抽屉中-获取所有成员
    getAllMember(org_id){
      let para={
        org_id
      }
      requestMethod.getUser('get',para )
      .then(res => {
        if (res.code === 200) {
          this.allMember=res.data.items
          console.log("this.allMember",this.allMember)

        } else {
          this.$message.error(res.message);
        }
      })

    },
    //添加抽屉中-根据成员获取成员角色
    getRoleByUserId(user_id){
      // this.form.role_id=null
      // requestMethod.getRoleByUserId('get',{user_id})
      // .then(res => {
      //   if (res.code === 200) {

      //     this.memberRole=res.data.roles.map(e=>{
      //       return{
      //         name:e.role_name,
      //         key:e.role_id
      //       }
      //     })
      //     console.log("this.memberRole",this.memberRole)

      //   } else {
      //     this.$message.error(res.message);
      //   }
      // })

    },
    //添加抽屉中-选择成员选择框事件
    memberSelectChange(val){
      if(val){
        //this.isRole=true
        console.log("memberSelectChange val",val)
        this.allMember.forEach(e=>{
          if(e.user_id===val){
            this.form.user_name=e.alias_name
            this.form.email=e.email
          }
        })
        console.log("this.form val",this.form)
        this.getRoleByUserId(val)
      }else{
        //this.isRole=false
      }
    },
    //
    // roleSelectChange(val){
    //   if(val){
    //     console.log("roleSelectChange val",val)
    //     this.memberRole.forEach(e=>{
    //       if(e.key===val){
    //         this.form.role_name=e.name
    //       }
    //     })
    //   }


    // },
    //添加抽屉事件
    handleClose(done){
      done();
    },
    //添加drawer取消
    onCancelForm(){
      this.drawerLoading = false
      this.drawer = false
    },
    //添加提交
    onSubmitForm(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            console.log('submit!');
            requestMethod.addMember('post',this.form)
            .then(res=>{
              if(res.code===200){
                this.$message.success("添加成员成功");
                this.drawerLoading = false
                this.drawer = false
                //刷新列表
                this.getMemberList(this.app_id)
              }else{
                this.$message.error(res.message);
              }
            })
            .catch(err=>{
              this.$message.error(err.message);
            })
          } else {
            console.log('error submit!!');
            return false;
          }
      });
    },
    //继续创建
    onSubmitNext(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            console.log('submit!');
            requestMethod.addMember('post',this.form)
            .then(res=>{
              if(res.code===200){
                this.$message.success("添加成员成功");
                this.drawerLoading = false
               // this.drawer = false
                //刷新列表
                this.getMemberList(this.app_id)
                this.form={
                   user_id:null,
                    user_name:"",
                    // role_id:"",
                    // role_name:"",
                    app_id:this.app_id,
                    email:""
                }
              }else{
                this.$message.error(res.message);
              }
            })
            .catch(err=>{
              this.$message.error(err.message);
            })
          } else {
            console.log('error submit!!');
            return false;
          }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.systemMemberAddEdit{
  height: 100%;
  .member_wrap{
    position: relative;
    .member_head{
    position: absolute;
    z-index: 100;
    top: -55px;
    right: 25px;
    }
  }
  .content{
    padding-right: 24px;
  }
}


</style>
