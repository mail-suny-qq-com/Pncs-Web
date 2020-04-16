import request from '@/utils/request'

const url = 'v1/indicators/indDatasources'

export function add(data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function test(data) {
  return request({
    url: url+'/test',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: url,
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: url,
    method: 'put',
    data
  })
}

export default { url, method: { add, edit, del } }
