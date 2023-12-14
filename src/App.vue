<script setup>
import HelloWorld from './components/HelloWorld.vue'
import PsychMain from './components/PsychMain.vue'
import webgazer from 'webgazer'
window.webgazer = webgazer
console.log("ok!!!!!!!",webgazer)
</script>

<template>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <PsychMain class="main-wrapper"/>
</template>

<style scoped>
.main-wrapper {
  width: 100%;
  height: 100%;
}
</style>
