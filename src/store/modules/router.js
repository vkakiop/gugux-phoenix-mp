import {createPinia,defineStore} from "pinia"
import {needLogin} from "@/utils/utils"
const useRouterStore = defineStore(
    'router',
    {
        state: () => ({
            router:{
                '/pages/mine/mine':false //false跳登录 true跳index
            }
        }),
        actions: {
            // 添加一项数据
            setRouter(key,value) {
                this.router[key] = value
            },
            getRouter(key) {
                return this.router[key]
            },
            routerTo(key) {
                if (this.getRouter(key)) {
                    this.setRouter(key,false)
                    uni.switchTab({url:'/pages/index/index'})
                }
                else {
                    this.setRouter(key,true)
                    needLogin()
                }
            }
        },
    })
export default useRouterStore
