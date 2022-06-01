<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { userToken } from '@/stores/token'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
    props:['currentUser'],
    setup() {
        const store = userToken()
        const route = useRoute()
        const router = useRouter()

        let userGroup = ref({} as any)

        function getUserGroup(){
            axios.get('v1/user-group/'+ route.params.id+'/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                userGroup.value = res.data
            })
        }

        function putUserGroup(){
            axios.put('v1/user-group/'+ route.params.id+'/',{
                group_name: userGroup.value.group_name,
                group_level: userGroup.value.group_level,
                group_status: userGroup.value.group_status
            },{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User group have been successfully updated!'
                })
                router.push({name: 'userGroup'})
            }).catch((err)=>{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: '<a href="">Why do I have this issue?</a>'
                })
            })
        }

        onMounted(()=>{
            getUserGroup()
        })

        return{
            store,
            userGroup,
            getUserGroup,
            putUserGroup
        }
    }
})
</script>


<template>

    <div class="row m-5">
        <div class="col-md-4"></div>
        <div class="col-md-4 bord">
            <h3 class="text-center p-3">Add New User Group</h3>
            <form method="post" class="p-3" @submit.prevent="putUserGroup">
                <div class="form-floating mb-3">
                    <input type="text" class="form-control"  placeholder="name@example.com" name="group_name" v-model="userGroup.group_name">
                    <label for="floatingInput">Group Name</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="number" class="form-control"  placeholder="name@example.com" name="group_level" min="0" v-model="userGroup.group_level">
                    <label for="floatingInput">Group Level</label>
                </div>
                <select class="form-select" aria-label="Default select example" name="group_status" v-model="userGroup.group_status">
                    <option value="false">Inactive</option>
                    <option value="true">Active</option>
                </select>
                <div class="d-grid gap-2 pt-2">
                    <button class="btn btn-primary" type="submit">Edit User Group</button>
                </div>
            </form>
        </div>
        <div class="col-md-4"></div>
    </div>
</template>