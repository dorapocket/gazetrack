<script setup>
import { provide, reactive,ref } from 'vue';
import PsychMain from './components/PsychMain.vue'
// import webgazer from 'webgazer'
// window.webgazer = webgazer
// console.log("ok!!!!!!!",webgazer)
// const haha = ref({a:1})
// setInterval(()=>{haha.value={a:haha.value.a+1}},1000)
// provide("haha",haha)
</script>

<template>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <PsychMain class="main-wrapper"/>
</template>

<style>
.main-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
