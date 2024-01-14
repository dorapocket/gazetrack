<template>
  <div style="width: 100%;height: 100%;">
    <TestView v-if="step==0" @button-clicked="continueExp"/>
    <BeforeStart v-if="step==1" @button-clicked="continueExp"/>
  <Calibration v-if="step==2" @button-clicked="continueExp"/>
  <ExpIntro v-if="step==3" @button-clicked="continueExp"/>
  <FindDifferent v-if="step==4" :imageToFind="imageDifferentDataDemo" @report-finish="demoReport"/>
  <ExpNow v-if="step==5"  @button-clicked="continueExp"/>
  <Success v-if="step==6"  @button-clicked="continueExp"/>
  </div>
 
</template>

<script setup>
import { inject, reactive, ref, toRefs, watch,provide } from 'vue'
import BeforeStart from './BeforeStart.vue'
import Calibration from './Calibration.vue'
import ExpIntro from './ExpIntro.vue';
import FindDifferent from './FindDifferent.vue'
import ExpNow from './ExpNow.vue'
import Success from './Success.vue'
import TestView from './TestView.vue';

const step = ref(0)
const scale = 550/923
const imageDifferentDataDemo = ref({
    pic1: "/public/different/demo/AB.jpg",
    pic2: "/public/different/demo/A'B.jpg",
    differentx: 333*scale,
    differenty: 855*scale,
    scale : scale,
    type:'social'
})
provide("imageToFind",imageDifferentDataDemo)
const continueExp = (dataFromChild) => {
  if(typeof dataFromChild==='number'){
    step.value = dataFromChild;
  }else{
    step.value ++;
  }
  // console.log("go")
      
};
const demoReport = (report) => {
    console.log(report);
    step.value ++;
};
</script>


<style scoped>

</style>
