import router from '@/router';
import store from '../store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken, removeToken, removeUser } from '@/utils/auth'; // get token from cookie
import { hasChild } from '@/utils/utils'; // get token from cookie
//import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login']; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  const hasToken = getToken();

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      const hasGetUserInfo = store.state.user.userInfo.userName;

      if (hasGetUserInfo) {
        next();
      } else {
        try {
          const { superAdmin, privileges } = await store.dispatch('user/getByUserName');
          const menus = await store.dispatch('permission/getResource');

          const accessRoutes = await store.dispatch('permission/generateRoutes', { privileges, superAdmin, menus });

          accessRoutes[accessRoutes.length - 2].redirect = hasChild(accessRoutes[0])
            ? accessRoutes[0].children[0].uri
            : accessRoutes[0].uri;

          router.addRoutes(accessRoutes);

          next({ ...to, replace: true });
        } catch (error) {
          removeToken();
          removeUser();
          Message.error(error || 'Has Error');
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
