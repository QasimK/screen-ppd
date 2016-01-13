require('./css/normalize.css');
require('./css/foundation.min.css');
require("./sass/main.sass");


document.addEventListener('DOMContentLoaded', function initialise(event) {
  require('./js/interface.js').initialise()
})
