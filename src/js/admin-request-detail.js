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
//untuk butiran admin
document.addEventListener("DOMContentLoaded", function() {
    const textareas = document.querySelectorAll(".butiranTextarea");

    textareas.forEach(function(textarea) {
        // Check if textarea has a value, if not set a default placeholder
        if (!textarea.value.trim()) {
            textarea.value = "Admin boleh menulis sebarang informasi tambahan buat pengguna disini.";
        }

        textarea.addEventListener("focus", function() {
            if (textarea.value === "Admin boleh menulis sebarang informasi tambahan buat pengguna disini.") {
                textarea.value = "";
            }
        });

        textarea.addEventListener("blur", function() {
            if (!textarea.value.trim()) {
                textarea.value = "Admin boleh menulis sebarang informasi tambahan buat pengguna disini.";
            }
        });
    });
});
