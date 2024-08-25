////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");
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
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    console.log(email + " " + password);
    main.signInWithEmailAndPassword(main.auth, email, password)
        .then((cred) => {
            alert("Sign in successful");
            window.location.href = "/home.html";
        })
        .catch((error) => {
            console.log(error.code);
        });
});