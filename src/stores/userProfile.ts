import { defineStore } from 'pinia'

export const userProfile = defineStore('user',{
    state: ()=>({
        user: {},
        isAuth: false,
    }),
    getters:{
        getUser(state){
            return state.user
        }
    },
    actions:{
        login(data: object){
            this.user = data
            this.isAuth = true
        }
    }
})