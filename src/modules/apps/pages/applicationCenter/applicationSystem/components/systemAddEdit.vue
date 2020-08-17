<template>
  <div class="systemAddEdit">
    <div class="form-c">
      <el-form ref="form" :rules="rules" :model="systemDetailData" v-loading="addSystemFirstLoading" label-width="140px" label-position="right">
        <el-form-item label="应用系统名称" prop="app_name">
          <el-input id="app_systemAddEdit_app_name" v-model="systemDetailData.app_name"></el-input>
        </el-form-item>
        <el-form-item label="业务组" prop="bus_id">
          <el-select id="app_systemAddEdit_bus_id" filterable v-model="systemDetailData.bus_id" :disabled="!isAdd" placeholder="请选择业务组" @change="handleBusGroupsSelect">
            <el-option
              v-for="item in taskGroup"
              :key="item.bus_id"
              :label="item.alias_name"
              :value="item.bus_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用类型" prop="app_base_type">
          <el-radio-group id="app_systemAddEdit_app_base_type" v-model="systemDetailData.app_base_type" size="small">
            <el-radio-button
              v-for="item in applicationType"
              :key="item.key"
              :label="item.name"
              :value="item.name">
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属环境" prop="app_base_env">
          <el-radio-group id="app_systemAddEdit_app_base_env" v-model="systemDetailData.app_base_env" @change="envChange">
            <el-radio-button
              v-for="item in environment"
              :key="item.key"
              :label="item.key"
            >
              {{item.name}}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="isLevel" label="灾备等级" prop="app_base_level">
          <el-checkbox-group id="app_systemAddEdit_app_base_level" v-model="systemDetailData.app_base_level" @change="levelChange">
            <el-checkbox
              v-for="item in disarsterLevel"
              :key="item.key"
              :label="item.name"
              :value="item.name">
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <tag-in-add ref="tagInAdd" :operation="operationAddOrEdit"></tag-in-add>
      </el-form>
    </div>
    <div class="ts-content-form-footer">
      <div class="btn-c">
        <el-button id="app_systemAddEdit_onCancel" @click="onCancel">取消</el-button>
        <el-button id="app_systemAddEdit_onSubmit" type="primary" @click="onSubmit">{{operation=='add'?"下一步":"确定"}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  //引入API
  import * as requestMethod from "../../../../api/applicationCenter/applicationSystem"
  import tagInAdd from "@/components/tagManagement/tagInAdd.vue";

  export default {
    name: "systemAddEdit",
    components: {
      tagInAdd
    },
    props: {
      //传入app_id
      app_id: Number,
    },
    data() {
      return {
        addSystemFirstLoading: false,
        //业务组数据
        taskGroup: [],
        //orgId
        orgId: null,
        //appId
        appId: null,
        //判断接口调新增接口还是编辑接口
        isAdd: null,
        //判断入口是新增还是编辑
        operation: null,
        //应用类型数据
        applicationType: [],
        //所属环境数据
        environment: [],
        //灾备等级数据
        isLevel: false,
        disarsterLevel: [],
        //表单提交参数-模拟
        systemDetailData: {
          app_name: '',
          bus_id: '',
          bus_name: '',
          app_base_type: '业务应用系统',
          app_base_env: 'env_type_dev',
          app_base_level: []
        },
        //表单规则
        rules: {
          app_name: [
            {required: true, message: '请输入应用系统名称', trigger: 'blur'}
          ],
          bus_id: [
            {required: true, message: '请选择业务组', trigger: 'change'}
          ],
          app_base_type: [
            {required: true, message: '请选择应用类型', trigger: 'change'}
          ],
          app_base_env: [
            {required: true, message: '请选择生产环境', trigger: 'change'}
          ],
          app_base_level: [
            {type: 'array', required: true, message: '请至少选择一个灾备等级', trigger: 'change'}
          ]
        },
        operationAddOrEdit: 'add'
      };
    },
    created() {
      this.operationAddOrEdit = this.$route.query.operation
    },
    mounted() {
      this.appId=this.app_id
      this.operation = this.$route.query.operation
      this.getTaskGroop()
      this.getApplicationType()
      this.getEnvironment()
      this.getDisasterLevel()

    },
    methods: {
      // 编辑时根据appId获取应用系统详情
      getSystemDetail(app_id) {
        this.addSystemFirstLoading = true
        requestMethod.getSystemDetail("get", app_id).then(res => {
          this.addSystemFirstLoading = false
          if (res.code === 200) {
            this.systemDetailData = res.data.app_info;
            console.log("this.environment", this.environment)
            //处理所属环境数据
            this.environment.forEach(e => {
              if (this.systemDetailData.app_base_env == e.name) {
                this.systemDetailData.app_base_env = e.key
                if (e.key == 'env_type_pro') {
                  this.isLevel = true
                } else {
                  this.isLevel = false
                }

              }
            })
            this.orgId = res.data.app_info.org_id;
            console.log("getSystemDetail", res.data);
          } else {
            this.$message.error(res.message);
          }
        });
      },
      //业务组数据select框选择改变事件
      handleBusGroupsSelect(val) {
        console.log("handleBusGroupsSelect", val)
        this.taskGroup.forEach(e => {
          if (e.bus_id === val) {
            this.systemDetailData.bus_name = e.alias_name
            this.orgId = e.org_id
          }
        })
        console.log("form,orgId", this.systemDetailData, this.orgId)
        //获取orgId
        // this.getBusGroupDetail(val)

      },
      //资源环境选择事件
      envChange(val) {
        console.log("envChange", val, this.systemDetailData)
        if (val == 'env_type_pro') {
          this.isLevel = true
        } else {
          this.isLevel = false
          this.systemDetailData.app_base_level = []
        }

      },
      //灾备等级选择事件
      levelChange(val) {
        console.log("levelChange", val, this.systemDetailData)

      },
      //下一步或确定提交事件
      onSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let tagInfo = this.$refs['tagInAdd'].tagInfo();
            //处理所属环境数据
            this.environment.forEach(e => {
              if (e.key == this.systemDetailData.app_base_env) {
                this.systemDetailData.app_base_env = e.name
              }
            })
            if (this.isAdd) {
              //新建时的分支-
              if (tagInfo.findIndex(item => item.tag_key=='') === -1&&tagInfo.findIndex(item => item.tag_value=='') === -1) {
                this.systemDetailData.tag_type = 2
                this.systemDetailData.tag_category = 7
                this.systemDetailData.tag_list = tagInfo
              }
              this.addSystemFirstLoading = true
              requestMethod.addSystemFirst('post', this.systemDetailData)
                .then(res => {
                  if (res.code === 200) {
                    this.addSystemFirstLoading = false
                    this.appId = res.data.app_id
                    //成功时跳转到下一步
                    console.log("this.orgId", this.orgId)
                    //改变标题
                    let str="新建应用系统("+this.systemDetailData.app_name+")"
                    this.$emit("changeTitle",str)
                    this.$router.replace({
                      path: '/applicationCenter/applicationSystem/addSystem/addSystemSecond',
                      query: {
                        org_id: this.orgId,
                        app_id: this.appId,
                        //title:this.systemDetailData.app_name
                      }
                    })
                  } else {
                    this.addSystemFirstLoading = false
                    this.$message.error(res.message);
                  }
                })
            } else {
              //编辑时的分支-
              this.addSystemFirstLoading = true
              requestMethod.editSystem('put', {app_id: this.app_id, body: this.systemDetailData})
                .then(res => {
                  if (res.code === 200) {
                    this.addSystemFirstLoading = false
                    //当是新增时
                    if (this.operation == 'add') {
                      //成功时跳转到下一步
                      console.log("this.orgId", this.orgId)
                      //改变标题
                    let str="新建应用系统("+this.systemDetailData.app_name+")"
                    this.$emit("changeTitle",str)
                      this.$router.replace({
                        path: '/applicationCenter/applicationSystem/addSystem/addSystemSecond',
                        query: {
                          org_id: this.orgId,
                          app_id: this.appId,
                         // title:this.systemDetailData.app_name
                        }
                      })
                    } else {
                      this.addSystemFirstLoading = false
                      this.$message.success(res.message);

                      //编辑时-   确定 按钮点击触发事件
                      this.$emit("submitSystemEdit")
                    }
                  } else {
                    this.addSystemFirstLoading = false
                    this.$message.error(res.message);
                  }
                })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      //取消事件
      onCancel() {
        if (this.operation == 'add') {
          //新建时-跳转到上一步
          // this.$router.push({
          //   path: '/applicationCenter/applicationSystem/'
          // })
          history.back()
        } else {
          //编辑时-取消按钮点击触发事件
          this.$emit("cancelSystemEdit")
        }
      },
      //获取业务组数据
      getTaskGroop() {
        requestMethod.getBusGroup('get')
          .then(res => {
            if (res.code === 200) {
              this.taskGroup = res.data.items
              console.log("this.taskGroup", this.taskGroup)

            } else {
              this.$message.error(res.message);
            }
          })
      },
      // //根据bus_id获取获取业务组详情
      // getBusGroupDetail(bus_id){
      //   requestMethod.getBusGroupDetail('get',{bus_group_id:bus_id})
      //   .then(res => {
      //     if (res.code === 200) {
      //       this.orgId=res.data.item.org_id
      //       console.log("this.orgId",this.orgId)

      //     } else {
      //       this.$message.error(res.message);
      //     }
      //   })

      // },
      //获取应用类型数据-该数据从基础数据接口中获取
      getApplicationType() {
        requestMethod.getDataBase('get', {
          config_type: "15"
        }).then(res => {
          if (res.code === 200) {
            let arr = []
            res.data.items.forEach(e => {
              if (e.parent_id !== null) {
                arr.push({
                  name: e.value_json,
                  key: e.config_key
                })
              }
            })
            this.applicationType = arr
            console.log("this.applicationType", this.applicationType)
          } else {
            this.$message.error(res.message);
          }
        })
      },
      //获取所属环境数据-该数据从基础数据接口中获取
      getEnvironment() {
        requestMethod.getDataBase('get', {
          config_type: "8"
        }).then(res => {
          if (res.code === 200) {
            let arr = []
            res.data.items.forEach(e => {
              if (e.parent_id !== null) {
                arr.push({
                  name: e.value_json,
                  key: e.config_key
                })
              }
            })
            this.environment = arr
            console.log("this.environment", this.environment)
            //判断有没有app-id,
            if (this.app_id) {
              //则掉编辑接口
              this.isAdd = false
              this.getSystemDetail(this.app_id)

            } else {
              //则掉新增接口
              this.isAdd = true
            }
          } else {
            this.$message.error(res.message);
          }
        })

      },
      //获取灾备等级数据-该数据从基础数据接口中获取
      getDisasterLevel() {
        requestMethod.getDataBase('get', {
          config_type: "16"
        }).then(res => {
          if (res.code === 200) {
            let arr = []
            res.data.items.forEach(e => {
              if (e.parent_id !== null) {
                arr.push({
                  name: e.value_json,
                  key: e.config_key
                })
              }
            })
            this.disarsterLevel = arr
            console.log("this.disarsterLevel", this.disarsterLevel)
          } else {
            this.$message.error(res.message);
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>

  .ts-content-form-footer {
    justify-content: flex-end;
    padding-right: 32px;
    position: absolute;
    bottom: 0px;
    left: 0px;
    z-index: 10px;
  }
</style>
