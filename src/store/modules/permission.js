import { asyncRoutes } from '@/router';
import { getResource } from '@/api/resource';
import { getUser } from '@/utils/auth';

import _ from 'lodash';

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(privileges, route) {
  if (route.meta && route.name) {
    return privileges.some((code) => code === route.name);
  } else {
    return true;
  }
}

const hasChild = (item) => {
  return item.children && item.children.length !== 0;
};

function formatPrivileges(menus) {
  let res = [];

  menus.map((item) => {
    const _item = { ...item };
    delete _item.children;

    res.push(_item.code);

    if (hasChild(item)) {
      res = _.concat(
        res,
        item.children.map((child) => child.code)
      );
    }
  });

  return res;
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param privileges
 */
function filterAsyncRoutes(routes, privileges, priviStr) {
  const res = [];

  routes.forEach((route) => {
    const tmp = { ...route };
    if (hasPermission(privileges, tmp)) {
      tmp.meta.manage = priviStr.indexOf(tmp.name + ':manage') !== -1;

      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, privileges, priviStr);
      }
      res.push(tmp);
    }
  });

  return res;
}

const state = {
  menu: [],
};

const mutations = {
  SET_MENU: (state, data) => {
    state.menu = data;
  },
};

const actions = {
  getResource() {
    return new Promise((resolve, reject) => {
      getResource({ userName: getUser() })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  generateRoutes({ commit }, { superAdmin, menus, privileges }) {
    return new Promise((resolve) => {
      commit('SET_MENU', menus);

      let accessedRoutes,
        priviString =
          (privileges &&
            privileges
              .filter((item) => item.actionCode === 'manage')
              .map((item) => item.privilegeCode)
              .join(',')) ||
          '';

      if (superAdmin) {
        accessedRoutes = asyncRoutes;
      } else {
        const _privileges = formatPrivileges(menus);

        accessedRoutes = filterAsyncRoutes(asyncRoutes, _privileges, priviString);
      }

      accessedRoutes[accessedRoutes.length - 2].redirect = hasChild(accessedRoutes[0])
        ? accessedRoutes[0].children[0].uri
        : accessedRoutes[0].uri;

      resolve(accessedRoutes);
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
