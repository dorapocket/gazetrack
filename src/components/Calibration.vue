<template>
   <div style="width: 100vw;height: 100vh;">
      <canvas id="plotting_canvas" width="500" height="500" style="cursor:crosshair;"></canvas>

            <!-- <ul class="nav navbar-nav">
               <li id="Accuracy"><a>Not yet Calibrated</a></li>
               <li><a @click="Restart" href="#">Recalibrate</a></li>
               
            </ul> -->

   <!-- Calibration points -->
      <div class="calibrationDiv">
         <input type="button" class="Calibration" id="Pt1" />
         <input type="button" class="Calibration" id="Pt2" />
         <input type="button" class="Calibration" id="Pt3" />
         <input type="button" class="Calibration" id="Pt4" />
         <input type="button" class="Calibration" id="Pt5" />
         <input type="button" class="Calibration" id="Pt6" />
         <input type="button" class="Calibration" id="Pt7" />
         <input type="button" class="Calibration" id="Pt8" />
         <input type="button" class="Calibration" id="Pt9" />
      </div>
      <a-modal v-model:visible="modalVisible" @ok="handleOk" @cancel="handleCancel">
    <template #title>
      Calibration
    </template>
    <div>Please click on each of the 9 points on the screen. You must click on each point 5 times till it goes yellow. This will calibrate your eye movements.</div>
  </a-modal>
   </div>
   
   <!-- Modal -->
<!-- <div style="position: absolute; float: left;top: 60vh;left: 48vw;">
   <p id="Accuracy"><a>Not yet Calibrated</a></p>
               <button type="button" id='start_calibration' class="btn btn-primary" data-bs-dismiss="modal"
                  @click="Restart">Calibrate</button>
</div> -->


</template>
   
<script setup>
import { ref, getCurrentInstance,onMounted, onActivated,h  } from 'vue'
import { Modal, Button } from '@arco-design/web-vue';

import {ClearCalibration,PopUpInstruction,ShowCalibrationPoint,docLoad } from '../webgazer/calibration.js'
// defineProps({
//   msg: String,
// })
const modalVisible = ref(false);
const modalTitle = ref();
const modalBody = ref();
var handleOk = () => {
   ShowCalibrationPoint()
   modalVisible.value = false;
    };
    var handleCancel = () => {
      ShowCalibrationPoint()
      modalVisible.value = false;
    }
function resize() {
   var canvas = document.getElementById('plotting_canvas');
   var context = canvas.getContext('2d');
   context.clearRect(0, 0, canvas.width, canvas.height);
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
};
window.addEventListener('resize', resize, false);
const emit = getCurrentInstance().emit;
// 

var gazeData = [];
var onlyTime = [];
onMounted(() => {
    docLoad()
    console.log("kkkk",window.webgazer)
    resize()
    //start the webgazer tracker
    window.webgazer.setRegression('ridge') /* currently must set regression and tracker */
        .setTracker('clmtrackr')
        .setGazeListener(function (data, clock) {
            // console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */

            if (data != null && data["x"]>0 && data["y"]>0 && isCalibrated && data["x"]<= screen.width && data["y"]<=screen.height) {
                var predx = data["x"];
                var predy = data["y"];
                var elapsedTime = clock;

                // push to gazeData array
                gazeData.push([elapsedTime, predx, predy]);

                // push to onlyTime array
                onlyTime.push([elapsedTime]);

                console.log(data["x"] + ", " + data["y"] + ", " + clock);
            }

            //   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
            //   console.log(elapsedTime);
        })
        .begin()
        window.webgazer.showPredictionPoints(true); /* shows a square every 100 milliseconds where current prediction is */


    //Set up the webgazer video feedback.
    var setup = function () {

        //Set up the main canvas. The main canvas is used to calibrate the webgazer.
        var canvas = document.getElementById("plotting_canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
    };

    function checkIfReady() {
      // console.log("!!!!")
      //   if (window.webgazer.isReady()) {
            setup();
            Restart();
      //   } else {
      //       setTimeout(checkIfReady, 100);
      //   }
    }
    setTimeout(checkIfReady, 100);

})


//  exporting data to .csv
function saveGaze(expData) {
    var csv = '';
    expData.forEach(function (row) {
        csv += row.join(',');
        csv += "\n";
    });

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'gazeData.csv';
    hiddenElement.click();
}

window.onbeforeunload = function () {
    //webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
    window.localStorage.clear(); //Comment out if you want to save data across different sessions
}

/**
 * Restart the calibration process by clearing the local storage and reseting the calibration point
 */
function Restart() {
   window.calibrationOK = ()=>{
      emit('button-clicked',true);
   }
   //  document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
   // ShowModal();
    ClearCalibration();
    PopUpInstruction();
   //  docLoad();
}


</script>
   
   
<style scoped>
@import "../webgazer/style.css";
</style>
   