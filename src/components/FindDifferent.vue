<template>
    <a-spin :loading="loading" tip="请稍后...">
        <div id="different-container" style="width: 100vw;height: 100vh;">
            <div style="position: absolute; margin: 10px 30px; top:0px; right:20px">
                <h1><icon-clock-circle style="margin-right: 10px;" /> {{ remainingTime }}s</h1>
            </div>
            <canvas id="cvs" ref="canvasRef" :width="canvasWidth" :height="canvasHeight" @click="handleCanvasClick"></canvas>
        </div>
    </a-spin>
</template>
<script setup>
import { ref, onMounted, reactive, watch, getCurrentInstance, onBeforeMount, toRefs, onUpdated, inject, resolveComponent } from 'vue';
import { Modal, Button } from '@arco-design/web-vue';
const canvasWidth = 1300;
const canvasHeight = 700;
const canvasRef = ref(null);
// const props = defineProps(["imageToFind"]);
const remainingTime = ref(60);
const gameData = inject('imageToFind');
// console.log("!!!",gameData);
const flash = ref(false);
const clicks = ref(0);
let timer;
function hideCamera() {
    let a = document.getElementById("webgazerVideoContainer")
    if(a) a.style.display = "none";
}
const loading = ref(true)

onMounted(async () => {
    if (window.eyegaze_enable) {
        try {
            // await window.webgazer.setRegression('ridge') // ridge /* currently must set regression and tracker */
            //     // .setTracker('clmtrackr')
            //     // .setGazeListener(function(data, clock) {
            //     //     console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
            //     //     console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
            //     // })
            //     .saveDataAcrossSessions(true)
            //     .begin()
            window.webgazer.resume()
            hideCamera()
            loading.value = false;

            window.webgazer.showPredictionPoints(false) /* shows a square every 100 milliseconds where current prediction is */
                .applyKalmanFilter(true); /* Kalman Filter defaults to on. Can be toggled by user. */
        } catch (e) {
            console.log(e);
            Modal.error({
                title: '错误',
                content: "加载时出现问题，请联系主试。" + e,
                okText: "刷新",
                hideCancel: true,
                simple: true,
                onOk: () => {
                    location.reload();
                }
            });
        }
    }
    loadImages(startTimer);
});
onBeforeMount(() => {
    if (window.eyegaze_enable) {
        window.webgazer.pause();
    }

})

// onUpdated(()=>{
//     console.log('props.imageToFind has changed:', props.imageToFind);
// })
watch(gameData, () => {
    loadImages(startTimer);
})
setInterval(() => {
    // console.log(props.imageToFind)
}, 1000)
const pic1base = { x: 0, y: 0 }
const pic2base = { x: 0, y: 0 }
const sensity = 40
const clickTrace = [] //[{x:0,y:0,time:0,find:false,side:"left/right"}]
let baseTime = 0;
function setTrace(x, y, find, side) {
    clickTrace.push({ x, y, time: Date.now() - baseTime, find, side })
    // console.log({x,y,time:Date.now()-baseTime,find,side},baseTime,Date.now())
}
const loadImages = (timer) => {
    hideCamera()
    const canvas = canvasRef.value;
    const context = canvas.getContext("2d");
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    // let anotherload = false;
    // 十字的中心坐标
    var centerX = canvasWidth / 2;
    var centerY = canvasHeight / 2;
    // 十字臂的长度
    var armLength = 16;

    // 画横线
    context.beginPath();
    context.moveTo(centerX - armLength, centerY);
    context.lineTo(centerX + armLength, centerY);
    context.strokeStyle = "#000"; // 设置线条颜色
    context.lineWidth = 3; // 设置线条宽度
    context.stroke();

    // 画竖线
    context.beginPath();
    context.moveTo(centerX, centerY - armLength);
    context.lineTo(centerX, centerY + armLength);
    context.stroke();

    const promise1 = new Promise((resolve, reject) => {
        const img1 = new Image();
        window.img1 = img1;
        img1.src = gameData.value.pic1;

        img1.onload = () => {
            img1.width = img1.width * gameData.value.scale
            img1.height = img1.height * gameData.value.scale
            pic1base.x = (canvasWidth / 2 - img1.width) / 2;
            pic1base.y = (canvasHeight - img1.height) / 2;
            // console.log(img1.width, img1.height, gameData.value.scale)
            resolve()
            // if(anotherload){
            //     timer()
            // }else{
            //     anotherload=true;
            // }
            // console.log(gameData)
            // drawCircle(pic1base.x+gameData.differentx, pic1base.y+gameData.differenty);
        };
    })
    // context.drawImage(img1, pic1base.x, pic1base.y, img1.width, img1.height);

    const promise2 = new Promise((resolve, reject) => {
        const img2 = new Image();
        window.img2 = img2;
        img2.src = gameData.value.pic2;

        img2.onload = () => {
            img2.width = img2.width * gameData.value.scale
            img2.height = img2.height * gameData.value.scale
            pic2base.x = canvasWidth / 2 + (canvasWidth / 2 - img2.width) / 2;
            pic2base.y = (canvasHeight - img2.height) / 2;
            resolve()
            // if(anotherload){
            //     timer()
            // }else{
            //     anotherload=true;
            // }
        };
        // context.drawImage(img2, pic2base.x, pic2base.y, img2.width, img2.height);
    })

    setTimeout(() => {
        Promise.allSettled([promise1, promise2]).then(() => {
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(window.img1, pic1base.x, pic1base.y, window.img1.width, window.img1.height);
            context.drawImage(window.img2, pic2base.x, pic2base.y, window.img2.width, window.img2.height);
            timer();
        }).catch((e) => { console.log(e) })
    }, 3000)
};

