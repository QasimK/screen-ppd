module.exports = {
    initialise: initialise
}

const utils = require('./utils')


function initialise(form) {
    form.curvatureBox.addEventListener("input", () => onCurvatureBoxChange(form))
    for (let buttonInput of form.curvatureUnitButtonInputs) {
        buttonInput.addEventListener("change", (event) => onCurvatureUnitButtonChange(form, event))
    }

    // Select button from box initially
    onCurvatureBoxChange(form)
}


function onCurvatureBoxChange(form) {
    const boxValue = form.curvatureBox.value
    if (boxValue === "" || boxValue === "0") {
        utils.selectButton(form.curvatureUnitButtonInputs, 'flat')
        form.curvatureBox.value = ""
    } else {
        utils.selectButton(form.curvatureUnitButtonInputs, 'mm')
    }
    form.doCircuit()
}


function onCurvatureUnitButtonChange(form, event) {
    const units = event.target.value
    if (units == "flat") {
        utils.selectButton(form.curvatureUnitButtonInputs, 'flat')
        form.curvatureBox.value = ""
    } else if (units == 'mm') {
        utils.selectButton(form.curvatureUnitButtonInputs, 'mm')
        if (form.curvatureBox.value === "" || form.curvatureBox.value === "0") {
            form.curvatureBox.value = 1500
        }
    } else {
        window.alert('Unknown units - onCurvatureUnitButtonChange()')
    }
    form.doCircuit()
}
