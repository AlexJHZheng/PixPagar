import request from '@/utils/request'
// import { getToken } from '@/utils/auth' // get token from cookie


//定一个一个请求头，里面有bearer token
//从vuex里面取出token
// const token=getToken()
// const headers={
//   'Authorization':'bearer '+token
// }
  

export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    headers:{
      'Authorization':'bearer '+token
    },
    url: '/api/getUserInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

// 通过token刷新token
export function refresh(refreshToken) {
  return request({
    url: '/api/refreshToken',
    method: 'post',
    data:refreshToken
  })
}

// 核验token和refreshToken是否过期
export function checkToken(token) {
  return request({
    url: '/api/checkToken',
    method: 'post',
    data:token
  })
}
