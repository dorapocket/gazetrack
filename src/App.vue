<script setup>
import { provide, reactive,ref } from 'vue';
import PsychMain from './components/PsychMain.vue'
import webgazer from '../WebGazer/src/index.mjs'
// window.eyegaze_enable=false

if(window.eyegaze_enable){
  window.webgazer = webgazer
  console.log("ok!!!!!!!",webgazer)
}
</script>

<template>
  <PsychMain class="main-wrapper"/>
</template>

<style>
.main-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
