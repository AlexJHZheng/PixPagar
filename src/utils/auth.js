import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 1.获取cookie值
export function getCookie(name) {
  return Cookies.get(name)
}

// 2.设置cookie值
export function setCookie(name, value) {
  return Cookies.set(name, value)
}

// 3.删除cookie值
export function removeCookie(name) {
  return Cookies.remove(name)
}