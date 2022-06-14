<script lang="ts">
import { userToken } from '@/stores/token'
import { defineComponent, onMounted, ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import moment from 'moment'

export default defineComponent({
    props:['currentUser'],
    setup(props) {
        const store = userToken()
        const router = useRouter()

        let name = ref('')
        let category = ref('')
        let measuring_name = ref('')
        let reordering_point = ref(0)
        let selling_price = ref(0)
        let categories = ref({} as any)
        let product = ref('')
        let quantity = ref(0)
        let hasExpiration = ref(false)
        let expiration_date = ref('')

        function getCategories(){
            axios.get('v1/category/all/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                categories.value = res.data
            })
        }

        function addProduct(){
            axios.post('v1/product/',{
                name: name.value,
                category: category.value,
                measuring_name: measuring_name.value,
                reordering_point: reordering_point.value,
                selling_price: selling_price.value,
                product: product.value,
                quantity: quantity.value,
                expiration_date: hasExpiration.value ? moment(expiration_date.value).utcOffset("+08:00") : null,
                user: props.currentUser.user_id
            },{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then(()=>{
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'New Category have been succesfully created!'
                })
                router.push({name:"viewProduct"})
            }).catch((err)=>{
                console.log(err)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
            })
        }

        onMounted(()=>{
            getCategories()
        })

        return{
            name,
            categories,
            category,
            measuring_name,
            reordering_point,
            selling_price,
            addProduct,
            product,
            quantity,
            hasExpiration,
            expiration_date,
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
                    <form action="post" class="p-3" @submit.prevent="addProduct">
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" autocomplete="off" v-model="name" required>
                            <label for="floatingInput">Product Name</label>
                        </div>
                        <select class="form-select form-floating mb-3" v-model="category">
                            <option v-for="cat in categories" :key="cat.category_id" :value="cat.category_id">{{cat.name}}</option>
                        </select>
                        <div class="border p-2 mb-3">
                            <p class="text-center">Initial Inventory</p>
                            <div class="form-floating mb-3">
                                <input type="number" class="form-control" autocomplete="off" v-model="quantity" required>
                                <label for="floatingInput">Quantity</label>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" v-model="hasExpiration">
                                <label class="form-check-label">
                                    Has Expiration Date
                                </label>
                            </div>
                            <div class="form-floating mb-3" v-show="hasExpiration">
                                <input type="datetime-local" class="form-control" autocomplete="off" v-model="expiration_date">
                                <label for="floatingInput">Expiration Date</label>
                            </div>
                        </div>

                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" autocomplete="off" v-model="measuring_name" required>
                            <label for="floatingInput">Measuring Name</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="number" class="form-control" autocomplete="off" v-model="reordering_point" required>
                            <label for="floatingInput">Reordering Point</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="number" step="0.01" class="form-control" autocomplete="off" v-model="selling_price" required>
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