<template>
    <a-spin :loading="loading" tip="请稍后...">
        <div style="width: 100vw;height: 100vh;">
            <canvas id="plotting_canvas" width="500" height="500" style="cursor:crosshair;"></canvas>

            <!-- <ul class="nav navbar-nav">
               <li id="Accuracy"><a>Not yet Calibrated</a></li>
               <li><a @click="Restart" href="#">Recalibrate</a></li>
               
            </ul> -->

            <!-- Calibration points -->
            <div class="calibrationDiv">
                <input @click="calPointClick" type="button" class="Calibration" id="Pt1" />
                <input @click="calPointClick" type="button" class="Calibration" id="Pt2" />
                <input @click="calPointClick" type="button" class="Calibration" id="Pt3" />
                <input @click="calPointClick" type="button" class="Calibration" id="Pt4" />
                <input @click="calPointClick" type="button" class="Calibration" id="Pt5" />
                <input @click="calPointClick" type="button" class="Calibration" id="Pt6" />
                <input @click="calPointClick" type="button" class="Calibration" id="Pt7" />
                <input @click="calPointClick" type="button" class="Calibration" id="Pt8" />
                <input @click="calPointClick" type="button" class="Calibration" id="Pt9" />
            </div>
            <a-modal v-model:visible="modalVisible" @ok="handleOk" @cancel="handleCancel">
                <template #title>
                    眼动校准
                </template>
                <div>请注视并点击画面上显示的9个点. 您必须点击每个点5次直到该点变成黄色。 这一步骤会帮助我们校准您的眼动。</div>
            </a-modal>
        </div>

        <!-- Modal -->
        <!-- <div style="position: absolute; float: left;top: 60vh;left: 48vw;">
   <p id="Accuracy"><a>Not yet Calibrated</a></p>
               <button type="button" id='start_calibration' class="btn btn-primary" data-bs-dismiss="modal"
                  @click="Restart">Calibrate</button>
</div> -->

    </a-spin>
</template>
   
<script setup>
import { ref, getCurrentInstance, onMounted, onActivated, h, onBeforeUnmount } from 'vue'
import { Modal, Button } from '@arco-design/web-vue';
import { ClearCalibration, PopUpInstruction, ShowCalibrationPoint, docLoad, calPointClick, ClearCanvas } from '../webgazer/calibration.js'
// defineProps({
//   msg: String,
// })
const modalVisible = ref(true);
const modalTitle = ref();
const modalBody = ref();
const loading = ref(true);
var handleOk = () => {
    Restart()
    modalVisible.value = false;
};
var handleCancel = () => {
    Restart()
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
onMounted(async () => {

    resize()
    //start the webgazer tracker
    //start the webgazer tracker
    if(window.eyegaze_enable){
        try {
        await window.webgazer.setRegression('ridge') // ridge /* currently must set regression and tracker */
            //.setTracker('clmtrackr')
            .setGazeListener(function (data, clock) {
                //   console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
                //   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
                // if(data&&data.x&&data.y) window._eye_prediction = [data.x,data.y,Date.now()];
                // else window._eye_prediction = [0,0,Date.now()];
            })
            // .saveDataAcrossSessions(true)
            .begin();
        loading.value = false;
        window.webgazer.showVideoPreview(true) /* shows all video previews */
            .showPredictionPoints(window._showpoints) /* shows a square every 100 milliseconds where current prediction is */
            .applyKalmanFilter(true); /* Kalman Filter defaults to on. Can be toggled by user. */
    } catch (e) {
        console.log(e);
        Modal.error({
            title: '错误',
            content: "加载时出现问题，请联系主试。" + e,
            okText: "刷新",
            maskClosable:false,
            hideCancel: true,
            simple: true,
            onOk: () => {
                location.reload();
            }
        });
    }
    }

    //Set up the webgazer video feedback.
    var setup = function () {

        //Set up the main canvas. The main canvas is used to calibrate the webgazer.
        var canvas = document.getElementById("plotting_canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
    };
    setup();


})
// window.saveDataAcrossSessions = true;
onBeforeUnmount(() => {
    if(window.eyegaze_enable){
        // window.webgazer.pause();
    }
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


/**
 * Restart the calibration process by clearing the local storage and reseting the calibration point
 */
function Restart() {
    console.log("setok")
    window.calibrationOK = () => {
        emit('button-clicked', true);
    }
    //  document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
    // ShowModal();
    // docLoad();
    ClearCanvas();
    ClearCalibration();
    // PopUpInstruction();
    ShowCalibrationPoint();

}


</script>
   
   
<style scoped>
@import "../webgazer/style.css";
</style>
   