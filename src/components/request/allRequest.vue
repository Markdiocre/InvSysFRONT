<script lang="ts">
import { userToken } from '@/stores/token'
import { defineComponent,onMounted,ref } from 'vue'
import axios from 'axios'
import moment from 'moment'

export default defineComponent({
    props:{
        currentUser: {} as any
    },
    setup(props) {
        const store = userToken()
        
        let requests = ref([] as any)
        let products = ref({} as any)
        let batches = ref({} as any)
        let users = ref({} as any)
        let userGroups = ref({} as any)

        function selfRequest(){
            axios.get('v1/request/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                requests.value = res.data
            })
        }

        function translateDate(date: any){
            return moment(date).format('LLLL')
        }

        function getUsers(){
            axios.get('v1/auth/users/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                users.value = res.data
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

        function getBatches(){
            axios.get('v1/batch/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                batches.value = res.data
            })
        }

        function findProductEquivalent(product: any){
            for(var i = 0; i < products.value.length; i++){
                if(products.value[i].product_id === product ){
                    return products.value[i].name
                }
            }
        }

        function findBatchEquivalent(batch: any){
            for(var i = 0; i < batches.value.length; i++){
                if(batches.value[i].batch_id === batch ){
                    return batches.value[i].batch_name
                }
            }
        }

        function findUserEquivalent(user: any):any{
            console.log(user)
            for(var i = 0; i < users.value.length; i++){
                if(users.value[i].user_id === user ){
                    return {name:users.value[i].name,
                            user_level: users.value[i].user_level
                            }
                }
            }
        }

        function findUserLevelEquivalent(user_level: any){
            for(var i = 0; i < userGroups.value.length; i++){
                if(userGroups.value[i].user_group_id === user_level ){
                    return userGroups.value[i].group_name
                }
            }
        }

        function getUserGroups(){
            axios.get('v1/user-group/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                userGroups.value = res.data
            })
        }

        onMounted(()=>{
            selfRequest()
            getBatches()
            getProducts()
            getUsers()
            getUserGroups()
        })

        return{
            requests, translateDate,findProductEquivalent,findBatchEquivalent, findUserEquivalent,findUserLevelEquivalent
        }

    },
})
</script>


<template>
    <div class="container-fluid">
        <div class="bord m-3">
            <div class="d-flex justify-content-between">
                <h3 class="p-4">All Requests</h3>
            </div>
            <div class="table-responsive m-3 text-center">
                <table class="table table-hover table-bordered">
                    <thead>
                        <th>Batch</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Request Date</th>
                        <th>Requested By</th>
                        <th>Department</th>
                    </thead>
                    <tbody>
                        <tr v-for="request in requests" :key="request.request_id">
                            <td>{{findBatchEquivalent(request.batch)}}</td>
                            <td>{{findProductEquivalent(request.product)}}</td>
                            <td>{{request.quantity}}</td>
                            <td>{{translateDate(request.request_date)}}</td>
                            <td>{{findUserEquivalent(request.user).name}}</td>
                            <td>{{findUserLevelEquivalent(findUserEquivalent(request.user).user_level)}}</td>
                        
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>