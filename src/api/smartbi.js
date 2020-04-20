import request from '@/utils/request'

export function login(username) {
  return request({
    url: '/smartbi/login/'+username,
    method: 'post'
  })
}
export default { login }
