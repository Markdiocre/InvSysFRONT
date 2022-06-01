<script lang="ts">
import { userToken } from '@/stores/token'
import axios from 'axios'
import Swal from 'sweetalert2'
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
    setup() {
        const store = userToken()
        const router = useRouter()

        let self = ref({} as any)

        function getSelf(){
            axios.get('v1/auth/users/me/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                self.value = res.data 
            })
        }

        function updateSelf(){
            axios.patch('v1/auth/users/me/',{
                username: self.value.username,
                name: self.value.name
            },{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then(()=>{
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Account have been successfully updated!'
                })
                router.push({name:"profile"})
            })
        }

        onMounted(()=>{
            getSelf()
        })

        return{
            store,
            self,
            updateSelf
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
                <form method="post" @submit.prevent="updateSelf">
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" v-model="self.name">
                        <label for="floatingInput">Name</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control"  v-model="self.username">
                        <label for="floatingInput">Username</label>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="d-grid gap-2">
                                <button class="btn btn-info" type="submit">Update</button>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="d-grid gap-2">
                                <router-link class="btn btn-danger" :to="{name:'newPassword'}">Change Password</router-link>
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
    button, a{
        color: white !important;
    }
</style>