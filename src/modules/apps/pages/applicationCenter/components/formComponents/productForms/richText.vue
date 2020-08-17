<template>
  <div class="theContent clearFloat" v-if="item" style="width:1000px;margin-top:10px">
    <div class="thetit" v-if="isTitle">
      {{ item.pro_para_name }}<span v-if="item.is_required === 1">*</span>
    </div>
    <div class="inbox" style="width:800px;margin-bottom:30px;">
      <quill-editor
        ref="myTextEditor"
        v-model="content"
        :options="editorOption"
        style="height:200px;"
        :disabled="!(isEdit.indexOf(phaseState)>-1)"
        @blur="onEditorBlur($event)"
      >
      </quill-editor>
    </div>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  props: {
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
    phaseState:{
      type:String
    },
    isEdit:{
      type:String
    },
    ActionSetFromIndex:{
                type:Number
            }
  },
  mounted() {
  },
  components: {
    quillEditor
  },
  data() {
    return {
      content: '',
      /* editorOption: {
          placeholder: '编辑文章内容'
      }, */
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }],
            [{ 'align': [] }],
            //['clean'],
            //['link', 'image', 'video']
          ]
        }
      }
    }
  },
  watch: {

  },
  methods: {
    onEditorBlur() {
      this.changgevalue(this.content)
    },
    /* @change="onEditorChange($event)"
    onEditorChange({ editor, html, text }) {
      this.changgevalue(html)
    }, */
    changgevalue(val) {
      this.$emit('changeForms', {
        index: this.ActionSetFromIndex,
        value: val,
        key_uuid:val.key_uuid,
        ref_key_uuid:val.ref_key_uuid,
        isUpload:false
      })
    }
  }
}
</script>
<style src="./common.less" lang="less" scoped></style>
<style lang="less" scoped>
.theContent /deep/ .ql-container.ql-snow {
  height: 145px;
}
</style>