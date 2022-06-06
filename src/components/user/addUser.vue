<script lang="ts">
import { userToken } from '@/stores/token'
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'
import moment from 'moment'

export default defineComponent({
    props:['currentUser'],
    setup() {
        const store = userToken()
        const router = useRouter()

        let userGroups = ref({} as any)
        let name = ref('')
        let username = ref('')
        let password = ref('')
        let user_level = ref('')
        let last_login = moment().format('YYYY-MM-DD[T]HH:mm:ss')

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

        async function addNewUser(){
            await axios.post('v1/auth/users/',{
                name: name.value,
                username: username.value,
                password: password.value,
                user_level: user_level.value,
                last_login: last_login
            },{
                headers:{
                    Authorization: 'token '+store.getToken.token
                }
            }).then((res: any)=>{
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'New User have been succesfully created!'
                })
                router.push({name:"viewUser"})
            }).catch((err: any)=>{
                console.log(err)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! The password must have been too short or common, or the user already exist with that username!',
                })
            })
        }

        onMounted(()=>{
            getUserGroups()
        })

        return{
            store,
            userGroups,
            name,
            username,
            password,
            user_level,
            last_login,
            getUserGroups,
            addNewUser
        }
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
                    <input type="text" class="form-control"  placeholder="name@example.com" name="name"  v-model="name" autocomplete="off" required>
                    <label for="floatingInput">Name</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control"  placeholder="name@example.com" name="username" v-model="username" autocomplete="off" required>
                    <label for="floatingInput">Username</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="password" class="form-control"  placeholder="name@example.com" name="password" v-model="password" autocomplete="off" required>
                    <label for="floatingInput">Password</label>
                </div>
                <select class="form-select form-floating mb-3" v-model="user_level" required>
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