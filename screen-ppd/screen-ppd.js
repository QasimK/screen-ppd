"use strict";

$(document).ready(function() {
  // Set viewing distance value
  updateDistanceNumber();
  updateUnitsText();
  
  $('.userin').change(circuit);
  $("input:radio[name='units']").change(changeUnits);
  $('#distance').on("input", updateDistanceNumber); // Update as your drag mouse

  function updateDistanceNumber() {
    $('#distance_value').val($('#distance').val());
    circuit();
  }
  
  function changeUnits() {
    // Convert units from imperial to metric and vica versa.
    // Only triggered on an actual change.
    var units = $("input[type='radio'][name='units']:checked").val();
    if(units == "metric") {
      var SF = 2.54;
    } else {
      var SF = 1 / 2.54;
    }
    
    // Update diagonal length
    var newDiagonalLength = Math.round(SF * parseInt($('#diagonal-size').val(), 10));
    $('#diagonal-size').val(newDiagonalLength);
    
    // Update viewing distance
    var oldDistance = parseInt($('#distance').val(), 10);
    var newDistance = SF * oldDistance;
    $('#distance').val(newDistance);
    updateDistanceNumber();
    
    // Update text
    updateUnitsText()
  }
  
  function updateUnitsText() {
    var units = $("input[type='radio'][name='units']:checked").val();
    if(units == "metric") {
      $(".units-text").text("cm");
      $("label[for='ppu']").text("PPCM:");
      $("label[for='scaled-ppu']").text("Scaled PPCM:");
    } else {
      $(".units-text").text("inches");
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
    var units = $("input[type='radio'][name='units']:checked").val();
    var SF = 1;
    if (units == "imperial") {
      SF = 2.54;
    }
    
    var diagonalLength = parseInt($('#diagonal-size').val(), 10);
    var resW = parseInt($('#resolution-width').val(), 10);
    var resH = parseInt($('#resolution-height').val(), 10);
    var distance = parseInt($('#distance').val(), 10);
    
    var scaling = $("input[type='radio'][name='scaling']:checked").val();
    scaling = parseInt(scaling, 10) / 100;
    
    return {
      diagonalLength: SF * diagonalLength,
      resW: resW,
      resH: resH,
      distance: SF * distance,
      scaling: scaling
    }
  }
  
  function getCalculations(info) {
    /* Take in info = {
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
    
    var aspectRatio = info.resW / info.resH;
    // TODO: Proper aspect ratio calculation
    var aspectRatioW = 0;
    var aspectRatioH = 0;
    
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
    var units = $("input[type='radio'][name='units']:checked").val();
    var SF = 1;
    if(units == "imperial") {
      SF = 1 / 2.54;
    }
    
    var PPD = Math.round(calcs.PPD);
    var horizontalFOV = Math.round(calcs.horizontalFOV);
    // TODO: Add aspect ratio as easy to read 16:9
    var aspectRatio = Math.round(calcs.aspectRatio * 1000) / 1000;
    var monitorSize = Math.round(SF * calcs.lengthW * 10) / 10 + " by " +
                        Math.round(SF * calcs.lengthH * 10) / 10;
    var PPU = Math.round((1 / SF) * calcs.PPCM);
    var scaledPPU = Math.round((1 / SF) * calcs.scaledPPCM);
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
});
