import request from '@/utils/request'

// 通过code获取协议详情-不需要包装内容
export function userProtocol(data) {
    return request({
      url: '/gugux-services-user-api/app/user/protocol/clear/'+data.code,
      method: 'get',
      dataType:'string',
    })
  }