<script lang="ts">
import { userToken } from '@/stores/token'
import axios from 'axios'
import { defineComponent,onMounted,ref, watch } from 'vue'

import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

import moment from 'moment';

export default defineComponent({
    props:['currentUser'],
    setup(props) {
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
                console.log(res.data)
            })
        }

        function generateReport(){
            var pdf = new jsPDF({
                orientation: "landscape",
                unit: "in",
                format: [8, 11.5]
            })
            
            let quarters = [
                '',
                '1st Quarter',
                '2nd Quarter',
                '3rd Quarter',
                '4th Quarter'
            ]

            let columns = [
                { header: 'Name', dataKey: 'name' },
                { header: 'Measuring Name', dataKey: 'measuring_name' },
                { header: 'Category', dataKey: 'category' },
                { header: 'Unit Cost', dataKey: 'unit_cost' },
                { header: 'Quarterly Total Request', dataKey: 'quarterly_request' },
                { header: 'Quarterly Total Cost', dataKey: 'quarterly_cost' }
            ]

            let rows = data.value.products.map((d:any)=>({
                name: d.name,
                measuring_name : d.measuring_name,
                category : d.get_category_name,
                unit_cost: 'PHP ' + d.selling_price,
                quarterly_request: d.quarterly_total,
                quarterly_cost : d.quarterly_total_cost
            }))

            pdf.text('Quarterly Report for ' + quarters[parseInt(quarter.value)] + ' of ' + year.value, 0.4, 0.4)
            autoTable(pdf,{body: rows, columns: columns, showHead:'everyPage'})
            pdf.save(year.value + ' ' + quarter.value + ' : Generated at - ' + moment().format('LLLL'))
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
            quarter, year, data, generateReport
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
                    <div class="col">
                        <button class="btn btn-info" @click="generateReport">Generate PDF</button>
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
                            <td v-if="product.quarterly_total > 0">{{product.name}}</td>
                            <td v-if="product.quarterly_total > 0">{{product.measuring_name}}</td>
                            <td v-if="product.quarterly_total > 0">{{product.get_category_name}}</td>
                            <td v-if="product.quarterly_total > 0">PHP {{product.selling_price}}</td>
                            <td v-if="product.quarterly_total > 0">{{product.quarterly_total}}</td>
                            <td v-if="product.quarterly_total > 0">PHP {{product.quarterly_total_cost}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
