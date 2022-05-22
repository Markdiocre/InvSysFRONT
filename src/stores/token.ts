import { defineStore } from 'pinia'

export const userToken = defineStore('token',{
    state: ()=>({
        token:{} as any,
    }),
    getters:{
        getToken(state){
            return state.token
        },
        getHeaders(state){
            return 'token '+state.token.token
        }
    },
    actions:{
        login(token: any){
            this.token = token
        }
    }
})