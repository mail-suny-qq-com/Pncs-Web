import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/smartbi/login',
    method: 'post',
    data: {
      username: username,
      password: password
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