const mouse_move = []
const eye_move = []
window.handleMouseMove = function (event) {
    // const canvas = document.getElementById("cvs")
    window.mouseX = event.clientX - window.cvs.getBoundingClientRect().left;
    window.mouseY = event.clientY - window.cvs.getBoundingClientRect().top;
}
const startTimer = () => {
    if (window.timer) {
        if(window.timer){
clearInterval(window.timer);
        }
        
        if(window.timer_100ms){
            clearInterval(window.timer_100ms);
        }
        
        if (window.eyegaze_enable) {
            window.webgazer.pause();
        }
        const canvas = document.getElementById("cvs")
        window.cvs = canvas
        canvas.removeEventListener('mousemove', window.handleMouseMove);
    }

    remainingTime.value = 60;
    timer = setInterval(() => {
        if (remainingTime.value > 0) {
            remainingTime.value--;
        } else {
            clearInterval(timer);
            Modal.error({
                title: '时间到啦',
                content: "没关系，下次继续加油哦！",
                okText: "下一组",
                hideCancel: true,
                simple: true,
                onCancel: () => {
                    loadImages(startTimer);
                },
                onOk: () => {
                    emit('report-finish', buildResultReport(false));
                }
            });
        }
    }, 1000);
    if (window.eyegaze_enable) {
        window.webgazer.resume();
    }
    // const canvas = canvasRef.value;
    window.cvs.addEventListener('mousemove', window.handleMouseMove);

    let timer_100ms = setInterval(() => {
        const canvas = window.cvs;
        mouse_move.push([window.mouseX || 0, window.mouseY || 0, Date.now()]);
        if (window.eyegaze_enable) {
            window.webgazer.getCurrentPrediction().then((pre) => {
                // console.log("Eye",res);
                try{
                    let x = (((pre.x || 0) - canvas.getBoundingClientRect().left) || 0).toFixed(1)
                let y = ((pre.y || 0) - (canvas.getBoundingClientRect().top || 0)).toFixed(1)
                console.log("Eye:",[parseFloat(x||"0.0")||0,parseFloat(y||"0.0")||0,Date.now()])
                eye_move.push([parseFloat(x||"0.0")||0,parseFloat(y||"0.0")||0])
                }catch(e){
                    console.log("Err! Eye: [0,0]",Date.now())
                    eye_move.push([0,0,Date.now()])
                }
            });
            // eye_move.push([pre.x - canvas.getBoundingClientRect().left,pre.y- canvas.getBoundingClientRect().top])
            // console.log("Eye:",pre)
        }
        console.log("Mouse:", [window.mouseX || 0, window.mouseY || 0,Date.now()])
    }, 100)

    baseTime = Date.now();
    window.timer = timer;
    window.timer_100ms = timer_100ms;
};
const emit = getCurrentInstance().emit;
const handleCanvasClick = (event) => {
    const canvas = canvasRef.value;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const inLeftImage = (x > pic1base.x && x < pic1base.x + img1.width) && (y > pic1base.y && y < pic1base.y + img1.height);
    const inRightImage = (x > pic2base.x && x < pic2base.x + img2.width) && (y > pic2base.y && y < pic2base.y + img2.height);
    // if(inLeftImage){
    //     console.log("AbsL (",x-pic1base.x,y-pic1base.y,")",gameData.value.pic1)
    // }else if(inRightImage){
    //     console.log("AbsR (",x-pic2base.x,y-pic2base.y,")",gameData.value.pic2)
    // }
    let find = false;
    if (
        ((x > pic1base.x + gameData.value.differentx - sensity) && (x < pic1base.x + gameData.value.differentx + sensity) && (y > pic1base.y + gameData.value.differenty - sensity) && (y < pic1base.y + gameData.value.differenty + sensity)) ||
        ((x > pic2base.x + gameData.value.differentx - sensity) && (x < pic2base.x + gameData.value.differentx + sensity) && (y > pic2base.y + gameData.value.differenty - sensity) && (y < pic2base.y + gameData.value.differenty + sensity))
        // (x < gameData.differentx && y < gameData.differenty) ||
        // (x > canvasWidth / 2 + gameData.differentx && y < gameData.differenty)
    ) {
        find = true;
        drawCircle(pic1base.x + gameData.value.differentx, pic1base.y + gameData.value.differenty);
        drawCircle(pic2base.x + gameData.value.differentx, pic2base.y + gameData.value.differenty);
        if (inLeftImage) {
            setTrace(x - pic1base.x, y - pic1base.y, find, "left")
        }
        if (inRightImage) {
            setTrace(x - pic2base.x, y - pic2base.y, find, "right")
        }
        if (window.timer) clearInterval(window.timer);
        if (window.timer_100ms) clearInterval(window.timer_100ms);
        setTimeout(() => {
            emit('report-finish', buildResultReport(true));
            // emit('button-clicked', true);
        }, 500)

        // Modal.info({
        //     title: '结果',
        //     content: "你真厉害！🎊",
        //     okText: "继续",
        //     simple: true,
        //     hideCancel:true,
        //     onOk: () => {
        //         emit('button-clicked', true);
        //     }
        // });
    } else {
        const context = canvas.getContext("2d");
        if (inLeftImage) {
            setTrace(x - pic1base.x, y - pic1base.y, find, "left")
        }
        if (inRightImage) {
            setTrace(x - pic2base.x, y - pic2base.y, find, "right")
        }
        drawX(x, y);
        setTimeout(() => {
            context.drawImage(window.img1, (x - pic1base.x - 13) / gameData.value.scale, (y - pic1base.y - 13) / gameData.value.scale, 26 / gameData.value.scale, 26 / gameData.value.scale, x - 13, y - 13, 26, 26);
            context.drawImage(window.img2, (x - pic2base.x - 13) / gameData.value.scale, (y - pic2base.y - 13) / gameData.value.scale, 26 / gameData.value.scale, 26 / gameData.value.scale, x - 13, y - 13, 26, 26);
        }, 500)
    }

};
const buildResultReport = (isfind) => {
    const result = {
        find: isfind,
        clicks: JSON.parse(JSON.stringify(clickTrace)),
        mouse_move: mouse_move,
        eye_move:eye_move,
        timeCost: Date.now() - baseTime,
        type: gameData.value.type,
        picture: {
            left: gameData.value.pic1,
            right: gameData.value.pic2,
            size: {
                width: img1.width,
                height: img1.height,
            },
        },
    };
    // console.log("aa",result);
    clickTrace.length = 0;
    return result;
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

<style scoped>
canvas {
    border: 1px solid #000;
}

#webgazerVideoContainer {
    display: none !important;
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