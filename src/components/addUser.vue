<script lang="ts">
import { userToken } from '@/stores/token'
import { defineComponent } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import moment from 'moment'

export default defineComponent({
    props:['currentUser'],
    setup() {
        const store = userToken()
        return{
            store
        }
    },
    data(){
        return{
            userGroups: {} as any,
            name: '',
            username: '',
            password: '',
            user_level: '',
            last_login: moment().format('YYYY-MM-DD[T]HH:mm:ss')
        }
    },
    methods:{
        getUserGroups(){
            axios.get('v1/user-group/',{
                headers:{
                    Authorization: 'token '+this.store.getToken.token
                }
            }).then((res)=>{
                this.userGroups = res.data
            }).catch((err)=>{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
            })
        },
        async addNewUser(){
            await axios.post('v1/auth/users/',{
                name: this.name,
                username: this.username,
                password: this.password,
                user_level: this.user_level,
                last_login: this.last_login
            },{
                headers:{
                    Authorization: 'token '+this.store.getToken.token
                }
            }).then((res: any)=>{
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'New User have been succesfully created!'
                })
                this.$router.push({name:"viewUser"})
            }).catch((err: any)=>{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! The password must have been too short or common, or the user already exist with that username!',
                })
            })
        }
    },
    mounted(){
        this.getUserGroups()
    }
})
</script>


<template>
    <div class="row m-5">
        <div class="col-md-4"></div>
        <div class="col-md-4 bord">
            <h3 class="text-center p-3">Add New User</h3>
            <form method="post" class="p-3" @submit.prevent="addNewUser">
                <div class="form-floating mb-3">
                    <input type="text" class="form-control"  placeholder="name@example.com" name="name"  v-model="name">
                    <label for="floatingInput">Name</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control"  placeholder="name@example.com" name="username" v-model="username">
                    <label for="floatingInput">Username</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="password" class="form-control"  placeholder="name@example.com" name="password" v-model="password">
                    <label for="floatingInput">Password</label>
                </div>
                <select class="form-select form-floating mb-3" v-model="user_level">
                    <option v-for="group in userGroups" :key="group.group_id" :value="group.user_group_id">{{group.group_name}}</option>
                </select>
                <div class="d-grid gap-2">
                    <button class="btn btn-primary" type="submit">Add New User</button>
                </div>
            </form>
        </div>
        <div class="col-md-4"></div>
    </div>
</template>