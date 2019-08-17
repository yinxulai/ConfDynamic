import Vue from 'vue'
import Vuex from 'vuex'
import Cos from 'cos-js-sdk-v5'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 对象
    configs: new Map()
  },
  mutations: {
    updateConfigs(state, configs) {
      state.configs.set()
    }
  },
  actions: {
    queryConfigs() {
      Cos.getBucket()
    },
    updateConfigByName() { },
    disableConfigByName() { },
    ensableConfigByName() { }
  }
})
