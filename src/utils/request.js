import axios from 'axios'
import buildURL from 'axios/lib/helpers/buildURL'
import errorCode from '@/utils/errorCode'
import { tansParams, blobValidate } from '@/utils/ruoyi'
import {isPlatformMp,getTokenValue,getCurrentPageUrl} from '@/utils/utils'
import {configHeadersDefault} from '@/config/index'
import JSONBIG from 'json-bigint'
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

let baseUrl = import.meta.env.VITE_APP_BASE_API

// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: baseUrl,
    // 超时
    timeout: 10000,
 // 将大数字转为字符串保障精度
    transformResponse: [function (data) {
        try {
            // 如果转换成功则返回转换的数据结果
            const json = JSONBIG({
                // 重要，保障以字符串保存
                storeAsString:true
            })
            return json.parse(data)
        } catch (err) {
            // 如果转换失败，则包装为统一数据格式并返回
            return {
                data
            }
        }
    }]

  })

// request拦截器
service.interceptors.request.use(config => {
    // 是否需要设置 token
    if (config.headers['isToken'] !== false) {
        if (!config.headers['token']) {
            let token = getTokenValue()
            if (token) {
                config.headers['token'] = token // 让每个请求携带自定义token 请根据实际情况自行修改
            }
        }
    }
    //config.headers = {...config.headers,...configHeadersDefault()}

    // get请求映射params参数
    if (config.method === 'get' && config.params) {
        let url = config.url + '?' + tansParams(config.params);
        url = url.slice(0, -1);
        config.params = {};
        config.url = url;
    }
    if (config.method === 'post' && config.params) {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        let url = config.url
        config.url = url;
        config.data = tansParams(config.params).slice(0, -1);
        config.params = {};
    }

    return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

service.interceptors.response.use(res => {
        let oldres = res
        if (isPlatformMp()) {
            res = res.data
        }
        //登录过期处理
        if (res.data && res.data.msg && res.data.msg.indexOf('token信息错误') != -1) {
            uni.reLaunch({url:'/pages/login/index?isShowReLoginMsg=1&url='+encodeURIComponent(getCurrentPageUrl())})
            return Promise.reject(res.data)
        }
        // 未设置状态码则默认成功状态
        if(res.data?.status!=undefined){
            res.data.code = res.data.status==1? 200 :500;
        }
        if(res.data?.code==0){
            res.data.code = 500;
        }
        const code = res.data.code  || 200  ;
        // 获取错误信息
        const msg = errorCode[code] || res.data.msg || errorCode['default']
        // 二进制数据则直接返回
        if(res.request && (res.request.responseType ===  'blob' || res.request.responseType ===  'arraybuffer')){
            return res.data
        }
        if (code !== 200) {
            //Toast.fail(msg);
            let ignoreErrorUrls = [
                '/gugux-services-location-api/app/security/safe/emergency/contact/help/add',
                '/gugux-services-activity-api/app/moyu/draw',
                '/gugux-services-user-api/app/digital/key/share/open'
            ]
            let isFind = false;
            ignoreErrorUrls.forEach((item)=>{
                if(oldres.url.indexOf(item) != -1){
                    isFind = true;
                }
            })
            if(!isFind){
                uni.showToast({
                    title: msg,
                    icon:'none',
                    duration: 2000
                });
            }
            return Promise.reject(res.data)
        } else {
            return  Promise.resolve(res.data)
        }
    },
    error => {
        //Toast.fail(message);
        uni.showToast({
            title: error.message,
            icon:'none',
            duration: 2000
        });
        return Promise.reject(error)
    }
)

axios.defaults.adapter = function(config) { //自己定义个适配器，用来适配uniapp的语法
    return new Promise((resolve, reject) => {
        //console.log(config)
        //var settle = require('axios/lib/core/settle');
        //var buildURL = require('axios/lib/helpers/buildURL');
        // uni.request({
        //     method: config.method.toUpperCase(),
        //     url: config.baseURL + buildURL(config.url, config.params, config.paramsSerializer),
        //     header: config.headers,
        //     data: config.data,
        //     dataType: config.dataType,
        //     responseType: config.responseType,
        //     sslVerify: config.sslVerify,
        //     complete: function complete(response) {
        //         console.log("执行完成：", response)
        //         response = {
        //             ...response,
        //             // data: response.data,
        //             status: response.statusCode,
        //             // errMsg: response.errMsg,
        //             // header: response.header,
        //             config: config
        //         };
        //
        //         settle(resolve, reject, response);
        //     }
        // })

        const requestTask = uni.request({
            method: config.method.toUpperCase(),
            url: config.baseURL + buildURL(config.url, config.params, config.paramsSerializer),
            header: config.headers,
            data: config.data,
            dataType: 'string',//config.dataType,
            responseType: config.responseType,
            sslVerify: config.sslVerify,
            success:(res)=> {
                let data = res.data
                if (config.dataType == 'string') {
                    resolve({data:data,url:config.baseURL + buildURL(config.url, config.params, config.paramsSerializer)});
                }
                else {
                    try {
                        var JSONbig = JSONBIG({storeAsString: true});
                        resolve({data:JSONbig.parse(data),url:config.baseURL + buildURL(config.url, config.params, config.paramsSerializer)});
                    }
                    catch (err) {
                        // 如果转换失败，则包装为统一数据格式并返回
                        reject({data:JSONbig.parse(data),message:'请求失败',url:config.baseURL + buildURL(config.url, config.params, config.paramsSerializer)});
                    }
                }
            },
            fail:(error) => {
                // if(url.indexOf('cashride')>0){
                //
                // }
                // else {
                //     uni.showToast({
                //         title: '网络异常，请重试！',
                //         icon: 'none'
                //     })
                let message = error || '网络异常，请重试！'
                if (typeof(error) == 'object') {
                    message = error.errMsg + ''
                }
                if (message == "Network Error") {
                    message = "后端接口连接异常";
                }
                else if (message.includes("timeout")) {
                    message = "系统接口请求超时";
                }
                else if (message.includes("Request failed with status code")) {
                    message = "系统接口" + message.substr(message.length - 3) + "异常";
                }
                else if (message.includes('request:fail')) {
                    message = "网络异常，请重试！";
                }
                reject({message:message,url:config.baseURL + buildURL(config.url, config.params, config.paramsSerializer)});
                //}
            },
            complete:()=>{
            }
        });
    })
}

export default service
