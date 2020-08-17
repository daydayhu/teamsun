<template>
  <tag-components
    :tagObjList="tagObjList"
    theUrl="/v1/api/app/search_items"
    :authority="authority"
  ></tag-components>
</template>

<script>
  import tagComponents from "@/components/tagComponents/index.vue";
  export default {
    name: "index",
    components: {
      tagComponents
    },
    data() {
      return {
        tagObjList: {
          tag_category: 7
        },
        authority: {
          add: this.$_hasAuth('front_app_tags_add'),
          edit: this.$_hasAuth('front_app_tags_edit'),
          delete: this.$_hasAuth('front_app_tags_delete'),
          batchDelete: this.$_hasAuth('front_app_tags_batch_delete')
        }
      }
    }
  }
</script>

<style scoped>

</style>
