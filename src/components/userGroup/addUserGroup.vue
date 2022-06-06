<script lang="ts">
import { userToken } from '@/stores/token'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { defineComponent, ref } from 'vue'
import Swal from 'sweetalert2'

export default defineComponent({
    props:['currentUser'],
    setup() {
        const store = userToken()
        const router = useRouter()
        
        let group_name = ref('')
        let group_level = ref(0)

        function addUserGroup(){
            axios.post('v1/user-group/',{
                group_name: group_name.value,
                group_level: group_level.value
            },{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'New user group have been succesfully created!'
                })
                router.push({name:"userGroup"})
            }).catch((err)=>{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
            })
        }

        return{
            store,
            group_name,
            group_level,
            addUserGroup
        }
    }
})
</script>


<template>
    <div class="row m-5">
        <div class="col-md-4"></div>
        <div class="col-md-4 bord">
            <h3 class="text-center p-3">Add New User Group</h3>
            <form method="post" class="p-3" @submit.prevent="addUserGroup">
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" v-model="group_name" placeholder="name@example.com" name="group_name" autocomplete="off" required>
                    <label for="floatingInput">Group Name</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="number" class="form-control" v-model="group_level" placeholder="name@example.com" name="group_level" min="0" required>
                    <label for="floatingInput">Group Level</label>
                </div>
                <div class="d-grid gap-2">
                    <button class="btn btn-primary" type="submit">Add New User Group</button>
                </div>
            </form>
        </div>
        <div class="col-md-4"></div>
    </div>
</template>