<template>
  <div>
    <div ref="wEditor" style="text-align: left;"></div>
  </div>
</template>

<script>
import E from 'wangeditor';

export default {
  name: 'WEditor',
  props: {
    value: String,
  },
  mounted() {
    var editor = new E(this.$refs.wEditor);

    editor.customConfig.pasteFilterStyle = false;
    editor.customConfig.uploadImgServer = this.BASE_URL + '/file/upload';
    editor.customConfig.uploadFileName = 'file';
    editor.customConfig.uploadImgTimeout = 10000;

    const that = this;

    editor.customConfig.uploadImgHooks = {
      customInsert: function (insertImg, result) {
        if (result.data && result.data.id) {
          insertImg(that.getFile(result.data.id));
        }
      },
    };

    editor.customConfig.onchange = (html) => {
      that.$emit('onChange', html);
    };
    editor.create();

    if (!this.$route.meta.manage) {
      editor.$textElem.attr('contenteditable', false);
    }

    if (this.value) editor.txt.html(this.value);
  },
};
</script>
