<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { userToken } from '@/stores/token'
import { useRouter,useRoute } from 'vue-router'

export default defineComponent({
    props:['currentUser'],
    setup() {
        const store = userToken()
        const router =useRouter()
        const route = useRoute()

        let category = ref({} as any)

        function getCategory(){
            axios.get('v1/category/'+ route.params.id+'/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                category.value = res.data
            })
        }

        function putCategory(){
            axios.put('v1/category/'+ route.params.id+'/',{
                name: category.value.name,

            },{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Category have been successfully updated!'
                })
                router.push({name: 'viewCategories'})
            }).catch((err)=>{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
            })
        }

        onMounted(()=>{
            getCategory()
        })

        return{
            category, getCategory, putCategory
        }
    },
})
</script>


<template>
    <div class="row m-5">
        <div class="col-md-4"></div>
        <div class="col-md-4 bord">
            <h3 class="text-center p-3">Edit Category</h3>
            <form method="post" class="p-3" @submit.prevent="putCategory">
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" autocomplete="off" v-model="category.name" required>
                    <label for="floatingInput">Category Name</label>
                </div>
                <div class="d-grid gap-2">
                    <button class="btn btn-primary" type="submit">Edit Category</button>
                </div>
            </form>
        </div>
        <div class="col-md-4"></div>
    </div>
</template>