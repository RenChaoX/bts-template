<template>
  <HelloWorld></HelloWorld>
</template>

<script setup>
import { onMounted, onBeforeMount, getCurrentInstance, ref } from "vue";
import HelloWorld from './components/HelloWorld'

onMounted(() => {
  console.log('onMounted')
})
</script>

<style lang="css">

</style>
