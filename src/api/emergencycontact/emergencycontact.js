import request from '@/utils/request'

// 紧急联系人登录注册页面
export function emergencyregister(data) {
    return request({
      url: '/gugux-services-location-api/app/security/safe/emergency/contact/register/page',
      method: 'get',
      params: data
    })
}

// 紧急联系人登录注册
export function emergencysign(data) {
    return request({
      url: '/gugux-services-location-api/app/security/safe/emergency/contact/register/sign',
      method: 'post',
      data:data
    })
}


// 发送短信
export function authsms(data) {
    return request({
      url: '/gugux-services-auth-api/app/auth/sms',
      method: 'post',
      data:data
    })
}

