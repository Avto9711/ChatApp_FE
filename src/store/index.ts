import Vue from 'vue'
import Vuex from 'vuex'
import Constants from '../utils/Constants'
import {IUser,IState} from '../utils/CustomTypes'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: sessionStorage.getItem(Constants.USER_KEY) ? JSON.parse(sessionStorage.getItem(Constants.USER_KEY)): {},
  } as IState,
  getters:{
    getUser: state => state.user
  },
  mutations: {
    [Constants.LOGIN_DISPATCHER] (state, userInformation) {
      state.user = userInformation
      sessionStorage.setItem(Constants.USER_KEY, JSON.stringify(state.user))
    },    
    [Constants.LOGOUT_DISPATCHER] (state, userInformation) {
      state.user = null
      sessionStorage.removeItem(Constants.USER_KEY)
    }
  },
  actions: {
    [Constants.LOGIN_DISPATCHER] ({ commit }, { userName, password }) {
      return new Promise ((resolve, reject) => {
        try {
          const userLogged:IUser = { name: userName, id: (userName.split(' ')[1]).toString(), token: 'tokenHere',connectionId:"randomConnectionId"  }
          commit(Constants.LOGIN_DISPATCHER, userLogged)
          resolve(userLogged)
        } catch (error) {
          reject(error)
        }
      })
    },
    [Constants.LOGOUT_DISPATCHER] ({ commit }) {
      return new Promise ((resolve, reject) => {
        commit(Constants.LOGOUT_DISPATCHER);
        resolve(); 
      })
    }
  },
  modules: {
  }
})
