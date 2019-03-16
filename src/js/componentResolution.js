module.exports = {
    initialise: initialise
}


function initialise(form) {
    form.resolutionWidth.addEventListener("input", onResolutionChange)
    form.resolutionHeight.addEventListener("input", onResolutionChange)
    form.resolutionDropDown.addEventListener("change", onResolutionDropDownChange)
}


function onResolutionChange () {
    const [newWidth, newHeight] = [form.resolutionWidth.value, form.resolutionHeight.value]

    // Update ResolutionDropDown
    form.resolutionDropDown.value = ""
    for (let option of form.resolutionDropDown.children) {
        const [elementWidth, elementHeight] = option.value.split('x')
        if (elementWidth == newWidth && elementHeight == newHeight) {
            form.resolutionDropDown.value = option.value
        }
    }

    if (newWidth != "" && newHeight != "") {
        form.doCircuit()
    }
}


function onResolutionDropDownChange () {
    // Update Resolution Width & Height boxes
    const [newWidth, newHeight] = form.resolutionDropDown.value.split('x')
    if (newWidth != "" && newHeight != "") {
        form.resolutionWidth.value = newWidth
        form.resolutionHeight.value = newHeight
        form.doCircuit()
    }
}
