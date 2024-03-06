////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");
/////////////////////////////////////////////////////////////////

const loginForm = document.querySelector("#loginForm");

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
