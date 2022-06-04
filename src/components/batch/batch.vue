<script lang="ts">
import { userToken } from '@/stores/token'
import { defineComponent, onMounted, ref } from 'vue'
import axios from 'axios'
import moment from 'moment'
import Swal from 'sweetalert2'

export default defineComponent({
    props:['currentUser'],
    setup(props) {
        const store = userToken()

        let page = ref({} as any)

        function getBatches(){
            axios.get('v1/inventory/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                page.value = res.data
                console.log(page.value)
            })
        }


        function translateDate(date: any){
            return moment(date).format('LLLL')
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
            getBatches()
        })

        return {
            page,translateDate,delBatch, flipPage
        }
    },
})
</script>


<template>
    <div class="container-fluid">
        <div class="bord m-3">
            <div class="d-flex justify-content-between">
                <h3 class="p-4">Inventory</h3>
                <router-link :to="{name: 'addBatch'}" class="btn btn-info m-4 p-2">Add New Batch</router-link>
            </div>
            <div class="table-responsive m-3">
                <table class="table table-hover table-bordered " >
                    <thead >
                        <th>Reference No.</th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Expiration Date</th>
                        <th>Date Purchased</th>
                        <th>Added By</th>
                        <th>Actions</th>
                    </thead>
                    <tbody>
                        <tr v-for="batch in page.results" :key="batch.inventory_id">
                            <td>{{batch.inventory_id}}</td>
                            <td>{{batch.get_product_name}}</td>
                            <td>{{batch.get_category_name}}</td>
                            <td>{{batch.quantity}}</td>
                            <td>{{batch.expiration_date == null ? 'No Expiration' : translateDate(batch.expiration_date)}}</td>
                            <td>{{translateDate(batch.date_purchased)}}</td>
                            <td>{{batch.get_user_name}}</td>
                            <td><router-link :to="{name: 'editBatch', params:{id: batch.inventory_id}}" class="btn btn-warning me-1"><i class="bi bi-pencil-square"></i>Edit</router-link><button class="btn btn-danger" @click="delBatch(batch.batch_id)"><i class="bi bi-trash3-fill"></i>Delete</button></td>
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