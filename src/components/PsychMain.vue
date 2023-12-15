<template>
  <BeforeStart v-if="step==0" @button-clicked="continueExp"/>
  <Calibration v-if="step==1" @button-clicked="continueExp"/>
  <ExpIntro v-if="step==2" @button-clicked="continueExp"/>
  <FindDifferent v-if="step==3" @button-clicked="continueExp"/>
  <ExpNow v-if="step==4" @button-clicked="continueExp"/>
</template>

<script setup>
import { ref } from 'vue'
import BeforeStart from './BeforeStart.vue'
import Calibration from './Calibration.vue'
import ExpIntro from './ExpIntro.vue';
import FindDifferent from './FindDifferent.vue'
import ExpNow from './ExpNow.vue'
// defineProps({
//   msg: String,
// })
const step = ref(0)
const continueExp = (dataFromChild) => {
      step.value ++;
};
</script>


<style scoped>

</style>
