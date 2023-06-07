import axios from 'axios'
import buildURL from 'axios/lib/helpers/buildURL'
import errorCode from '@/utils/errorCode'
import {isPlatformMp,getTokenValue} from '@/utils/utils'
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
    if (config.headers['isToken']) {
        let token = getTokenValue()
        if (token) {
            config.headers['token'] = token // 让每个请求携带自定义token 请根据实际情况自行修改
        }
    }

    return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

service.interceptors.response.use(res => {
        if (isPlatformMp()) {
            res = res.data
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
            uni.showToast({
                title: msg,
                icon:'none',
                duration: 2000
            });
            return Promise.reject('error')
        } else {
            return  Promise.resolve(res.data)
        }
    },
    error => {
        let message = error + '';
        if (typeof(error) == 'object') {
            message = error.message + ''
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
        //Toast.fail(message);
        uni.showToast({
            title: message,
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
                try {
                    var JSONbig = JSONBIG({storeAsString: true});
                    resolve({data:JSONbig.parse(data)});
                }
                catch (err) {
                    // 如果转换失败，则包装为统一数据格式并返回
                    reject('请求失败');
                }
            },
            fail:(err) => {
                // if(url.indexOf('cashride')>0){
                //
                // }
                // else {
                    uni.showToast({
                        title: res.data.msg!=null&&res.data.msg!=undefined&&res.data.msg!=''?res.data.msg:'网络异常，请重试！',
                        icon: 'none'
                    })
                    reject('网络异常，请重试！');
                //}
            },
            complete:()=>{
            }
        });
    })
}

export default service
