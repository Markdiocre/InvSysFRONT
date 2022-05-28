import { defineStore } from 'pinia'

export const userToken = defineStore('token',{
    state: ()=>({
        token:{} as any,
        isAuth: false
    }),
    getters:{
        getToken(state){
            return state.token
        },
        getAuthStatus(state){
            return state.isAuth
        }
        
    },
    actions:{
        login(token: any){
            this.token = token
            this.isAuth = true
        },
        logout(){
            this.token = {} as any
            this.isAuth = false
        }
    }
})