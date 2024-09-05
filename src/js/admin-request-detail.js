////////////////////////////MUST HAVE////////////////////////////
import $ from "jquery";
const main = require("./main.js");
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
