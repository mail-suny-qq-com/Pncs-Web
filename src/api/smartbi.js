import request from '@/utils/request'

export function login(username, password, smartbiUrl) {
  return request({
    url: '/smartbi/login',
    method: 'post',
    data: {
      username: username,
      password: password,
      smartbiUrl: smartbiUrl
    }
  })
}

export function logout() {
  return request({
    url: '/smartbi/logout',
    method: 'post'
  })
}

export default { login, logout }
