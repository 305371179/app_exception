import request from '@/utils/request'

export function getExceptions(params) {
  return request({
    url: '/exception/list',
    method: 'get',
    params
  })
}
export function deleteException(data = {}) {
  return request({
    url: '/exception/delete',
    method: 'post',
    data
  })
}
export function sendException(data = {}) {
  return request({
    url: '/exception/send',
    method: 'post',
    data
  })
}
export function checkFile(data = {}) {
  return request({
    url: '/exception/checkFile',
    method: 'post',
    data
  })
}
export function statistics(data = {}) {
  return request({
    url: '/exception/statistics',
    method: 'get'
  })
}
