<script lang="ts">
import { userToken } from '@/stores/token'
import { defineComponent,onMounted,ref  } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import moment from 'moment'
import { useRouter } from 'vue-router'

export default defineComponent({
    props:{
        currentUser: {} as any
    },
    setup(props) {
        const store = userToken()
        const router = useRouter()

        let products = ref({} as any)
        let product = ref('')
        let quantity = ref(0)
        let hasExpiration = ref(false)
        let expiration_date = ref('')

        function getProducts(){
            axios.get('v1/product/all/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                products.value = res.data
            })
        }

        function addBatch(){
             axios.post('v1/inventory/',{
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
                router.push({name:"viewBatch"})
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
            getProducts()
        })

        return {
            products,
            product,
            quantity,
            hasExpiration,
            expiration_date,
            addBatch
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
                    <h3 class="text-center p-3">Add New Batch</h3>
                    <form action="post" class="p-3" @submit.prevent="addBatch">
                        <select class="form-select form-floating mb-3" v-model="product">
                            <option v-for="prod in products" :key="prod.product_id" :value="prod.product_id">{{prod.name}}</option>
                        </select>
                        <div class="form-floating mb-3">
                            <input type="number" class="form-control" autocomplete="off" v-model="quantity">
                            <label for="floatingInput">Quantity</label>
                        </div>
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="checkbox" v-model="hasExpiration">
                            <label class="form-check-label" for="flexCheckDefault">
                                Has Expiration Date
                            </label>
                        </div>
                        <div class="form-floating mb-3" v-show="hasExpiration">
                            <input type="datetime-local" class="form-control" autocomplete="off" v-model="expiration_date">
                            <label for="floatingInput">Expiration Date</label>
                        </div>
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary" type="submit">Add New Batch</button>
                        </div>
                    </form>
                </div>
                <div class="col-md-4">

                </div>
            </div>
        </div>
    </div>
</template>