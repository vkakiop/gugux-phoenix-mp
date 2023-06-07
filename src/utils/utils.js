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
	const app = getApp()
	let token = app.globalData.loginToken && app.globalData.loginToken.accessToken
	if (!token || token == 'undefined') {
		token = ''
	}
	return token
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

export function needLogin() {
	const app = getApp()
	if (!app.globalData.loginToken.accessToken) {
		uni.navigateTo({url:'/pages/login/phone?url='+encodeURIComponent(getCurrentPageUrl())})
	}
}

