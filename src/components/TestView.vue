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
        title: '分辨率测试',
        content: "在实验开始之前，请先确认您的显示器分辨率是否满足要求。请问您是否能完全看见黑色矩形框？",
        okText: "可以",
        cancelText: "不能",
        hideCancel: false,
        simple: false,
        onCancel: () => {
            Modal.error({
                title: '对不起',
                content: "对不起，您可能不满足实验条件，请使用更大分辨率的电脑重试。",
                okText: "退出",
                hideCancel: true,
                simple: true,
                onOk: () => {
                    window.close();
                }
            });
        },
        onOk: () => {
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
            localStorage.clear();
        } else {
            localStorage.clear();
            Modal.warning({
                title: '数据恢复',
                content: "您好，我们检测到您有待发送的数据。是否要重新进行发送？",
                okText: "发送",
                cancelText: "我不知道",
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