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

        function selfRequest(){
            axios.get('v1/request/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                requests.value = res.data.filter((request:any) => request.user == props.currentUser.user_id)
            })
        }

        function translateDate(date: any){
            return moment(date).format('LLLL')
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

        function findProductEquivalent(product: any){
            for(var i = 0; i < products.value.length; i++){
                if(products.value[i].product_id === product ){
                    return products.value[i].name
                }
            }
        }

        function findBatchEquivalent(batch: any){
            for(var i = 0; i < batches.value.length; i++){
                if(batches.value[i].batch_id === batch ){
                    return batches.value[i].batch_name
                }
            }
        }

        function revertRequest(request :any){
            if(request.is_approved == true){
                Swal.fire({
                    icon: 'warning',
                    title: 'Waning!',
                    text: 'Approved Request cannot be reverted! Please contact an admin to disapprove your request before reverting'
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

        onMounted(()=>{
            selfRequest()
            getBatches()
            getProducts()
        })

        return{
            requests, translateDate,findProductEquivalent,findBatchEquivalent, revertRequest
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
                        <th>Batch</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Request Date</th>
                        <th>Approved</th>
                        <th>Action</th>
                    </thead>
                    <tbody>
                        <tr v-for="request in requests" :key="request.request_id">
                            <td>{{request.get_batch_name}}</td>
                            <td>{{request.get_product_name}}</td>
                            <td>{{request.quantity}}</td>
                            <td>{{translateDate(request.request_date)}}</td>
                            <td>{{request.is_approved ? 'Yes': 'No'}}</td>
                            <td><button class="btn btn-danger" @click="revertRequest(request)"><i class="bi bi-backspace-fill me-2"></i>Revert</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>