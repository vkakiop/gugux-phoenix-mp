import {createPinia,defineStore} from "pinia"
const useLoginTokenStore = defineStore(
    'loginToken',
    {
        state: () => ({
            loginToken:{}
        }),
        actions: {
            // 添加一项数据
            set(data) {
                this.loginToken = data || {}
            }
        },
        getters: {
            get() {
                return ()=> this.loginToken || {}
            }
        }
    })
export default useLoginTokenStore
