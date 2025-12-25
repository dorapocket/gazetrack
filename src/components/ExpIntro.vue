<template>
   <div class="layout-demo">
       <a-layout style="height: 100%;">
     <a-layout-header></a-layout-header>
     <a-layout-content><div>
       <a-row class="grid-demo">
       <a-col :span="16" :offset="4">
           <a-card title="Instructions">
            Welcome to this experiment. You will see two real-world scene images presented side by side, and you must find one difference within 60 seconds. Before the images appear, please fixate on the cross at the center of the screen. You may use the mouse to assist your search—left click on the object you select in either image. If it is incorrect, nothing will happen; if it is correct, a green circle will appear and you will advance to the next trial. Please <b>use the mouse to move the gaze point indicator while searching.</b>
            <div style="color:red;font-weight: 700;margin-top:20px;">Next is a sample image.</div>
       <!-- <template #extra>
           <a-link>More</a-link>
       </template> -->
       <div style="margin-top:40px">       <a-button @click="handleOk" type="primary">Start</a-button></div>

       
       </a-card>
       </a-col>
     </a-row>
           
   </div></a-layout-content>
     <a-layout-footer></a-layout-footer>
   </a-layout>
   </div>
  
   
  </template>
  
  <script setup>
  import { ref,getCurrentInstance } from 'vue'
  // defineProps({
  //   msg: String,
  // })

  const emit = getCurrentInstance().emit;
  const appContext =  getCurrentInstance().appContext;
  const sendDataToParent = () => {
   policyVisible.value=true;
     // Pass data to parent

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
  
