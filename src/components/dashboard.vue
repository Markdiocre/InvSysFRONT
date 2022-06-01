<script lang="ts">
import { userToken } from '@/stores/token'
import { defineComponent, onMounted, ref } from 'vue'
import axios from 'axios'

export default defineComponent({
    props:['currentUser'],
    setup(props){
        const store = userToken()

        let data = ref({} as  any)
        let reqs = ref({} as any)
        let products = ref({} as any)
        let headers = {
                    Authorization: 'token '+ store.getToken.token
                }

        function getDashboard(){
            axios.all([
                axios.get('v1/dashboard/',{headers: headers}),
                axios.get('v1/request/recent/',{headers: headers}),
                axios.get('v1/product/recent/',{headers: headers})
            ]).then(axios.spread((dashboard, request, product)=>{
                data.value = dashboard.data
                reqs.value = request.data
                products.value = product.data
            }))
        }

        onMounted(()=>{
            getDashboard()
        })

        return{
            data, reqs,products
        }
    }
})
</script>


<template>
    <div class="container-fluid">
        <div class="m-3">
            <div class="row">
                <div class="col-lg-3 ">
                    <div class="bord m-3 p-3 total"> 
                        <div class="row">
                            <div class="col-3">
                                <h1 class="text-center"><i class="bi bi-box2-fill"></i></h1>
                            </div>
                            <div class="col-9">
                                <div class="row">
                                    <h5> Total Products </h5>
                                </div>
                                <div class="row">
                                    <h5>{{data.total}}</h5>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class=" bord m-3 p-3 low"> 
                        <div class="row">
                            <div class="col-3">
                                <h1 class="text-center"><i class="bi bi-box2-fill"></i></h1>
                            </div>
                            <div class="col-9">
                                <div class="row">
                                    <h5> Low Stock Products </h5>
                                </div>
                                <div class="row">
                                    <h5>{{data.low_stock_count}}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class=" bord m-3 p-3 out"> 
                        <div class="row">
                            <div class="col-3">
                                <h1 class="text-center"><i class="bi bi-box2-fill"></i></h1>
                            </div>
                            <div class="col-9">
                                <div class="row">
                                    <h5>Out Of Stock Products</h5>
                                </div>
                                <div class="row">
                                    <h5>{{data.out_of_stock_count}}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class=" bord m-3 p-3 most"> 
                         <div class="row">
                            <div class="col-3">
                                <h1 class="text-center"><i class="bi bi-box2-fill"></i></h1>
                            </div>
                            <div class="col-9">
                                <div class="row">
                                    <h5>Most Stock Products</h5>
                                </div>
                                <div class="row">
                                    <h5>{{data.most_stock_product_count}}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row text-center">
                <div class="col-lg-6">
                    <div class="m-3 p-3 bord">
                        <h2>Recent Requests</h2>
                        <table class="table table-hovered text-start">
                            <thead>
                                <th>Requested By</th>
                                <th>Quantity</th>
                                <th>Product</th>
                            </thead>
                            <tbody>
                                <tr v-for="req in reqs" :key="req.request_id">
                                    <td>{{req.get_user_name}}</td>
                                    <td>{{req.quantity}}</td>
                                    <td>{{req.get_product_name}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="m-3 p-3 bord">
                        <h2>Recent Products</h2>
                        <table class="table table-hovered text-start">
                            <thead>
                                <th>Name</th>
                                <th>Quantity</th>
                            </thead>
                            <tbody>
                                <tr v-for="prod in products" :key="prod.product_id">
                                    <td>{{prod.name}}</td>
                                    <td>{{prod.total_quantity}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
 .low{
    background-color: #F27B53 !important;
    color: white !important;
 }

 .total{
    background-color: #36BA9B !important;
    color: white !important;
 }

 .out{
    background-color: #DF577B !important;
    color: white !important;
 }

 .most{
     background-color: #847CC5 !important;
    color: white !important;
 }
</style>