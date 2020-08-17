<template>
    <div class="menu-dialog">
        <el-dialog :visible.sync="dialogVisible" @close="close" width="40%" :title="type.classific">
            <!-- <template slot="title">
                <div class="dialog-title">{{type.classific}}</div>
            </template> -->
            <el-form :model="form" ref="ruleForm" label-width="auto">
                <div v-if="type.classific === '添加子级'" class="add-nodes">
                    <el-radio v-model="radioCheck" label="1">添加业务节点</el-radio>
                    <el-radio v-model="radioCheck" label="2">添加按钮</el-radio>
                    <el-radio v-model="radioCheck" label="3">添加子菜单</el-radio>
                </div>
                <el-form-item
                        :label="type.classific !== '添加子级' ? type.content : btnObj[`${radioCheck}`]"
                        prop="name"
                        :rules="{required:true, validator:validateName, trigger:'blur' }"
                >
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                        label="授权key"
                        prop="key"
                        :rules="{required:true, validator:validateKey, trigger:'blur' }"
                >
                    <el-input v-model="form.key" autocomplete="off"></el-input>
                </el-form-item>
                <!--
                    modules：展示条件
                    菜单类型为：
                             1 菜单  6 服务
                    edit: 1 菜单  6 服务
                    add:  5服务分类  6 服务  1菜单
                -->
                <div v-if="type.isModule && isShowModule">
                    <el-form-item
                            label="所属模块"
                            prop="module"
                            :rules="{required:true, validator:validateModules, trigger:'blur' }">
                        <el-input v-model="form.module" autocomplete="off"></el-input>
                    </el-form-item>
                </div>
                <div v-if="type.isUrl && isShowURL">
                    <el-form-item
                            label="菜单Class"
                            prop="class">
                        <el-input v-model="form.class" autocomplete="off"></el-input>
                    </el-form-item>
                </div>
                <!--
                   URL：展示条件
                   菜单类型为：
                           1 菜单  6 服务
                   edit: 1 菜单  6 服务
                   add:  5服务分类  6 服务  1菜单
               -->
                <div v-if="type.isUrl && isShowURL">
                    <el-form-item label="URL" prop="url" :rules="type.classific === '添加服务' ? checkUrlObj : {}">
                        <el-radio v-model="radioURLType" label="1">已有菜单URL</el-radio>
                        <el-radio v-model="radioURLType" label="2">自定义URL</el-radio>
                        <div class="add-url">
                            <el-select v-if="radioURLType === '1'" v-model="form.url" placeholder="请选择">
                                <el-option
                                        v-for="item in subMenuList"
                                        :key="item.menu_id"
                                        :label="item.menu_name"
                                        :value="item.menu_url"
                                ></el-option>
                            </el-select>
                            <el-input v-else v-model="form.url" placeholder="请输入内容"></el-input>
                        </div>
                    </el-form-item>
                </div>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="confirm(false)">取 消</el-button>
                <el-button type="primary" @click="save('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
  import {mapState} from 'vuex';

  export default {
    props: {
      dialogFormVisible: {
        type: Boolean,
      },
      type: {
        type: Object,
      },
    },
    computed: {
      ...mapState('global', [
        'modulesList',
      ]),
      isShowURL() {
        return this.type.classific === '添加子级' ? this.radioCheck === '3' : true;
      },
      isShowModule() {
        return this.type.classific === '添加子级' ? this.radioCheck === '3' : true;
      },
      subMenuList() {
        return this.type.row.children.filter((item) => {
          return item.menu_url.length > 0;
        });
      },
    },
    data() {
      return {
        form: {
          name: '',
          key: '',
          url: '',
          module: '',
          class: ''
        },
        checkUrlObj: {
          required: true,
          validator: this.validateUrl,
          trigger: this.radioURLType === '1' ? 'change' : 'blur',
        },
        dialogVisible: this.dialogFormVisible,
        radioURLType: '1',
        radioCheck: '1',
        btnObj: {
          1: '业务节点名称',
          2: '按钮名称',
          3: '子菜单名称',
        },
        classificType: {
          edit: {
            type: 'edit',
            name: '编辑',
          },
          addServiceClass: {
            type: 'add_5',
            name: '添加服务分类',
          },
          addService: {
            type: 'add_6',
            name: '添加服务',
          },
          addJSON: {
            type: 'add_2',
            name: '添加JSON请求',
          },
          addMenu: {
            type: 'add_1',
            name: '添加菜单',
          },
          addNode: {
            type: 'add_0', // 包括添加业务节点、添加按钮、添加子菜单
            name: '添加子级',
          },
        },
        radioType: {
          had: {
            type: '1',
            name: '已有菜单URL',
          },
          self: {
            type: '2',
            name: '自定义URL',
          },
        },
        radioCheckType: {
          node: {
            type: '1',
            name: '添加业务节点',
          },
          btn: {
            type: '2',
            name: '添加按钮',
          },
          menu: {
            type: '3',
            name: '添加子菜单',
          },
        },
        radioCheckTypeoMtype: {
          '1': 4, // 添加业务节点
          '2': 3, // 添加按钮
          '3': 1,  // 添加菜单
        },
      };
    },
    watch: {
      radioURLType: function () {
        this.$set(this.form, 'url', '');
      },
    },
    methods: {
      validateName(rule, value, callback) {
        if (value == '') {
          return callback(new Error('名称不能为空'));
        } else {
          return callback();
        }
      },
      validateKey(rule, value, callback) {
        if (value == '') {
          return callback(new Error('授权key不能为空'));
        } else {
          return callback();
        }
      },
      validateUrl(rule, value, callback) {
        if (value == '') {
          return callback(new Error('url不能为空'));
        } else {
          return callback();
        }
      },
      validateModules(rule, value, callback) {
        if (value == '') {
          return callback(new Error('所属模块不能为空'));
        } else if (this.modulesList.indexOf(value) === -1) {
          return callback(new Error('非法模块名称'));
        } else {
          return callback();
        }
      },
      save(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            //确定后，保存数据，通知父组件更新lists
            //编辑
            if (this.type.classific === '编辑') {

              this.$api.menuApi.getMenu('put', {
                menu_id: this.type.row.menu_id,
                menu_name: this.form.name,
                auth_id: this.form.key,
                menu_tag: this.form.module,
                menu_url: this.form.url,
                menu_class: this.form.class
              }).then(res => {
                if (res.status) {
                  this.$message({
                    message: '编辑成功',
                    type: 'success',
                  });
                  this.type.row.menu_name = this.form.name;
                  this.type.row.auth_id = this.form.key;
                  this.type.row.menu_tag = this.form.module;
                  this.type.row.menu_url = this.form.url;
                  this.type.row.menu_class = this.form.class;
                } else {
                  this.$message({
                    message: res.message,
                    type: 'error',
                  });
                }
              });
            }
            //添加服务、菜单
            if (
              this.type.classific.indexOf('添加') !== -1 &&
              Object.keys(this.type.row).length > 0
            ) {
              let menuType;
              switch (this.type.classific) {
                case '添加服务':
                  menuType = 6;
                  break;
                case '添加菜单':
                  menuType = 1;
                  break;
                case '添加子级':
                  menuType = this.radioCheckTypeoMtype[this.radioCheck];
                  // this.radioCheck === "1" ? 4 : this.radioCheck === "2" ? 3 : 1;
                  break;
                case '添加JSON请求':
                  menuType = 2;
                  break;
              }
              this.$api.menuApi.getMenu('post', {
                parent_id: this.type.row.menu_id,
                menu_name: this.form.name,
                menu_url: this.form.url,
                auth_id: this.form.key,
                menu_type: menuType,
                menu_tag: this.form.module,
                menu_class: this.form.class
              }).then(res => {
                if (res.status) {
                  this.type.row.children.push({
                    menu_name: this.form.name,
                    menu_url: this.form.url,
                    menu_id: res.data.menu_id, //随机id
                    menu_type: menuType,
                    menu_class: this.form.class,
                    menu_tag: this.form.module,
                    auth_id: this.form.key,
                    is_fold: this.form.url ? false : true,
                    is_enable: true,
                    children: [],
                  });
                  this.$message({
                    message: '添加成功',
                    type: 'success',
                  });
                } else {
                  this.$message({
                    message: res.message,
                    type: 'error',
                  });
                }
              });
            }
            this.confirm(true, this.form, this.type);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      confirm(res, formData, type) {
        this.$emit('close-dialog', res, formData, type);
      },
      close() {
        this.confirm(false, {});
      },
    },
    mounted() {
      if (this.type.classific === '编辑') {
        this.form.name = this.type.row.menu_name;
        this.form.key = this.type.row.auth_id;
        this.form.module = this.type.row.menu_tag;
        this.form.url = this.type.row.menu_url;
        this.form.class = this.type.row.menu_class;
      }
    },
  };
</script>
<style lang="less" scoped>
    .menu-dialog {
        .dialog-title {
            position: relative;
            font-size: 18px;
            text-align: left;
            &:before {
                content: "";
                display: block;
                width: 4px;
                height: 20px;
                background-color: #20a0ff;
                position: absolute;
                bottom: 0px;
                left: -10px;
            }
        }
        .add-nodes {
            margin-bottom: 15px;
        }
        .add-url {
            margin-top: 10px;
        }
        .el-dialog--center .el-dialog__footer {
            padding-top: 20px;
            background-color: #f5f5f5;
        }
        .el-dialog--center {
            .el-select {
                display: block;
            }
        }
    }
</style>
