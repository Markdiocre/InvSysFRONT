<script lang="ts">
import { userToken } from '@/stores/token'
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

export default defineComponent({
    props:['currentUser'],
    setup() {
        const store = userToken()
        const router = useRouter()
        const route = useRoute()

        let product = ref({} as any)
        let categories = ref({} as any)

        function getProduct(){
            axios.get('v1/product/'+ route.params.id+'/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                product.value = res.data
            }).catch((err)=>{
                console.log(err)
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

        function editProduct(){
            axios.put('v1/product/'+ route.params.id+'/',{
                name: product.value.name,
                category: product.value.category,
                measuring_name: product.value.measuring_name,
                reordering_point: product.value.reordering_point,
                selling_price: product.value.selling_price
            },{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Category have been successfully updated!'
                })
                router.push({name: 'viewProduct'})
            }).catch((err)=>{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
            })
        }

        onMounted(()=>{
            getCategories()
            getProduct()
        })

        return{
            product, categories, editProduct
        }

    },
})
</script>


<template>
    <div class="container-fluid">
        <div class="m-3">
            <div class="row">
                <div class="col-md-4">

                </div>
                <div class="col-md-4 bord ">
                    <h3 class="text-center p-3">Add New Product</h3>
                    <form action="post" class="p-3" @submit.prevent="editProduct">
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" autocomplete="off" v-model="product.name">
                            <label for="floatingInput">Product Name</label>
                        </div>
                        <select class="form-select form-floating mb-3" v-model="product.category">
                            <option v-for="cat in categories" :key="cat.category_id" :value="cat.category_id">{{cat.name}}</option>
                        </select>
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" autocomplete="off" v-model="product.measuring_name">
                            <label for="floatingInput">Measuring Name</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="number" class="form-control" autocomplete="off" v-model="product.reordering_point">
                            <label for="floatingInput">Reordering Point</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="number" class="form-control" step="0.01" autocomplete="off" v-model="product.selling_price">
                            <label for="floatingInput">Selling Price</label>
                        </div>
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary" type="submit">Add New Product</button>
                        </div>
                    </form>
                </div>
                <div class="col-md-4">

                </div>
            </div>
        </div>
    </div>
</template>