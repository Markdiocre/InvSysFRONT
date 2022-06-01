<script lang="ts">
import { userToken } from '@/stores/token'
import axios from 'axios'
import Swal from 'sweetalert2'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
    setup() {
        const store = userToken()
        const router = useRouter()
        
        let current_password = ref('')
        let new_password = ref('')
        let re_new_password = ref('')

        function changePass(){
            axios.post('v1/auth/users/set_password/',{
                current_password: current_password.value,
                new_password: new_password.value,
                re_new_password: re_new_password.value
            },{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then(()=>{
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User password have been successfully updated!'
                })
                router.push({name: "profile"})
            }).catch((err)=>{
                console.log(err)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Please double check your passwords',
                })
            })
        }

        return{
            current_password,
            new_password,
            re_new_password,
            changePass
        }
    },
})
</script>


<template>
    <div class="container-fluid">
        <div class="row mt-5">
            <div class="col-md-2">
            </div>
            <div class="col-md-8 bord p-5">
                <h3 class="text-center">Edit Account</h3>
                <form method="post" @submit.prevent="changePass">
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" v-model="current_password">
                        <label for="floatingInput">Current Password</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" v-model="new_password">
                        <label for="floatingInput">New Password</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" v-model="re_new_password">
                        <label for="floatingInput">Re-type New Password</label>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="d-grid gap-2">
                                <button class="btn btn-info" type="submit">Update</button>
                            </div>
                        </div>
                    </div>
                    
                </form>
            </div>
            <div class="col-md-2">
            </div>
        </div>
    </div>
</template>

<style scoped>
    button{
        color: white !important;
    }
</style>