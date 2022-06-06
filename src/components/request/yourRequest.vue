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
        
        let page = ref([] as any)

        function selfRequest(){
            axios.get('v1/request/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                page.value = res.data
                page.value.results = page.value.results.filter((request:any) => request.user == props.currentUser.user_id)
            })
        }

        function translateDate(date: any){
            return moment(date).format('LLLL')
        }


        function revertRequest(request :any){
            if(request.remarks == 'c'){
                Swal.fire({
                    icon: 'warning',
                    title: 'Waning!',
                    text: 'Approved Request cannot be cancelled! Please contact an admin to disapprove your request before reverting'
                })
            }else{
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, cancel it!'
                    }).then((result) => {
                    if (result.isConfirmed) {
                        axios.delete('v1/request/'+request.request_id+'/',{
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
                        }).catch((err)=>{
                            console.log(err)
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

        function flipPage(url : any){
            axios.get(url,{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                page.value = res.data
            })
        }

        onMounted(()=>{
            selfRequest()
        })

        return{
            page, translateDate, revertRequest, flipPage
        }

    },
})
</script>


<template>
    <div class="container-fluid">
        <div class="bord m-3">
            <div class="d-flex justify-content-between">
                <h3 class="p-4">Your Requests</h3>
                <router-link :to="{name: 'addRequest'}" class="btn btn-info m-4 p-2">Add a Request</router-link>
            </div>
            <div class="table-responsive m-3 text-center">
                <table class="table table-hover table-bordered">
                    <thead>
                        <th>Inventory Reference No.</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Request Date</th>
                        <th>Remarks</th>
                        <th>Action</th>
                    </thead>
                    <tbody>
                        <tr v-for="request in page.results" :key="request.request_id">
                            <td>{{request.get_inventory_name}}</td>
                            <td>{{request.get_product_name}}</td>
                            <td>{{request.quantity}}</td>
                            <td>{{translateDate(request.request_date)}}</td>
                            <td>{{request.get_remarks}}</td>
                            <td><button class="btn btn-danger" @click="revertRequest(request)"><i class="bi bi-backspace-fill me-2"></i>Cancel</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <nav>
                <ul class="pagination p-3">
                    <li class="page-item" :class="{'disabled':(page.previous == null)}"><button class="page-link" @click="flipPage(page.previous)">Previous</button></li>
                    <li class="page-item" :class="{'disabled':(page.next == null)}"><button class="page-link" @click="flipPage(page.next)">Next</button></li>
                </ul>
            </nav>
        </div>
    </div>
</template>