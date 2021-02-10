<template>
  <div class="full-screen">
    <iframe ref="activit" width="100%" scrolling="auto" height="100%" :src="src" style="border: none;"></iframe>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'; //登陆人的token

export default {
  name: 'ActivitiExp',
  props: {
    modelId: String,
  },
  computed: {
    src() {
      const publicPath = this.PUBLIC_PATH == '/' ? '/' : this.PUBLIC_PATH + '/';
      return `${publicPath}webapp/modeler.html?modelId=${this.modelId}`; //activiti主html路径
    },
    apiUrl() {
      return this.BASE_URL + '/service'; //后台部署的api服务
    },
    token() {
      return getToken(); //token
    },
  },
  methods: {
    goto() {
      this.$message({
        message: '流程保存成功',
        type: 'success',
      });
      this.$emit('handleCancel');
    },
  },
  mounted() {
    window.getMyVue = this; //全局存入当前vue实例，供activiti调用
  },
};
</script>

<style lang="less" scoped>
.full-screen {
  width: 100%;
  height: 100%;
}
</style>
