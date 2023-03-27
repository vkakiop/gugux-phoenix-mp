import request from '@/utils/request'

// 推送列表
export function getTrackInfo(data) {
    return request({
        url: '/gugux-services-location-api/app/location/track/share',
        headers: {
            isToken: true
        },
        method: 'get',
        params:data
    })
}
