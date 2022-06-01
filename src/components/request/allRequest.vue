<script lang="ts">
import { userToken } from '@/stores/token'
import { defineComponent,onMounted,ref } from 'vue'
import axios from 'axios'
import moment from 'moment'
import Swal from 'sweetalert2'

export default defineComponent({
    props:{
        currentUser: {} as any
    },
    setup(props) {
        const store = userToken()
        
        let requests = ref([] as any)
        let products = ref({} as any)
        let batches = ref({} as any)
        let users = ref({} as any)
        let userGroups = ref({} as any)

        function selfRequest(){
            axios.get('v1/request/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                requests.value = res.data
            })
        }

        function translateDate(date: any){
            return moment(date).format('LLLL')
        }

        function getUsers(){
            axios.get('v1/auth/users/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                users.value = res.data
            })
        }


        function getProducts(){
            axios.get('v1/product/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                products.value = res.data
            })
        }

        function getBatches(){
            axios.get('v1/batch/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                batches.value = res.data
            })
        }

        function getUserGroups(){
            axios.get('v1/user-group/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                userGroups.value = res.data
            })
        }

        function approve(request: any){
            console.log(request)
            if(request.is_approved == false){
                axios.patch('v1/request/'+request.request_id+'/',{
                    is_approved: true
                },{
                    headers:{
                        Authorization: 'token '+ store.getToken.token
                    }
                }).then((res)=>{
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'You\'ve succesfully requested!'
                    })
                    selfRequest()
                }).catch((err)=>{
                    console.log(err)
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: err.response.data,
                    })
                })
            }else{
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, revert it!'
                    }).then((result) => {
                    if (result.isConfirmed) {
                        axios.patch('v1/request/'+request.request_id+'/',{
                            is_approved: false
                        },{
                            headers:{
                                Authorization: 'token '+ store.getToken.token
                            }
                        }).then(()=>{
                            Swal.fire(
                                {
                                icon: 'success',
                                title: 'Success!',
                                text:'Request successfully reverted!'
                                }
                            )
                            selfRequest()
                        }).catch(()=>{
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Something went wrong!',
                            })
                        })
                        
                    }
                })
            }
        }

        onMounted(()=>{
            selfRequest()
            getBatches()
            getProducts()
            getUsers()
            getUserGroups()
        })

        return{
            requests, translateDate, approve
        }

    },
})
</script>


<template>
    <div class="container-fluid">
        <div class="bord m-3">
            <div class="d-flex justify-content-between">
                <h3 class="p-4">All Requests</h3>
            </div>
            <div class="table-responsive m-3 text-center">
                <table class="table table-hover table-bordered">
                    <thead>
                        <th>Batch</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Request Date</th>
                        <th>Requested By</th>
                        <th>Department</th>
                        <th>Approved</th>
                        <th>Actions</th>
                    </thead>
                    <tbody>
                        <tr v-for="request in requests" :key="request.request_id">
                            <td>{{request.get_batch_name}}</td>
                            <td>{{request.get_product_name}}</td>
                            <td>{{request.quantity}}</td>
                            <td>{{translateDate(request.request_date)}}</td>
                            <td>{{request.get_user_name}}</td>
                            <td>{{request.get_user_department}}</td>
                            <td>{{request.is_approved ? 'Yes': 'No'}}</td>
                            <td><button class="btn btn-success" v-if="request.is_approved == false" @click="approve(request)">Approve</button><button class="btn btn-danger" v-else  @click="approve(request)">Revert</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>