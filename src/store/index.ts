import Vue from 'vue'
import Vuex from 'vuex'
import Constants from '../utils/Constants'
import {IUser,IState} from '../utils/CustomTypes'

Vue.use(Vuex)
const  urlAPI = process.env.VUE_APP_API_URL;

export default new Vuex.Store({
  state: {
    user: sessionStorage.getItem(Constants.USER_KEY) ? JSON.parse(sessionStorage.getItem(Constants.USER_KEY)): {},
    token: sessionStorage.getItem(Constants.TOKEN) ? sessionStorage.getItem(Constants.TOKEN): null,
  } as IState,
  getters:{
    getUser: state => state.user,
    token: state => state.token,
  },
  mutations: {
    [Constants.LOGIN_DISPATCHER] (state, {user,token}) {
      state.user = user
      state.token = token
      sessionStorage.setItem(Constants.USER_KEY, JSON.stringify(state.user))
      sessionStorage.setItem(Constants.TOKEN, token)
    },    
    [Constants.LOGOUT_DISPATCHER] (state, userInformation) {
      state.user = null
      sessionStorage.removeItem(Constants.USER_KEY)
    }
  },
  actions: {
    [Constants.LOGIN_DISPATCHER] ({ commit }, model) {
      return new Promise ((resolve, reject) => {
        try {

          let result =  fetch(urlAPI+"api/Auth",{
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(model)
          });
        
          result
            .then(resp => resp.json())
            .then((response:{user:IUser, token:string, error?:string})=>{

              if (response.error) {
                reject(response.error)
              }
              commit(Constants.LOGIN_DISPATCHER, {...response})
              resolve(response.user)
            }).catch(err=>  reject(err));


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
