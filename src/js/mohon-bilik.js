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
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const roomID = urlParams.get("id");

main.getDoc(main.doc(main.db, "room", roomID)).then((doc) => {
    const data = doc.data();

    $("#roomName").text(data.name);
    $("#roomLocation").text(data.location);
});

//OTHER CATERER
$("#caterer").on("change", function () {
    console.log(this.value);
    if (this.value == "0") {
        $("#catererOther").prop("disabled", false);
    } else {
        console.log("test");
        $("#catererOther").prop("disabled", true);
    }
});
