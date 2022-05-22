<script lang="ts">
import { defineComponent} from 'vue'
import { userToken } from '@/stores/token'
import axios from 'axios'
import Swal from 'sweetalert2'

export default defineComponent({
    setup(){
        const store = userToken()

        return{
            store
        }
    },
    data(){
        return{
            username: '',
            password: ''
        }
    },
    methods:{
        login(){
            axios.post('v1/api-token-auth/',{
                username: this.username, password: this.password
            }).then((res)=>{
                this.store.login(res.data);
                Swal.fire({title: 'Welcome!'})
                this.$router.push({name: 'dashboard'})
            })
        }
    }
})
</script>


<template>
    <div class="row">
        <div class="col-md-4">
            
        </div>
        <div class="col-md-4 p-5">
            <div class="bord p-4">
                <div class="text-center">
                    <h1>Login Panel</h1>
                    <p>Inventory Management System</p>
                </div>
                <form method="post" @submit.prevent="login">
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" v-model="username" placeholder="name@example.com" name="username" autocomplete="off">
                        <label for="floatingInput">Username</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" v-model="password" placeholder="name@example.com" name="password">
                        <label for="floatingInput">Password</label>
                    </div>
                    <div class="d-grid gap-2 pt-3">
                        <button class="btn btn-outline-danger" type="submit">Log In</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="col-md-4">

        </div>
    </div>
</template>