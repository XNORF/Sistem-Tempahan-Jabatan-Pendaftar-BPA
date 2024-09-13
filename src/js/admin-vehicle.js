////////////////////////////MUST HAVE////////////////////////////
import $ from "jquery";
const main = require("./main.js");
/////////////////////////////////////////////////////////////////
new DataTable('#example');

//untuk modal
// For Tambah Pengguna modal
var modaladd = document.getElementById("ModalTambahKenderaan");
var btnadd = document.getElementById("TambahKenderaan");
var spanadd = document.getElementsByClassName("close-tambah")[0]; // Target the unique class

btnadd.onclick = function() {
    modaladd.style.display = "block";
}

spanadd.onclick = function() {
    modaladd.style.display = "none";
}

// For Kemas Kini Pengguna modal
var modalupdate = document.getElementById("ModalKemasKiniKenderaan");
var btnupdate = document.getElementById("KemasKiniKenderaan");
var spanupdate = document.getElementsByClassName("close-update")[0]; // Target the unique class

btnupdate.onclick = function() {
    modalupdate.style.display = "block";
}

spanupdate.onclick = function() {
    modalupdate.style.display = "none";
}

// Close the modals when clicking outside the modal box
window.onclick = function(event) {
    // Close Tambah Pengguna modal if clicked outside
    if (event.target == modaladd) {
        modaladd.style.display = "none";
    }
    
    // Close Kemas Kini Pengguna modal if clicked outside
    if (event.target == modalupdate) {
        modalupdate.style.display = "none";
    }
}

//end modal
