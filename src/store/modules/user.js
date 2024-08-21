import { login, logout, getInfo, refresh, checkToken } from '@/api/user'
import {
  getToken,
  setToken,
  removeToken,
  getCookie,
  setCookie,
  removeCookie
} from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  refreshToken: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_REFRESH_TOKEN: (state, refreshToken) => {
    state.refreshToken = refreshToken
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then((response) => {
          commit('SET_TOKEN', response.token)
          commit('SET_REFRESH_TOKEN', response.refreshToken)
          commit('SET_ROLES', response.roles)
          commit('SET_NAME', response.name)
          // setToken(response.token)
          setCookie('Admin-Token', response.token)
          setCookie('refreshToken', response.refreshToken)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          if (!response) {
            reject('Verification failed, please Login again.')
          }

          const { roles, name } = response
          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }

          commit('SET_ROLES', roles)
          commit('SET_NAME', name)
          // commit('SET_AVATAR', avatar)
          // commit('SET_INTRODUCTION', introduction)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    console.log('logout')
    removeCookie('Admin-Token')
    removeCookie('refreshToken')
    console.log('logout1')
    // 在cookie中检查refreshtoken是否存在，存在输出true，不存在输出false
    return new Promise((resolve, reject) => {
      // 如果cookie中的Admin-Token和refreshToken为undefined,则返回resolve
      const token = getCookie('Admin-Token')
      const refreshToken = getCookie('refreshToken')
      if (token === undefined && refreshToken === undefined) {
        resolve(true)
      }
    }).catch((error) => {
      reject(error)
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // 通过refreshToken获取新的token
  refreshToken({ commit, state }) {
    return new Promise((resolve, reject) => {
      const refreshToken = getCookie('refreshToken')
      if (refreshToken) {
        refresh({ refreshToken: refreshToken }).then((response) => {
          const { token } = response
          if (token) {
            commit('SET_TOKEN', response.token)
            setCookie('Admin-Token', response.token)
            resolve(true)
          } else {
            resolve(false)
          }
        })
      }
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true
    })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  },
  // 检查token是否过期，调用接口返回tokenCode 1为正常，0为过期，2为过期但是可以刷新
  checkToken({ commit, state }) {
    return new Promise((resolve, reject) => {
      const token = getCookie('Admin-Token')
      const refreshToken = getCookie('refreshToken')
      // 通过接口传递token和refreshToken
      checkToken({ token, refreshToken }).then((response) => {
        const { tokenCode } = response
        if (tokenCode === 0) {
          resolve(false)
        } else if (tokenCode === 1) {
          resolve(true)
        } else if (tokenCode === 2) {
          // 把接收到的新token存入cookie和vuex
          commit('SET_TOKEN', token)
          setCookie('Admin-Token', token)
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
