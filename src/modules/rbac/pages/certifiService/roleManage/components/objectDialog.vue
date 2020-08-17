<template>
  <div>
    <div>
      <el-radio-group v-model="radio" @change="onRadio" id="rbac_objectDialog_userRadio">
        <el-radio :label="0">用户</el-radio>
        <el-radio :label="1">用户组</el-radio>
      </el-radio-group>
    </div>
    <div class="roleSelect">
      <el-select
        v-model="value"
        multiple
        filterable
        size="medium"
        placeholder="请选择"
        style="margin-top: 24px"
        id="rbac_objectDialog_roleSelect"
      >
        <el-option
          v-for="item in s_selectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
          <el-checkbox v-model="item.checked" @change="handleCheckboxChange(item)"></el-checkbox>
          <span style="margin-left: 8px">{{item.label}}</span>
        </el-option>
      </el-select>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handelOk" id="rbac_objectDialog_submit">确定</el-button>
      <el-button @click="handCancle" id="rbac_objectDialog_cancel">取 消</el-button>
    </div>
  </div>
</template>
<script>
  import * as userRequestMethod from "@/modules/rbac/api/certifiService/userApi";
  import * as requestMethod from "@/modules/rbac/api/certifiService/userGroupApi";
  import * as roleRequestMethod from "@/modules/rbac/api/certifiService/roleManageApi";

  import {filterData} from "@/utils/utils";


  export default {
    props: {
      roleId: {},
      objectsData: {
        type: Array
      }
    },
    components: {},
    data() {
      return {
        active: 0,
        radio: 0,
        options: [],
        value: [],
        dialogFormVisible: false,
        submitLoading: false,
        theIds: [],
        selectedVal: []
      }
    },
    computed: {
      s_selectOptions() {
        if (this.value.length) {
          let selectList = this.value;
          console.log(selectList)
          return this.options.map(item => {
            if (selectList.includes(item.value)) {
              return {
                ...item,
                checked: true
              }
            } else {
              return item
            }
          })
        }
        return this.options
      }
    },
    watch: {
      objectsData: {
        handler(newVal) {
          this.theIds = newVal;
          let tag = 'user';
          if (this.radio === 0) {
            tag = 'user';
          } else {
            tag = 'group';
          }
          if (newVal.length > 0) {
            const data = newVal.filter(item => item.type == tag);
            const ids = [];
            data.forEach(item => {
              ids.push(item.id);
            });
            // this.value = ids;
          }
        },
        immediate: true
      }
    },
    created() {
      if (this.radio === 0) {
        this.getUser();
      } else {
        this.getUserGroup();
      }
    },
    methods: {
      // changeIds() {
      //   let tag = 'user';
      //   if (this.radio === 0) {
      //     tag = 'user';
      //   } else {
      //     tag = 'group';
      //   }
      //   if (this.theIds.length > 0) {
      //     const data = this.theIds.filter(item => item.type == tag);
      //     const ids = [];
      //     data.forEach(item => {
      //       ids.push(item.id);
      //     });
      //     // this.value = ids;
      //     this.value = []
      //   }
      // },
      addRoleHandleClose() {
        this.active = 0;
      },
      onRadio(val) {
        this.value = [];
        this.radio = val;
        if (val === 0) {
          this.getUser();
        } else {
          this.getUserGroup();
        }
        // this.changeIds()
      },
      getUser() {
        // var data = {
        //   per_page: 10000,
        //   current_page: 1,
        //   keyword: []
        // }
        userRequestMethod.getNotObjectsUserApi('get',this.roleId).then(res => {
          if (res.code === 200) {
            const data = filterData(res.data.items, 'user_id', 'alias_name');
            this.options = this.setChecked(data);
          }
        })
      },
      getUserGroup(data) {
        // var data = {
        //   per_page: 10000,
        //   current_page: 1,
        //   keyword: []
        // }
        requestMethod.getNotObjectsUserGroupApi('get', this.roleId).then(res => {
          if (res.code === 200) {
            const data = filterData(res.data.items, 'group_id', 'group_alias');
            this.options = this.setChecked(data);
          }
        })
      },
      setChecked(data) {
        data.forEach(item => {
          item.checked = false;
        });
        return data;
      },
      handelOk() {
        const data = this.handelIds();
        if (data) {
          this.saveRoleObject('post', data);
        }
      },
      saveRoleObject(type, data) {
        const param = {role_id: this.roleId, role_info: {objects: data}};
        roleRequestMethod.authObjects(type, param).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message);
            this.$emit('object-list');
            this.handCancle()
          } else {
            this.$message.error(res.message);
          }
        })
      },
      remoteMethod(query) {
        const keyword = JSON.stringify({user_name: query});
        const data = {keyword};
        if (this.radio === 0) {
          this.getUser(data);
        } else if (this.radio === 1) {
          this.getUserGroup({keyword: query});
        }
      },
      handelIds() {
        let tag;
        if (this.radio === 0) {
          tag = 'user';
        } else {
          tag = 'group'
        }
        return [{type: tag, ids: this.value}];
      },
      handleCheckboxChange(obj) {
        let {value, checked} = obj;
        // 根据选中状态判断勾选
        if (checked) {
          this.value = this.value.filter(state => state !== value);
        } else {
          this.value.push(value);
        }
      },
      handCancle() {
        this.value = []
        this.$emit('set-drawer', false)
      }
    }
  }
</script>
<style lang="less" scoped>
  .dialog-footer {
    margin-top: 20px;
  }

  .roleSelect {
    .el-select {
      width: 50%;
    }
  }
</style>

