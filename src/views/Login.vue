<template>
  <div class="admin-login">
    <el-card shadow="always" class="login-card">
      <h1>
        <span>管理系统</span>
      </h1>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" size="medium">
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="loginForm.password" show-password maxlength="32"></el-input>
        </el-form-item>
      </el-form>
      <el-button size="medium" type="primary" :loading="loading" @click="handleLogin()">登录</el-button>
    </el-card>
  </div>
</template>

<script>
import { Encrypt } from '@/utils/AESUtils';

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'change' }],
      },
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) return false;

        this.loading = true;
        this.$store
          .dispatch('user/signIn', {
            ...this.loginForm,
            password: Encrypt(this.loginForm.password),
          })
          .then(() => {
            this.$router.push({ path: this.redirect || '/' });
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      });
    },
  },
};
</script>

<style lang="less">
.admin-login {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: url('../assets/images/bg.jpg') no-repeat;
  background-size: cover;
  background-position: center;

  .el-card {
    width: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -200px;
    transform: translateY(-50%);
  }

  h1 {
    margin-bottom: 20px;
    margin-top: 20px;
    text-align: center;
    font-size: 18px;
    color: #2884ea;
    font-weight: 500;
  }

  label {
    color: #2884ea;

    &::before {
      display: none;
    }
  }

  .el-button {
    width: 100%;
    margin: 20px 0px;
  }

  .name {
    width: 100%;
    position: absolute;
    bottom: 26px;
    font-size: 18px;
    text-align: center;
    color: #fff;
  }
  .login-card {
    background-color: rgba(135, 206, 235, 0.7);
  }
}
</style>
