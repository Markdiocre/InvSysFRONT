<script lang="ts">
import { userToken } from '@/stores/token'
import axios from 'axios'
import { computed, defineComponent,onMounted,ref, watch } from 'vue'

import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

import moment from 'moment';

export default defineComponent({
    props:['currentUser'],
    setup(props) {
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

        function generateReport(){
            var pdf = new jsPDF({
                orientation: "landscape",
                unit: "in",
                format: [8, 11.5]
            })
            
            let months = [
                '',
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ]

            let columns = [
                { header: 'Name', dataKey: 'name' },
                { header: 'Measuring Name', dataKey: 'measuring_name' },
                { header: 'Category', dataKey: 'category' },
                { header: 'Unit Cost', dataKey: 'unit_cost' },
                { header: 'Monthly Total Request', dataKey: 'month_request' },
                { header: 'Monthly Total Cost', dataKey: 'month_cost' }
            ]

            let rows = data.value.products.map((d:any)=>({
                name: d.name,
                measuring_name : d.measuring_name,
                category : d.get_category_name,
                unit_cost: 'PHP ' + d.selling_price,
                month_request: d.monthly_total,
                month_cost : d.monthly_total_cost

            }))

            pdf.text('Monthly Report for ' + months[month.value] + ' of ' + year.value, 0.4, 0.4)
            autoTable(pdf,{body: rows, columns: columns, showHead:'everyPage'})
            pdf.save(year.value + ' ' + month.value + ' : Generated at - ' + moment().format('LLLL'))
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
            month, year, data, generateReport
        }
    },
})
</script>

<template>
    <div class="container-fluid">
        <div class="bord m-3">
            <div class="d-flex justify-content-between" >
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
                    <div class="col">
                        <button class="btn btn-info" @click="generateReport">Generate PDF</button>
                    </div>
                </div>
            </div>
            <div class="table-responsive m-3">
                <table class="table table-hover table-bordered " id="report">
                    <thead>
                        <th>Name</th>
                        <th>Measuring Name</th>
                        <th>Category</th>
                        <th>Unit Cost</th>
                        <th>Monthly Total Request</th>
                        <th>Monthly Total Cost</th>
                    </thead>
                    <tbody>
                        <tr v-for="product in data.products" :key="product.product_id">
                            <td v-if="product.monthly_total > 0">{{product.name}}</td>
                            <td v-if="product.monthly_total > 0">{{product.measuring_name}}</td>
                            <td v-if="product.monthly_total > 0">{{product.get_category_name}}</td>
                            <td v-if="product.monthly_total > 0">PHP {{product.selling_price}}</td>
                            <td v-if="product.monthly_total > 0">{{product.monthly_total}}</td>
                            <td v-if="product.monthly_total > 0">PHP {{product.monthly_total_cost}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
