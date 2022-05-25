<script lang="ts">
import { userToken } from '@/stores/token'
import { defineComponent } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

export default defineComponent({
    setup() {
        const store = userToken()
        return{
            store
        }
    },
    data(){
        return{
            userGroups: {} as any,
            user: {} as any
        }
    },
    methods:{
        getUser(){
            axios.get('v1/auth/users/'+this.$route.params.id,{
                headers:{
                    Authorization: 'token '+this.store.getToken.token
                }
            }).then((res)=>{
                this.user = res.data
            })
        },
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
        putUser(){
            axios.put('v1/auth/users/'+this.$route.params.id,{
                name:this.user.name,
                username: this.user.username,
                user_level: this.user.user_level,
                is_active: this.user.is_active
            },{
                headers:{
                    Authorization: 'token '+this.store.getToken.token
                }
            }).then((res)=>{
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User have been successfully updated!'
                })
                this.$router.push({name: 'viewUser'})
            }).catch(()=>{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Either user username already existing or password is too short or common..',
                })
            })
        }
    },
    mounted(){
        this.getUser()
        this.getUserGroups()
    }
})
</script>


<template>
    <div class="row m-5">
        <div class="col-md-4"></div>
        <div class="col-md-4 bord">
            <h3 class="text-center p-3">Edit User</h3>
            <form method="post" class="p-3" @submit.prevent="putUser">
                <div class="form-floating mb-3">
                    <input type="text" class="form-control"  placeholder="name@example.com" v-model="user.name">
                    <label for="floatingInput">Name</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control"  placeholder="name@example.com" v-model="user.username">
                    <label for="floatingInput">Username</label>
                </div>
                <select class="form-select form-floating mb-3" v-model="user.user_level">
                    <option v-for="group in userGroups" :key="group.group_id" :value="group.user_group_id">{{group.group_name}}</option>
                </select>
                <select class="form-select" aria-label="Default select example" name="group_status" v-model="user.is_active">
                    <option value="false">Inactive</option>
                    <option value="true">Active</option>
                </select>
                <div class="d-grid gap-2 mt-3">
                    <button class="btn btn-primary" type="submit">Edit User</button>
                </div>
            </form>
        </div>
        <div class="col-md-4"></div>
    </div>
</template>