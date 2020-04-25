import Vue from 'vue'
import Vuex from 'vuex'
import Constants from '../utils/Constants'
import CONSTANTS from '../utils/Constants'

interface User {
  name: string;
  id: string;
}
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: localStorage.getItem(CONSTANTS.USER_KEY) ?? {},
  },
  getters:{
    getUser: state => state.user
  },
  mutations: {
    [Constants.LOGIN_DISPATCHER] (state, userInformation) {
      state.user = userInformation
      localStorage.setItem(Constants.USER_KEY, JSON.stringify(state.user))
    }
  },
  actions: {
    [Constants.LOGIN_DISPATCHER] ({ commit }, { userName, password }) {
      return new Promise ((resolve, reject) => {
        try {
          const userLogged = { name: 'user 1', id: 1, token: 'tokenHere' }
          commit(Constants.LOGIN_DISPATCHER, userLogged)
          resolve(userLogged)
        } catch (error) {
          reject(error)
        }
      })
    }
  },
  modules: {
  }
})
