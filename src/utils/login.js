import {switchTabPathes,configLoginToken} from '@/config/index'
import useLoginTokenStore from '@/store/modules/loginToken'
import {getUserInfo} from '@/api/mine/index'
import WebIM from '@/utils/WebIM'

export function tokenSave(res,returnUrl,isPop) {
    //const app = getApp()
    let tokenRes = res.data
    if (tokenRes && tokenRes.accessToken) {
        getUserInfo({},{token:tokenRes.accessToken}).then(res=>{
            //app.globalData.loginToken = res.data
            const loginTokenStore = useLoginTokenStore()
            tokenRes['user'] = res.data || {id:''}
            tokenRes['user'].isWxPhoneLogin = isPop ? true :false
            loginTokenStore.set(tokenRes)

            uni.setStorage({
                key: configLoginToken,
                data: JSON.stringify(tokenRes),
                success: function () {
                    //环信登录
                    hxLogin(tokenRes)

                    //跳转
                    let url = returnUrl || '/pages/index/index'
                    if (returnUrl) {
                        let isSwitch = isSwitchTab(url)
                        if (isSwitch) {
                            uni.switchTab({url:url})
                        }
                        else {
                            uni.navigateTo({url:url})
                        }
                    }
                    else {
                        if (isPop) {
                            uni.showToast({
                                title: "登录成功",
                                icon: "none"
                            });
                        }
                        else {
                            uni.navigateBack({delta: 1})
                        }
                    }
                }
            });
        })

    }
    else {
        uni.showToast({
            title: 'token获取错误！',
            icon:'none',
            duration: 2000
        });
        setTimeout(()=>{
            uni.navigateBack({delta: 1})
        },2000)
    }
}

export function isSwitchTab(path) {
    let isSwitch = false
    if (path) {
        switchTabPathes.forEach(item=>{
            if (item.indexOf(path) != -1) {
                isSwitch = true
            }
        })
    }
    return isSwitch
}

export function hxLogin(tokenRes,app) {
    // uni.setStorage({
    //     key: "myUsername",
    //     data: tokenRes.user.nickname
    // });
    let thisApp = app
    if (!app) {
        thisApp = getApp()
    }
    thisApp.globalData.conn.open({
        apiUrl: WebIM.config.apiURL,
        user: tokenRes.imId,
        pwd: tokenRes.imPwd,
        accessToken: tokenRes.imToken,
        //grant_type: this.data.grant_type,
        appKey: WebIM.config.appkey
    });
    console.log('环信已登录')
}

export function loginout() {
    useLoginTokenStore().set({accessToken:'',expireTime:0,user:{id:''}})
    uni.clearStorageSync(configLoginToken)
}
