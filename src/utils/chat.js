import WebIM from '@/utils/WebIM'
import {configLoginToken} from '@/config/index'

export function getSendMsgExt() {
    //登录信息处理
    let ggx_login_token_text = uni.getStorageSync(configLoginToken)
    let loginToken = {}
    if (ggx_login_token_text) {
        loginToken = JSON.parse(ggx_login_token_text) || {}
    }

    let userInfo = loginToken.user || {};
    let ext = {
        UserId:userInfo.id,
        ggx_icon:userInfo.icon,
        ggx_name:userInfo.nickname,
        em_apns_ext:{
            em_huawei_push_badge_class: "com.caigetuxun.app.ggx.splash.SplashActivity",
            em_push_content: "",
            em_push_name: userInfo.nickname+"发来一条新的消息"
        }
    }
    return ext;
}

export function onSendText(payload) {
    return new Promise((resolve, reject) => {
        const {chatType, chatId, message} = payload;
        const id = WebIM.conn.getUniqueId();
        const chatroom = chatType === "chatroom";
        const msgObj = new WebIM.message("txt", id);
        const type = chatType === "contact" ? "singleChat" : "groupChat";
        msgObj.set({
            msg: message,
            to: chatId['id'],
            chatType: type,
            roomType: chatroom,
            ext: getSendMsgExt(),
            success: function () {

            },
            fail: function (e) {
                console.log("Send private text error", e);
            }
        });
        WebIM.conn.send(msgObj.body)
            .then(res => {
                resolve()
            })
            .catch(e => {
                reject()
            })
    })
}

export function onSendCustomEmergencyContactAgree(payload) {
    return new Promise((resolve, reject) => {
        const { chatType, chatId } = payload;
        const id = WebIM.conn.getUniqueId();
        const time = +new Date();
        const chatroom = chatType === "chatroom";
        const type = chatType === "contact" ? "singleChat" : "groupChat";

        let customExts = {}

        const msgObj = new WebIM.message("custom", id);
        msgObj.set({
            to: chatId['id'],
            chatType: type,
            roomType: chatroom,
            customExts:{custom_json:JSON.stringify(customExts)},
            customEvent: 'emergency_contact_agree',
            ext: getSendMsgExt(),
            success: function () {

            },
            fail: function (e) {
                console.log("Send private text error", e);
            }
        });

        WebIM.conn.send(msgObj.body)
            .then(res=>{
                resolve()
            })
            .catch(e=>{
                reject()
            })
    })

}