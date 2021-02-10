<template>
  <div>
    <el-upload
      :action="`${BASE_URL}/file/upload`"
      list-type="picture-card"
      :file-list="fileList"
      multiple
      :limit="20"
      :on-success="onSuccess"
      :on-error="onError"
      :before-upload="beforeAvatarUpload"
      :on-progress="onProgress"
      :disabled="loading"
      accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.GIF"
    >
      <i slot="default" class="el-icon-plus"></i>
      <template slot="file" slot-scope="{ file }">
        <el-image class="el-upload-list__item-thumbnail" :src="(checkOk(file) && getFile(file.response.data.id))" fit="cover">
          <span v-if="loading" slot="error" class="el-upload-list__item-actions" style="opacity: 1; background: none;">
            <i style="font-size: 28px; color: #8c939d;" class="el-icon-loading"></i>
          </span>
          <img v-else slot="error" :src="errorEmpty" class="image-slot" />
        </el-image>
        <span v-if="checkOk(file)" class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file.response.data)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <a :href="getFile(file.response.data.id)" download>
            <span v-if="!disabled" class="el-upload-list__item-delete">
              <i class="el-icon-download"></i>
            </span>
          </a>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file.response.data)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </template>
      <div slot="tip" class="el-upload__tip">只能上传jpg、jpeg、png、gif文件</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :modal="false">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import errorEmpty from '@/assets/images/empty.png';

export default {
  props: {
    fileIds: Array,
  },
  data() {
    return {
      errorEmpty,
      fileList: [],
      loading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
    };
  },
  created() {
    this.fileList = this.fileIds.map((id) => ({
      response: {
        data: {
          id,
        },
      },
    }));
  },
  methods: {
    checkOk(file) {
      return file.response && file.response.data && file.response.data.id;
    },
    handleRemove(data) {
      this.fileList = this.fileList.filter((item) => item.response.data.id != data.id);

      this.$emit(
        'change',
        this.fileList.map((item) => this.checkOk(item))
      );
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = this.getFile(file.id);
      this.dialogVisible = true;
    },
    onProgress() {
      this.loading = true;
    },
    onError() {
      this.loading = false;
    },
    onSuccess(res, file, fileList) {
      console.log(res, file);

      this.fileList = fileList;

      this.$emit(
        'change',
        fileList.map((item) => this.checkOk(item))
      );
      this.loading = false;
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

<style lang="less" scoped>
.el-avatar {
  display: flex;
}
</style>
