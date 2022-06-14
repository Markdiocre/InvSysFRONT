<script lang="ts">
import { userToken } from '@/stores/token'
import { defineComponent, onMounted, ref } from 'vue'
import axios from 'axios'
import moment from 'moment'

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
            })).catch((err)=>{
                console.log(err)
            })
        }

        function translateDate(date: any){
            return moment(date).format('LLLL')
        }

        onMounted(()=>{
            getDashboard()
        })

        return{
            data, reqs, products,props,translateDate
        }
    }
})
</script>


<template>
    <div class="container-fluid">
        <div class="m-3">
            <div class="row">
                <div :class="{'col-xl-6 height-adjust': (props.currentUser.user_level_equivalent > 1), 'col-xl-3': (props.currentUser.user_level_equivalent <= 1)} ">
                    <div class=" bord m-3 p-3 total" :class="{'h-75 d-flex align-items-center justify-content-center' :(props.currentUser.user_level_equivalent > 1)}"> 
                        <div class="row" :class="{'form-wrapper align-items-center justify-content-center text-end':(props.currentUser.user_level_equivalent > 1)}">
                            <div class="col-3">
                                <h1 class="text-center"><i class="bi bi-box2-fill" :class="{'big-icon':(props.currentUser.user_level_equivalent > 1)}"></i></h1>
                            </div>
                            <div class="col-9">
                                <div class="row">
                                    <h5 :class="{'big-font':(props.currentUser.user_level_equivalent > 1)}"> No. of Total Products </h5>
                                </div>
                                <div class="row">
                                    <h5 :class="{'big-font':(props.currentUser.user_level_equivalent > 1)}">{{data.total}}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div :class="{'col-xl-6 height-adjust': (props.currentUser.user_level_equivalent > 1), 'col-xl-3': (props.currentUser.user_level_equivalent <= 1)} ">
                    <div class=" bord m-3 p-3 low" :class="{'h-75 d-flex align-items-center justify-content-center' :(props.currentUser.user_level_equivalent > 1)}"> 
                        <div class="row" :class="{'form-wrapper align-items-center justify-content-center text-end':(props.currentUser.user_level_equivalent > 1)}">
                            <div class="col-3">
                                <h1 class="text-center"><i class="bi bi-box2-fill" :class="{'big-icon':(props.currentUser.user_level_equivalent > 1)}"></i></h1>
                            </div>
                            <div class="col-9">
                                <div class="row">
                                    <h5 :class="{'big-font':(props.currentUser.user_level_equivalent > 1)}"> Low Stock Products </h5>
                                </div>
                                <div class="row">
                                    <h5 :class="{'big-font':(props.currentUser.user_level_equivalent > 1)}">{{data.low_stock_count}}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div :class="{'col-xl-6 height-adjust': (props.currentUser.user_level_equivalent > 1), 'col-xl-3': (props.currentUser.user_level_equivalent <= 1)} ">
                    <div class=" bord m-3 p-3 out" :class="{'h-75 d-flex align-items-center justify-content-center' :(props.currentUser.user_level_equivalent > 1)}"> 
                        <div class="row" :class="{'form-wrapper align-items-center justify-content-center text-end':(props.currentUser.user_level_equivalent > 1)}">
                            <div class="col-3">
                                <h1 class="text-center"><i class="bi bi-box2-fill" :class="{'big-icon':(props.currentUser.user_level_equivalent > 1)}"></i></h1>
                            </div>
                            <div class="col-9">
                                <div class="row">
                                    <h5 :class="{'big-font':(props.currentUser.user_level_equivalent > 1)}">Out Of Stock Products</h5>
                                </div>
                                <div class="row">
                                    <h5 :class="{'big-font':(props.currentUser.user_level_equivalent > 1)}">{{data.out_of_stock_count}}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div :class="{'col-xl-6 height-adjust ': (props.currentUser.user_level_equivalent > 1), 'col-xl-3': (props.currentUser.user_level_equivalent <= 1)} ">
                    <div class=" bord m-3 p-3 most" :class="{'h-75 d-flex align-items-center justify-content-center' :(props.currentUser.user_level_equivalent > 1)}"> 
                         <div class="row" :class="{'form-wrapper align-items-center justify-content-center text-end':(props.currentUser.user_level_equivalent > 1)}" >
                            <div class="col-3">
                                <h1 class="text-center"><i class="bi bi-box2-fill " :class="{'big-icon':(props.currentUser.user_level_equivalent > 1)}"></i></h1>
                            </div>
                            <div class="col-9">
                                <div class="row">
                                    <h5 :class="{'big-font':(props.currentUser.user_level_equivalent > 1)}">Most Stock Products</h5>
                                </div>
                                <div class="row">
                                    <h5 :class="{'big-font':(props.currentUser.user_level_equivalent > 1)}">{{data.most_stock_product_count}}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div :class="{'row text-center': (props.currentUser.user_level_equivalent <= 1), 'collapse': (props.currentUser.user_level_equivalent > 1)}">
                <div class="col-lg-8">
                    <div class="m-3 p-3 bord">
                        <h2>Recent Requests</h2>
                        <div class="table-responsive">
                            <table class="table table-hovered text-start">
                                <thead>
                                    <th>Reference No.</th>
                                    <th>Requested By</th>
                                    <th>Quantity</th>
                                    <th>Product</th>
                                    <th>Date Requested</th>
                                </thead>
                                <tbody>
                                    <tr v-for="req in reqs" :key="req.request_id">
                                        <td>{{req.get_inventory_name}}</td>
                                        <td>{{req.get_user_name}}</td>
                                        <td>{{req.quantity}}</td>
                                        <td>{{req.get_product_name}}</td>
                                        <td>{{translateDate(req.request_date)}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="m-3 p-3 bord">
                        <h2>Recent Products</h2>
                        <div class="table-responsive">
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

.big-icon{
    font-size: 7rem;
}

.big-font{
    font-size: 3rem;
}

 .height-adjust{
     height: 400px;
 }

 @media screen and (max-width: 1200px) {
    .height-adjust{
        height: 200px;
    }

    .big-icon{
        font-size: 5rem;
    }

    .big-font{
        font-size: 2rem;
    }
 }

 @media screen and (max-width: 470px){

     .big-icon{
        font-size: 3rem;
    }

     .big-font{
        font-size: 1rem;
    }
 }
</style>