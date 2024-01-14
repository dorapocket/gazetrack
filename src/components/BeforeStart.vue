<template>
  <div class="layout-demo">
    <a-layout style="height: 100%;">
      <a-layout-header></a-layout-header>
      <a-layout-content>
        <div>
          <a-row class="grid-demo">
            <a-col :span="16" :offset="4">
              <a-card title="被试信息">
                <!-- <template #extra>
            <a-link>More</a-link>
        </template> -->
                <a-form :style="{ marginTop: '20px', width: '90%' }" id="loginform" :model="form" :layout="layout">
                  <a-form-item field="post" label="编号" tooltip="请询问主试来获得您的被试编号">
                    <a-input-number v-model="form.id" placeholder="编号" :min="1" :max="1000" />
                  </a-form-item>
                  <a-form-item field="name" label="姓名">
                    <a-input v-model="form.name" placeholder="请输入您的姓名..." />
                  </a-form-item>
                  <a-form-item field="post" label="年龄">
                    <a-input-number v-model="form.age" placeholder="年龄" :min="18" :max="50" />
                  </a-form-item>
                  <a-form-item feedback :help="help_idcard" :validate-status="val_idcard" field="name" label="身份证">
                    <a-input v-model="form.idcard"  @change="idCardChange" placeholder="请输入中国大陆身份证号码（报销用途，我们将严格保密）" />
                  </a-form-item>
                  <a-form-item feedback :help="help_phone" :validate-status="val_phone" field="name" label="手机">
                    <a-input v-model="form.phone" @change="phoneChange" placeholder="请输入您的手机号..." />
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
        </div>
      </a-layout-content>
      <a-layout-footer></a-layout-footer>
    </a-layout>
  </div>
</template>
   
<script setup>
import { ref, getCurrentInstance, reactive } from 'vue'
import BeforeStart from './BeforeStart.vue'
const ins = getCurrentInstance()
const msg = ins.appContext.config.globalProperties.$message
const val_idcard = ref(null)
const help_idcard = ref(null)
const val_phone = ref(null)
const help_phone = ref(null)
function idCardChange(code) {
  console.log(code)
  // 身份证号前两位代表区域
  const city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 ',
  };
  const idCardReg = /^[1-9]\d{5}(19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i; // 身份证格式正则表达式
  let errorMessage = ''; // 错误提示信息
  let isPass = true; // 身份证验证是否通过（true通过、false未通过）

  // 如果身份证不满足格式正则表达式
  if (!code) {
    errorMessage = '请输入身份证号码';
    isPass = false;
  } else if (!code.match(idCardReg)) {
    errorMessage = '请输入正确的身份证号码';
    isPass = false;
  } else if (!city[code.substr(0, 2)]) {
    // 区域数组中不包含需验证的身份证前两位
    errorMessage = '请输入正确的身份证号码';
    isPass = false;
  } else if (code.length === 18) {
    // 18位身份证需要验证最后一位校验位
    code = code.split('');
    // ∑(ai×Wi)(mod 11)
    // 加权因子
    const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验位
    const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    let ai = 0;
    let wi = 0;
    for (let i = 0; i < 17; i++) {
      ai = parseInt(code[i]);
      wi = factor[i];
      sum += ai * wi; // 开始计算并相加
    }
    const last = parity[sum % 11]; // 求余
    if (last.toString() !== code[17]) {
      errorMessage = '请输入正确的身份证号码';
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
help_phone.value = isPass?null:"请输入正确的手机号码";
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
    msg.error('请填写您的被试编号')
    return;
  }
  if(!form.name||form.name==""){
    msg.error('请填写您的姓名')
    return;
  }
  if(!form.age){
    msg.error('请填写您的年龄')
    return;
  }
  if(!form.idcard||form.idcard==""||!idCardChange(form.idcard)){
    msg.error('请检查您的身份证')
    return;
  }
  if(!form.phone||form.phone==""||!phoneChange(form.phone)){
    msg.error('请检查您的手机号')
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
  margin-top: 20px
}

/* .layout-demo :deep(.arco-layout-header),
.layout-demo :deep(.arco-layout-footer) {
  height: 64px;
  background-color: var(--color-primary-light-4);
} */</style>
   