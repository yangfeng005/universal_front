import Cookies from 'js-cookie';

const TokenKey = 'ADMIN_PC_TOKEN';
const UserKey = 'ADMIN_PC_USER';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 7 });
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getUser() {
  return Cookies.get(UserKey);
}

export function setUser(userName) {
  return Cookies.set(UserKey, userName, { expires: 7 });
}

export function removeUser() {
  return Cookies.remove(UserKey);
}
