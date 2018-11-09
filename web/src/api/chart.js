import request from '@/utils/request'

export function summary(query) {
  return request({
    url: '/chart/summary',
    method: 'get',
    params: query
  })
}
export function today(query) {
  return request({
    url: '/chart/summary',
    method: 'get',
    params: query
  })
}
