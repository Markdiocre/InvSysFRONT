<script lang="ts">
import { defineComponent } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { userToken } from '@/stores/token'
import axios from 'axios'
import Swal from 'sweetalert2'
import moment from 'moment'

export default defineComponent({
    setup(){
        const store = userToken()
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
            currentUser : {} as any,
            sideBarActive: false
        }
    },
    methods:{
        logout(){
            axios.post('v1/auth/token/logout/',this.store.getToken.token,{
                headers:{
                    Authorization: 'token '+this.store.getToken.token
                }
            }).then(()=>{
                Swal.fire({
                    title: 'Logged out!'
                })
                this.$router.push({name:'login'})
                this.store.logout
            })
        },
        toggleSideBar(){
            this.sideBarActive = !this.sideBarActive
        },
        getTime(){
            return moment().format('MMMM Do YYYY, h:mm:ss a')
        }
    },
    mounted(){
        axios.get('v1/auth/users/me/',{
            headers:{
                Authorization: 'token '+this.store.getToken.token
            }
        }).then((res)=>{
            this.currentUser = res.data
        }).catch((err)=>{
            console.log(err)
        })
        
    }
})
</script>


<template>
    <div class="wrapper">
        <div id="sidebar" :class="{'active': sideBarActive}">
            <h1 class="sidebar-header text-center">Inventory System</h1>
            <ul class="list-unstyled components">
                <li>
                    <router-link :to="{ name:'dashboard'}">Dashboard</router-link>
                </li>
                <div v-if="currentUser.user_level <= 1">
                    <li>
                        <a href="#UserManagement" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle">User Management</a>
                        <ul class="collapse list-unstyled" id="UserManagement">
                            <li><router-link :to="{name:'userGroup'}">Manage User Groups</router-link></li>
                            <li><router-link :to="{name:'viewUser'}">Manage Users</router-link></li>
                        </ul>
                    </li>
                </div>
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
                    <button @click="toggleSideBar" type="button" id="sideCol" class="btn rounded-circle"><i class="bi bi-list"></i></button>
                    <div>
                        {{getTime()}}
                    </div>
                    <div>
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle active rounded-pill" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {{currentUser.name}}
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <li><a class="dropdown-item" href="edit_account.php"><i class="bi bi-gear-fill pe-1"></i>Settings</a></li>
                                    <li><button class="dropdown-item" @click="logout"><i class="bi bi-box-arrow-in-right pe-1"></i>Log Out</button></li>
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

<style scoped>
    #sidebar{
      min-width: 250px !important;
      max-width: 250px !important;
      background: #035397 !important;
      transition: all 0.3s !important;
      color: white !important;
  }

  #sidebar.active{
      margin-left: -250px !important;
  }

  #sidebar .sidebar-header{
      padding: 20px !important; 
      font-family: 'Anton', sans-serif !important;
  }

  #sidebar ul.components{
      padding: 20px 0px !important;
      border-bottom: 1px solid !important;
  }

  #sidebar ul li a{
      font-size: 1.1em !important;
      display: block !important;
      padding: 10px !important;
  }

  #sidebar ul li a:hover{
      color: white !important;
      background: #5089C6 !important;
  }

  #sidebar ul li.active>a,
      a[aria-expanded="true"]{
          color: white !important;
          background: #5089C6 !important;
      }

  #sidebar a[data-bs-toggle="collapse"]{
      position: relative !important;
  }

  #sidebar .dropdown-toggle::after{
      display: block !important;
      position: absolute !important;
      top: 50% !important;
      right:20% !important;
      transform: translateY(-50%);
  }

  #sidebar ul ul a{
      font-size: 0.9em !important ;
      padding-left: 30px !important;
      background: #FFAA4C !important;
  }
  #content{
      width: 100% !important;
      padding: 20px !important;
      min-height: 100vh !important;
      transition: all 3.0s !important;
  }

  @media(max-width: 768px){
      #sidebar{
          margin-left: -250px !important;
      }

      #sidebar.active{
          margin-left: 0px !important;
      }

      #sideCol span{
          display:none !important;
      }
  }
</style>