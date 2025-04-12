////////////////////////////MUST HAVE////////////////////////////
import $ from "jquery";
const main = require("./main.js");
var currentUser;
var userData;
main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        currentUser = user;
        main.getDoc(main.doc(main.db, "users", user.uid)).then((doc) => {
            userData = doc.data();
        });
    }
});
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