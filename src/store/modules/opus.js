import {createPinia,defineStore} from "pinia"
const useOpusStore = defineStore(
    'opus',
    {
        state: () => ({
            like:{id:'',isLike:false,likeNum:0}
        }),
        actions: {
            // 添加一项数据
            setLike(data) {
                this.like = data || {}
            }
        },
        getters: {
            getLike() {
                return ()=> this.like || {}
            }
        }
    })
export default useOpusStore
