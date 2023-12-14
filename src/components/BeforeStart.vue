<template>
    <h1>Welcome</h1>
    <div>
       <b>Before We Start:</b>
       <p>xxxxxxxxxxxxxxxxxxxxxxxx</p>
       <p>xxxxxxxxxxxxxxxxxxxxxxxx</p>
       <p>xxxxxxxxxxxxxxxxxxxxxxxx</p>
       <p>xxxxxxxxxxxxxxxxxxxxxxxx</p>
       <p>xxxxxxxxxxxxxxxxxxxxxxxx</p>
    </div>
    <button @click="sendDataToParent">Let's Start</button>
   </template>
   
   <script setup>
   import { ref,getCurrentInstance } from 'vue'
   import BeforeStart from './BeforeStart.vue'
   // defineProps({
   //   msg: String,
   // })
   const emit = getCurrentInstance().emit;
   const sendDataToParent = () => {
      // 传递数据到父组件
      emit('button-clicked', '你好，父组件！');
    };
   </script>
   
   
   <style scoped>
   
   </style>
   