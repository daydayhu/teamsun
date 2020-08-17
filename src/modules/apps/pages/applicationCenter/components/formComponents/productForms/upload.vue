<template>
    <div class="theContent clearFloat" :class="[isTitle==true ? 'hasTitleWidth': 'noTitleWidth']">
        <div class="thetit" v-if="isTitle">
            上传附件
        </div>
        <div class='inbox'>
            <el-upload
                class="upload-demo"
                :action="uploadActionUrl"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :on-error="handleError"
                :on-preview="handPreView"
                multiple
                :file-list="fileList">
                <el-button size="small"  type="primary">点击上传</el-button>
            </el-upload>
        </div>
    </div>
</template>
<script>
    export default {
        props:{
            item: {
                type: Object
            },
            serial: {
                type: Number
            },
            isTitle:{
                type:Boolean,
                default: true
            },
            fileList:{
                type:Array
            },
            ActionSetFromIndex:{
                type:Number
            }
        },
        data(){
            return{
                uploadActionUrl: '/v1/api/file_storage/file_store/files?custom_path=attachments',
            }
        },
        methods:{
            handleRemove(file, fileList) {
                console.log(file, fileList);
                this.$emit('changeForms', {
                    index: this.ActionSetFromIndex,
                    value:file.storage_path,
                    isUpload:true
                })
            },
            handleSuccess(response, file, fileList) {
                console.log(response.data.file_info[0],'upload')
                /* var obj={
                    name:response.data.file_info[0].name,
                    url:response.data.file_info[0].storage_path
                } */
                this.$emit('changeForms', {
                    index: this.ActionSetFromIndex,
                    value:response.data.file_info[0],
                    isUpload:true
                }) 
            },
            handleError(err, file, fileList) {
                
            },
            handPreView(file){
               //window.open(file.download_url);
                var blob = new Blob([],{type:'application/excel;charset=utf-8'})
                var downloadElement = document.createElement('a')
                var href = window.URL.createObjectURL(blob) //创建下载链接
                downloadElement.href = file.download_url// 此处可以通过拼接字符串的方式传递参数
                document.body.appendChild(downloadElement)
                downloadElement.click() // 点击下载
                document.body.removeChild(downloadElement) // 下载完成之后移除元素
                window.URL.removeObjectURL(href) // 释放掉blob对象
            }
        },
        mounted(){
        }
    }
</script>
<style src="./common.less" lang="less" scoped></style>
<style lang="less" scoped>
.theContent{
    line-height: 60px;
}
</style>