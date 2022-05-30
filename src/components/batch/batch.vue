<script lang="ts">
import { userToken } from '@/stores/token'
import { defineComponent, onMounted, ref } from 'vue'
import axios from 'axios'
import moment from 'moment'
import Swal from 'sweetalert2'

export default defineComponent({
    props:['currentUser'],
    setup() {
        const store = userToken()

        let batches = ref({} as any)
        let users = ref({} as any)
        let products = ref({} as any)


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

        function getUsers(){
            axios.get('v1/auth/users/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                users.value = res.data
            })
        }

        function translateDate(date: any){
            return moment(date).format('LLLL')
        }

        function findUserEquivalent(user: any){
            for(var i = 0; i < users.value.length; i++){
                if(users.value[i].user_id === user ){
                    return users.value[i].name
                }
            }
        }

        function findProductEquivalent(product: any){
            for(var i = 0; i < products.value.length; i++){
                if(products.value[i].product_id === product ){
                    return products.value[i].name
                }
            }
        }

        function delBatch(id : any){
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
                    axios.delete('v1/batch/'+id+'/',{
                        headers:{
                            Authorization: 'token '+ store.getToken.token
                        }
                    }).then(()=>{
                        Swal.fire(
                            {
                            icon: 'success',
                            title: 'Success!',
                            text:'Category successfully deleted!'
                            }
                        )
                        getBatches()
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
        

        onMounted(()=>{
            getBatches()
            getUsers()
            getProducts()
        })

        return {
            batches,translateDate,findUserEquivalent,findProductEquivalent,delBatch
        }
    },
})
</script>


<template>
    <div class="container-fluid">
        <div class="bord m-3">
            <div class="d-flex justify-content-between">
                <h3 class="p-4">Batches</h3>
                <router-link :to="{name: 'addBatch'}" class="btn btn-info m-4 p-2">Add New Batch</router-link>
            </div>
            <div class="table-responsive m-3">
                <table class="table table-hover table-bordered " >
                    <thead >
                        <th>Batch Name</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Expiration Date</th>
                        <th>Date Added</th>
                        <th>Added By</th>
                        <th>Actions</th>
                    </thead>
                    <tbody>
                        <tr v-for="batch in batches" :key="batch.batch_id">
                            <td>{{batch.batch_name}}</td>
                            <td>{{findProductEquivalent(batch.product)}}</td>
                            <td>{{batch.quantity}}</td>
                            <td>{{batch.expiration_date == null ? 'No Expiration' : translateDate(batch.expiration_date)}}</td>
                            <td>{{translateDate(batch.date_added)}}</td>
                            <td>{{findUserEquivalent(batch.user)}}</td>
                            <td><router-link :to="{name: 'editBatch', params:{id: batch.batch_id}}" class="btn btn-warning me-1"><i class="bi bi-pencil-square"></i>Edit</router-link><button class="btn btn-danger" @click="delBatch(batch.batch_id)"><i class="bi bi-trash3-fill"></i>Delete</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>