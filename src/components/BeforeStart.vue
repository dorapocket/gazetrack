<template>
  <div class="layout-demo">
    <a-layout style="height: 100%;">
      <a-layout-header></a-layout-header>
      <a-layout-content>
        <div>
          <a-row class="grid-demo">
            <a-col :span="16" :offset="4">
              <a-card title="Participant Information">
                <!-- <template #extra>
            <a-link>More</a-link>
        </template> -->
                <a-form :style="{ marginTop: '20px', width: '90%' }" id="loginform" :model="form" :layout="layout">
                  <a-form-item field="post" label="Participant ID" tooltip="Please ask the experimenter for your participant ID.">
                    <a-input-number v-model="form.id" placeholder="Participant ID" :min="1" :max="1000" />
                  </a-form-item>
                  <a-form-item field="name" label="Name">
                    <a-input v-model="form.name" placeholder="Please enter your name..." />
                  </a-form-item>
                  <a-form-item field="post" label="Age">
                    <a-input-number v-model="form.age" placeholder="Age" :min="18" :max="50" />
                  </a-form-item>
                  <a-form-item feedback :help="help_idcard" :validate-status="val_idcard" field="name" label="National ID">
                    <a-input v-model="form.idcard"  @change="idCardChange" placeholder="Please enter your mainland China ID number (for reimbursement only; it will be kept confidential)." />
                  </a-form-item>
                  <a-form-item feedback :help="help_phone" :validate-status="val_phone" field="name" label="Phone">
                    <a-input v-model="form.phone" @change="phoneChange" placeholder="Please enter your phone number..." />
                  </a-form-item>
                  <a-form-item>
                    <a-button type="primary" @click="sendDataToParent">Let's get started</a-button>
                  </a-form-item>
                </a-form>

              </a-card>
            </a-col>
          </a-row>

          <a-modal v-model:visible="policyVisible" @ok="handleOk" @cancel="handleCancel" ok-text="Continue" cancel-text="Cancel">
            <template #title>
              Important Notes
            </template>
            <div>xxx</div>
          </a-modal>
        </div>
      </a-layout-content>
      <a-layout-footer></a-layout-footer>
    </a-layout>
  </div>
</template>
   
<script setup>
import { ref, getCurrentInstance, reactive } from 'vue'
const ins = getCurrentInstance()
const msg = ins.appContext.config.globalProperties.$message
const val_idcard = ref(null)
const help_idcard = ref(null)
const val_phone = ref(null)
const help_phone = ref(null)
function idCardChange(code) {
  console.log(code)
  // The first two digits represent the region.
  const city = {
    11: 'Beijing',
    12: 'Tianjin',
    13: 'Hebei',
    14: 'Shanxi',
    15: 'Inner Mongolia',
    21: 'Liaoning',
    22: 'Jilin',
    23: 'Heilongjiang',
    31: 'Shanghai',
    32: 'Jiangsu',
    33: 'Zhejiang',
    34: 'Anhui',
    35: 'Fujian',
    36: 'Jiangxi',
    37: 'Shandong',
    41: 'Henan',
    42: 'Hubei',
    43: 'Hunan',
    44: 'Guangdong',
    45: 'Guangxi',
    46: 'Hainan',
    50: 'Chongqing',
    51: 'Sichuan',
    52: 'Guizhou',
    53: 'Yunnan',
    54: 'Tibet',
    61: 'Shaanxi',
    62: 'Gansu',
    63: 'Qinghai',
    64: 'Ningxia',
    65: 'Xinjiang',
    71: 'Taiwan',
    81: 'Hong Kong',
    82: 'Macau',
    91: 'Overseas',
  };
  const idCardReg = /^[1-9]\d{5}(19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i; // ID format regex
  let errorMessage = ''; // Error message
  let isPass = true; // Whether validation passed

  // If the ID does not match the format regex
  if (!code) {
    errorMessage = 'Please enter your ID number.';
    isPass = false;
  } else if (!code.match(idCardReg)) {
    errorMessage = 'Please enter a valid ID number.';
    isPass = false;
  } else if (!city[code.substr(0, 2)]) {
    // The region list does not include the first two digits.
    errorMessage = 'Please enter a valid ID number.';
    isPass = false;
  } else if (code.length === 18) {
    // For 18-digit IDs, validate the check digit.
    code = code.split('');
    // ∑(ai×Wi)(mod 11)
    // Weights
    const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // Check digits
    const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    let ai = 0;
    let wi = 0;
    for (let i = 0; i < 17; i++) {
      ai = parseInt(code[i]);
      wi = factor[i];
      sum += ai * wi; // Sum weighted digits
    }
    const last = parity[sum % 11]; // Modulo
    if (last.toString() !== code[17]) {
      errorMessage = 'Please enter a valid ID number.';
      isPass = false;
    }
  }
  val_idcard.value = isPass?"success":"error";
  help_idcard.value = errorMessage;
  return isPass
}

function phoneChange(val){
  const reg = /^1[3|4|5|7|8]\d{9}$/;
const isPass = reg.test(val);
val_phone.value = isPass?"success":"error";
help_phone.value = isPass?null:"Please enter a valid phone number.";
return isPass;
}
// defineProps({
//   msg: String,
// })
const layout = ref('horizontal')
const form = reactive({
  id: 1,
  name: '',
  age: 18,
  idcard: "",
  phone: ""
})

const emit = getCurrentInstance().emit;
const appContext = getCurrentInstance().appContext;
const sendDataToParent = () => {
  if(!form.id){
    msg.error('Please enter your participant ID.')
    return;
  }
  if(!form.name||form.name==""){
    msg.error('Please enter your name.')
    return;
  }
  if(!form.age){
    msg.error('Please enter your age.')
    return;
  }
  if(!form.idcard||form.idcard==""||!idCardChange(form.idcard)){
    msg.error('Please check your ID number.')
    return;
  }
  if(!form.phone||form.phone==""||!phoneChange(form.phone)){
    msg.error('Please check your phone number.')
    return;
  }
  policyVisible.value = true;
};
const policyVisible = ref(false);

const handleOk = () => {
  document.documentElement.requestFullscreen()
  policyVisible.value = false;
  window.experimentee = form;
  emit('button-clicked', true);
};
const handleCancel = () => {
  appContext.config.globalProperties.$message.warning('You must read and agree to the notes before continuing.')
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
  margin-top: 20px
}

/* .layout-demo :deep(.arco-layout-header),
.layout-demo :deep(.arco-layout-footer) {
  height: 64px;
  background-color: var(--color-primary-light-4);
} */</style>
   
