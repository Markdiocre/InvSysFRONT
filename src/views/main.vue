<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { RouterView, RouterLink, onBeforeRouteUpdate, useRouter } from 'vue-router'
import { userToken } from '@/stores/token'
import axios from 'axios'
import Swal from 'sweetalert2'
import moment from 'moment'

export default defineComponent({
    components:{
        RouterView,
        RouterLink
    },
    setup(){
        const store = userToken()
        const router = useRouter()

        let currentUser = ref({} as any)
        let sideBarActive = ref(false)

        onBeforeRouteUpdate(()=>{
            if(store.getAuthStatus == false){
                Swal.fire('You\'re not authenticated! Please Log in first!')
                router.push({name: 'login'})
            }
        })


        onMounted(()=>{
            axios.get('v1/auth/users/me/',{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then((res)=>{
                currentUser.value = res.data
            }).catch((err)=>{
                console.log(err)
            })
        })

        function logout(){
            axios.post('v1/auth/token/logout/', store.getToken.token,{
                headers:{
                    Authorization: 'token '+ store.getToken.token
                }
            }).then(()=>{
                Swal.fire({
                    title: 'Logged out!'
                })
                router.push({name:'login'})
                store.logout
            })
        }

        function toggleSideBar(){
            sideBarActive.value = !sideBarActive.value
        }

        function getTime(){
            return moment().format('MMMM Do YYYY, h:mm:ss a')
        }
        return{
            store,
            currentUser,
            sideBarActive,
            logout,
            toggleSideBar,
            getTime
        }
    },

})
</script>


<template>
    <div class="wrapper">
        <div id="sidebar" :class="{'active': sideBarActive}">
            <h1 class="sidebar-header text-center h1">Inventory Management System</h1>
            <ul class="list-unstyled components">
                <li>
                    <router-link :to="{ name:'dashboard'}">Dashboard</router-link>
                </li>
                <div v-if="currentUser.user_level_equivalent <= 1">
                    <li>
                        <a href="#UserManagement" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle">User Management</a>
                        <ul class="collapse list-unstyled" id="UserManagement">
                            <li><router-link :to="{name:'userGroup'}">Manage User Groups</router-link></li>
                            <li><router-link :to="{name:'viewUser'}">Manage Users</router-link></li>
                        </ul>
                    </li>
                </div>
                <li v-if="currentUser.user_level_equivalent <= 1">
                    <router-link :to="{name:'viewCategories'}">Categories</router-link>
                </li>
                <li v-if="currentUser.user_level_equivalent <= 1">
                    <router-link :to="{name:'viewProduct'}">Products</router-link>
                </li>
                <li>
                    <router-link :to="{name:'viewBatch'}">Inventory</router-link>
                </li>
                <li>
                    <a href="#Request" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle">Request</a>
                    <ul class="collapse list-unstyled" id="Request">
                        <li v-if="currentUser.user_level_equivalent <= 1"><router-link :to="{name:'allRequest'}">All Requests</router-link></li>
                        <li><router-link :to="{name:'selfRequest'}">Your Requests</router-link></li>
                    </ul>
                </li>
                <li>
                    <a href="#Report" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle">Reports</a>
                    <ul class="collapse list-unstyled" id="Report">
                        <li><router-link :to="{name:'monthly'}">Monthly Report</router-link></li>
                        <li><router-link :to="{name:'quarterly'}">Quarterly Report</router-link></li>
                        <li><router-link :to="{name:'yearly'}">Yearly Report</router-link></li>
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
                                    <li><router-link :to="{name:'profile'}" class="dropdown-item"><i class="bi bi-person-fill pe-1"></i>Profile</router-link></li>
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