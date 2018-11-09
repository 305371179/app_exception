import Mock from 'mockjs'
const todayData = []
for(var i=0;i<24;i++){
  todayData.push(Math.round(Math.random()*1000))
}
export default {
  summary: () => {
    return {
      code: 200,
      data:{
        total: 1024,
        ios: 24,
        android: 1000,
        today: 10
      }
    }
  },
  today: () => {
    return {
      code: 200,
      data:{

      }
    }
  },
}
