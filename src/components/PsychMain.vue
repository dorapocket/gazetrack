<template>
 <!-- <BeforeStart @button-clicked="handleButtonClicked"/> -->
  <Calibration/>
</template>

<script setup>
import { ref } from 'vue'
import BeforeStart from './BeforeStart.vue'
import Calibration from './Calibration.vue'
// defineProps({
//   msg: String,
// })
const handleButtonClicked = (dataFromChild) => {
      console.log(dataFromChild)
};

</script>


<style scoped>

</style>
