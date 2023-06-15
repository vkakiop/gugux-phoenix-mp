import {switchTabPathes,configLoginToken} from '@/config/index'
import useLoginTokenStore from '@/store/modules/loginToken'
import {getUserInfo} from '@/api/mine/index'
export function tokenSave(res,returnUrl) {
    //const app = getApp()
    let tokenRes = res.data
    if (tokenRes && tokenRes.accessToken) {
        getUserInfo({},{token:tokenRes.accessToken}).then(res=>{
            //app.globalData.loginToken = res.data
            const loginTokenStore = useLoginTokenStore()
            tokenRes['user'] = res.data || {id:''}
            loginTokenStore.set(tokenRes)

            uni.setStorage({
                key: configLoginToken,
                data: JSON.stringify(tokenRes),
                success: function () {
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
                        uni.navigateBack({delta: 1})
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
