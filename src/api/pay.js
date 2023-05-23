import request from '@/utils/request'
import { getToken } from '@/utils/auth' // get token from cookie

// 新增支付流水
export function addPay(data) {
  // 从 cookie 中获取 token
  const token = getToken()
  const headers = {
    Authorization: `Bearer ${token}`
  };
  // 将token放入请求头中
  return request({
    url: '/api/addPayFlow',
    method: 'put',
    headers, // 添加请求头
    data
  })
}



