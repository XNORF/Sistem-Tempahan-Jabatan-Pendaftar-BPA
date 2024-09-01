////////////////////////////MUST HAVE////////////////////////////
import $ from "jquery";
import { v4 as uuidv4 } from "uuid";

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
        document.querySelector("#userType").value = data.type;
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
    const type = document.querySelector("#userType").value;

    main.updateDoc(main.doc(main.db, "users", id), {
        id,
        name,
        empID,
        phone,
        email,
        type,
    }).then(() => {
        alert("User updated successfully!");
        $("#updateUserForm").get(0).reset();
    });
});

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
//UNCOMMENT WHEN DEPLOYING
/* //GET
main.onSnapshot(main.query(main.stationaryDB, main.orderBy("quantity", "desc")), (snapshot) => {
    $("#stationaryList").empty();

    snapshot.docs.forEach((doc, index) => {
        const data = doc.data();

        $("#stationaryList").append(
            `
            <tr id="` +
                data.id +
                `">
                <th scope="row">` +
                (index + 1) +
                `</th>
                <td>` +
                data.name +
                `</td>
                <td>` +
                data.quantity +
                `</td>
                <td>` +
                data.unit +
                `</td>
                <td><button class="btn btn-primary updateStationaryBtn" id="` +
                data.id +
                `">Kemas kini</button></td>
            </tr>
            `
        );
    });
}); */

//ADD
var lastID;
await main.onSnapshot(main.query(main.stationaryDB, main.orderBy("id", "desc"), main.limit(1)), (snapshot) => {
    lastID = parseInt(snapshot.docs[0].data().id, 10);
});

const stationaryForm = document.querySelector("#addStationaryForm");
stationaryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    $("#addStationaryBtn").prop("disabled", true);

    const name = stationaryForm.name.value;
    const quantity = stationaryForm.quantity.value;
    const unit = stationaryForm.unit.value;
    const id = pad(lastID + 1, 3);
    const data = { id, name, quantity, unit };

    data.tags = getTags(data);
    console.log(id);

    main.setDoc(main.doc(main.db, "stationaries", data.id), data)
        .then((success) => {
            // Clear the form and hide the new admin form
            alert("New stationary added successfully!");
            $("#addStationaryForm").get(0).reset();
            $("#addStationaryBtn").prop("disabled", false);
        })
        .catch((error) => {
            console.log(error);
        });
});

function getTags(data) {
    var tags = [];
    var tempStr = "";

    //SPLIT SENTENCES INTO INDIVIDUAL WORDS
    const textArray = data.name.split(" ");
    textArray.forEach((word, index) => {
        //SPELL EACH SENTENCES
        for (var i = 1; i <= word.length; i++) {
            tempStr += word.substring(i - 1, i).toLowerCase();
            if (i == word.length && textArray.length - 1 != index) {
                tags.push(tempStr);
                tempStr += " ";
            }
            tags.push(tempStr);
        }

        //SPELL EACH WORDS STARTING WITH 2ND WORD
        for (var i = 1; i <= word.length; i++) {
            if (index > 0) {
                tags.push(word.substring(0, i).toLowerCase());
            } else {
                if (i != 1) {
                    tags.push(word.toLowerCase());
                }
                break;
            }
        }
    });
    tags.push(data.id);
    return tags;
}

function pad(n, length) {
    var len = length - ("" + n).length;
    return (len > 0 ? new Array(++len).join("0") : "") + n;
}

//UPDATE
//Open update "modal"
const updateStationaryForm = document.querySelector("#updateStationaryForm");
$("#stationaryList").on("click", ".updateStationaryBtn", function () {
    const id = $(this).attr("id");

    main.getDoc(main.doc(main.db, "stationaries", id)).then((doc) => {
        const data = doc.data();
        console.log(data);
        updateStationaryForm.id.value = data.id;
        updateStationaryForm.name.value = data.name;
        updateStationaryForm.unit.value = data.unit;
        updateStationaryForm.quantity.value = data.quantity;
    });
});

//Update data
updateStationaryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = updateStationaryForm.id.value;
    const name = updateStationaryForm.name.value;
    const unit = updateStationaryForm.unit.value;
    const quantity = updateStationaryForm.quantity.value;
    const data = { id, name, quantity, unit };

    data.tags = getTags(data);

    main.updateDoc(main.doc(main.db, "stationaries", id), data).then(() => {
        alert("Stationary updated successfully!");
        $("#updateStationaryForm").get(0).reset();
    });
});

