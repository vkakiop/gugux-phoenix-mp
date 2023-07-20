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
export function getUserInfo(data,header) {
	return request({
		url: '/gugux-services-user-api/app/user/info',
		method: 'get',
		params: data,
		headers: header,
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
		url: '/gugux-services-opus-api/app/opus/homepage/like/36',
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
		url: '/gugux-services-opus-api/app/opus/homepage/collection/36',
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
		url: '/gugux-services-opus-api/app/opus/rec/details',
		params:data,
		method: 'get'
	  })
}

// 修改头像
export function infopicture(data) {
    return request({
        url: '/gugux-services-user-api/app/user/info/picture',
        method: 'post',
        params:data,
    })
}

// 修改昵称
export function infoname(data) {
    return request({
        url: '/gugux-services-user-api/app/user/info/name',
        method: 'post',
        params:data,
    })
}