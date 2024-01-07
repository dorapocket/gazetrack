<template>
    <div id="different-container" style="width: 100vw;height: 100vh;">
        <canvas ref="canvasRef" width="1300" height="700"></canvas>
    </div>
</template>
<script setup>
import { Modal, Button } from '@arco-design/web-vue';
import { onMounted,getCurrentInstance } from 'vue';
const emit = getCurrentInstance().emit;
onMounted(() => {
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