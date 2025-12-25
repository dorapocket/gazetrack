

import { Modal, Button } from '@arco-design/web-vue';
import {h} from 'vue'
var PointCalibrate = 0;
var CalibrationPoints={};

// Find the help modal
var helpModal;

/**
 * Clear the canvas and the calibration button.
 */
function ClearCanvas(){
  document.querySelectorAll('.Calibration').forEach((i) => {
    i.style.setProperty('display', 'none');
  });
  var canvas = document.getElementById("plotting_canvas");
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Show the instruction of using calibration at the start up screen.
 */
function PopUpInstruction(){
  ClearCanvas();
  // Modal.info({
  //   title: 'Calibration',
  //   content: "Please click on each of the 9 points on the screen. You must click on each point 5 times till it goes yellow. This will calibrate your eye movements.",
  //   okText:"Start Calibrate",
  //   onOk:()=>{
  //       // window.calibrationOK();
  //       // ShowCalibrationPoint();
  //       calcAccuracy()
  //   }
  // });
//   swal({
//     title:"Calibration",
//     text: "Please click on each of the 9 points on the screen. You must click on each point 5 times till it goes yellow. This will calibrate your eye movements.",
//     buttons:{
//       cancel: false,
//       confirm: true
//     }
//   }).then(isConfirm => {
    // ShowCalibrationPoint();
//   });

}
/**
  * Show the help instructions right at the start.
  */
function helpModalShow() {
    // if(!helpModal) {
    //     helpModal = new bootstrap.Modal(document.getElementById('helpModal'))
    // }
    // helpModal.show();
}

function calcAccuracy() {
    // show modal
    // notification for the measurement process

    Modal.info({
        title: '校验',
        content: "请不要移动您的鼠标 & 盯住中间的点5秒。我们将测量您的眼动准确度。",
        okText:"确认",
        maskClosable:false,
        onOk:()=>{
            store_points_variable(); // start storing the prediction points
            let measurement_limit = 60
            sleep(5000).then(() => {
                    stop_storing_points_variable(); // stop storing the prediction points
                    var past50 = window.webgazer.getStoredPoints(); // retrieve the stored points
                    var precision_measurement = calculatePrecision(past50);
                    window.accuracy_user = precision_measurement;
                    Modal.info({
                        title: '校验结果',
                        maskClosable:false,
                        content: ()=>h({
                            setup() {
                              return () => h('div', {class: 'info-modal-content'}, [
                                h('div', {style: 'margin-bottom: 10px;'}, "您的校验准确度为：" + precision_measurement + "%"),
                                h('div', {style: precision_measurement>measurement_limit?'color:green;':'color:red;'},[
                                    h('span',{},precision_measurement>measurement_limit?'您可以点击继续开始实验。':'您的准确度不足，请重新校准！')
                                ]),
                              ])
                            },
                          })
                        ,
                        okText:"继续试验",
                        cancelText:"重新校准",
                        draggable:true,
                        simple:false,
                        hideCancel:false,
                        okButtonProps:{disabled:precision_measurement<measurement_limit},
                        onOk:()=>{
                            ClearCanvas();
                            // window.webgazer.removeMouseEventListeners()
                            // window.cancelAnimationFrame(window._anim);
                            window.webgazer.pause();
                            window.calibrationOK();
                        },
                        onCancel:()=>{
                            //use restart function to restart the calibration
                            //window.webgazer.clearData();
                            ClearCalibration();
                            ClearCanvas();
                            ShowCalibrationPoint();
                        }
                    });
                    // var accuracyLabel = "<a>Accuracy | "+precision_measurement+"%</a>";
                    // document.getElementById("Accuracy").innerHTML = accuracyLabel; // Show the accuracy in the nav bar.
            });
        }
      });
    // swal({
    //     title: "Calculating measurement",
    //     text: "Please don't move your mouse & stare at the middle dot for the next 5 seconds. This will allow us to calculate the accuracy of our predictions.",
    //     closeOnEsc: false,
    //     allowOutsideClick: false,
    //     closeModal: true
    // }).then( () => {
        // makes the variables true for 5 seconds & plots the points
    
       
    // });
}

function calPointClick(node) {
  node = node.srcElement;
    const id = node.id;

    if (!CalibrationPoints[id]){ // initialises if not done
        CalibrationPoints[id]=0;
    }
    CalibrationPoints[id]++; // increments values

    if (CalibrationPoints[id]==5){ //only turn to yellow after 5 clicks
        node.style.setProperty('background-color', 'yellow');
        node.setAttribute('disabled', 'disabled');
        PointCalibrate++;
    }else if (CalibrationPoints[id]<5){
        //Gradually increase the opacity of calibration points when click to give some indication to user.
        var opacity = 0.2*CalibrationPoints[id]+0.2;
        node.style.setProperty('opacity', opacity);
    }

    //Show the middle calibration point after all other points have been clicked.
    if (PointCalibrate == 8){
        document.getElementById('Pt5').style.removeProperty('display');
    }

    if (PointCalibrate >= 9){ // last point is calibrated
        // grab every element in Calibration class and hide them except the middle point.
        document.querySelectorAll('.Calibration').forEach((i) => {
            i.style.setProperty('display', 'none');
        });
        document.getElementById('Pt5').style.removeProperty('display');

        // clears the canvas
        var canvas = document.getElementById("plotting_canvas");
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        // Calculate the accuracy
        calcAccuracy();
    }
}

/**
 * Load this function when the index page starts.
* This function listens for button clicks on the html page
* checks that all buttons have been clicked 5 times each, and then goes on to measuring the precision
*/
//$(document).ready(function(){
function docLoad() {
  ClearCanvas();
//   helpModalShow();
    
    // click event on the calibration buttons
    // document.querySelectorAll('.Calibration').forEach((i) => {
    //     i.addEventListener('click', () => {
    //         calPointClick(i);
    //     })
    // })
};
// window.addEventListener('load', docLoad);

/**
 * Show the Calibration Points
 */
function ShowCalibrationPoint() {
  document.querySelectorAll('.Calibration').forEach((i) => {
    i.style.removeProperty('display');
  });
  // initially hides the middle button
  document.getElementById('Pt5').style.setProperty('display', 'none');
}

/**
* This function clears the calibration buttons memory
*/
function ClearCalibration(){
  // Clear data from WebGazer

  document.querySelectorAll('.Calibration').forEach((i) => {
    i.style.setProperty('background-color', 'red');
    i.style.setProperty('opacity', '0.2');
    i.removeAttribute('disabled');
  });

  CalibrationPoints = {};
  PointCalibrate = 0;
}

// sleep function because java doesn't have one, sourced from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/*
 * This function calculates a measurement for how precise 
 * the eye tracker currently is which is displayed to the user
 */
function calculatePrecision(past50Array) {
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;
  
    // Retrieve the last 50 gaze prediction points
    var x50 = past50Array[0];
    var y50 = past50Array[1];
  
    // Calculate the position of the point the user is staring at
    var staringPointX = windowWidth / 2;
    var staringPointY = windowHeight / 2;

    var k = [];
    for(let i=0;i<50;i++){
      k.push([x50[i],y50[i]]);
    }
    var precisionPercentages = new Array(50);
    calculatePrecisionPercentages(precisionPercentages, windowHeight, x50, y50, staringPointX, staringPointY);
    var precision = calculateAverage(precisionPercentages);
    window._user_meta = {
      windowHeight,
      windowWidth
    }
    window._calibrationData = {
      actual_points: [staringPointX,staringPointY],
      predict_points: k,
      percision:Math.round(precision)
    };
    // Return the precision measurement as a rounded percentage
    return Math.round(precision);
  };
  
  /*
   * Calculate percentage accuracy for each prediction based on distance of
   * the prediction point from the centre point (uses the window height as
   * lower threshold 0%)
   */
  function calculatePrecisionPercentages(precisionPercentages, windowHeight, x50, y50, staringPointX, staringPointY) {
    for (var x = 0; x < 50; x++) {
      // Calculate distance between each prediction and staring point
      var xDiff = staringPointX - x50[x];
      var yDiff = staringPointY - y50[x];
      var distance = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
  
      // Calculate precision percentage
      var halfWindowHeight = windowHeight / 2;
      var precision = 0;
      if (distance <= halfWindowHeight && distance > -1) {
        precision = 100 - (distance / halfWindowHeight * 100);
      } else if (distance > halfWindowHeight) {
        precision = 0;
      } else if (distance > -1) {
        precision = 100;
      }
  
      // Store the precision
      precisionPercentages[x] = precision;
    }
  }
  
  /*
   * Calculates the average of all precision percentages calculated
   */
  function calculateAverage(precisionPercentages) {
    var precision = 0;
    for (var x = 0; x < 50; x++) {
      precision += precisionPercentages[x];
    }
    precision = precision / 50;
    return precision;
  }
  /*
 * Sets store_points to true, so all the occuring prediction
 * points are stored
 */
function store_points_variable(){
    window.webgazer.params.storingPoints = true;
  }
  
  /*
   * Sets store_points to false, so prediction points aren't
   * stored any more
   */
  function stop_storing_points_variable(){
    window.webgazer.params.storingPoints = false;
  }

export {
    ClearCalibration,
    PopUpInstruction,
    ShowCalibrationPoint,
    docLoad,
    calPointClick,
    ClearCanvas
}
