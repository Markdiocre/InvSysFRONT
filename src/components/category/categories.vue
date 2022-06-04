<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import axios from 'axios'
import { userToken } from '@/stores/token'
import Swal from 'sweetalert2'

export default defineComponent({
    props:['currentUser'],
    setup() {
        const store = userToken()

        let page = ref({} as any)

        function getCategories(){
            axios.get('v1/category/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                page.value = res.data
            })
        }

        function deleteCategory(id: any){
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete('v1/category/'+id+'/',{
                        headers:{
                            Authorization: 'token '+ store.getToken.token
                        }
                    }).then(()=>{
                        Swal.fire(
                            {
                            icon: 'success',
                            title: 'Success!',
                            text:'Category successfully deleted!'
                            }
                        )
                        getCategories()
                    }).catch(()=>{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                        })
                    })
                    
                }
            })
            
        }

        function flipPage(url : any){
            axios.get(url,{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                page.value = res.data
            })
        }

        onMounted(()=>{
            getCategories()
        })

        return{
            store,
            page,
            deleteCategory,
            flipPage
        }
    }
})
</script>


<template>
    <div class="container-fluid">
        <div class="bord m-3">
            <div class="d-flex justify-content-between">
                <h3 class="py-4 ps-4">Categories</h3>
                <router-link :to="{name: 'addCategory'}" class="btn btn-info m-4 p-2">Add New Categories</router-link>
            </div>
            <div class="container-fluid p-3 text-center table-responsive">
                <table class="table table-hover ">
                    <thead>
                        <th>Name</th>
                        <th>Actions</th>
                    </thead>
                    <tbody>
                        <tr v-for="category in page.results" :key="category.category_id">
                            <td>{{category.name}}</td>
                            <td><router-link :to="{name: 'editCategory', params:{ id: category.category_id} }" class="btn btn-warning me-1"><i class="bi bi-pencil-square"></i>Edit</router-link><button class="btn btn-danger" @click="deleteCategory(category.category_id)"><i class="bi bi-trash3-fill"></i>Delete</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <nav>
                <ul class="pagination p-3">
                    <li class="page-item" :class="{'disabled':(page.previous == null)}"><button class="page-link" @click="flipPage(page.previous)">Previous</button></li>
                    <li class="page-item" :class="{'disabled':(page.next == null)}"><button class="page-link" @click="flipPage(page.next)">Next</button></li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<style scoped>
    a{
        color: white !important;
    }
</style>