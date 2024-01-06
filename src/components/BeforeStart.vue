<template>
    <div class="layout-demo">
        <a-layout style="height: 100%;">
      <a-layout-header></a-layout-header>
      <a-layout-content><div>
        <a-row class="grid-demo">
        <a-col :span="16" :offset="4">
            <a-card title="被试信息">
        <!-- <template #extra>
            <a-link>More</a-link>
        </template> -->
        <a-form :style="{marginTop:'20px',width:'90%'}" id="loginform" :model="form" :layout="layout">
      <a-form-item field="name" label="姓名">
        <a-input v-model="form.name" placeholder="请输入您的姓名..." />
      </a-form-item>
      <a-form-item field="post" label="年龄">
        <a-input-number v-model="form.age" placeholder="年龄" :min="18" :max="50"/>
      </a-form-item>
      <a-form-item field="name" label="身份证">
        <a-input v-model="form.idcard" placeholder="请输入中国大陆身份证号码（我们将严格保密）"/>
      </a-form-item>
      <a-form-item field="name" label="手机">
        <a-input v-model="form.phone" placeholder="请输入您的手机号..."/>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="sendDataToParent">让我们开始吧</a-button>
      </a-form-item>
    </a-form>
        
        </a-card>
        </a-col>
      </a-row>
            
      <a-modal v-model:visible="policyVisible" @ok="handleOk" @cancel="handleCancel" ok-text="继续" cancel-text="取消">
    <template #title>
      注意事项
    </template>
    <div>xxx</div>
  </a-modal>
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
   const layout = ref('horizontal')
    const form = reactive({
      name: '',
      age:18,
      idcard:"",
      phone:""
    })

   const emit = getCurrentInstance().emit;
   const appContext =  getCurrentInstance().appContext;
   const sendDataToParent = () => {
    policyVisible.value=true;
      // 传递数据到父组件

    };
    const policyVisible = ref(false);

    const handleOk = () => {
      document.documentElement.requestFullscreen()
        policyVisible.value = false;
      window.experimentee = form;
      emit('button-clicked', true);
    };
    const handleCancel = () => {
        appContext.config.globalProperties.$message.warning('您必须阅读并同意注意事项后才能继续')
     policyVisible.value = false;
    }
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
   