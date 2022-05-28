<script lang="ts">
import { defineComponent } from 'vue'
import { userToken } from '@/stores/token'
import axios from 'axios'
import Swal from 'sweetalert2'

export default defineComponent({
    props:['currentUser'],
    setup(){
        const store = userToken()
        return{
            store
        }
    },
    data(){
        return{
            usergroups : {} as any
        }
    },
    methods:{
        getUserGroups(){
            axios.get('v1/user-group/',{
                headers:{
                    Authorization: 'token '+this.store.getToken.token
                }
            }).then((res)=>{
                this.usergroups = res.data
            }).catch((err)=>{
                console.log(err)
            })
        },
        deleteUserGroup(id: any){
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete('v1/user-group/'+id,{
                        headers:{
                            Authorization: 'token '+this.store.getToken.token
                        }
                    }).then(()=>{
                        Swal.fire(
                            {
                            icon: 'success',
                            title: 'Success!',
                            text:'User Group successfully deleted!'
                            }
                        )
                        this.getUserGroups()
                    }).catch(()=>{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                            footer: '<a href="">Why do I have this issue?</a>'
                        })
                    })
                    
                }
            })
            
        }
    },
    mounted(){
        this.getUserGroups()
    }
})
</script>


<template>
    <div class="container-fluid">
        <div class="row bord m-3">
            <div class="col-lg-12">
                <div class="d-flex justify-content-between">
                    <h3 class="p-4">User Groups</h3>
                    <router-link :to="{name:'addUserGroup'}" class="btn btn-info m-4 p-2">Add New User Group</router-link>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover table-responsive pt-3 text-center">
                        <thead>
                            <th>Group Name</th>
                            <th>Group Level</th>
                            <th>Group Status</th>
                            <th>Action</th>
                        </thead>
                        <tbody>
                            <tr v-for="group in usergroups" :key="group.user_group_id">
                                <td>{{group.group_name}}</td>
                                <td>{{group.group_level}}</td>
                                <td>{{group.group_status ? 'Active' : 'Inactive' }}</td>
                                <td><router-link :to="{name:'editUserGroup', params:{id:group.user_group_id}}" class="btn btn-warning router-link me-1"><i class="bi bi-pencil-square">Edit</i></router-link><button @click="deleteUserGroup(group.user_group_id)" class="btn btn-danger router-link"><i class="bi bi-trash3-fill">Delete</i></button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    a{
        color:white !important;
    }
</style>