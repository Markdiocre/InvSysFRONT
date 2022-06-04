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
            })
        }

        function translateDate(date: any){
            return moment(date).format('LLLL')
        }

        function reject(id: any){
            axios.patch('v1/request/'+id+'/',{
                remarks: 'a'
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
        }

        function revert(id:  any){
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
                    axios.patch('v1/request/'+id+'/',{
                        remarks: 'p'
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

        function approve(id: any){
            axios.patch('v1/request/'+id+'/',{
                remarks: 'a'
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
            page, translateDate, approve, flipPage, reject,revert
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
                        <th>Inventory Reference No.</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Request Date</th>
                        <th>Requested By</th>
                        <th>Department</th>
                        <th>Remarks</th>
                        <th>Actions</th>
                    </thead>
                    <tbody>
                        <tr v-for="request in page.results" :key="request.request_id">
                            <td>{{request.get_inventory_name}}</td>
                            <td>{{request.get_product_name}}</td>
                            <td>{{request.quantity}}</td>
                            <td>{{translateDate(request.request_date)}}</td>
                            <td>{{request.get_user_name}}</td>
                            <td>{{request.get_user_department}}</td>
                            <td>{{request.get_remarks}}</td>
                            <td>
                                <div v-if="request.remarks == 'p'">
                                    <button class="btn btn-success" @click="approve(request.request_id)">Approve</button>
                                    <button class="btn btn-warning m-1" @click="reject(request.request_id)">Reject</button>
                                </div>
                                <div v-else>
                                    <button class="btn btn-danger" @click="revert(request.request_id)">Revert</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <nav>
                    <ul class="pagination p-3">
                        <li class="page-item" :class="{'disabled':(page.previous == null)}"><button class="page-link" @click="flipPage(page.previous)">Previous</button></li>
                        <li class="page-item" :class="{'disabled':(page.next == null)}"><button class="page-link" @click="flipPage(page.next)">Next</button></li>
                    </ul>
                </nav>
            </div>
        </div>
        
    </div>
</template>