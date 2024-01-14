<template>
    <div
        style="width: 100vw;height: 100vh;overflow: hidden;margin: auto;align-items: center;display: flex;justify-content: center;">

        <a-result v-if="stat == 'success'" status="success" title="谢谢">
            <template #subtitle>
                <div class="info">
                    <div>我们已经收到您的数据，感谢您的参与！</div>
                    <div>最后，我们需要您填写一份问卷，以便我们更好地分析实验结果。</div>
                </div>
            </template>
            <template #icon>

            </template>
            <template #extra>
                <a-space>
                    <a-button type='primary' @click="finish">填写问卷</a-button>
                </a-space>
            </template>
        </a-result>
        <a-result v-if="stat == 'wait'" status="null" title="请稍后">
            <template #subtitle>
                <div class="info">
                    <div>我们正在处理您的数据，请稍后...</div>
                    <div>这不会花费很长时间🙂</div>
                </div>
            </template>
            <template #icon>
                <a-spin :size="40" />
            </template>
        </a-result>
        <a-result v-if="stat == 'error'" status="error" title="错误">
            <template #subtitle>
                <div class="info">
                    <div>抱歉，我们遇到了一些错误。</div>
                    <div>请联系主试并提供以下错误截图：</div>
                    <div style="margin-top:20px">
                        {{ error }}
                    </div>

                </div>
            </template>
            <template #extra>
                <a-space>
                    <a-button type='primary' @click="exitF">退出全屏</a-button>
                </a-space>
            </template>
        </a-result>
    </div>
</template>
<script setup>
import { ref, getCurrentInstance, reactive, onMounted } from 'vue'
import axios from 'axios';
import { MD5 } from 'crypto-js';
let stat = ref("wait");
let error = ref("");

function finish(){
    exitF();
    window.location.href = "https://www.wjx.cn/vm/PiaVhAo.aspx#"
}

function exitF(){
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
  // 退出全屏
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
  console.log('当前不处于全屏状态。');
}
}
function uploadDataToServer(data) {
    const jsonData = data; 
    const axiosInstance = axios.create({
            baseURL: 'https://gaze-backend.lgyserver.top',
            // baseURL:"http://localhost:9000"
        });
    const md5Hash = MD5("gyp"+JSON.stringify(jsonData.experimentee.idcard)+"lgy").toString();
    jsonData.md5 = md5Hash;
    console.log(jsonData)
    return axiosInstance.post('/upload', jsonData)
        .then(response => {
            // 处理成功响应
            console.log('Server Response:', response.data);
            stat.value = "success"
        })
        .catch(error => {
            // 处理错误
            console.error('Error uploading data:', error.message);
            error.value = error.message+""
            stat.value = "error"
        });
}
onMounted(() => {
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
            data: window.experiment_report,
        });
    }
})
</script>
<style scoped>
.info {
    margin: 20px
}
</style>