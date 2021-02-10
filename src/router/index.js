import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/views/Layout';

Vue.use(Router);

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    uri: '/login',
    component: () => import('@/views/Login'),
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: '/404',
    uri: '/404',
    component: () => import('@/views/errorPage/404'),
    meta: { hideInMenu: true },
  },
  {
    path: '/401',
    uri: '/401',
    component: () => import('@/views/errorPage/401'),
    meta: { hideInMenu: true },
  },
];

export const asyncRoutes = [
  {
    path: '/systemManage',
    name: 'systemManage',
    uri: '/systemManage',
    component: Layout,
    meta: { title: '系统管理', icon: 'el-icon-setting' },
    children: [
      {
        path: 'agencyManage',
        name: 'agencyManage',
        uri: '/systemManage/agencyManage',
        component: () => import('@/views/system/organization/index'),
        meta: { title: '组织管理', manage: true },
      },
      {
        path: 'userManage',
        name: 'userManage',
        uri: '/systemManage/userManage',
        component: () => import('@/views/system/police/index'),
        meta: { title: '用户管理', manage: true },
      },
      {
        path: 'roleManage',
        name: 'roleManage',
        uri: '/systemManage/roleManage',
        component: () => import('@/views/system/role/index'),
        meta: { title: '角色权限管理', manage: true },
      },
      {
        path: 'sysLog',
        name: 'sysLog',
        uri: '/systemManage/sysLog',
        component: () => import('@/views/system/log/index'),
        meta: { title: '操作日志', manage: true },
      },
    ],
  },
  { path: '/', meta: { hideInMenu: true } },
  { path: '*', redirect: '/404', meta: { hideInMenu: true } },
];

const createRouter = () =>
  new Router({
    routes: constantRoutes,
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
