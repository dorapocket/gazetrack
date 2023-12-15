<template>
   <div class="layout-demo">
       <a-layout style="height: 100%;">
     <a-layout-header></a-layout-header>
     <a-layout-content><div>
       <a-row class="grid-demo">
       <a-col :span="16" :offset="4">
           <a-card title="注意事项">
            再给爷200块才能继续做
       <!-- <template #extra>
           <a-link>More</a-link>
       </template> -->
       <div style="margin-top:40px">       <a-button @click="handleOk" type="primary">让爷试试</a-button></div>

       
       </a-card>
       </a-col>
     </a-row>
           
   </div></a-layout-content>
     <a-layout-footer></a-layout-footer>
   </a-layout>
   </div>
  
   
  </template>
  
  <script setup>
  import { ref,getCurrentInstance,reactive } from 'vue'
  import BeforeStart from './BeforeStart.vue'
  // defineProps({
  //   msg: String,
  // })

  const emit = getCurrentInstance().emit;
  const appContext =  getCurrentInstance().appContext;
  const sendDataToParent = () => {
   policyVisible.value=true;
     // 传递数据到父组件

   };
   const policyVisible = ref(false);

   const handleOk = () => {
     emit('button-clicked', true);
   };
  </script>
  
  
  <style scoped>
  .layout-demo :deep(.arco-layout-header),
.layout-demo :deep(.arco-layout-footer),
.layout-demo :deep(.arco-layout-sider-children),
.layout-demo :deep(.arco-layout-content) {
 display: flex;
 flex-direction: column;
 justify-content: center;
 color: var(--color-white);
 font-size: 16px;
 font-stretch: condensed;
 text-align: center;
}
.layout-demo {
   height: 100vh;
   width: 100vw;
   overflow: hidden;
}
#loginform {
   margin-top:20px
}
/* .layout-demo :deep(.arco-layout-header),
.layout-demo :deep(.arco-layout-footer) {
 height: 64px;
 background-color: var(--color-primary-light-4);
} */
  </style>
  