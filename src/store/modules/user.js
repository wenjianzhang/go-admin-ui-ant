import storage from 'store'
import { login, getInfo, logout, refreshtoken } from '@/api/user'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import router, { resetRouter } from '@/router'
import moment from 'moment'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    permisaction: [],
    permissions: [],
    introduction: '',
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_PERMISSIONS: (state, permisaction) => {
      state.permisaction = permisaction
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(result => {

          let a = moment(new Date());
          let b = moment(result.expire);

          storage.set(ACCESS_TOKEN, result.token,Math.abs(a.diff(b)))
          commit('SET_TOKEN', result.token)
          resolve()
        }).catch(_=>{
          reject()
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.data
          if(!result) {
            commit('SET_TOKEN', '')
            resolve()
          }

          const { roles, name, avatar, introduction, permissions } = result
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }
          commit('SET_ROLES', roles)
          commit('SET_INFO', result)
          commit('SET_NAME', { name: name, welcome: welcome() })
          commit('SET_AVATAR', avatar)
          commit('SET_PERMISSIONS', permissions)
          commit('SET_INTRODUCTION', introduction)
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
        })
      })
    },

    // 刷新token
    refreshToken({ commit, state }) {
      return new Promise((resolve, reject) => {
        refreshtoken({ token: state.token }).then(response => {
          const { token } = response
          commit('SET_TOKEN', token)
          resolve()
        })
      })
    },

    // remove token
    resetToken({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        resolve()
      })
    },

    // dynamically modify permissions
    changeRoles({ commit, dispatch }, role) {
      return new Promise(async resolve => {
        const token = role + '-token'
        commit('SET_TOKEN', token)
        const { roles } = await dispatch('getInfo')
        resetRouter()
        // generate accessible routes map based on roles
        const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
        // dynamically add accessible routes
        router.addRoutes(accessRoutes)
        // reset visited views and cached views
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      })
    }

  }
}

export default user
