import request from '@/utils/request'
// 我的
export function getUserBase(data) {
	return request({
		url: '/gugux-services-user-api/app/user/base',
		method: 'get',
		params: data
	})
}
// 个人信息
export function getUserInfo(data) {
	return request({
		url: '/gugux-services-user-api/app/user/info',
		method: 'get',
		params: data,
		headers: {
            isToken: true
        },
	})
}
// 用户主页个人信息
export function userhomepage(data) {
	return request({
		url: '/gugux-services-user-api/app/user/homepage',
		method: 'get',
		params: data,
		headers: {
			isToken: true
		},
	})
}
// 用户主页作品列表
export function homepageopus(data) {
	return request({
		url: '/gugux-services-opus-api/app/opus/homepage/opus',
		method: 'get',
		params: data,
		headers: {
			isToken: true
		},
	})
}
// 用户主页点赞作品列表
export function homepagelike(data) {
	return request({
		url: '/gugux-services-opus-api/app/opus/homepage/like',
		method: 'get',
		params: data,
		headers: {
			isToken: true
		},
	})
}
// 用户主页收藏
export function homepagecollection(data) {
	return request({
		url: '/gugux-services-opus-api/app/opus/homepage/collection',
		method: 'get',
		params: data,
		headers: {
			isToken: true
		},
	})
}
// 用户作品详情
export function opusdetails(data) {
	return request({
		url: `/gugux-services-opus-api/app/opus/details/${data.opusId}`,
		method: 'get',
		params: data,
		headers: {
			isToken: true
		},
	})
}