//DELETE
$("#deleteStationaryBtn").on("click", (e) => {
    e.preventDefault();
    const id = updateStationaryForm.id.value;
    const name = updateStationaryForm.name.value;

    if (confirm("Padam " + name + "?")) {
        main.deleteDoc(main.doc(main.db, "stationaries", id)).then(() => {
            alert(name + " berjaya dipadam");
            $("#updateStationaryForm").get(0).reset();
        });
    }
});
////////////////////////////////////////////////////////////

////////////////////////////VEHICLE////////////////////////////
//GET
main.onSnapshot(main.query(main.vehicleDB, main.orderBy("status", "asc")), (snapshot) => {
    $("#vehicleList").empty();

    snapshot.docs.forEach((doc, index) => {
        const data = doc.data();

        $("#vehicleList").append(
            `
            <tr id="` +
                doc.id +
                `">
                <th scope="row">` +
                (index + 1) +
                `</th>
                <td>` +
                data.name +
                `</td>
                <td>` +
                data.status +
                `</td>
                <td><button class="btn btn-primary updateVehicleBtn" id="` +
                doc.id +
                `">Kemas kini</button></td>
            </tr>
            `
        );
    });
});
//ADD
const addVehicleForm = document.querySelector("#addVehicleForm");
addVehicleForm.addEventListener("submit", (e) => {
    e.preventDefault();
    $("#addVehicleBtn").prop("disabled", true);

    const name = addVehicleForm.name.value;
    const status = document.querySelector("#vehicleStatus").value;
    const image = addVehicleForm.img.files[0];
    const imgID = uuidv4();
    const imgRef = main.ref(main.storage, "vehicle/" + imgID);
    if (imgSize(image)) {
        main.uploadBytes(imgRef, image).then((img) => {
            main.getDownloadURL(img.ref).then((imgURL) => {
                const data = { name, status, img: imgURL, imgID };
                main.addDoc(main.vehicleDB, data)
                    .then((success) => {
                        // Clear the form and hide the new admin form
                        alert("New vehicle added successfully!");
                        $("#addVehicleForm").get(0).reset();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        });
    }

    $("#addVehicleBtn").prop("disabled", false);
});

//UPDATE
//Open update "modal"
const updateVehicleForm = document.querySelector("#updateVehicleForm");
$("#vehicleList").on("click", ".updateVehicleBtn", function () {
    const id = $(this).attr("id");

    main.getDoc(main.doc(main.db, "vehicle", id)).then((doc) => {
        const data = doc.data();
        console.log(data);
        updateVehicleForm.id.value = doc.id;
        updateVehicleForm.name.value = data.name;
        document.querySelector("#vehicleUpdateStatus").value = data.status;
        updateVehicleForm.imgID.value = data.imgID;
        updateVehicleForm.imgURL.value = data.img;
    });
});

//Update data
updateVehicleForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = updateVehicleForm.id.value;
    const name = updateVehicleForm.name.value;
    const status = document.querySelector("#vehicleUpdateStatus").value;
    const image = updateVehicleForm.img.files[0];
    const imgID = updateVehicleForm.imgID.value;

    if (updateVehicleForm.img.files.length === 0) {
        const currentImgURL = updateVehicleForm.imgURL.value;
        const data = { name, status, img: currentImgURL, imgID };
        main.updateDoc(main.doc(main.db, "vehicle", id), data)
            .then((success) => {
                // Clear the form and hide the new admin form
                alert("Vehicle updated successfully!");
                $("#updateVehicleForm").get(0).reset();
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        if (imgSize(image)) {
            const imgRef = main.ref(main.storage, "vehicle/" + imgID);
            main.uploadBytes(imgRef, image).then((img) => {
                main.getDownloadURL(img.ref).then((imgURL) => {
                    const data = { name, status, img: imgURL, imgID };
                    main.updateDoc(main.doc(main.db, "vehicle", id), data)
                        .then((success) => {
                            // Clear the form and hide the new admin form
                            alert("Vehicle updated successfully!");
                            $("#updateVehicleForm").get(0).reset();
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });
            });
        }
    }
});

//DELETE
$("#deleteVehicleBtn").on("click", (e) => {
    e.preventDefault();
    const id = updateVehicleForm.id.value;
    const name = updateVehicleForm.name.value;
    const imgID = updateVehicleForm.imgID.value;
    const imgRef = main.ref(main.storage, "vehicle/" + imgID);

    if (confirm("Padam " + name + "?")) {
        main.deleteDoc(main.doc(main.db, "vehicle", id)).then(() => {
            main.deleteObject(imgRef).then(() => {
                alert(name + " berjaya dipadam");
                $("#updateVehicleForm").get(0).reset();
            });
        });
    }
});
////////////////////////////////////////////////////////////

////////////////////////////ROOM////////////////////////////
//GET
main.onSnapshot(main.query(main.roomDB, main.orderBy("status", "asc")), (snapshot) => {
    $("#roomList").empty();

    snapshot.docs.forEach((doc, index) => {
        const data = doc.data();

        $("#roomList").append(
            `
            <tr id="` +
                doc.id +
                `">
                <th scope="row">` +
                (index + 1) +
                `</th>
                <td>` +
                data.name +
                `</td>
                <td>` +
                data.location +
                `</td>
                <td>` +
                data.status +
                `</td>
                <td><button class="btn btn-primary updateRoomBtn" id="` +
                doc.id +
                `">Kemas kini</button></td>
            </tr>
            `
        );
    });
});

//ADD
const addRoomForm = document.querySelector("#addRoomForm");
addRoomForm.addEventListener("submit", (e) => {
    e.preventDefault();
    $("#addRoomBtn").prop("disabled", true);

    const name = addRoomForm.name.value;
    const location = addRoomForm.location.value;
    const status = document.querySelector("#roomStatus").value;
    const image = addRoomForm.img.files[0];
    const imgID = uuidv4();
    const imgRef = main.ref(main.storage, "room/" + imgID);
    if (imgSize(image)) {
        main.uploadBytes(imgRef, image).then((img) => {
            main.getDownloadURL(img.ref).then((imgURL) => {
                const data = { name, status, location, img: imgURL, imgID };
                main.addDoc(main.roomDB, data)
                    .then((success) => {
                        // Clear the form and hide the new admin form
                        alert("New room added successfully!");
                        $("#addRoomForm").get(0).reset();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        });
    }

    $("#addRoomBtn").prop("disabled", false);
});

//UPDATE
//Open update "modal"
const updateRoomForm = document.querySelector("#updateRoomForm");
$("#roomList").on("click", ".updateRoomBtn", function () {
    const id = $(this).attr("id");

    main.getDoc(main.doc(main.db, "room", id)).then((doc) => {
        const data = doc.data();
        console.log(data);
        updateRoomForm.id.value = doc.id;
        updateRoomForm.name.value = data.name;
        updateRoomForm.location.value = data.location;
        document.querySelector("#roomUpdateStatus").value = data.status;
        updateRoomForm.imgID.value = data.imgID;
        updateRoomForm.imgURL.value = data.img;
    });
});

//Update data
updateRoomForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = updateRoomForm.id.value;
    const name = updateRoomForm.name.value;
    const location = updateRoomForm.location.value;
    const status = document.querySelector("#roomUpdateStatus").value;
    const image = updateRoomForm.img.files[0];
    const imgID = updateRoomForm.imgID.value;

    if (updateRoomForm.img.files.length === 0) {
        const currentImgURL = updateRoomForm.imgURL.value;
        const data = { name, status, img: currentImgURL, imgID };
        main.updateDoc(main.doc(main.db, "room", id), data)
            .then((success) => {
                // Clear the form and hide the new admin form
                alert("Room updated successfully!");
                $("#updateRoomForm").get(0).reset();
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        if (imgSize(image)) {
            const imgRef = main.ref(main.storage, "room/" + imgID);
            main.uploadBytes(imgRef, image).then((img) => {
                main.getDownloadURL(img.ref).then((imgURL) => {
                    const data = { name, status, img: imgURL, imgID };
                    main.updateDoc(main.doc(main.db, "room", id), data)
                        .then((success) => {
                            // Clear the form and hide the new admin form
                            alert("Room updated successfully!");
                            $("#updateRoomForm").get(0).reset();
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });
            });
        }
    }
});

//DELETE
$("#deleteRoomBtn").on("click", (e) => {
    e.preventDefault();
    const id = updateRoomForm.id.value;
    const name = updateRoomForm.name.value;
    const imgID = updateRoomForm.imgID.value;
    const imgRef = main.ref(main.storage, "room/" + imgID);

    if (confirm("Padam " + name + "?")) {
        main.deleteDoc(main.doc(main.db, "room", id)).then(() => {
            main.deleteObject(imgRef).then(() => {
                alert(name + " berjaya dipadam");
                $("#updateRoomForm").get(0).reset();
            });
        });
    }
});
////////////////////////////////////////////////////////////

//Check image size
function imgSize(file) {
    if (file.size > 2097152) {
        alert("Image size must be less than 2MB");
        return false;
    } else {
        return true;
    }
}
