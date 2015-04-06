"use strict";

$(document).ready(function() {
  window.ppdCalc.initialise();
});


// Interface
(function( ppd, $, undefined ) {
  // Private
  var form;
  var prevDistanceUnits;
  
  
  function onDiagonalUnitsChange() {
    var diagonalUnits = form.diagonalActiveUnit().val();
    
    // Update diagonal length
    if (diagonalUnits === "cm") {
      var DSF = 2.54;
    }
    else { //inches
      var DSF = 1 / 2.54;
    }
    var newLength = Math.round(DSF * parseInt(form.diagonalLength.val(), 10));
    form.diagonalLength.val(newLength);
    
    // Update text
    if(diagonalUnits === "cm") {
      $("#monitor-size-units").text("cm");
      $("label[for='ppu']").text("PPCM:");
      $("label[for='scaled-ppu']").text("Scaled PPCM:");
    } else {
      $("#monitor-size-units").text("inches");
      $("label[for='ppu']").text("PPI:");
      $("label[for='scaled-ppu']").text("Scaled PPI:");
    }
    
    updateDiagonalButtons();
  }
  
  function onDistanceUnitsChange() {
    updateDistanceSlider();
    updateDistanceButtons();
    updateDistanceText();
  }
  
  
  function _selectButton(buttonsList, activeInput) {
    var currentSelectedValue = activeInput.val();
    buttonsList.each( function() {
      var correspondingInput = $("#" + $(this).attr('for'));
      if (correspondingInput.val() === currentSelectedValue) {
        $(this).removeClass("secondary");
      }
      else {
        $(this).addClass("secondary");
      }
    });
  }
  
  function updateDiagonalButtons() {
    _selectButton(form.diagonalButtons, form.diagonalActiveUnit());
  }
  
  function updateDistanceButtons() {
    _selectButton(form.distanceButtons, form.distanceActiveUnit());
  }
  
  function updateScalingButtons() {
    _selectButton(form.scalingButtons, form.scalingActiveInput());
  }
  
  function updateDistanceSlider() {
    var distanceUnits = form.distanceActiveUnit().val();
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
      DSF = 3.280839;
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
      maxSize = 100;
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
    var oldDistance = parseFloat(form.distance.val(), 10);
    var newDistance = stepSize * Math.round(DSF * (1 / stepSize) * oldDistance);
    
    form.distance.attr("max", maxSize).attr("step", stepSize).val(newDistance);
  }
  
  function updateDistanceText() {
    form.distanceNumberText.val(form.distance.val());
    var unitsText = form.distanceActiveUnit().val();
    if (unitsText === "inches") {
      unitsText = '"';
    }
    form.distanceUnitsText.val(unitsText);
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
    var diagonalUnits = form.diagonalActiveUnit().val();
    var DSF = 1; //Assume cm
    if (diagonalUnits == "inches") {
      DSF = 2.54;
    }
    
    var distanceUnits = form.distanceActiveUnit().val();
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
    
    var diagonalLength = parseFloat(form.diagonalLength.val());
    var resW = parseInt(form.resWidth.val(), 10);
    var resH = parseInt(form.resHeight.val(), 10);
    var distance = parseFloat(form.distance.val(), 10);
    
    var scaling = form.scalingActiveInput().val();
    scaling = parseInt(scaling, 10) / 100;
    
    return {
      diagonalLength: DSF * diagonalLength,
      resW: resW,
      resH: resH,
      distance: diagSF * distance,
      scaling: scaling
    }
  }
  
  function setOutput(calcs) {
    // Set output in the appropriate units (takes in calcs from getCalculations)
    var diagonalUnits = form.diagonalActiveUnit().val();
    var DSF = 1; // Assume CM
    if(diagonalUnits == "inches") {
      DSF = 1 / 2.54;
    }
    
    var PPD = Math.round(calcs.PPD);
    var scaledPPD = Math.round(calcs.scaledPPD);
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
    $('#ppd-scaled').text(scaledPPD);
    $('#horizontal-fov').text(horizontalFOV);
    $('#aspect-ratio').text(aspectRatio);
    $('#monitor-size').text(monitorSize);
    $('#ppu').text(PPU);
    $('#scaled-ppu').text(scaledPPU);
    $('#scaled-resolution').text(scaledResolution);
  }
  
  
  function circuit() {
    setOutput(ppd.calculate(getInput()));
  }
  
  // Public
  // Note: you can move the functions into the update...Buttons function
  // and create a static property
  ppd.initialise = function() {
    form = {
      diagonalLength: $('#diagonal-size'),
      diagonalUnits: $("input:radio[name='diagonal-units']"),
      diagonalActiveUnit: function() {return $("input:radio[name='diagonal-units']:checked")},
      diagonalButtons: $("label[for^='diagonal-units-']"),
      resWidth: $('#resolution-width'),
      resHeight: $('#resolution-height'),
      distance: $('#distance'),
      distanceNumberText: $('#distance-value'),
      distanceUnitsText: $('#distance-units-text'),
      distanceUnits: $("input[type='radio'][name='distance-units']"),
      distanceActiveUnit: function() {return $("input[type='radio'][name='distance-units']:checked")},
      distanceButtons: $("label[for^='distance-units-']"),
      scalingInputs: $("input[type='radio'][name='scaling']"),
      scalingActiveInput: function() {return $("input[type='radio'][name='scaling']:checked")},
      scalingButtons: $("label[for^='scale-']")
    }
    
    prevDistanceUnits = form.distanceActiveUnit().val()
    
    updateDiagonalButtons();
    updateDistanceButtons();
    updateScalingButtons();
    updateDistanceText();
    updateDistanceSlider();
    circuit(); //Calculate PPD (may already be input on the form)
    
    form.diagonalUnits.change(onDiagonalUnitsChange);
    form.distanceUnits.change(onDistanceUnitsChange);
    form.scalingInputs.change(updateScalingButtons);
    form.distance.on("input", updateDistanceText); // Update as mouse dragged
    form.distance.on("input", circuit); // Do a complete calculation
    $('.userin').change(circuit); //Any change on a user-input form element
  }
  
}(window.ppdCalc = window.ppdCalc || {}, jQuery));



// Logic
(function(ppd, $, undefined) {
  // Private
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
  
  
  // Public
  ppd.calculate = function(info) {
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
      scaledPPD: ,
      
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
    var PPD = info.resW / horizontalFOV;
    var scaledPPD = scaledResW / horizontalFOV;
    
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
      scaledPPD: scaledPPD,
      
      lengthW: lengthW,
      lengthH: lengthH,
      PPCM: PPCM,
      scaledPPCM: scaledPPCM
    }
  };
}(window.ppdCalc = window.ppdCalc || {}, jQuery));
