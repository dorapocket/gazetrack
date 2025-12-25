<template>
    <div
        style="width: 100vw;height: 100vh;overflow: hidden;margin: auto;align-items: center;display: flex;justify-content: center;">

        <a-result v-if="stat == 'success'" status="success" title="Thank you">
            <template #subtitle>
                <div class="info">
                    <div>Your data has been sent successfully. Thank you for participating!</div>
                    <div>Finally, please complete a short survey so we can better analyze the results.</div>
                </div>
            </template>
            <template #icon>

            </template>
            <template #extra>
                <a-space>
                    <a-button type='primary' @click="finish">Fill out survey</a-button>
                </a-space>
            </template>
        </a-result>
        <a-result v-if="stat == 'wait'" status="null" title="Please wait">
            <template #subtitle>
                <div class="info">
                    <div>We are processing your data. Please wait...</div>
                    <div>This will not take long 🙂</div>
                </div>
            </template>
            <template #icon>
                <a-spin :size="40" />
            </template>
        </a-result>
        <a-result v-if="stat == 'error'" status="error" title="Error">
            <template #subtitle>
                <div class="info">
                    <div>Sorry, we encountered an error while sending the data. Don't worry—your data will be downloaded locally. If the download does not start immediately, please <a style="font-weight: 700;color: #0085f2;" @click="click_download">click here</a>.</div>
                    <div v-if="error">Please contact the experimenter and provide the following error:</div>
                    <div style="margin-top:20px">
                        {{ error }}
                    </div>

                </div>
            </template>
            <template #extra>
                <a-space>
                    <a-button type='primary' @click="finish">Open survey</a-button>
                </a-space>
            </template>
        </a-result>
    </div>
</template>
<script setup>
import { ref, getCurrentInstance, reactive, onMounted } from 'vue'
import axios from 'axios';
import { MD5 } from 'crypto-js';
// import j from "../assets/test_data.json"
let stat = ref("wait");
let error = ref("");

function finish() {
    exitF();
    setInterval(()=>{
        window.location.href = "https://www.wjx.cn/vm/PiaVhAo.aspx#"
    },1000)

}
function numberToThreeDigitString(number) {
  // Convert the number to a string
  let numberString = number.toString();

  // Pad with leading zeros until length is 3
  while (numberString.length < 3) {
    numberString = '0' + numberString;
  }

  return numberString;
}
function click_download(){
    document.getElementById("download_a").click();
}
function download(){
    // stat.value="success"
    // Convert JSON data to a string
    const jsonData = {
            experimentee: JSON.parse(JSON.stringify(window.experimentee)),
            data: window.experiment_report,
    }
    // const jsonData = j
    
    const jsonString = JSON.stringify(jsonData, null, 2); // The second argument formats the output.

    // Create a Blob
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a Blob URL
    const blobUrl = URL.createObjectURL(blob);

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.id="download_a"
    downloadLink.href = blobUrl;
    downloadLink.download = "data_"+numberToThreeDigitString(jsonData.experimentee.id)+".json"; // Set filename

    // Trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();

}
function exitD() {
    download();
    finish();
}
function exitF() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    } else {
        console.log('No fullscreen');
    }
}
function uploadDataToServer(data) {
    localStorage.setItem('value', JSON.stringify(data));
    localStorage.setItem('isSend', JSON.stringify(false));

    const jsonData = data;
    const axiosInstance = axios.create({
        baseURL: '[hidden for peer review]',
        // baseURL:"http://localhost:9000"
    });
    const md5Hash = MD5("[hidden for peer review]" + JSON.stringify(jsonData.experimentee.idcard) + "[hidden for peer review]").toString();
    jsonData.md5 = md5Hash;
    console.log(jsonData)
    return axiosInstance.post('/upload', jsonData)
        .then(response => {
            // Handle success response
            console.log('Server Response:', response.data);
            stat.value = "success"
            // Clear all localStorage data
            localStorage.clear();
        })
        .catch(error => {
            // Handle error
            console.error('Error uploading data:', error.message);
            error.value = error.message + ""
            stat.value = "error"
            download();
        });
}
onMounted(() => {
    // uploadDataToServer(j);
    // window.experimentee = j.experimentee
    // window.experiment_report = j.data

    indexedDB.deleteDatabase('localforage');
    if (!window.experiment_report) {
        stat.value = "error"
        error.value = "No experiment report found."
    } else if (!window.experimentee) {
        stat.value = "error"
        error.value = "No personal info found."
    } else {
        uploadDataToServer({
            experimentee: JSON.parse(JSON.stringify(window.experimentee)),
            eyemove_accuracy:window.accuracy_user,
            metadata:window._user_meta,
            calibration_data:window._calibrationData,
            data: window.experiment_report,
        });
        // download();
    }
})
</script>
<style scoped>
.info {
    margin: 20px
}
</style>
