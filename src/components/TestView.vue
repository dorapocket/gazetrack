<template>
    <div id="different-container" style="width: 100vw;height: 100vh;">
        <canvas ref="canvasRef" width="1300" height="700"></canvas>
    </div>
</template>
<script setup>
import { Modal, Button } from '@arco-design/web-vue';
import { onMounted, getCurrentInstance } from 'vue';
const emit = getCurrentInstance().emit;
function showModalNext() {
    Modal.info({
        title: 'Resolution Check',
        content: "Before the experiment starts, please confirm that your screen resolution meets the requirements. Can you fully see the black rectangle?",
        okText: "Yes",
        cancelText: "No",
        hideCancel: false,
        simple: false,
        maskClosable:false,
        onCancel: () => {
            Modal.error({
                title: 'Sorry',
                content: "Sorry, your screen may not meet the requirements. Please try again on a higher-resolution device.",
                okText: "Exit",
                hideCancel: true,
                maskClosable:false,
                simple: true,
                onOk: () => {
                    window.close();
                }
            });
        },
        onOk: () => {
            localStorage.clear();
            emit('button-clicked', true);
        }
    });
}
onMounted(() => {
    let val = localStorage.getItem('value');
    let isSend = localStorage.getItem('isSend');
    if (val && isSend) {
        val = JSON.parse(val);
        isSend = JSON.parse(isSend);
        if (isSend) {
            indexedDB.deleteDatabase('localforage');
            showModalNext()
        } else {
            Modal.warning({
                title: 'Data Recovery',
                content: "We detected data that has not been sent. Would you like to resend it?",
                okText: "Send",
                cancelText: "Not sure",
                maskClosable:false,
                hideCancel: false,
                simple: false,
                onCancel: () => {
                    showModalNext()
                },
                onOk: () => {
                    window.experimentee = val.experimentee;
                    window.experiment_report = val.data;
                    emit('button-clicked', 6);
                }
            });
        }
    } else {
        indexedDB.deleteDatabase('localforage');
        showModalNext()
        localStorage.clear();
    }

})
</script>
<style scoped>
canvas {
    border: 2px solid #000;
}

#different-container {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
}
</style>
