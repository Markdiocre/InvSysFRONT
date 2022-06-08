<script lang="ts">
import { userToken } from '@/stores/token'
import { defineComponent, onMounted, ref, watch } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

export default defineComponent({
    props:{
        currentUser: {} as any
    },
    setup(props) {
        const store = userToken()
        const router = useRouter()


        let product = ref(0)
        let batch = ref(0)
        let quantity = ref(0)


        let products = ref({} as any)
        let batches = ref({} as any)
        let proxyBatches = ref({} as any)

        function getProducts(){
            axios.get('v1/product/all/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                products.value = res.data
            })
        }

        function getBatches(){
            axios.get('v1/inventory/all/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                batches.value = res.data
            })
        }

        function makeRequest(){
            axios.post('v1/request/',{
                product: product.value,
                inventory: batch.value,
                quantity: quantity.value,
                user: props.currentUser.user_id,
                remarks : 'p'
            },{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then(()=>{
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'You\'ve succesfully requested!'
                })
                router.push({name:"selfRequest"})
            }).catch((err)=>{
                console.log(err)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
            })
        }

        watch(()=>product.value, (newProd)=>{
            proxyBatches.value = batches.value.filter((batch:any)=>batch.product === newProd && batch.quantity !== 0 )
        })

        onMounted(()=>{
            getBatches()
            getProducts()
        })

        return{
            product, batch,products, proxyBatches, quantity, makeRequest
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
                    <h3 class="text-center p-3">Make Request</h3>
                    <form action="post" class="p-3" @submit.prevent="makeRequest">
                        <select class="form-select form-floating mb-3" v-model="product" required>
                            <option v-for="prod in products" :key="prod.product_id" :value="prod.product_id">{{prod.name}}</option>
                        </select>
                        <select class="form-select form-floating mb-3" v-model="batch" required>
                            <option v-for="btch in proxyBatches" :key="btch.inventory_id" :value="btch.inventory_id"><p>Reference No: {{btch.inventory_id}} - ({{btch.quantity}})</p></option>
                        </select>
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" autocomplete="off" v-model="quantity" required>
                            <label for="floatingInput">Quantity</label>
                        </div>
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary" type="submit">Make Request</button>
                        </div>
                    </form>
                </div>
                <div class="col-md-4">

                </div>
            </div>
        </div>
    </div>
</template>