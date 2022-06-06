<script lang="ts">
import { userToken } from '@/stores/token'
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

export default defineComponent({
    setup() {
        const store = userToken()
        const router = useRouter()
        const route = useRoute()

        let userGroups = ref({} as any)
        let user = ref({} as any)

        function getUser(){
            axios.get('v1/auth/users/'+ route.params.id,{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                user.value = res.data
            })
        }

        function getUserGroups(){
            axios.get('v1/user-group/all/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                userGroups.value = res.data
            }).catch((err)=>{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
            })
        }

        function putUser(){
            axios.put('v1/auth/users/'+ route.params.id+'/',{
                name: user.value.name,
                username: user.value.username,
                user_level: user.value.user_level,
                is_active: user.value.is_active,
                last_login: user.value.last_login
            },{
                headers:{
                    Authorization: 'token '+store.getToken.token
                }
            }).then((res)=>{
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User have been successfully updated!'
                })
                router.push({name: 'viewUser'})
            }).catch(()=>{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Either user username already existing or password is too short or common..',
                })
            })
        }

        

        onMounted(()=>{
            getUser()
            getUserGroups()
        })

        return{
            userGroups,
            user,
            putUser
        }
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
                    <input type="text" class="form-control"  placeholder="name@example.com" v-model="user.name" required>
                    <label for="floatingInput">Name</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control"  placeholder="name@example.com" v-model="user.username" required>
                    <label for="floatingInput">Username</label>
                </div>
                <select class="form-select form-floating mb-3" v-model="user.user_level" required>
                    <option v-for="group in userGroups" :key="group.group_id" :value="group.user_group_id">{{group.group_name}}</option>
                </select>
                <select class="form-select" name="group_status" v-model="user.is_active" required>
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