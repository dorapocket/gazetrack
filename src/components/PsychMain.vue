<template>
  <div>
    <BeforeStart v-if="step==0" @button-clicked="continueExp"/>
  <!-- <Calibration v-if="step==1" @button-clicked="continueExp"/>
  <ExpIntro v-if="step==2" @button-clicked="continueExp"/> -->
  <FindDifferent v-if="step==3" :imageToFind="imageDifferentDataDemo" @report-finish="demoReport" @button-clicked="continueExp"/>
  <ExpNow v-if="step==4"  @button-clicked="continueExp"/>
  </div>
 
</template>

<script setup>
import { inject, reactive, ref, toRefs, watch } from 'vue'
import BeforeStart from './BeforeStart.vue'
import Calibration from './Calibration.vue'
import ExpIntro from './ExpIntro.vue';
import FindDifferent from './FindDifferent.vue'
import ExpNow from './ExpNow.vue'
// defineProps({
//   msg: String,
// })
// const haha = inject("haha")
// watch(haha,()=>{
//   console.log(haha)
// })
const step = ref(4)
const imageDifferentDataDemo = reactive({
    pic1: "/public/pic1.png",
    pic2: "/public/pic2.png",
    differentx: 20,
    differenty: 40,
    scale : 1,
})
const continueExp = (dataFromChild) => {
      // step.value ++;
};
const demoReport = (report) => {
    console.log(report);
};
</script>


<style scoped>

</style>
