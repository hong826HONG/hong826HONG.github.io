import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
  username: ''
}
const mutations = {
  setusername: (state, value) => {
    state.username = value
    localStorage.setItem('myname', value)
  },
  getusername: (state) => {
    return state.username
  }
}
const actions = {
  setusernameAction: ({commit}, value) => {
    commit('setusername', value)
  }
}
const getters = {
  username: (state) => {
    return localStorage.getItem('myname')
  }
}
export default new Vuex.Store({
  strict: true,
  state,
  getters,
  actions,
  mutations
})
