<script lang="ts">
import { userToken } from '@/stores/token'
import axios from 'axios'
import { defineComponent, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'

export default defineComponent({
    props:['currentUser'],
    setup(props) {
        const store = userToken()

        let products = ref({} as any)
        let categories = ref({} as any)

        function getProducts(){
            axios.get('v1/product/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                products.value = res.data
            })
        }

        function getCategories(){
            axios.get('v1/category/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                
                categories.value = res.data
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

        onMounted(()=>{
            getProducts()
            getCategories()
        })

        return{
            products, categories, delProduct
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
            <div class="container-fluid p-3 text-center" v-for="category in categories" :key="category.category_id">
                <h5 class="text-start">{{category.name}}</h5>
                <table class="table table-hover table-bordered" >
                    <thead >
                        <th>Name</th>
                        <th>Total Quantity</th>
                        <th>Measuring Name</th>
                        <th>Reordering Point</th>
                        <th>Unit Cost</th>
                        <th>Total Cost</th>
                        <th>Remarks</th>
                        <th v-if="$props.currentUser.user_level_equivalent <= 1">Actions</th>
                    </thead>
                    <tbody v-for="product in products" :key="product.product_id" >
                        <tr v-show="product.category == category.category_id ">
                            <td>{{product.name}}</td>
                            <td>{{product.total_quantity}}</td>
                            <td>{{product.measuring_name}}</td>
                            <td>{{product.reordering_point}}</td>
                            <td>{{product.selling_price}}</td>
                            <td>{{product.total_quantity}}</td>
                            <td>{{product.remarks}}</td>
                            <td v-if="$props.currentUser.user_level_equivalent <= 1"><router-link :to="{name:'editProduct', params:{id:product.product_id}}" class="btn btn-warning me-1" ><i class="bi bi-pencil-square"></i>Edit</router-link><button class="btn btn-danger" @click="delProduct(product.product_id)"><i class="bi bi-trash3-fill"></i>Delete</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>