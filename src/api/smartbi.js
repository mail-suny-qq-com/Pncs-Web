import request from '@/utils/request'

export function login(username) {
  return request({
    url: '/smartbi/login/' + username,
    method: 'post'
  })
}

export function syncUser(url, method) {
  return request({
    url: url,
    method: method
  })
}

export default { login, syncUser }
