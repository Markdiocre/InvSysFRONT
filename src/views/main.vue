<script lang="ts">
import { defineComponent } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { userProfile } from '@/stores/userProfile'

export default defineComponent({
    setup(){
        const store = userProfile()
        return{
            store
        }
    },
    components:{
        RouterView,
        RouterLink
    },
    data(){
        return {
            currentUser : {} as any
        }
    },
    mounted(){
        this.currentUser = this.store.getUser
    }
})
</script>


<template>
    <div class="wrapper">
        <div id="sidebar">
            <h1 class="sidebar-header text-center">Inventory System</h1>
            <ul class="list-unstyled components">
                <li>
                    <router-link :to="{ name:'dashboard'}">Dashboard</router-link>
                </li>
                <li>
                    <a href="#UserManagement" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle">User Management</a>
                    <ul class="collapse list-unstyled" id="UserManagement">
                        <li><a href="#">Manage User Groups</a></li>
                        <li><a href="">Manage Users</a></li>
                    </ul>
                </li>
                <li>
                    <a href="view_categories.php">Categories</a>
                </li>
                <li>
                    <a href="#ProductManagement" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle">Products</a>
                    <ul class="collapse list-unstyled" id="ProductManagement">
                        <li><a href="#">Manage Products</a></li>
                        <li><a href="#">Add Products</a></li>
                    </ul>
                </li>
            </ul>
        </div>
        <div id="content">
            <nav class="navbar navbar-expand-lg navbar-light bg-light rounded-pill">
                <div class="container-fluid">
                    <button type="button" id="sideCol" class="btn rounded-circle"><i class="bi bi-list"></i></button>
                    <div>
                        Sheeeesh
                    </div>
                    <div>
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle active rounded-pill" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {{currentUser.name}}
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <li><a class="dropdown-item" href="edit_account.php"><i class="bi bi-gear-fill pe-1"></i>Settings</a></li>
                                    <li><router-link class="dropdown-item" :to="{name: 'login'}"><i class="bi bi-box-arrow-in-right pe-1"></i>Log Out</router-link></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div class="container-fluid">
                <router-view :current-user="currentUser"></router-view>
            </div>
        </div>
    </div>
</template>