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
        url: '/gugux-services-auth-api/app/auth/applet/wx/sms/login',
        headers: {
            isToken: false
        },
        method: 'post',
        data:data
    })
}

// 密码登录
export function authPwdLogin(data) {
    return request({
        url: '/gugux-services-auth-api/app/auth/pwd/login',
        headers: {
            isToken: false
        },
        method: 'post',
        data:data
    })
}

// 微信小程序登录
export function authWxLogin(data) {
    return request({
        url: '/gugux-services-auth-api/app/auth/applet/wx/login',
        headers: {
            isToken: false
        },
        method: 'post',
        data:data
    })
}


