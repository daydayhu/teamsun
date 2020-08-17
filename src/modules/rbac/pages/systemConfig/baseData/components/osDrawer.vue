<template>
    <el-drawer
            :title="titleSet[drawerInfo.status]"
            :visible.sync="drawerFlag"
            direction="rtl"
            size="40%"
            ref="drawer"
            :append-to-body="true"
            :modal-append-to-body="true"
            custom-class="operation-drawer"
            @closed="close"
    >
        <div class="ts-drawer-c">
            <el-form
                    ref="osForm"
                    :model="osForm"
                    :rules="osFormRules"
                    :label-position="labelPosition"
                    :label-width="formLabelWidth"
            >
                <el-form-item label="名称" prop="name">
                    <el-input v-model="osForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="imageUrl">
                    <!--TODO: 此行为了监听imageUrl改变-->
                    <el-input v-model="osForm.imageUrl" autocomplete="off" v-show="false"></el-input>
                    <div class="icon-upload-c">
                        <div class="icon-show-c" v-if="showImageUrl">
                            <img :src="showImageUrl" />
                            <div class="progress-c" v-if="progressFlag">
                                <el-progress type="circle" :percentage="progressPercent" :width="100"></el-progress>
                            </div>
                            <div class="delete-c" v-else>
                                <el-button
                                        type="text"
                                        @click.stop="iconDelete">
                                    <i class="el-icon-delete"></i>
                                </el-button>
                            </div>
                        </div>
                        <el-upload class="el-upload-self" v-show="!showImageUrl"
                                   ref="upload"
                                   :before-upload="beforeIconUpload"
                                   :action="uploadActionUrl"
                                   :http-request="iconUpload"
                                   :auto-upload="true"
                                   :show-file-list="false"
                                   :on-exceed="exceedUpload"
                                   :limit="1"
                        >
                            <div class="show-c">
                                <i class="el-icon-plus"></i>
                            </div>
                        </el-upload>
                    </div>
                    <div class="hint">上传icon支持（.png .gif .jpg...，建议尺寸100px*100px）</div>
                </el-form-item>
                <el-form-item label="版本号" prop="osVersionListFlag">
                    <!--<el-input v-model="osForm.osVersionListFlag" autocomplete="off" v-show="false"></el-input>-->
                    <ul class="os-list-c">
                        <li class="os-item" v-for="(version,index) in osForm.osVersionList" :key="index">
                            <el-input v-model="osForm.osVersionList[index]" autocomplete="off" ></el-input>
                            <div class="add-pro-os" v-if="index === osForm.osVersionList.length - 1 && index < osVersionMaxNum - 1">
                                <el-button type="text" @click="addVersionforOSList">
                                    <svg-icon icon-class="add"></svg-icon>
                                </el-button>
                                <span>新建</span>
                            </div>
                            <div class="delete-pro-os" v-else>
                                <el-button type="text" @click="deleteVersionforOSList(index)">
                                    <svg-icon icon-class="reduce"></svg-icon>
                                </el-button>
                                <span>删除</span>
                            </div>
                        </li>
                    </ul>
                </el-form-item>
            </el-form>
        </div>
        <div class="drawer_footer">
            <el-button @click="drawerFlag = false">取 消</el-button>
            <el-button type="primary" :loading="submitLoading" @click="confirm">{{ submitLoading ? '提交中...'
                : '确认' }}
            </el-button>

        </div>
    </el-drawer>
</template>

