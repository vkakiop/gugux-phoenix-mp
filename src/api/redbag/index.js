import request from '@/utils/request'

// 获取红包
export function redbagInfo(data) {
    return request({
        url: '/gugux-services-location-api/app/location/track/share',
        headers: {
            isToken: true
        },
        method: 'get',
        params:data
    })
}
