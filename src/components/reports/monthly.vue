<script lang="ts">
import { userToken } from '@/stores/token'
import axios from 'axios'
import { defineComponent,onMounted,ref, watch } from 'vue'

export default defineComponent({
    setup() {
        const store = userToken()

        let data = ref({} as any)
        let year = ref(2022)
        let month = ref(1)


        function getReport(){
            axios.post('v1/monthly/',{
                year: year.value,
                month: month.value
            },{
                headers: {
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                data.value = res.data
            })
        }

        watch(()=>year.value,()=>{
            getReport()
        })

        watch(()=>month.value,()=>{
            getReport()
        })

        onMounted(()=>{
            getReport()
        })

        return{
            month, year, data
        }
    },
})
</script>

<template>
    <div class="container-fluid">
        <div class="bord m-3">
            <div class="d-flex justify-content-between">
                <h3 class="p-4">Monthly Report</h3>
                <div class="m-4 p-2 row">
                    <select class="form-select col" v-model="month">
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                    <div class="col">
                        <input type="number" class="form-control" placeholder="Year" v-model="year">
                    </div>
                </div>
            </div>
            <div class="table-responsive m-3">
                <table class="table table-hover table-bordered " >
                    <thead >
                        <th>Name</th>
                        <th>Measuring Name</th>
                        <th>Category</th>
                        <th>Unit Cost</th>
                        <th>Monthly Total Request</th>
                        <th>Monthly Total Cost</th>
                    </thead>
                    <tbody>
                        <tr v-for="product in  data.products" :key="product.product_id">
                            <td>{{product.name}}</td>
                            <td>{{product.measuring_name}}</td>
                            <td>{{product.get_category_name}}</td>
                            <td>PHP {{product.selling_price}}</td>
                            <td>{{product.monthly_total}}</td>
                            <td>PHP {{product.monthly_total_cost}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
