import {param2Obj} from '@/utils'

export default {
  login: () => {
    return {
      "header": {
        "mp_sId": "ASBCIZJQDXGQGLFMAVHLEACVBVCACVCK",
        "transId": "20181108173924127",
        "channel": "MH",
        "versionNo": "3.0.7",
        "channelIP": "172.20.10.5",
        "model": "rosy",
        "UUID": "863252036082140460015442028983",
        "type": "J",
        "errorCode": "0",
        "errorMsg": ""
      }, "body": {
        roles: ['admin'],
        token: 'admin',
        introduction: '我是超级管理员',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
      }
    }
  },
  // getUserInfo: config => {
  //   const { token } = param2Obj(config.url)
  //   if (userMap[token]) {
  //     return userMap[token]
  //   } else {
  //     return false
  //   }
  // },
  // logout: () => 'success'
}
