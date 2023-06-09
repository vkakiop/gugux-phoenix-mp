import request from '@/utils/request'

// 推送列表
export function getWorks(data) {
	return request({
		url: '/gugux-services-opus-api/app/opus/list/city',
		method: 'post',
		headers: {
            isToken: true
        },
		data: data
	})
}
// 视频列表
export const postVideorecommend = (data) => {
	return request({
		url: '/gugux-services-opus-api/app/opus/video/recommend',
		method: 'post',
		headers: {
            isToken: true
        },
		data: data
	})
}
// 作品列表
export const getClassify = (data,num=1) => {
	return request({
		url: `/gugux-services-opus-api/app/opus/list/1622581366744965137/${num}/10`,
		//测试环境
		// url: `/gugux-services-opus-api/app/opus/list/1550301155963486544/${num}/10`,
		headers: {
			isToken: true
		},
		method: 'get',
		params: data
	})

}