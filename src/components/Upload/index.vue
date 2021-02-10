<template>
  <el-upload
    class="avatar-uploader"
    :action="`${BASE_URL}/file/upload`"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.GIF"
  >
    <img v-if="avatarUrl" :src="getFile(avatarUrl)" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    <div slot="tip" class="el-upload__tip" style="margin-left: 5px; display: inline-block;">只能上传jpg、jpeg、png、gif文件</div>
  </el-upload>
</template>

<script>
export default {
  name: 'Upload',
  props: {
    avatarUrl: String,
  },
  methods: {
    handleAvatarSuccess(res) {
      this.$emit('changeUrl', res.data.id);
    },
    beforeAvatarUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50;
      const isIMG = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].indexOf(file.type) !== -1;

      if (!isIMG) {
        this.$message.error('上传图片类型只支持 jpg、jpeg、png、gif!');
      }

      if (!isLt50M) {
        this.$message.error('上传图片大小不能超过 50MB!');
      }

      return isIMG && isLt50M;
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
  object-fit: contain;
}
</style>
