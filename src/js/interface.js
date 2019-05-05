/* Interactive interface */

module.exports = {
    initialise: initialise
}

const $ = require('jquery')
const calc = require('pixels-per-degree')
window.$ = $

const componentDiagonal = require('./componentDiagonal')
const componentResolution = require('./componentResolution')
const componentDistance = require('./componentDistance')
const componentScaling = require('./componentScaling')
const componentRefreshRate = require('./componentRefreshRate')
const componentHDR = require('./componentHDR')
const componentCurvature = require('./componentCurvature')
const utils = require('./utils')


function getInput (form) {
    // Return input as metric measurements
    /* Example: Return {
        diagonalLength: 68.58, //27 inches in metric
        resW: 5120,
        resH: 2160,
        distance: 101.6, //40 inches in metric
        scaling: 2 //200% scaling
    } */
    var diagonalUnits = form.getSelectedDiagonalUnit()
    var DSF = 1 // Assume cm
    if (diagonalUnits === 'inches') {
        DSF = 2.54
    }

    var distanceUnits = form.getDistanceUnits()
    var diagSF
    if (distanceUnits === 'cm') {
        diagSF = 1
    } else if (distanceUnits === 'inches') {
        diagSF = 2.54
    } else if (distanceUnits === 'feet') {
        diagSF = 30.48
    } else if (distanceUnits === 'metres') {
        diagSF = 100
    } else {
        window.alert("Unknown distance units - getInput()")
    }

    var diagonalLength = parseFloat(form.diagonalBox.value)
    var resW = parseInt(form.resolutionWidth.value, 10)
    var resH = parseInt(form.resolutionHeight.value, 10)
    var distance = parseFloat(form.distanceBox.value, 10)
    var scaling = parseInt(form.scalingBox.value, 10) / 100

    return {
        diagonalLength: DSF * diagonalLength,
        resW: resW,
        resH: resH,
        distance: diagSF * distance,
        scaling: scaling
    }
}

function setOutput (form, calcs) {
    // Set output in the appropriate units (takes in calcs from getCalculations)
    var diagonalUnits = form.getSelectedDiagonalUnit()
    var DSF = 1 // Assume CM
    if (diagonalUnits === 'inches') {
        DSF = 1 / 2.54
    }

    var PPD = Math.round(calcs.PPD)
    var scaledPPD = Math.round(calcs.scaledPPD)
    var horizontalFOV = Math.round(calcs.horizontalFOV)
    var aspectRatio = calcs.aspectRatioW + ':' + calcs.aspectRatioH + ' (' +
                                        Math.round(calcs.aspectRatio * 1000) / 1000 + ')'
    var monitorSize = Math.round(DSF * calcs.lengthW * 10) / 10 + ' by ' +
                                            Math.round(DSF * calcs.lengthH * 10) / 10
    var PPU = Math.round((1 / DSF) * calcs.PPCM)
    var scaledPPU = Math.round((1 / DSF) * calcs.scaledPPCM)
    var scaledResolution = Math.round(calcs.scaledResW) + ' x ' +
                                                    Math.round(calcs.scaledResH)

    $('#ppd').text(PPD)
    $('#ppd-scaled').text(scaledPPD)
    $('#horizontal-fov').text(horizontalFOV)
    $('#aspect-ratio').text(aspectRatio)
    $('#monitor-size').text(monitorSize)
    $('#ppu').text(PPU)
    $('#scaled-ppu').text(scaledPPU)
    $('#scaled-resolution').text(scaledResolution)
}

function circuit (form) {
    console.debug('Doing full circuit.')
    setOutput(form, calc.ppdCalc(getInput(form)))
}

// Public
// Note: you can move the functions into the update...Buttons function
// and create a static property
function initialise () {
    window.form = form = {
        // Diagonal Size
        diagonalBox: document.getElementById('diagonal-box'),
        diagonalUnitButtonInputs: document.querySelectorAll("input[name='diagonal-units']"),
        getSelectedDiagonalUnit: function() { return document.querySelector("input[name='diagonal-units']:checked").value },

        // Resolution
        resolutionWidth: document.getElementById('resolution-width'),
        resolutionHeight: document.getElementById('resolution-height'),
        resolutionDropDown: document.getElementById('resolution-preselect'),
        getResolutionDropDownSelected: function() { return document.querySelector('#resolution-preselect option:checked') },

        // Distance to Eyes
        distanceBox: document.getElementById('distance-box'),
        distanceSlider: document.getElementById('distance-slider'),
        distanceUnitsDropDown: document.getElementById('distance-units-drop-down'),
        getDistanceUnits: function() { return document.querySelector('#distance-units-drop-down option:checked').value },

        // DPI Scaling
        scalingBox: document.getElementById('scaling-box'),
        scalingButtonInputs: document.querySelectorAll("input[name='scaling-buttons']"),
        scalingButtonLabels: document.querySelectorAll("label[for^='scale-']"),

        // Refresh Rate (TODO: Output based on refresh rate)
        refreshRateBox: document.getElementById('refresh-rate-box'),
        refreshRateButtonInputs: document.querySelectorAll("input[name='refresh-rate']"),
        refreshRateButtonLabels: document.querySelectorAll("label[for^='refresh-rate-']"),

        // HDR Bit Depth (TODO: Output based on HDR)
        hdrBox: document.getElementById('hdr-box'),
        hdrButtonInputs: document.querySelectorAll("input[name='hdr-bit']"),
        hdrButtonLabels: document.querySelectorAll("label[for^='hdr-bit-']"),

        // Curvature (TODO: Output based on curvature)
        curvatureBox: document.getElementById('curvature-box'),
        curvatureUnitButtonInputs: document.querySelectorAll("input[name='curvature-units']"),
        curvatureUnitButtonLabels: document.querySelectorAll("label[for^='curvature-units-']"),
    }
    form.doCircuit = function() { circuit(form) }

    componentDiagonal.initialise(form)
    componentResolution.initialise(form)
    componentDistance.initialise(form)
    componentScaling.initialise(form)
    componentRefreshRate.initialise(form)
    componentHDR.initialise(form)
    componentCurvature.initialise(form)

    // Calculate PPD (there may already be input on the form)
    form.doCircuit()
}
