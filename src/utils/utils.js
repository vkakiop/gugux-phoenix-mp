import useLoginTokenStore from '@/store/modules/loginToken'

export function isPlatformMp() {
	const isMp = process.env.UNI_PLATFORM === "mp-weixin";
	return isMp
}

/*
* 是否空数组
*/
export  function isArrayEmpty (val) {
	if(val&&val instanceof Array&&val.length>0){
		return false;
	}else{
		return true;
	}
 }


 export function jumpAppStore(userInfo){//userId,type,redirect
	console.log(userInfo)
	try {
		let u = navigator.userAgent;
		let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
		let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		if (isAndroid) {
			var state = null;
				//type:1  名片分享
				//type:2  群名片分享
				//type:3  作品分享
				//type:4  用户中心分享

			window.location = 'ggx://gugux.caigetuxun.com?url='+userInfo.redirect; //schema链接或者universal link
			// window.location = 'ggx://gugux.caigetuxun.com?type='+userInfo.type+'&id='+userInfo.userId; //schema链接或者universal link
			window.setTimeout(function() {
				window.location = 'https://gugux.caigetuxun.com/down/index.html?redirect='+userInfo.redirect;//android下载地址
			}, 500);
		}else if(isIOS) {
			var loadDateTime = new Date();
			// window.location = "https://59544bbd7ecc578dee8a35b0478c70f0.share2dlink.com?url="+userInfo.redirect;//schema链接或者universal link
			window.location = 'ggx://gugux.caigetuxun.com?url='+userInfo.redirect; //schema链接或者universal link
			window.setTimeout(function() { //如果没有安装app,便会执行setTimeout跳转下载页
				var timeOutDateTime = new Date();
				if (timeOutDateTime - loadDateTime < 5000) {
					window.location = 'https://gugux.caigetuxun.com/down/index.html?redirect='+userInfo.redirect; //ios下载地址
				} else {
					window.close();
				}
			}, 500);
		}

	} catch (error) {

	}


	// window.location = 'https://gugux.caigetuxun.com/down/index.html?redirect='+redirect;
	// let u = navigator.userAgent;
	// let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
	// let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	// if (isAndroid) {
	// 	// let  android_API =window.guApi.jsCallApp("GET_USER_INFO", 1, null);
	// 	// let jsonObj = JSON.parse(android_API);
	// 	// this.androisId = jsonObj.token
	// 	// uni.setStorageSync('token', jsonObj.token)
	// 	// uni.setStorageSync('user_id', jsonObj.user_id)
	// 	// window.guApi.jsCallApp("GET_STATUS_BAR_HEIGHT", null, null)
	// 	console.log('isAndroid');
	// 	copyToClip(redirect);
	// 	// window.location = ;
	// 	window.location = 'https://gugux.caigetuxun.com/down/index.html?redirect='+redirect;
	// }else if(isIOS) {
	// 	console.log('ios');
	// 	copyToClip(redirect);
	// 	window.location = 'https://apps.apple.com/cn/app/id1480983265'
	// 	// window.webkit.messageHandlers.jsCallApp.postMessage("GET_USER_INFO", null, null);
	// }
 }

 export function isMicroMessengerPage() {
	 var ua = navigator.userAgent.toLowerCase();
	 let is_atpage = false
	 if (ua.match(/MicroMessenger/i) == "micromessenger") {
		 is_atpage = true
	 }
	 return is_atpage
 }
export function numberAdd(a,b) {
	if (!a) {
		a=0;
	}
	if (!b) {
		b=0;
	}
	return a+b;
}

export function copyToClip(text) {
	const input = document.createElement('input')
	input.value = text
	document.body.appendChild(input)
	input.select()
	document.execCommand('Copy')
	document.body.removeChild(input)
}

export function rad(d) {
	return d * Math.PI / 180.0;
}

export const local = {
	set(key, value) {
		uni.setStorageSync(key, JSON.stringify(value));
	},
	get(key) {
		return JSON.parse(uni.getStorageSync(key));
	},
	remove(key) {
		uni.removeStorageSync(key);
	},
}

export const session = {
	set(key, value) {
		sessionStorage.setItem(key, JSON.stringify(value));
	},
	get(key) {
		return JSON.parse(sessionStorage.getItem(key));
	},
	remove(key) {
		sessionStorage.removeItem(key);
	},
}


export function distanceOf(p1, p2) {
	var radLng1 = rad(p1.x);
	var radLng2 = rad(p2.x);
	var mdifference = radLng1 - radLng2;
	var difference = rad(p1.y) - rad(p2.y);
	var distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(difference / 2), 2) +
		Math.cos(radLng1) * Math.cos(radLng2) * Math.pow(Math.sin(mdifference / 2), 2)));
	distance = distance * 6378.137;
	distance = Math.abs(Math.round(distance * 10000) / 10);
	return distance;
}

export function formatedDistance(p1) {
	let text = '';
	if (p1 < 1000) {
		text = p1+'米';
	}
	else {
		text = (p1/1000).toFixed(1) + '公里';
	}
	return text
}

export function getTokenValue() {

	//const app = getApp()
	//let token = app.globalData.loginToken && app.globalData.loginToken.accessToken
	const loginTokenStore = useLoginTokenStore()
	let loginToken = loginTokenStore.get()
	let token = loginToken && loginToken.accessToken ? loginToken.accessToken : ''
	if (!token || token == 'undefined') {
		token = ''
	}
	return token
}

