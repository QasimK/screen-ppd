module.exports = {
    linkBoxToButtons: linkBoxToButtons,
    selectButton: selectButton,
    getInputFromLabel: getInputFromLabel,
}


function linkBoxToButtons(form, box, buttonInputs) {
    // Link an input box to input buttons and vice versa
    console.assert(form !== undefined)
    console.assert(box !== undefined)
    console.assert(buttonInputs !== undefined)

    function onBoxChange(event) {
        const box = event.target
        selectButtonFromBox(buttonInputs, box)
        if (box.value != "") {
            form.doCircuit()
        }
    }

    function onButtonChange(event) {
        const button = event.target
        const buttonValue = button.value
        selectButton(buttonInputs, buttonValue)
        box.value = buttonValue
        form.doCircuit()
    }

    box.addEventListener("input", onBoxChange)
    for (let buttonInput of buttonInputs) {
        buttonInput.addEventListener("change", onButtonChange)
    }

    // Select button from box initially
    selectButtonFromBox(buttonInputs, box)
}


function selectButton(buttonInputs, activeInputValue) {
    for (let buttonInput of buttonInputs) {
        const buttonLabel = buttonInput.labels[0]
        if (buttonInput.value == activeInputValue) {
            buttonInput.checked = true
            buttonLabel.classList.remove('secondary')
        } else {
            buttonInput.checked = false
            buttonLabel.classList.add('secondary')
        }
    }
}


function selectButtonFromBox(buttonInputs, box) {
    activeInputValue = box.value
    for (let buttonInput of buttonInputs) {
        const buttonLabel = buttonInput.labels[0]
        if (buttonInput.value == activeInputValue) {
            buttonInput.checked = true
            buttonLabel.classList.remove('secondary')
        } else {
            buttonInput.checked = false
            buttonLabel.classList.add('secondary')
        }
    }
}


function getInputFromLabel(buttonLabel) {
    return document.getElementById(buttonLabel.htmlFor)
}
