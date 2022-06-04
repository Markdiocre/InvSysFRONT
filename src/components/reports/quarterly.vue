<script lang="ts">
import { userToken } from '@/stores/token'
import axios from 'axios'
import { defineComponent,onMounted,ref, watch } from 'vue'

export default defineComponent({
    setup() {
        const store = userToken()

        let data = ref({} as any)
        let year = ref(2022)
        let quarter = ref('1')


        function getReport(){
            axios.post('v1/quarterly/',{
                year: year.value,
                quarter: quarter.value
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

        watch(()=>quarter.value,()=>{
            getReport()
        })

        onMounted(()=>{
            getReport()
        })

        return{
            quarter, year, data
        }
    },
})
</script>

<template>
    <div class="container-fluid">
        <div class="bord m-3">
            <div class="d-flex justify-content-between">
                <h3 class="p-4">Quarterly Report</h3>
                <div class="m-4 p-2 row">
                    <select class="form-select col" v-model="quarter">
                        <option value="1">1st Quarter ( Jan- Mar )</option>
                        <option value="2">2nd Quarter ( Apr- Jun )</option>
                        <option value="3">3rd Quarter ( Jul- Sept )</option>
                        <option value="4">4th Quarter ( Oct- Dec )</option>
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
                        <th>Quarterly Total Request</th>
                        <th>Quarterly Total Cost</th>
                    </thead>
                    <tbody>
                        <tr v-for="product in  data.products" :key="product.product_id">
                            <td>{{product.name}}</td>
                            <td>{{product.measuring_name}}</td>
                            <td>{{product.get_category_name}}</td>
                            <td>PHP {{product.selling_price}}</td>
                            <td>{{product.quarterly_total}}</td>
                            <td>PHP {{product.quarterly_total_cost}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
