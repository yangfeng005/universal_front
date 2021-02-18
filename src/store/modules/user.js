import { signIn, signOut } from '@/api/login';
import { getByUserName } from '@/api/user';
import { setToken, removeToken, setUser, getUser, removeUser } from '@/utils/auth';
import router, { resetRouter } from '@/router';

const state = {
  userInfo: {
    userName: '',
    gender: null,
    type: null,
    avatarUrl: null,
    status: null,
  },
};

const mutations = {
  SET_USERINFO: (state, data) => {
    state.userInfo = data;
  },
};

const actions = {
  signIn({ commit, dispatch }, userInfo) {
    const { username, password } = userInfo;

    return new Promise((resolve, reject) => {
      signIn({ username: username.trim(), password: password })
        .then((response) => {
          const { data, additionalProperties } = response;
          setToken(additionalProperties.token);
          setUser(data.userName);
          const userinfo = { ...data };
          delete userinfo.privileges;
          delete userinfo.roles;
          commit('SET_USERINFO', userinfo);

          dispatch('permission/getResource', {}, { root: true }).then((menus) => {
            resetRouter();

            // generate accessible routes map based on roles
            dispatch(
              'permission/generateRoutes',
              { privileges: data.privileges, superAdmin: userinfo.superAdmin, menus },
              { root: true }
            ).then((accessRoutes) => {
              router.addRoutes(accessRoutes);

              resolve();
            });
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  signOut({ state }) {
    return new Promise((resolve, reject) => {
      signOut(state.token)
        .then(() => {
          removeToken();
          removeUser();
          resetRouter();
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getByUserName({ commit }) {
    return new Promise((resolve, reject) => {
      getByUserName({ userName: getUser() })
        .then((response) => {
          const userinfo = { ...response.data };
          delete userinfo.privileges;
          delete userinfo.roles;
          commit('SET_USERINFO', userinfo);

          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
