<script lang="ts">
import { userToken } from '@/stores/token'
import axios from 'axios'
import Swal from 'sweetalert2'
import moment from 'moment'
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
    props:['currentUser'],
    setup() {
        const store = userToken()

        let users = ref({} as any)
        let userGroups = ref({} as any)

        function getUsers(){
            axios.get('v1/auth/users/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                users.value = res.data
            })
        }

        function getUserGroups(){
            axios.get('v1/user-group/',{
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

        function translateDate(date: any){
            return moment(date).format('LLLL')
        }

        async function deleteUser(id: any){
            const { value: password } = await Swal.fire({
                title: 'Enter your password',
                text:'To confirm the deletetion of this user, please enter your password.',
                input: 'password',
                inputPlaceholder: 'Enter your password'
            })

            if(password){
                axios.delete('v1/auth/users/'+id+'/',{
                    data:{
                        current_password: password
                    },
                    headers:{
                        Authorization: 'token '+ store.getToken.token
                    }
                }).then(()=>{
                    Swal.fire(
                        {
                        icon: 'success',
                        title: 'Success!',
                        text:'User Group successfully deleted!'
                        }
                    )
                    getUsers()
                }).catch(()=>{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                    })
                })
            }else{
                Swal.fire('Password cannot be blank!')
            }
                    
        }

        onMounted(()=>{
            getUsers()
            getUserGroups()
        })
        return{
            store,
            users,
            userGroups,
            translateDate,
            deleteUser
        }
    }
})
</script>


<template>
    <div class="container-fluid">
    <div class="bord m-3">
        <div class="d-flex justify-content-between">
            <h3 class="p-4">Users</h3>
            <router-link :to="{name: 'addUser'}" class="btn btn-info m-4 p-2">Add New User</router-link>
        </div>
        <div class="container-fluid p-3 text-center table-responsive">
            <table class="table table-hover ">
                <thead>
                    <th>Name</th>
                    <th>Username</th>
                    <th>User Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Action</th>
                </thead>
                <tbody>
                        <tr v-for="user in users" :key="user.user_id">
                            <td>{{user.name}}</td>
                            <td>{{user.username}}</td>
                            <td>{{user.user_group_name}}</td>
                            <td>{{user.is_active  ? 'active' : 'inactive'}}</td>
                            <td>{{translateDate(user.last_login)}}</td>
                            <td><router-link :to="{name:'editUser', params:{id:user.user_id}}" class="btn btn-warning me-1"><i class="bi bi-pencil-square"></i>Edit</router-link><button @click="deleteUser(user.user_id)" class="btn btn-danger"><i class="bi bi-trash3-fill"></i>Delete</button></td>
                        </tr>
                </tbody>
            </table>
        </div>
        
    </div>
    
</div>
</template>

<style scoped>
    a{
        color:white !important;
    }
</style>