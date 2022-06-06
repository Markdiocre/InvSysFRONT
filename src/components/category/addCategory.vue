<script lang="ts">
import { userToken } from '@/stores/token'
import axios from 'axios'
import { defineComponent, ref } from 'vue'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

export default defineComponent({
    props:['currentUser'],
    setup() {
        const store = userToken()
        const router = useRouter()

        let name = ref('')

        function addCategory(){
            axios.post('v1/category/',{
                name: name.value
            },{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then(()=>{
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'New Category have been succesfully created!'
                })
                router.push({name:"viewCategories"})
            }).catch(()=>{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
            })
        }

        return{
            name,addCategory
        }
    },
})
</script>


<template>
    <div class="row m-5">
        <div class="col-md-4"></div>
        <div class="col-md-4 bord">
            <h3 class="text-center p-3">Add New Category</h3>
            <form method="post" class="p-3" @submit.prevent="addCategory">
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" autocomplete="off" v-model="name" required> 
                    <label for="floatingInput">Category Name</label>
                </div>
                <div class="d-grid gap-2">
                    <button class="btn btn-primary" type="submit">Add Category</button>
                </div>
            </form>
        </div>
        <div class="col-md-4"></div>
    </div>
</template>