<script>
  import axios from 'axios';
  import * as requestMethod from '@/modules/rbac/api/systemConfig/baseData.js';
  export default {
    name: 'osDrawer',
    props: {
      drawerInfo: {
        type: Object,
      },
    },
    data() {
      return {
        osForm: {
          id: '',
          name: '',
          imageUrl: '',
          osVersionList: [''],
          config_type: '',
          config_key: '',
          osVersionListFlag: true
        },
        osVersionMaxNum: 6,
        osFormRules: {
          name: [
            {required: true, message: '系统名称是必填项', trigger: 'blur'},
            {max: 64, message: '字符不能超过64位', trigger: 'blur'},
          ],
          imageUrl: {
            required: true, message: '请上传操作系统图标'
          },
          osVersionListFlag: {
            required: true, message: '请完善选择操作系统版本'
          }
        },
        titleSet: {
          add: '添加操作系统',
          edit: '编辑操作系统'
        },
        drawerFlag: true,
        labelPosition: 'right',
        formLabelWidth: '150px',
        submitLoading: false,
        // 上传图标相关
        showImageUrl: '',
        uploadActionUrl: '/v1/api/file_storage/file_store/files?custom_path=imgs',
        imageMaxSize: 1024 * 1024 * 2,
        progressFlag: false,
        progressPercent: 0
      };
    },
    created() {
      this.getOsForm();
    },
    methods: {
      getOsForm() {
        this.osForm = Object.assign(this.osForm, JSON.parse(JSON.stringify(this.drawerInfo.osForm)));
        this.showImageUrl = this.osForm.imageUrl;
      },
      resetOsVersionListFlag() {
        this.osForm.osVersionListFlag = this.osForm.osVersionList.every( value => value !== '') || '';
      },
      confirm() {
        this.resetOsVersionListFlag();
        this.$refs.osForm.validate((isValid, s) => {
          if (isValid) {
            switch (this.drawerInfo.status) {
              case 'add':
                this.addOs();
                break;
              case 'edit':
                this.editOs();
                break;
              default:
                break;
            }
          }
        });
      },
      addOs() {
        let param = {
           parent_id: this.osForm.id,
           config_tag: this.osForm.name,
           versions: this.osForm.osVersionList,
           config_type : this.osForm.config_type,
           image_url:  this.osForm.imageUrl
        };
        requestMethod.addOS('post', param).then(res => {
          if (res.code === 200) {
            this.$emit('getBaseDataForType');
            this.$message.success('添加操作系统成功');
            this.close();
          }else {
            this.$message.error(res.message);
          }
        });
      },
      editOs() {
        let param = {
          config_tag: this.osForm.name,
          versions: this.osForm.osVersionList,
          config_key : this.osForm.config_key,
          image_url:  this.osForm.imageUrl
        };
        requestMethod.editOS('put', param).then(res => {
          if (res.code === 200) {
            this.$emit('getBaseDataForType');
            this.$message.success('编辑操作系统成功');
            this.close();
          }else {
            this.$message.error(res.message);
          }
        });
      },
      // 用于图片上传
      beforeIconUpload(file) {
        const isImage = file.type.indexOf('image/') !== -1;
        const isRange = file.size < this.imageMaxSize;
        if (!isImage) {
          this.$message.warning('请上传正确图片格式!');
          return false;
        }
        if (!isRange) {
          this.$message.warning('上传图标大小不能超过 2MB!');
          return false;
        }
        this.showImageUrl = URL.createObjectURL(file)
        return true;
      },
      iconUpload(params) {
        let formData = new FormData();
        formData.append('file', params.file);
        this.progressFlag = true;
        axios.post(params.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: progressEvent => {
            this.progressPercent = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
          },
        }).then(res => {
          if (res.data.code === 200) {
            this.osForm.imageUrl = res.data.data.file_info[0].download_url;
          }else {
            this.showImageUrl = '';
          }
          this.progressFlag = false;
          this.progressPercent = 0;
        }).catch((e) => {
          this.progressFlag = false;
          this.showImageUrl = '';
          this.progressPercent = 0
        });
      },
      exceedUpload() {
        this.$message.warning('只能上传一张图片')
      },
      iconDelete() {
        this.showImageUrl = '';
        this.osForm.imageUrl = '';
        this.$refs.upload.clearFiles();
      },
      // 用于添加操作系统版本号
      addVersionforOSList() {
        this.osForm.osVersionList.push('')
      },
      deleteVersionforOSList(index) {
        this.osForm.osVersionList.splice(index, 1)
      },
      close() {
        this.$emit('closeOsDrawer');
      },
    },
    watch: {
      'osForm.osVersionList': {
        handler(arr, oldArr) {
          this.osForm.osVersionListFlag = this.osForm.osVersionList.every( value => value !== '') || '';
        },
        deep: true,
      }
    },
  };
</script>

<style lang="less" scoped>
    .operation-drawer {
        position: relative;
        height: 500px;
        .ts-drawer-c {
            width: 100%;
            overflow-x: hidden;
            padding: 0 40px 60px 0;
            .el-form {
                .el-form-item {
                    .icon-upload-c {
                        @flex();
                        .icon-show-c {
                            position: relative;
                            margin-right: 20px;
                            @flex();
                            justify-content: center;
                            width: 106px;
                            height: 106px;
                            border-radius: 6px;
                            overflow: hidden;
                            &:hover .delete-c {
                                @flex();
                                justify-content: center;
                            }
                            & > img {
                                width: 106px;
                                height: 106px;
                            }
                            .progress-c {
                                @flex();
                                justify-content: center;
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                                height: 100%;
                                background-color: rgba(0, 0, 0, 0.2);
                            }
                            .delete-c {
                                display: none;
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                                height: 100%;
                                background-color: rgba(0, 0, 0, 0.2);
                            }
                        }
                        .el-upload-self {
                            /deep/ .el-upload {
                                .show-c {
                                    border: 1px dashed #d9d9d9;
                                    border-radius: 6px;
                                    cursor: pointer;
                                    position: relative;
                                    overflow: hidden;
                                    width: 104px;
                                    height: 104px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                }
                            }
                            /*/deep/ .el-upload-list {*/
                            /*margin: 0;*/
                            /*padding: 0;*/
                            /*display: flex;*/
                            /*& > li {*/
                            /*width: 106px;*/
                            /*height: 106px;*/
                            /*margin: 0 20px 0 0;*/
                            /*}*/
                            /*}*/
                        }
                    }
                    .os-list-c {
                        & > li {
                            margin-bottom: 20px;
                            position: relative;
                            @flex();
                            width: 80%;
                            .add-pro-os {
                                .add
                            }
                            .delete-pro-os {
                                .delete
                            }
                        }
                    }
                    .add {
                        @flex();
                        position: absolute;
                        top: 0;
                        right: -120px;
                        height: 100%;
                        width: 100px;
                        color: @g-font-color-m;
                        cursor: pointer;
                        span {
                            margin-left: 10px;
                        }
                    }
                    .delete {
                        @flex();
                        position: absolute;
                        top: 0;
                        right: -120px;
                        height: 100%;
                        width: 100px;
                        color: @g-font-color-m;
                        cursor: pointer;
                        span {
                            margin-left: 10px;
                        }
                    }
                }
            }
        }
    }

</style>
