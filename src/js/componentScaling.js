module.exports = {
    initialise: initialise
}

const utils = require('./utils')

function initialise(form) {
    utils.linkBoxToButtons(form, form.scalingBox, form.scalingButtonInputs)
}
