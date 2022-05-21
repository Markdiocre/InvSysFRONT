<script lang="ts">
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
export default defineComponent({
  components:{
    RouterView
  }
})
</script>



<template>
  <router-view/>
</template>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Poppins&display=swap');

  body{
      font-family: 'Poppins', sans-serif !important;
      background-color: #8DBDFF !important;
  }

  a,a:hover,a:focus{
      color:inherit !important;
      text-decoration: none !important;
      transition: all 03s !important;
  }

  .bord{
      background: white !important;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important;
  }

  .wrapper{
      display: flex !important;
      
      transition: all 0.3s !important;
  }
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

  @import'~bootstrap/dist/css/bootstrap.css'
</style>
