////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");
/////////////////////////////////////////////////////////////////

// toggle untuk nak tunjuk section tempahan jamuan
function toggleSection2(value) {
    var section2 = document.getElementById("section2");
    if (value === "1") {  // Check for the value "1" instead of "yes"
        section2.style.display = "block";
    } else {
        section2.style.display = "none";
    }
}
