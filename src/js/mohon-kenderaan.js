////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");
/////////////////////////////////////////////////////////////////
function toggleEndDate() {
    var daysSelect = document.getElementById("days");
    var endDateInput = document.getElementById("end_date");

    if (daysSelect.value === "balik_hari") {
        endDateInput.disabled = true;
        endDateInput.required = false;
        endDateInput.value = ""; // Clear the value
    } else {
        endDateInput.disabled = false;
        endDateInput.required = true;
    }
}