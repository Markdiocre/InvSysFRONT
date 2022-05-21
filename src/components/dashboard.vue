<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props:['currentUser']
})
</script>


<template>
    <h2>{{currentUser.name}}</h2>
</template>