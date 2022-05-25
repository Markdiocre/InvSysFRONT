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
  <router-view></router-view>
</template>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Poppins&display=swap');
  @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.2/font/bootstrap-icons.css");

  body{
      font-family: 'Poppins', sans-serif !important;
      background-color: #8DBDFF !important
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
  

  
</style>
