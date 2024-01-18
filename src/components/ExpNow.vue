<template>
  <div v-if="introduction" class="layout-demo">
    <a-layout style="height: 100%;">
      <a-layout-header></a-layout-header>
      <a-layout-content>
        <div>
          <a-row class="grid-demo">
            <a-col :span="16" :offset="4">
              <a-card title="开始实验">
                接下来将正式开始实验。您将看见9组图片，请在时间限制内找出图片中的不同点。
                <div style="color:black;font-weight: 700;margin-top:20px">请尽量使用鼠标辅助显示您的注视位置。</div>
                <video id="introv" src="../assets/demo.mp4" muted autoplay loop></video>
                <div style="color:green;font-weight: 700;margin-top:20px">如果您准备好了，请点击开始😊</div>
                <!-- <template #extra>
            <a-link>More</a-link>
        </template> -->
                <div style="margin-top:40px"> <a-button @click="handleOk" type="primary">开始</a-button></div>


              </a-card>
            </a-col>
          </a-row>

        </div>
      </a-layout-content>
      <a-layout-footer></a-layout-footer>
    </a-layout>
  </div>
  <FindDifferent ref="childRef" v-else @report-finish="saveReport" />
</template>
   
<script setup>
import FindDifferent from './FindDifferent.vue'
import { ref, getCurrentInstance, reactive, provide } from 'vue'
import BeforeStart from './BeforeStart.vue'
import different_config from "../assets/different_config.json"
import { chunk, shuffle, cloneDeep } from 'lodash'

const publicPath = import.meta.env.BASE_URL;
const childRef = ref()
const build_random_experiment = () => {
  let experiment = []
  // const demo = ["bathtub_boy","bathtub_boy","bathtub_boy","bathtub_boy","bathtub_boy","bathtub_boy","bathtub_boy","bathtub_boy","bathtub_boy"]
  let demo = Object.keys(different_config)
  // demo.push("bathroom_woman","bathroom_woman")
  // const all_data = chunk(shuffle(demo),3);
  const all_data = shuffle(demo);
  const rearrange_map = {};

  function getNext(image) {
    const choice = ["social", "social_nonsocial", "nonsocial"];
    let random = choice[Math.floor(Math.random() * 3)]
    if (!rearrange_map[image]) rearrange_map[image] = {};
    if (Object.keys(rearrange_map[image]).length >= 3) {
      return false;
    }
    while (rearrange_map[image][random] && Object.keys(rearrange_map[image]).length < 3) {
      random = choice[Math.floor(Math.random() * 3)]
    }
    rearrange_map[image][random] = true;
    return random;
  }

  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 9; i++) {
      const typ = getNext(all_data[i]);
      if(!typ) {
      console.error("Type randome choice error");break;
      }
      experiment.push({ exp: different_config[all_data[i]][typ], type: typ, dir: all_data[i] });
    }
  }
  // 
  // const all_data = chunk(shuffle(demo),3);
  // for(let i=0;i<3;i++){
  //   experiment.push({exp:different_config[all_data[0][i]]["nonsocial"],type:"social",dir:all_data[0][i]});
  //   experiment.push({exp:different_config[all_data[1][i]]["social"],type:"social_nonsocial",dir:all_data[1][i]});
  //   experiment.push({exp:different_config[all_data[2][i]]["social_nonsocial"],type:"nonsocial",dir:all_data[2][i]});
  // }
  return experiment;
  // return shuffle(experiment)
}
const experiment = build_random_experiment();
console.log("Pending Experiment:", experiment)
const experiment_report = [];
// defineProps({
//   msg: String,
// })
const imageDifferentData = ref({})
provide("imageToFind", imageDifferentData)
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
  console.log("Test Result from last picture:",dataFromChild)
  experiment_report.push(dataFromChild);
  // console.log("Next ")
  run_experiment();
}
const run_experiment = () => {
  current_exp += 1;
  if (current_exp == 27) {
    console.log("All Settle! Result: ", experiment_report);
    window.experiment_report = experiment_report;
    emit('button-clicked', true);
  } else {
    // debugger
    const current_exp_data = experiment[current_exp];
    const randomize_lr = Math.random() < 0.5 ? 0 : 1;
    const scale = 550 / current_exp_data.exp.size[1];
    // console.log("Meta:",current_exp,current_exp_data)
    imageDifferentData.value = {
      pic1: "/public/different/" + current_exp_data.dir + "/" + current_exp_data.exp.picture[randomize_lr],
      pic2: "/public/different/" + current_exp_data.dir + "/" + current_exp_data.exp.picture[randomize_lr == 0 ? 1 : 0],
      differentx: current_exp_data.exp.different.x * scale,
      differenty: current_exp_data.exp.different.y * scale,
      scale: scale,
      type: current_exp_data.type,
      needRest: current_exp == 8 || current_exp == 17
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
#introv {
  width: 600px;
}

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
 } */
</style>
   