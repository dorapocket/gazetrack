<template>
    <div id="different-container" style="width: 100vw;height: 100vh;">
        <div style="position: absolute; margin: 10px 30px; top:0px; left:20px">
            <h1><icon-clock-circle style="margin-right: 10px;" /> {{ remainingTime }}s</h1>
        </div>
        <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight" @click="handleCanvasClick"></canvas>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive, watch, getCurrentInstance } from 'vue';
import { Modal, Button } from '@arco-design/web-vue';
const canvasWidth = 1000;
const canvasHeight = 500;
const canvasRef = ref(null)
const remainingTime = ref(100);
const gameData = reactive({
    pic1: "/public/pic1.png",
    pic2: "/public/pic2.png",
    differentx: 20,
    differenty: 40
});
const flash = ref(false);
const clicks = ref(0);
let timer;

onMounted(() => {
    loadImages();
    startTimer();
});
const pic1base = { x: 0, y: 0 }
const pic2base = { x: 0, y: 0 }
const sensity = 15
const loadImages = () => {
    const canvas = canvasRef.value;
    const context = canvas.getContext("2d");

    const img1 = new Image();
    window.img1 = img1;
    img1.src = gameData.pic1;


    const img2 = new Image();
    window.img2 = img2;
    img2.src = gameData.pic2;


    img1.onload = () => {
        pic1base.x = (canvasWidth / 2 - img1.width) / 2;
        pic1base.y = (canvasHeight - img1.height) / 2;
        context.drawImage(img1, pic1base.x, pic1base.y, img1.width, img1.height);
        console.log(gameData)
        // drawCircle(pic1base.x+gameData.differentx, pic1base.y+gameData.differenty);
    };

    img2.onload = () => {
        pic2base.x = canvasWidth / 2 + (canvasWidth / 2 - img2.width) / 2;
        pic2base.y = (canvasHeight - img2.height) / 2;
        context.drawImage(img2, pic2base.x, pic2base.y, img2.width, img2.height);
    };

};

const startTimer = () => {
    timer = setInterval(() => {
        if (remainingTime.value > 0) {
            remainingTime.value--;
        } else {
            clearInterval(timer);
            Modal.error({
                title: '结果',
                content: "诶哟，再试试？",
                okText: "继续",
                cancelText: "重试",
                hideCancel:false,
                simple: false,
                onCancel: () => {
                    loadImages();
                    startTimer();
                },
                onOk: () => {
                    emit('button-clicked', true);
                }
            });
        }
    }, 1000);
    window.timer = timer
};
const emit = getCurrentInstance().emit;
const handleCanvasClick = (event) => {
    const canvas = canvasRef.value;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (
        ((x > pic1base.x + gameData.differentx - sensity) && (x < pic1base.x + gameData.differentx + sensity) && (y > pic1base.y + gameData.differenty - sensity) && (y < pic1base.y + gameData.differenty + sensity)) ||
        ((x > pic2base.x + gameData.differentx - sensity) && (x < pic2base.x + gameData.differentx + sensity) && (y > pic2base.y + gameData.differenty - sensity) && (y < pic2base.y + gameData.differenty + sensity))
        // (x < gameData.differentx && y < gameData.differenty) ||
        // (x > canvasWidth / 2 + gameData.differentx && y < gameData.differenty)
    ) {
        drawCircle(pic1base.x + gameData.differentx, pic1base.y + gameData.differenty);
        drawCircle(pic2base.x + gameData.differentx, pic2base.y + gameData.differenty);
        if (window.timer) clearInterval(window.timer);
        Modal.info({
            title: '结果',
            content: "诶哟，不错哦",
            okText: "继续",
            cancelText: "重试",
            simple: false,
            hideCancel:false,
            onCancel: () => {
                loadImages();
                startTimer();
            },
            onOk: () => {
                emit('button-clicked', true);
            }
        });
    } else {
        const context = canvas.getContext("2d");
        drawX(x, y);
        setTimeout(() => {
            context.drawImage(window.img1, x - pic1base.x - 13, y - pic1base.y - 13, 26, 26, x - 13, y - 13, 26, 26);
            context.drawImage(window.img2, x - pic2base.x - 13, y - pic2base.y - 13, 26, 26, x - 13, y - 13, 26, 26);
        }, 500)

    }
};

const drawCircle = (x, y) => {
    const canvas = canvasRef.value;
    const context = canvas.getContext("2d");
    context.beginPath();
    context.arc(x, y, 10, 0, 2 * Math.PI);
    context.strokeStyle = "green";
    context.lineWidth = 3;
    context.stroke();
};

const drawX = (x, y) => {
    const canvas = canvasRef.value;
    const context = canvas.getContext("2d");

    const drawXHelper = () => {
        context.beginPath();
        context.moveTo(x - 10, y - 10);
        context.lineTo(x + 10, y + 10);
        context.moveTo(x - 10, y + 10);
        context.lineTo(x + 10, y - 10);
        context.strokeStyle = "white";
        context.lineWidth = 3;
        context.stroke();
    };

    drawXHelper();

    //   setTimeout(() => {
    //     context.clearRect(0, 0, canvasWidth, canvasHeight);
    //     loadImages();
    //     drawXHelper();
    //   }, 500);

    clicks.value++;

    //   if (clicks.value >= 2) {
    //     clearInterval(timer);
    //     alert("恭喜你找到了所有不同点！");
    //   }
};
</script>

<style>
canvas {
    border: 1px solid #000;
}

#different-container {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
}</style>