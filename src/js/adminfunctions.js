////////////////////////////MUST HAVE////////////////////////////
import $ from "jquery";
const main = require("./main.js");
var currentUser;
main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        currentUser = user;
        console.log(user);
    }
});
/////////////////////////////////////////////////////////////////

////////////////////////////USER////////////////////////////
//GET
main.onSnapshot(main.query(main.usersDB), (snapshot) => {
    $("#userList").empty();

    snapshot.docs.forEach((doc, index) => {
        const data = doc.data();

        $("#userList").append(
            `
            <tr id="` +
                data.id +
                `">
                <th scope="row">` +
                (index + 1) +
                `</th>
                <td>` +
                data.empID +
                `</td>
                <td>` +
                data.name +
                `</td>
                <td>` +
                data.email +
                `</td>
                <td>` +
                data.phone +
                `</td>
                <td>` +
                data.type +
                `</td>
                <td><button class="btn btn-primary updateUserBtn" id="` +
                data.id +
                `">Kemas kini</button></td>
            </tr>
            `
        );
    });
});

//ADD
const userForm = document.querySelector("#addUserForm");
userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    $("#addUserBtn").prop("disabled", true);

    const name = userForm.name.value;
    const empID = userForm.empID.value;
    const phone = userForm.phone.value;
    const email = userForm.email.value;
    const password = "spbpajp123";

    main.createUserWithEmailAndPassword(main.auth2, email, password)
        .then((cred) => {
            if (cred.user != null) {
                main.updateProfile(main.auth2.currentUser, {
                    displayName: name,
                    phoneNumber: phone,
                })
                    .then(() => {
                        main.setDoc(main.doc(main.db, "users", cred.user.uid), {
                            email,
                            empID,
                            phone,
                            name,
                            type: "User",
                            id: cred.user.uid,
                        }).then(() => {
                            // Clear the form and hide the new admin form
                            alert("New user added successfully!");
                            $("#addUserForm").get(0).reset();
                            $("#addUserBtn").prop("disabled", false);
                            main.signOut(main.auth2);
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        })
        .catch((err) => {
            alert(err.message);
        });
});

//UPDATE
//Open update "modal"
const updateUserForm = document.querySelector("#updateUserForm");
$("#userList").on("click", ".updateUserBtn", function () {
    const id = $(this).attr("id");

    main.getDoc(main.doc(main.db, "users", id)).then((doc) => {
        const data = doc.data();
        console.log(data);
        updateUserForm.id.value = data.id;
        updateUserForm.name.value = data.name;
        updateUserForm.empID.value = data.empID;
        updateUserForm.phone.value = data.phone;
        updateUserForm.email.value = data.email;
    });
});

//Update data
updateUserForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = updateUserForm.id.value;
    const name = updateUserForm.name.value;
    const empID = updateUserForm.empID.value;
    const phone = updateUserForm.phone.value;
    const email = updateUserForm.email.value;

    main.updateDoc(main.doc(main.db, "users", id), {
        id,
        name,
        empID,
        phone,
        email,
    }).then(() => {
        $("#updateUserForm").get(0).reset();
    });
});
//DELETE

////////////////////////////////////////////////////////////

////////////////////////////REQUEST////////////////////////////
//GET
main.onSnapshot(main.query(main.requestDB, main.orderBy("status", "desc")), (snapshot) => {
    $("#requestList").empty();

    snapshot.docs.forEach((doc, index) => {
        const data = doc.data();

        var type;
        var status;

        if (data.type == "stationary") {
            type = "Alat Tulis";
        } else if (data.type == "vehicle") {
            type = "Kenderaan";
        } else if (data.type == "room") {
            type = "Bilik";
        }

        if (data.status == "pending") {
            status = "Belum selesai";
        } else if (data.status == "complete") {
            status = "Selesai";
        }

        $("#requestList").append(
            `
            <tr>
                <th scope="row">` +
                (index + 1) +
                `</th>
                <td>` +
                type +
                `</td>
                <td>` +
                data.name +
                `</td>
                <td>` +
                data.request.neededDate +
                `</td>
                <td>` +
                status +
                `</td>
                <td><a href="" class="btn btn-primary">Lebih lanjut</a></td>
            </tr>
        `
        );
    });
});
////////////////////////////////////////////////////////////

////////////////////////////STATIONARY////////////////////////////

////////////////////////////////////////////////////////////

////////////////////////////VEHICLE////////////////////////////

////////////////////////////////////////////////////////////

////////////////////////////ROOM////////////////////////////

////////////////////////////////////////////////////////////
