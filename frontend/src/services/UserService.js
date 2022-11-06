import HttpService from './HttpService';
import cookies from "js-cookies";

const authEndpoint = 'auth';

const login = async (credentials) => {
  localStorage.removeItem("token");
  const user = await HttpService.post(`${authEndpoint}/login`, credentials);
  _handleLogin(user);
}

const signup = async (credentials) => {
  const user = HttpService.post(`${authEndpoint}/signup`, credentials);
  // return _handleLogin(user);
}

const logout = async () => {
  HttpService.post(`${authEndpoint}/logout`);
  sessionStorage.clear();
}

const _handleLogin = (user) => {
  localStorage.setItem("token", user.accessToken);
}

// const getById = (id) => {
//   const user = HttpService.get(`${endpoint}/${id}`);
//   return user;
// }

// const getUserLoggedIn = () => {
//   return sessionStorage.getItem('user');
// }

// const checkConnection = () => {
//   const currentUser = getUserLoggedIn();
//   if (currentUser) {
//     return true;
//   }
//   return false;
// }

export default {
  login,
  signup,
  logout,
};