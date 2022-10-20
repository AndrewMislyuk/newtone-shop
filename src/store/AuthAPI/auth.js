import axios from 'axios';

export default {
  state: {
    token: localStorage.getItem('user-token') || '',
    status: '',
  },
  getters: {
    isAuthenticated(state) {
      return !!state.token;
    },
    authStatus(state) {
      return state.status;
    },
  },
  actions: {
    AUTH_REQUEST({ commit }, { email, password }) {
      return new Promise((resolve, reject) => {
        commit('AUTH_REQUEST');
        axios({
          url: 'http://159.89.235.180:3000/auth/sign-in',
          data: { email, password },
          method: 'POST',
        })
          .then((resp) => {
            const token = resp.data.token;
            localStorage.setItem('user-token', token);

            axios.defaults.headers.common['Authorization'] = token;
            commit('AUTH_SUCCESS', resp);
            resolve(resp);
          })
          .catch((err) => {
            commit('AUTH_ERROR', err);
            localStorage.removeItem('user-token');
            reject(err);
          });
      });
    },
    AUTH_LOGOUT({ commit }) {
      return new Promise((resolve) => {
        commit('AUTH_LOGOUT');
        localStorage.removeItem('user-token');
        delete axios.defaults.headers.common['Authorization'];
        resolve();
      });
    },
  },
  mutations: {
    AUTH_REQUEST: (state) => {
      state.status = 'loading';
    },
    AUTH_SUCCESS: (state, token) => {
      state.status = 'success';
      state.token = token;
    },
    AUTH_ERROR: (state) => {
      state.status = 'error';
    },
    AUTH_LOGOUT: (state) => {
      state.token = '';
    },
  },
};
