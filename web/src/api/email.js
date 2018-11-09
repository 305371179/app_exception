import request from '@/utils/request'

export function getEmails(params) {
  return request({
    url: '/email/list',
    method: 'get',
    params
  })
}
export function addEmail(data = {}) {
  return request({
    url: '/email/add',
    method: 'post',
    data
  })
}
export function deleteEmail(data = {}) {
  return request({
    url: '/email/delete',
    method: 'post',
    data
  })
}
