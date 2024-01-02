<template>
  <div v-if="introduction" class="layout-demo">
    <a-layout style="height: 100%;">
      <a-layout-header></a-layout-header>
      <a-layout-content>
        <div>
          <a-row class="grid-demo">
            <a-col :span="16" :offset="4">
              <a-card title="开始实验">
                <!-- <template #extra>
            <a-link>More</a-link>
        </template> -->
                <div style="margin-top:40px"> <a-button @click="handleOk" type="primary">拿去</a-button></div>


              </a-card>
            </a-col>
          </a-row>

        </div>
      </a-layout-content>
      <a-layout-footer></a-layout-footer>
    </a-layout>
  </div>
  <FindDifferent ref="childRef" v-else @report-finish="saveReport" @button-clicked="continueExp"/>
</template>
   
<script setup>
import FindDifferent from './FindDifferent.vue'
import { ref, getCurrentInstance, reactive, provide } from 'vue'
import BeforeStart from './BeforeStart.vue'
import different_config from "../assets/different_config.json"
import { chunk,shuffle } from 'lodash'
const publicPath = import.meta.env.BASE_URL;
const childRef = ref()
const build_random_experiment = () => {
  const experiment = []
  // const demo = ["bathroom_woman","","woman_hair","woman_hair","woman_hair","woman_hair","woman_hair","woman_hair","woman_hair"]
  let demo = Object.keys(different_config)
  demo.push("bathroom_woman","bathroom_woman")
  const all_data = chunk(shuffle(demo),3);
  // 
  // const all_data = chunk(shuffle(demo),3);
  for(let i=0;i<3;i++){
    experiment.push({exp:different_config[all_data[0][i]]["social"],type:"social",dir:all_data[0][i]});
    experiment.push({exp:different_config[all_data[1][i]]["social_nonsocial"],type:"social_nonsocial",dir:all_data[1][i]});
    experiment.push({exp:different_config[all_data[2][i]]["nonsocial"],type:"nonsocial",dir:all_data[2][i]});
  }
  return shuffle(experiment)
}
const experiment = build_random_experiment();
console.log(experiment)
const experiment_report = [];
// defineProps({
//   msg: String,
// })
const imageDifferentData = ref({})
provide("imageToFind",imageDifferentData)
const introduction = ref(true);
const emit = getCurrentInstance().emit;
const appContext = getCurrentInstance().appContext;
let current_exp = -1;
const handleOk = () => {
  introduction.value = false;
  run_experiment();
  // emit('button-clicked', true);
};
const saveReport = (dataFromChild) => {
  experiment_report.push(dataFromChild);
  console.log("Next pic")
  run_experiment();
}
const continueExp = (dataFromChild) => {
  return 0;
}
const run_experiment = () => {
  current_exp += 1;
  if(current_exp==9){
    console.log("All Settle",experiment_report);
  }else{
    // debugger
    const current_exp_data = experiment[current_exp];
    const randomize_lr = Math.random() < 0.5 ? 0 : 1;
    const scale = 500 / current_exp_data.exp.size[1];
    imageDifferentData.value = {
      pic1 :"/public/different/"+current_exp_data.dir+"/"+current_exp_data.exp.picture[randomize_lr],
      pic2 : "/public/different/"+current_exp_data.dir+"/"+current_exp_data.exp.picture[randomize_lr==0?1:0],
      differentx : current_exp_data.exp.different.x * scale,
      differenty : current_exp_data.exp.different.y * scale,
      scale : scale,
      type:current_exp_data.type
    }
    // imageDifferentData.value.pic1 = "/public/different/"+current_exp_data.dir+"/"+current_exp_data.exp.picture[randomize_lr];
    // imageDifferentData.value.pic2 = "/public/different/"+current_exp_data.dir+"/"+current_exp_data.exp.picture[randomize_lr==0?1:0];
    // imageDifferentData.value.differentx = current_exp_data.exp.different.x * scale;
    // imageDifferentData.value.differenty = current_exp_data.exp.different.y * scale;
    // imageDifferentData.value.scale = scale;
  }
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
   