<template>
   <div class="layout-demo">
       <a-layout style="height: 100%;">
     <a-layout-header></a-layout-header>
     <a-layout-content><div>
       <a-row class="grid-demo">
       <a-col :span="16" :offset="4">
           <a-card title="注意事项">
            欢迎参与本次实验，接下来您将会看见左右呈现的两幅真实场景的图片，你需要在60s内找出两幅图片中的一处不同。在图片展示之前，您需要盯紧屏幕中央的十字注视点。您可以利用鼠标辅助搜索，在任何图片中左击选中的物体，如果错误则不会有任何反应，如果正确则出现绿色圆圈并进入下一题。 请<b>尽量用鼠标移动代表眼睛注视点辅助寻找。</b>
            <div style="color:red;font-weight: 700;margin-top:20px;">接下来是一张样例</div>
       <!-- <template #extra>
           <a-link>More</a-link>
       </template> -->
       <div style="margin-top:40px">       <a-button @click="handleOk" type="primary">开始</a-button></div>

       
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
  