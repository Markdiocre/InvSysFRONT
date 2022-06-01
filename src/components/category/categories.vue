<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import axios from 'axios'
import { userToken } from '@/stores/token'
import Swal from 'sweetalert2'

export default defineComponent({
    props:['currentUser'],
    setup() {
        const store = userToken()

        let categories = ref({} as any)

        function getCategories(){
            axios.get('v1/category/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                categories.value = res.data
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

        onMounted(()=>{
            getCategories()
        })

        return{
            store,
            categories,
            getCategories,
            deleteCategory
        }
    }
})
</script>


<template>
    <div class="container-fluid">
        <div class="bord m-3">
            <div class="d-flex justify-content-between">
                <h3 class="p-4">Categories</h3>
                <router-link :to="{name: 'addCategory'}" class="btn btn-info m-4 p-2" v-if="$props.currentUser.user_level_equivalent <= 1">Add New Categories</router-link>
            </div>
            <div class="container-fluid p-3 text-center table-responsive">
                <table class="table table-hover ">
                    <thead>
                        <th>Name</th>
                        <th v-if="$props.currentUser.user_level_equivalent <= 1">Actions</th>
                    </thead>
                    <tbody>
                        <tr v-for="category in categories" :key="category.category_id">
                            <td>{{category.name}}</td>
                            <td v-if="$props.currentUser.user_level_equivalent <= 1"><router-link :to="{name: 'editCategory', params:{ id: category.category_id} }" class="btn btn-warning me-1"><i class="bi bi-pencil-square"></i>Edit</router-link><button class="btn btn-danger" @click="deleteCategory(category.category_id)"><i class="bi bi-trash3-fill"></i>Delete</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
    button,a{
        color: white !important;
    }
</style>