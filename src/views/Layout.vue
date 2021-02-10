<template>
  <el-container>
    <el-aside width="auto">
      <Sidebar :menuList="menuList" :collapse="isCollapse" />
    </el-aside>
    <el-container>
      <el-header height="60px">
        <el-row type="flex" justify="space-between">
          <el-col style="width: auto;">
            <div class="grid-content bg-purple">
              <span class="nav-switch" v-bind:class="switchClass" @click="handleSwitch" />
              <el-breadcrumb class="nav-router" separator="/">
                <el-breadcrumb-item v-for="item in breadList" :key="item.path">{{ item.meta.title }}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </el-col>
          <el-col style="width: auto;">
            <div class="grid-content bg-purple">
              <el-link
                v-if="showScreenMenu"
                style="margin-right: 20px; font-weight: normal;"
                icon="el-icon-s-platform"
                @click="showScreen()"
                >警力大屏</el-link
              >
              <el-dropdown style="cursor: pointer;" @command="handleCommand">
                <span class="el-dropdown-link">
                  <el-avatar v-if="userInfo.avatarUrl" style="vertical-align: middle;" :src="userInfo.avatarUrl"></el-avatar>
                  <el-avatar v-else style="vertical-align: middle;"
                    >{{ (userInfo.trueName || userInfo.userName).substr(0, 1).toUpperCase() }}
                  </el-avatar>
                  <span style="margin-left: 5px;">{{ userInfo.trueName || userInfo.userName }}</span>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="updPwd" icon="el-icon-edit-outline">修改密码</el-dropdown-item>
                  <el-dropdown-item command="logout" icon="el-icon-switch-button">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
        </el-row>
        <!-- <div class="tags-view">
          <el-tag
            class="tags-view-item"
            v-for="tag in tags"
            :key="tag.name"
            :closable="tag.closable"
            :type="tag.type"
          >{{tag.name}}</el-tag>
        </div> -->
      </el-header>
      <el-main class="page-component__scroll">
        <section class="el-scrollbar__wrap">
          <transition name="fade-transform" mode="out-in">
            <router-view :key="key" />
          </transition>
        </section>
        <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>
      </el-main>
    </el-container>
    <el-dialog :close-on-click-modal="false" title="修改密码" :visible.sync="dialog1Visible" :before-close="handleCancel">
      <el-form ref="form1" :model="form1" :rules="form1Rules" label-width="110px">
        <el-form-item label="原密码" prop="originPassword">
          <el-input type="password" v-model="form1.originPassword" placeholder="请输入原密码" autocomplete="off" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="form1.newPassword" placeholder="请输入新密码" autocomplete="off" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
          <el-input type="password" v-model="form1.checkPass" placeholder="请确认新密码" autocomplete="off" maxlength="32"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button :loading="saving" type="primary" @click="handlePwd">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import Sidebar from '@/components/SideBar.vue';

import { updatePwd } from '@/api/user';

export default {
  name: 'layout',
  components: { Sidebar },
  data() {
    var validatePass = (rule, value, callback) => {
      if (this.form1.checkPass) {
        this.$refs.form1.validateField('checkPass');
      }
      callback();
    };

    var validatePass2 = (rule, value, callback) => {
      if (value && value !== this.form1.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      isCollapse: false,
      tags: [
        { name: '首页', closable: false, type: '' },
        { name: '用户管理', closable: true, type: 'success' },
        { name: '添加用户', closable: true, type: 'info' },
      ],
      saving: false,
      dialog1Visible: false,
      form1: {},
      form1Rules: {
        originPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' },
        ],
        checkPass: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    switchClass() {
      if (this.isCollapse) return 'el-icon-s-unfold';
      else return 'el-icon-s-fold';
    },
    key() {
      return this.$router.path;
    },
    breadList() {
      return this.$route.matched || [];
    },
    menuList() {
      return this.$store.state.permission.menu;
    },
    showScreenMenu() {
      const hasScreen = this._.find(this.menuList, ['code', 'policeForceScreen']);

      return !!hasScreen;
    },
    userInfo() {
      return this.$store.state.user.userInfo;
    },
  },
  methods: {
    showScreen() {
      window.open(window.location.href.split('/#')[0] + '/#/policeForceScreen');
    },
    handleSwitch() {
      this.isCollapse = !this.isCollapse;
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleLink(route) {
      // console.log(route);
      this.$router.push(route.path);
    },
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.handleLogout();
          break;
        case 'updPwd':
          this.updatePwd();
          break;
      }
    },
    handleLogout() {
      this.$store
        .dispatch('user/signOut')
        .then(() => {
          this.$router.push({ path: '/login' });
        })
        .catch(() => {});
    },
    updatePwd() {
      this.form1 = {};

      this.dialog1Visible = true;
    },
    handleCancel() {
      this.form1 = {};
      this.$refs.form1.resetFields();
      this.dialog1Visible = false;
    },
    handlePwd() {
      this.$refs.form1.validate((valid) => {
        if (!valid) return;

        this.saving = true;

        updatePwd(this.form1)
          .then(() => {
            this.$message({
              message: '操作成功',
              type: 'success',
            });

            this.dialog1Visible = false;
          })
          .finally(() => (this.saving = false));
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
}

.el-aside {
  height: 100vh;
  overflow: hidden;
  color: #304156;
  background-color: #304156;
}

.el-header {
  overflow: hidden;
  position: relative;
  background: #fff;
  -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.1);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.1);
  background-color: #fff;
  z-index: 99;

  .grid-content {
    height: 60px;
    display: flex;
    align-items: center;
  }

  .nav-switch {
    display: inline-block;
    font-size: 24px;
    margin-right: 8px;
  }

  .nav-router {
    display: inline-block;
    line-height: 24px;
  }

  .tags-view-item {
    margin: 0 5px;
    cursor: pointer;
    height: 26px;
    line-height: 26px;
  }
}

#app > .el-container {
  height: 100vh;
  overflow: hidden;
}
</style>
