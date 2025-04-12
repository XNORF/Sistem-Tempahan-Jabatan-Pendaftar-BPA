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

const loginForm = document.querySelector("#loginForm");

// loginForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     const email = loginForm.email.value;
//     const password = loginForm.password.value;
//     console.log(email + " " + password);
//     main.signInWithEmailAndPassword(main.auth, email, password)
//         .then((cred) => {
//             alert("Sign in successful");
//             window.location.href = "/home.html";
//         })
//         .catch((error) => {
//             console.log(error.code);
//         });
// });

// Function to toggle password visibility

function togglePassword() {
    var passwordField = document.getElementById("form2Example27");
    var eyeIcon = document.getElementById("toggleEye");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const type = loginForm.userType.value;
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    if (type == "Admin") {
        main.onSnapshot(main.query(main.usersDB, main.where("email", "==", email), main.where("type", "==", type)), (snapshot) => {
            if (snapshot.docs.length == 1) {
                main.signInWithEmailAndPassword(main.auth, email, password)
                    .then((cred) => {
                        alert("Sign in successful");
                        window.location.href = "/admin-home.html";
                    })
                    .catch((error) => {
                        alert(error.code);
                    });
            } else {
                alert("Tiada akses admin");
            }
        });
    } else {
        main.signInWithEmailAndPassword(main.auth, email, password)
            .then((cred) => {
                alert("Sign in successful");
                window.location.href = "/home.html";
            })
            .catch((error) => {
                alert(error.code);
            });
    }
});

$("#tab-user").on("click", (e) => {
    $("#tab-user").addClass("active");
    $("#tab-admin").removeClass("active");
    $("#userType").val("User");
});

$("#tab-admin").on("click", (e) => {
    $("#tab-admin").addClass("active");
    $("#tab-user").removeClass("active");
    $("#userType").val("Admin");
});
