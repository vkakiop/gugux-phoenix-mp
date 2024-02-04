import request from '@/utils/request'

// 被分享数字蓝牙钥匙-是否有分享
export function blekeyIsShared(data) {
    return request({
        url: '/gugux-services-user-api/app/digital/share/is/shared',
        method: 'get'
    })
}

// 被分享数字蓝牙钥匙
export function blekeyShared(data) {
    return request({
      url: '/gugux-services-user-api/app/digital/share/shared',
      method: 'get'
    })
}

// 分享开锁
export function blekeyOpen(data) {
    return request({
        url: '/gugux-services-user-api/app/digital/key/share/open',
        method: 'post',
        data:data
    })
}

// 分享开锁结果
export function blekeyOpenResult(data) {
    return request({
        url: '/gugux-services-user-api/app/digital/key/share/open/result',
        method: 'post',
        data:data
    })
}

// 获取地理位置
export function blekeySharePlace(data) {
    return request({
        url: '/gugux-services-user-api/app/digital/share/place',
        method: 'get'
    })
}