export function isWxPhoneLogin() {
	if (getTokenValue()) {
		const loginTokenStore = useLoginTokenStore()
		let loginToken = loginTokenStore.get()
		let userInfo = loginToken && loginToken.user ? loginToken.user : {}
		return userInfo.isWxPhoneLogin ? true : false
	}
	return false
}

export function needLogin() {
	//const app = getApp()
	//if (!app.globalData.loginToken.accessToken) {
	if (!getTokenValue()) {
		uni.navigateTo({url:'/pages/login/index?url='+encodeURIComponent(getCurrentPageUrl())})
		return false
	}
	return true
}

export function getCurrentPageUrl() {
	let pages = getCurrentPages();    //获取加载的页面
	let currentPages = pages[pages.length - 1];  //获取当前页面的对象
	let url = currentPages.route;  //当前页面url
	let options = currentPages.options;   //获取url中所带的参数
	//拼接url的参数
	let currentPage= url + '?';
	for (let key in options) {
		let value = options[key]
		currentPage+= key + '=' + value + '&';
	}
	currentPage= '/'+currentPage.substring(0, currentPage.length - 1);
	return currentPage;
}


/*格式化时间*/
export function formatedCommentDate(datestr) {
	var str = (datestr+'').replace('-','/').replace('-','/');
	//将字符串转换成时间格式
	var timePublish = new Date(str);
	var timeNow = new Date();
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var month = day * 30;
	var year = month * 12;
	var diffValue = timeNow - timePublish;
	var diffMonth = diffValue / month;
	var diffWeek = diffValue / (7 * day);
	var diffDay = diffValue / day;
	var diffHour = diffValue / hour;
	var diffMinute = diffValue / minute;
	var diffYear = diffValue / year;
	let result = ''
	if (diffValue < 0) {
		result = "刚刚";
	}
	// else if (diffYear > 1) {
	// 	result = parseInt(diffYear) + "年前";
	// } else if (diffMonth > 1) {
	// 	result = parseInt(diffMonth) + "月前";
	// } else if (diffWeek > 1) {
	// 	result = parseInt(diffWeek) + "周前";
	// }
	else if (diffDay >= 30) {
		result = "一个月前";
	}
	else if (diffDay >= 1) {
		result = parseInt(diffDay) + "天前";
	} else if (diffHour >= 1) {
		result = parseInt(diffHour) + "小时前";
	} else if (diffMinute >= 1) {
		result = parseInt(diffMinute) + "分钟前";
	} else {
		result = "刚刚";
	}
	return result;
}

/*图片缩略
lfit（默认值）：等比缩放，缩放图限制为指定w与h的矩形内的最大图片。
mfit：等比缩放，缩放图为延伸出指定w与h的矩形框外的最小图片。
fill：将原图等比缩放为延伸出指定w与h的矩形框外的最小图片，之后将超出的部分进行居中裁剪。
pad：将原图缩放为指定w与h的矩形内的最大图片，之后使用指定颜色居中填充空白部分。
fixed：固定宽高，强制缩放。
* */
export function imageThumb(url,width,height,model) {
	if (url.indexOf('.caigetuxun.com/') == -1) {
		return url
	}
	if (!model) {
		model = 'mfit'
	}
	let param = ''
	if (width) {
		param += ',w_'+width
	}
	if (height) {
		param += ',h_'+height
	}
	if (model) {
		param += ',m_'+model
	}
	else {
		param += ',m_lfit'
	}
	return url + ((url+'').indexOf('?') == -1 ? '?' : '&') + 'x-oss-process=image/resize' + param
}

export function rpxTopx(rpx) {
	return wx.getSystemInfoSync().windowWidth/750*rpx
}

export function pxTorpx(px) {
	return 750/wx.getSystemInfoSync().windowWidth*px
}

export function htmlEncode (str){
	var temp = "";
	if(!str) return "";
	temp = str.replace(/&/g,"&amp;");
	temp = temp.replace(/</g,"&lt;");
	temp = temp.replace(/>/g,"&gt;");
	temp = temp.replace(/[ ]/g,"&nbsp;");
	temp = temp.replace(/\'/g,"&#39;");
	temp = temp.replace(/\"/g,"&quot;");
	return temp;
}

/* 用正则表达式实现html解码（反转义）*/
export function htmlDecode (str){
	var temp = "";
	if(!str) return "";
	temp = str.replace(/&amp;/g,"&");
	temp = temp.replace(/&lt;/g,"<");
	temp = temp.replace(/&gt;/g,">");
	temp = temp.replace(/&nbsp;/g," ");
	temp = temp.replace(/&#39;/g,"\'");
	temp = temp.replace(/&quot;/g,"\"");
	return temp;
}

export function getHtmlReplaceEnter(text) {
	text = htmlEncode(text)
	return (text+'').replace(/\r|\n/g,'<br/>')
}

export function privacyAuth() {
	uni.requirePrivacyAuthorize({
		success: () => {
			console.log('同意');
		},
		fail: () => {
			console.log('拒绝');
		}, // 用户拒绝授权
		complete: () => {}
	})
}