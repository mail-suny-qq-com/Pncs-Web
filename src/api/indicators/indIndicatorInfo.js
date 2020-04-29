import request from '@/utils/request'

const url = 'v1/indicators/indIndicatorInfos'

export function add(data) {
  return request({
    url: url,
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

export function getDimInfo() {
  return request({
    url: 'v1/indicators/indDimensions/dim/all',
    method: 'get'
  })
}

export function getAllSource() {
  return request({
    url: 'v1/indicators/indDatasources/source/all',
    method: 'get'
  })
}

export function getTables(data) {
  return request({
    url: 'v1/database/tables/all',
    method: 'post',
    data
  })
}

export function getColumns(data) {
  return request({
    url: 'v1/database/columns/all',
    method: 'post',
    data
  })
}

export function saveArithmetic(data) {
  return request({
    url: 'v1/indicators/indDeriveRules/saveArithmetic',
    method: 'post',
    data
  })
}

export function getIndDeriveRule(data) {
  return request({
    url: 'v1/indicators/indDeriveRules/getIndDeriveRule',
    method: 'post',
    data
  })
}

export default { url, method: { add, edit, del }}
