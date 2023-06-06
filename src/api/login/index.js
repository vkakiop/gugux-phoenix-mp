import request from '@/utils/request'

// 发送短信
export function authSms(data) {
    return request({
        url: '/gugux-services-auth-api/app/auth/sms',
        headers: {
            isToken: false
        },
        method: 'post',
        data:data
    })
}

// 短信登录
export function authSmsLogin(data) {
    return request({
        url: '/gugux-services-auth-api/app/auth/sms/login',
        headers: {
            isToken: false
        },
        method: 'post',
        data:data
    })
}

