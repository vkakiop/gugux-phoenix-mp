import request from '@/utils/request'

// 视频列表
export const postVideorecommend = (data) => {
	return request({
		url: '/gugux-services-opus-api/app/opus/recommend',
		method: 'get',
		headers: {
            isToken: false
        },
		params: data,
	})
}
