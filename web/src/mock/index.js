import Mock from 'mockjs'
import user from './user'
import transaction from './transaction'
import chart from './chart'

// 修复在使用 MockJS 情况下，设置 withCredentials = true，且未被拦截的跨域请求丢失 Cookies 的问题
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}

// Mock.setup({
//   timeout: '350-600'
// })
// const baseURL = process.env.BASE_API
// 登录相关、
Mock.mock(/\/user\/login/, 'post', user.list)
Mock.mock(/\/transaction\/list/, 'get', transaction.list)
Mock.mock(/\/chart\/summary/, 'get', chart.summary)

export default Mock
