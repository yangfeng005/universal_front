<template>
  <el-scrollbar>
    <el-divider />
    <el-menu
      router
      mode="vertical"
      background-color="#304156"
      text-color="#fff"
      active-text-color="#409EFF"
      :collapse="collapse"
      class="el-menu-vertical"
      :default-active="$route.path"
    >
      <el-menu-item class="logo">
        <!-- <i>
           <img src="../assets/logo.png" />
         </i>
         <span slot="title">管理系统</span>-->
      </el-menu-item>
      <sidebar-item :imgs="imgs" v-for="menu in menuList" :key="menu.uri" :item="menu" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import SidebarItem from './SidebarItem';

const imgKeys = [
    'el-icon-document',
    'el-icon-edit-outline',
    'el-icon-help',
    'el-icon-monitor',
    'el-icon-notebook-2',
    'el-icon-s-data',
    'el-icon-s-operation',
    'el-icon-s-platform',
    'el-icon-s-promotion',
    'el-icon-setting',
    'el-icon-shopping-bag-1',
    'el-icon-timer',
    'el-icon-video-camera',
  ],
  imgs = {};

imgKeys.map((item) => {
  imgs[item] = require(`../assets/images/menu/${item}.png`);
});

export default {
  name: 'Sidebar',
  components: { SidebarItem },
  props: {
    menuList: {
      type: Array,
      required: true,
    },
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      imgs,
    };
  },
};
</script>

<style lang="less" scoped>
.el-scrollbar {
  height: calc(100% + 15px);
  overflow: hidden;

  .el-divider {
    width: 220px;
    height: 60px;
    margin: 0px;
    position: absolute;
    z-index: 9;
    background: none;
    -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.2);
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.2);
  }

  .logo {
    height: 60px;
    line-height: 60px;
    position: fixed;
    top: 0px;
    z-index: 99;
    margin: 0px;
    box-sizing: border-box;
    font-size: 20px;
    font-weight: 600;
    background-color: #304156 !important;

    img {
      width: 32px;
    }

    span {
      margin-left: 12px;
      letter-spacing: 1px;
      color: #fff;
    }
  }

  .el-menu {
    padding-top: 60px;
    border-right: 0px;
  }
}

.el-menu-vertical {
  &:not(.el-menu--collapse) {
    width: 220px;

    .logo {
      width: 220px;
    }
  }

  &.el-menu--collapse {
    width: 72px;
    box-sizing: border-box;
    padding-left: 4px;
    padding-right: 4px;

    .logo {
      width: 72px;
      margin-left: -4px;
    }
  }
}
</style>
