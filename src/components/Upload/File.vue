<template>
  <el-upload
    :action="`${BASE_URL}/file/upload`"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :on-error="onError"
    :on-progress="onProgress"
    :disabled="loading"
    :before-upload="beforeUpload"
    :accept="accepts"
  >
    <el-button size="small" :loading="loading" type="primary">点击上传</el-button>
    {{ parseFileName(filePath) }}
    <div slot="tip" class="el-upload__tip">{{ tips }}</div>
  </el-upload>
</template>

<script>
export default {
  name: 'UploadFile',
  props: {
    fileId: String,
    filePath: {
      default: null,
    },
    fileType: String,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    tips() {
      const obj = {
        video: '只能上传mp4文件',
        apk: '只能上传apk安装包',
      };

      return obj[this.fileType];
    },
    accepts() {
      const obj = {
        video: '.mp4,.MP4',
        apk: '.apk',
      };

      return obj[this.fileType];
    },
  },
  methods: {
    parseFileName(filePath) {
      if (!filePath) return '';
      const arr = filePath.split('/');

      return arr[arr.length - 1];
    },
    onProgress() {
      this.loading = true;
    },
    onError() {
      this.loading = false;
    },
    handleAvatarSuccess(res) {
      this.loading = false;
      this.$emit('change', res.data);
    },
    beforeUpload(file) {
      if (this.fileType === 'video') {
        return this.beforeVideoUpload(file);
      } else if (this.fileType === 'apk') {
        return this.beforeApkUpload(file);
      } else {
        return true;
      }
    },
    beforeApkUpload(file) {
      const isLt100M = file.size / 1024 / 1024 / 1024 < 100;
      const isAPK = file.name.substr(file.name.length - 4, file.name.length) === '.apk';

      if (!isAPK) {
        this.$message.error('上传安装包类型只支持 apk!');
      }

      if (!isLt100M) {
        this.$message.error('上传安装包大小不能超过 100MB!');
      }

      return isLt100M && isAPK;
    },
    beforeVideoUpload(file) {
      const isLt2G = file.size / 1024 / 1024 / 1024 < 2048;
      const isVideo = file.type === 'video/mp4';

      if (!isVideo) {
        this.$message.error('上传视频类型只支持 mp4!');
      }

      if (!isLt2G) {
        this.$message.error('上传视频大小不能超过 2GB!');
      }

      return isLt2G && isVideo;
    },
  },
};
</script>
