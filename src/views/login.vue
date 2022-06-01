<script lang="ts">
import { defineComponent, ref} from 'vue'
import { userToken } from '@/stores/token'
import axios from 'axios'
import Swal from 'sweetalert2'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'

export default defineComponent({
    setup(){
        const store = userToken()
        const router = useRouter()

        let username = ref('')
        let password = ref('')

        onBeforeRouteUpdate(()=>{
            if(store.getAuthStatus == true){
                Swal.fire('You\'re already authenticated. Redirecting you to main page.')
                router.push({name: 'dashboard'})
            }
        })

        function login(){
            axios.post('v1/api-token-auth/',{
                username: username.value, password: password.value
            }).then((res)=>{
                store.login(res.data);
                Swal.fire({title: 'Welcome!'})
                router.push({name: 'dashboard'})
            }).catch(()=>{
                Swal.fire({
                    icon: 'error',
                    title: 'Credentials Error',
                    text: 'You\'ve provided wrong username or password, or your account doesn\'t exist',
                })
            })
        }

        return{
            store,
            username, 
            password,
            login
        }
    }
})
</script>


<template>
    <div class="container-fluid">
        <div class="row login">
            <div class=" d-flex align-items-center justify-content-center">
                <div class="form-wrapper align-items-center justify-content-center text-center">
                    <h1 class="text-center title pb-5 h1">Inventory Management and Monitoring System</h1>
                    <div class="row">
                        <div class="col-md-6 ">
                            <div class="p-3">

                            
                                <img src="@/assets/loginLogo.png" class="logo img-thumbnail mx-auto  d-block " alt="Login Logo"/>
                            </div>
                        </div>
                        <div class="col-md-6 bord">
                            <div class="d-flex align-items-center justify-content-center pt-5">
                                <div class="align-items-center justify-content-center  pt-5">
                                    <div class="text-center">
                                        <h1>Welcome!</h1>
                                    </div>
                                    <form method="post" @submit.prevent="login">
                                        <div class="input-group pt-3">
                                            <span class="input-group-text icon" for="floatingInput"><i class="bi bi-people-fill m-2 icons"></i></span>
                                            <input type="text" class="form-control form-control-lg" v-model="username"  name="username" autocomplete="off" placeholder="Username">
                                            
                                        </div>
                                        <div class="input-group pt-3">
                                            <span class="input-group-text icon" for="floatingInput"><i class="bi bi-key-fill m-2 icons"></i></span>
                                            <input type="password" class="form-control form-control-lg" v-model="password" name="password" placeholder="Password">
                                            
                                        </div>
                                        <div class="d-grid gap-2 pt-3">
                                            <button class="btn btn-outline-danger btn-lg" type="submit">Log In</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        
    </div>
</template>

<style scoped>
*{
        margin: 0px !important;
        padding: 0px !important;
    }
    .logo{
        width: 500px !important;
        height: 500px !important;
        background-color: transparent;
        border-color: transparent;
    }

    .login{
        max-width: 100% !important;
        min-height: 100vh;
    }

    .loginbord{
        background: white !important;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important;

    }

    .icon{
        background: transparent !important;
        border-right-color: transparent !important;
    }

    .form-control{
        border-left-color: transparent !important;
    }

    .title{
        font-family: 'Anton', sans-serif !important;
        font-size: 3rem;
        color:#315F99;
    }
</style>