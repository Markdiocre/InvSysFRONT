<script lang="ts">
import { userToken } from '@/stores/token'
import axios from 'axios'
import { defineComponent, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'

export default defineComponent({
    props:['currentUser'],
    setup(props) {
        const store = userToken()

        let page = ref({} as any)

        function getProducts(){
            axios.get('v1/product/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                page.value = res.data
            })
        }

        function delProduct(id : any){
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
                    axios.delete('v1/product/'+id+'/',{
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
                        getProducts()
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
            getProducts()
        })


        return{
            page, delProduct, flipPage
        }

    },
})
</script>


<template>
    <div class="container-fluid">
        <div class="bord m-3">
            <div class="d-flex justify-content-between">
                <h3 class="p-4">Products</h3>
                <router-link :to="{name: 'addProduct'}" class="btn btn-info m-4 p-2" v-if="$props.currentUser.user_level_equivalent <= 1">Add New Product</router-link>
            </div>
            <div class="container-fluid p-3 text-center">
                <table class="table table-hover table-bordered" >
                    <thead >
                        <th>Name</th>
                        <th>Category</th>
                        <th>Total Quantity</th>
                        <th>Measuring Name</th>
                        <th>Reordering Point</th>
                        <th>Unit Cost</th>
                        <th>Total Cost</th>
                        <th>Remarks</th>
                        <th>Actions</th>
                    </thead>
                    <tbody v-for="product in page.results" :key="product.product_id" >
                        <tr>
                            <td>{{product.name}}</td>
                            <td>{{product.get_category_name}}</td>
                            <td>{{product.total_quantity}}</td>
                            <td>{{product.measuring_name}}</td>
                            <td>{{product.reordering_point}}</td>
                            <td>{{product.selling_price}}</td>
                            <td>{{product.total_quantity * product.selling_price}}</td>
                            <td>{{product.remarks}}</td>
                            <td><router-link :to="{name:'editProduct', params:{id:product.product_id}}" class="btn btn-warning me-1" ><i class="bi bi-pencil-square"></i>Edit</router-link><button class="btn btn-danger" @click="delProduct(product.product_id)"><i class="bi bi-trash3-fill"></i>Delete</button></td>
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