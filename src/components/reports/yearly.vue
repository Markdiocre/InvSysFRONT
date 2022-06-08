<script lang="ts">
import { userToken } from '@/stores/token'
import axios from 'axios'
import { defineComponent,onMounted,ref, watch } from 'vue'

import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

import moment from 'moment';

export default defineComponent({
    setup() {
        const store = userToken()

        let data = ref({} as any)
        let year = ref(2022)


        function getReport(){
            axios.post('v1/yearly/',{
                year: year.value,
            },{
                headers: {
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                data.value = res.data
            })
        }

        function generateReport(){
            var pdf = new jsPDF({
                orientation: "landscape",
                unit: "in",
                format: [8, 11.5]
            })

            let columns = [
                { header: 'Name', dataKey: 'name' },
                { header: 'Measuring Name', dataKey: 'measuring_name' },
                { header: 'Category', dataKey: 'category' },
                { header: 'Unit Cost', dataKey: 'unit_cost' },
                { header: 'Yearly Total Request', dataKey: 'yearly_request' },
                { header: 'Yearly Total Cost', dataKey: 'yearly_cost' }
            ]

            let rows = data.value.products.map((d:any)=>({
                name: d.name,
                measuring_name : d.measuring_name,
                category : d.get_category_name,
                unit_cost: 'PHP ' + d.selling_price,
                yearly_request: d.yearly_total,
                yearly_cost : 'PHP' + d.yearly_total_cost

            }))

            pdf.text('Yearly Report for the Year ' + year.value, 0.4, 0.4)
            autoTable(pdf,{body: rows, columns: columns, showHead:'everyPage'})
            pdf.save(year.value + ' : Generated at - ' + moment().format('LLLL'))
        }

        watch(()=>year.value,()=>{
            getReport()
        })

        onMounted(()=>{
            getReport()
        })

        return{
            year, data, generateReport
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
                        <th>Yearly Total Request</th>
                        <th>Yearly Total Cost</th>
                    </thead>
                    <tbody>
                        <tr v-for="product in  data.products" :key="product.product_id">
                            <td>{{product.name}}</td>
                            <td>{{product.measuring_name}}</td>
                            <td>{{product.get_category_name}}</td>
                            <td>PHP {{product.selling_price}}</td>
                            <td>{{product.yearly_total}}</td>
                            <td>PHP {{product.yearly_total_cost}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
