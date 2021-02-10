<template>
  <el-submenu v-if="item.children && item.children.length > 0" :index="item.url || `/${item.code}`">
    <template slot="title">
      <div class="menu-icon"><img :src="imgs[item.img] || imgs['el-icon-notebook-2']" /></div>
      <span style="margin-left: 3px;" slot="title">{{ item.name }}</span>
    </template>

    <template v-for="child in item.children">
      <sidebar-item v-if="child.children && child.children.length > 0" :item="child" :key="`/${item.code}/${child.code}`" />
      <el-menu-item v-else :key="`/${item.code}/${child.code}`" :index="`/${item.code}/${child.code}`">
        <span slot="title">{{ child.name }}</span>
      </el-menu-item>
    </template>
  </el-submenu>
  <el-menu-item v-else-if="item.code !== 'policeForceScreen'" :index="item.url || `/${item.code}`">
    <div class="menu-icon"><img :src="imgs[item.img] || imgs['el-icon-notebook-2']" /></div>
    <span style="margin-left: 3px;" slot="title">{{ item.name }}</span>
  </el-menu-item>
</template>
<script>
export default {
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
    imgs: Object,
  },
};
</script>

<style lang="less" scoped>
.menu-icon {
  width: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  img {
    width: 18px;
  }
}
</style>
