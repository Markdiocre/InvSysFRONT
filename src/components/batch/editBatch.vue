<script lang="ts">
import { userToken } from '@/stores/token'
import { defineComponent,onMounted,ref  } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import moment from 'moment'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
    props:{
        currentUser: {} as any
    },
    setup(props) {
        const store = userToken()
        const router = useRouter()
        const route = useRoute()

        let products = ref({} as any)
        let batch = ref({} as any)
        let hasExpiration = ref(false)

        function getBatch(){
            axios.get('v1/batch/'+ route.params.id+'/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                batch.value = res.data
            }).catch((err)=>{
                console.log(err)
            })
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

        function editBatch(){
            axios.put('v1/batch/'+ route.params.id+'/',{
                batch_name: batch.value.batch_name,
                product: batch.value.product,
                quantity: batch.value.quantity,
                expiration_date: hasExpiration.value ? moment(batch.value.expiration_date).utcOffset("+08:00") : null,
                user: props.currentUser.user_id
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
                router.push({name: 'viewBatch'})
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
            getBatch()

            if(batch.value.expiration_date != null){
                hasExpiration.value = true
            }
        })

        return {
            products,
            batch,
            editBatch,
            hasExpiration
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
                    <h3 class="text-center p-3">Edit Batch</h3>
                    <form action="post" class="p-3" @submit.prevent="editBatch">
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" autocomplete="off" v-model="batch.batch_name">
                            <label for="floatingInput">Batch Name</label>
                        </div>
                        <select class="form-select form-floating mb-3" v-model="batch.product">
                            <option v-for="prod in products" :key="prod.product_id" :value="prod.product_id">{{prod.name}}</option>
                        </select>
                        <div class="form-floating mb-3">
                            <input type="number" class="form-control" autocomplete="off" v-model="batch.quantity">
                            <label for="floatingInput">Quantity</label>
                        </div>
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="checkbox" v-model="hasExpiration">
                            <label class="form-check-label" for="flexCheckDefault">
                                Has Expiration Date
                            </label>
                        </div>
                        <div class="form-floating mb-3" v-show="hasExpiration">
                            <input type="datetime-local" class="form-control" v-model="batch.expiration_date">
                            <label for="floatingInput">Expiration Date</label>
                        </div>
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary" type="submit">Update Batch</button>
                        </div>
                    </form>
                </div>
                <div class="col-md-4">

                </div>
            </div>
        </div>
    </div>
</template>