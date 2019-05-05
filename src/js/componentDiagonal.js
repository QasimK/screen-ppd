module.exports = {
    initialise: initialise
}

const utils = require('./utils')


function initialise(form) {
    form.diagonalBox.addEventListener("change", onDiagonalBoxChange)
    for (let element of form.diagonalUnitButtonInputs) {
        element.addEventListener("change", onDiagonalUnitsChange)
    }

    // Select correct button and text initially
    setDiagonalUnitsOnly()
}


function onDiagonalBoxChange(event) {
    const value = event.target.value
    if (value !== "" && value !== "0") {
        form.doCircuit()
    }
}


function onDiagonalUnitsChange () {
    var diagonalUnits = form.getSelectedDiagonalUnit()

    // Update diagonal length
    var DSF
    if (diagonalUnits === 'cm') {
        DSF = 2.54
    } else if (diagonalUnits === 'inches') {
        DSF = 1 / 2.54
    } else {
        window.alert("Unknown diagonal units: " + diagonalUnits)
    }
    var newLength = Math.round(DSF * parseInt(form.diagonalBox.value, 10))
    form.diagonalBox.value = newLength

    setDiagonalUnitsOnly()
    form.doCircuit()
}


function setDiagonalUnitsOnly() {
    const units = form.getSelectedDiagonalUnit()
    utils.selectButton(form.diagonalUnitButtonInputs, units)

    // Update text
    if (units === 'cm') {
        document.getElementById('monitor-size-units').innerHTML = 'cm'
        document.querySelector("label[for='ppu']").innerHTML = 'PPCM:'
        document.querySelector("label[for='scaled-ppu']").innerHTML = 'Scaled PPCM:'
    } else if (units == 'inches') {
        document.getElementById('monitor-size-units').innerHTML = 'inches'
        document.querySelector("label[for='ppu']").innerHTML = 'PPI:'
        document.querySelector("label[for='scaled-ppu']").innerHTML = 'Scaled PPI:'
    } else {
        window.alert('Unknown units - setDiagonalUnitsOnly()')
    }
}
