module.exports = {
    initialise: initialise
}

var prevDistanceUnits


function initialise(form) {
    prevDistanceUnits = form.getDistanceUnits()

    form.distanceBox.addEventListener("input", onDistanceBoxChange)
    form.distanceSlider.addEventListener("input", onDistanceSliderChange)
    form.distanceUnitsDropDown.addEventListener("change", onDistanceUnitsDropDownChange)
}


function onDistanceBoxChange () {
    const newDistance = form.distanceBox.value
    if (newDistance != "") {
        form.distanceSlider.value = newDistance
        form.doCircuit()
    }
}


function onDistanceSliderChange() {
    form.distanceBox.value = form.distanceSlider.value
    form.doCircuit()
}


function onDistanceUnitsDropDownChange () {
    updateDistanceSliderAttributes()

    const distance = form.distanceBox.value
    if (distance !== "") {
        updateDistanceValues()
        form.doCircuit()
    }
}


function updateDistanceValues () {
    var oldDistance = parseFloat(form.distanceBox.value, 10)
    if (isNaN(oldDistance)) {
        return
    }

    var distanceUnits = form.getDistanceUnits()
    if (prevDistanceUnits === distanceUnits) {
        return
    }

    var DSF
    if (prevDistanceUnits === 'inches' && distanceUnits === 'cm') {
        DSF = 2.54
    } else if (prevDistanceUnits === 'cm' && distanceUnits === 'inches') {
        DSF = 0.393700
    } else if (prevDistanceUnits === 'inches' && distanceUnits === 'feet') {
        DSF = 0.083333 // 1 / 12
    } else if (prevDistanceUnits === 'feet' && distanceUnits === 'inches') {
        DSF = 12
    } else if (prevDistanceUnits === 'inches' && distanceUnits === 'metres') {
        DSF = 0.0254 // 2.54 / 100
    } else if (prevDistanceUnits === 'metres' && distanceUnits === 'inches') {
        DSF = 39.37
    } else if (prevDistanceUnits === 'cm' && distanceUnits === 'feet') {
        DSF = 0.032808 // 1 / 30.48
    } else if (prevDistanceUnits === 'feet' && distanceUnits === 'cm') {
        DSF = 30.48
    } else if (prevDistanceUnits === 'cm' && distanceUnits === 'metres') {
        DSF = 0.01 // 1 / 100
    } else if (prevDistanceUnits === 'metres' && distanceUnits === 'cm') {
        DSF = 100
    } else if (prevDistanceUnits === 'feet' && distanceUnits === 'metres') {
        DSF = 0.3048 // 30.48 / 100
    } else if (prevDistanceUnits === 'metres' && distanceUnits === 'feet') {
        DSF = 3.280839
    } else {
        window.alert("Bug updateDistanceValues() - unknown distance units")
    }

    // New distance values
    var stepSize = form.distanceSlider.step
    var newDistance = Math.max(1, stepSize * Math.round(DSF * (1 / stepSize) * oldDistance))
    form.distanceBox.value = newDistance
    form.distanceSlider.value = newDistance

    prevDistanceUnits = distanceUnits
}

function updateDistanceSliderAttributes() {
    var distanceUnits = form.getDistanceUnits()

    var maxSize
    var stepSize = 1
    if (distanceUnits === 'inches') {
        maxSize = 100
    } else if (distanceUnits === 'cm') {
        maxSize = 100
    } else if (distanceUnits === 'feet') {
        maxSize = 33
    } else if (distanceUnits === 'metres') {
        maxSize = 10
        stepSize = 0.1
    }

    form.distanceSlider.max = maxSize
    form.distanceSlider.step = stepSize
}
