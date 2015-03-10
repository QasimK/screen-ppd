"use strict";

$(document).ready(function() {
  // Set viewing distance value
  var prevDistanceUnits = $("input[type='radio'][name='distance-units']:checked").val();
  changeDistanceUnits();
  updateDistanceNumber();
  updateDiagonalUnitsText();
  
  $("input:radio[name='diagonal-units']").change(changeDiagonalUnits);
  $("input:radio[name='distance-units']").change(changeDistanceUnits);
  $('#distance').on("input", updateDistanceNumber); // Update as your drag mouse
  $('.userin').change(circuit);

  function updateDistanceNumber() {
    $('#distance_value').val($('#distance').val());
    circuit();
  }
  
  function changeDiagonalUnits() {
    var diagonalUnits = $("input[type='radio'][name='diagonal-units']:checked").val();
    if(diagonalUnits == "cm") {
      var DSF = 2.54;
    }
    else { //inches
      var DSF = 1 / 2.54;
    }

    // Update diagonal length
    var newDiagonalLength = Math.round(DSF * parseInt($('#diagonal-size').val(), 10));
    $('#diagonal-size').val(newDiagonalLength);
    
    updateDiagonalUnitsText()
  }
  
  function changeDistanceUnits() {
    var distanceUnits = $("input[type='radio'][name='distance-units']:checked").val();
    var DSF;
    if (prevDistanceUnits == "inches" && distanceUnits == "cm") {
      DSF = 2.54;
    }
    else if (prevDistanceUnits == "cm" && distanceUnits == "inches") {
      DSF = 0.393700;
    }
    else if (prevDistanceUnits == "inches" && distanceUnits == "feet") {
      DSF = 0.083333; //1 / 12;
    }
    else if (prevDistanceUnits == "feet" && distanceUnits == "inches") {
      DSF = 12;
    }
    else if (prevDistanceUnits == "inches" && distanceUnits == "m") {
      DSF = 0.0254; //2.54 / 100;
    }
    else if (prevDistanceUnits == "m" && distanceUnits == "inches") {
      DSF = 39.37;
    }
    else if (prevDistanceUnits == "cm" && distanceUnits == "feet") {
      DSF = 0.032808; //1 / 30.48;
    }
    else if (prevDistanceUnits == "feet" && distanceUnits == "cm") {
      DSF = 30.48;
    }
    else if (prevDistanceUnits == "cm" && distanceUnits == "m") {
      DSF = 0.01; //1 / 100;
    }
    else if (prevDistanceUnits == "m" && distanceUnits == "cm") {
      DSF = 100;
    }
    else if (prevDistanceUnits == "feet" && distanceUnits == "m") {
      DSF = 0.3048; //30.48 / 100;
    }
    else if (prevDistanceUnits == "m" && distanceUnits == "feet") {
      DSF = 0.3048; //30.48 / 100;
    }
    else if (prevDistanceUnits == distanceUnits) {
      DSF = 1;
    }
    else {
      alert("Bug - unknown distance units");
    }
    
    var maxSize, stepSize = 1;
    if (distanceUnits === "inches") {
      maxSize = 100;
    }
    else if (distanceUnits === "cm") {
      maxSize = 250;
    }
    else if (distanceUnits === "feet") {
      maxSize = 30;
    }
    else if (distanceUnits === "m") {
      maxSize = 10;
      stepSize = 0.1;
    }
    
    prevDistanceUnits = distanceUnits;
    
    // Update diagonal length
    var oldDistance = parseFloat($('#distance').val(), 10);
    var newDistance = stepSize * Math.round(DSF * (1 / stepSize) * oldDistance);
    $('#distance').attr("max", maxSize);
    $('#distance').attr("step", stepSize);
    $('#distance').val(newDistance);
    
    updateDistanceNumber();
  }
  
  function updateDiagonalUnitsText() {
    var diagonalUnits = $("input[type='radio'][name='diagonal-units']:checked").val();
    if(diagonalUnits == "cm") {
      $("#monitor-size-units").text("cm");
      $("label[for='ppu']").text("PPCM:");
      $("label[for='scaled-ppu']").text("Scaled PPCM:");
    } else {
      $("#monitor-size-units").text("inches");
      $("label[for='ppu']").text("PPI:");
      $("label[for='scaled-ppu']").text("Scaled PPI:");
    }
  }
  
  function circuit() {
    //Do the complete circuit;
    setOutput(getCalculations(getInput()));
  }
  
  function getInput() {
    // Return input as metric measurements
    /* Example: Return {
      diagonalLength: 68.58, //27 inches in metric
      resW: 5120,
      resH: 2160,
      distance: 101.6, //40 inches in metric
      scaling: 2 //200% scaling
    }*/
    var diagonalUnits = $("input[type='radio'][name='diagonal-units']:checked").val();
    var DSF = 1; //Assume cm
    if (diagonalUnits == "inches") {
      DSF = 2.54;
    }
    
    var distanceUnits = $("input[type='radio'][name='distance-units']:checked").val();
    var diagSF = 1; //Assume cm
    if (distanceUnits == "inches") {
      diagSF = 2.54;
    }
    else if (distanceUnits == "feet") {
      diagSF = 30.48;
    }
    else if (distanceUnits == "m") {
      diagSF = 100;
    }
    
    var diagonalLength = parseInt($('#diagonal-size').val(), 10);
    var resW = parseInt($('#resolution-width').val(), 10);
    var resH = parseInt($('#resolution-height').val(), 10);
    var distance = parseFloat($('#distance').val(), 10);
    
    var scaling = $("input[type='radio'][name='scaling']:checked").val();
    scaling = parseInt(scaling, 10) / 100;
    
    return {
      diagonalLength: DSF * diagonalLength,
      resW: resW,
      resH: resH,
      distance: diagSF * distance,
      scaling: scaling
    }
  }
  
  function getCalculations(info) {
    /* Take in info = { // in metric form
      diagonalLength: ,
      resW: ,
      resH: ,
      distance: ,
      scaling: 
    }
    return { // in metric form
      aspectRatio: 2.3755435,
      aspectRatioW: 21, // or "uncommon"
      aspectRatioH: 9,  // or "uncommon"
      scaledResW: 2560,
      scaledResH: 1080,
      horizontalFOV: ,
      PPD: ,
      
      // Unit dependent (in metric):
      lengthW: ,
      lengthH: ,
      PPCM: ,
      scaledPPCM: 
    }*/
    
    var ratioInfo = getAspectRatio(info.resW, info.resH);
    var aspectRatio = ratioInfo.ratio;
    var aspectRatioW = ratioInfo.ratioHor;
    var aspectRatioH = ratioInfo.ratioVer;
    
    // Scaled resolution
    var scaledResW = info.resW / info.scaling;
    var scaledResH = info.resH / info.scaling;
    
    var lengthW = info.diagonalLength / Math.sqrt(1 + Math.pow(aspectRatio, -2));
    var lengthH = info.diagonalLength / Math.sqrt(1 + Math.pow(aspectRatio, 2));
    
    var horizontalFOV = 180 / Math.PI * 2 * Math.atan( lengthW / 2 / info.distance);
    var PPD = scaledResW / horizontalFOV;
    
    var PPCM = info.resW / lengthW; // Pixels per unit
    var scaledPPCM = PPCM / info.scaling;
    
    return {
      aspectRatio: aspectRatio,
      aspectRatioW: aspectRatioW,
      aspectRatioH: aspectRatioH,
      scaledResW: scaledResW,
      scaledResH: scaledResH,
      horizontalFOV: horizontalFOV,
      PPD: PPD,
      
      lengthW: lengthW,
      lengthH: lengthH,
      PPCM: PPCM,
      scaledPPCM: scaledPPCM
    }
  }
  
  function setOutput(calcs) {
    // Set output in the appropriate units (takes in calcs from getCalculations)
    var diagonalUnits = $("input[type='radio'][name='diagonal-units']:checked").val();
    var DSF = 1; // Assume CM
    if(diagonalUnits == "inches") {
      DSF = 1 / 2.54;
    }
    
    var PPD = Math.round(calcs.PPD);
    var horizontalFOV = Math.round(calcs.horizontalFOV);
    var aspectRatio = calcs.aspectRatioW + ":" + calcs.aspectRatioH + " (" + 
                      Math.round(calcs.aspectRatio * 1000) / 1000 + ")";
    var monitorSize = Math.round(DSF * calcs.lengthW * 10) / 10 + " by " +
                        Math.round(DSF * calcs.lengthH * 10) / 10;
    var PPU = Math.round((1 / DSF) * calcs.PPCM);
    var scaledPPU = Math.round((1 / DSF) * calcs.scaledPPCM);
    var scaledResolution = Math.round(calcs.scaledResW) + " x " +
                            Math.round(calcs.scaledResH);
    
    $('#ppd').text(PPD);
    $('#horizontal-fov').text(horizontalFOV);
    $('#aspect-ratio').text(aspectRatio);
    $('#monitor-size').text(monitorSize);
    $('#ppu').text(PPU);
    $('#scaled-ppu').text(scaledPPU);
    $('#scaled-resolution').text(scaledResolution);
  }
  
  function getAspectRatio(width, height) {
    var theGCD = gcd(width, height);
    var ratioHor = width / theGCD;
    var ratioVer = height / theGCD;
    
    //1366 x 768
    if(ratioHor === 683 && ratioVer === 384) {
      ratioHor = 16;
      ratioVer = 9;
    }
    //2560 x 1080
    if(ratioHor === 64 && ratioVer === 27) {
      ratioHor = 21;
      ratioVer = 9;
    }
    //3440 x 1440
    if(ratioHor === 43 && ratioVer === 18) {
      ratioHor = 21;
      ratioVer = 9;
    }
    //Change 8:5 to 16:10
    if(ratioHor === 8 && ratioVer === 5) {
      ratioHor = 16;
      ratioVer = 10;
    }
    
    return {
      ratio: width / height,
      ratioHor: ratioHor,
      ratioVer: ratioVer
    }
  }
  
  function gcd(a, b) {
    // Not fastest algorithm but good enough
    if(!b) {
      return a;
    }
    return gcd(b, a % b);
  }
});
