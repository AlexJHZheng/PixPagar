import request from '@/utils/request'
import { getToken } from '@/utils/auth' // get token from cookie

// 新增支付流水
export function addPay(data) {
  // 从 cookie 中获取 token
  const token = getToken()
  const headers = {
    Authorization: `Bearer ${token}`
  }
  // 将token放入请求头中
  return request({
    url: '/api/addPayFlow',
    method: 'put',
    headers, // 添加请求头
    data
  })
}

// 获取支付流水列表
export function getPayList(data) {
  const token = getToken()
  const headers = {
    Authorization: `Bearer ${token}`
  }
  // 返回 post getList方法
  return request({
    url: '/api/getPayFlowList',
    method: 'get',
    headers, // 添加请求头
    params: data
  })
}

// 查询支付状态
export function getPayStatus(data) {
  const token = getToken()
  const headers = {
    Authorization: `Bearer ${token}`
  }
  // 返回 post getList方法
  return request({
    url: '/api/getPayStatus',
    method: 'post',
    headers, // 添加请求头
    data
  })
}

// 查询店家已支付的总金额和列表
export function getPayTotalList(data) {
  const token = getToken()
  const headers = {
    Authorization: `Bearer ${token}`
  }
  // 返回 post getList方法
  return request({
    url: '/api/getPayTotalList',
    method: 'get',
    headers, // 添加请求头
    params: data
  })
}

// 查询全部店家已支付的总金额
export function getPayShopTotal(data) {
  const token = getToken()
  const headers = {
    Authorization: `Bearer ${token}`
  }
  // 返回 post getList方法
  return request({
    url: '/api/getPayShopTotal',
    method: 'get',
    headers, // 添加请求头
    params: data
  })
}
