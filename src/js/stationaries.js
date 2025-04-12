////////////////////////////MUST HAVE////////////////////////////
import $ from "jquery";
const main = require("./main.js");
var currentUser;
main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        main.getDoc(main.doc(main.db, "users", user.uid)).then((doc) => {
            currentUser = doc.data();
        });
    }
});
/////////////////////////////////////////////////////////////////

const search = document.querySelector("#SearchAlatTulis");
const list = document.querySelector("#list");
const submit = document.querySelector("#dateForm");
const limit = 5; //LIMIT FOR EACH PAGE
var searchRunning = false;
var value, pValue; //Previous value inputted
var cart = {}; //Cart
var firstVisible,
    lastVisible,
    previousFirstVisible = [],
    currentPage = 1;

//GET TOTAL STATIONARY LIST COUNT
const totalStationary = (await main.getCountFromServer(main.query(main.stationaryDB))).data().count;
const totalPage = Math.ceil(totalStationary / limit);

//DISPLAY LIST WHEN PAGE IS LOADED
getStationary(getQuery("default", false));

//NUMBER PAGINATION
document.querySelectorAll(".pageNav").forEach((btn) => {
    btn.addEventListener("click", () => {
        if (btn.value == "next" && currentPage < totalPage) {
            getStationary(getQuery("next", false));
            currentPage++;
        } else if (btn.value == "previous" && currentPage > 1) {
            getStationary(getQuery("previous", false));
            currentPage--;
        }
        $("#currentPage").text(currentPage);
    });
});

//SEARCH
search.addEventListener("input", (e) => {
    if (searchRunning) {
        searchRunning = false;
    } else {
        //1 SECOND DELAY TO SAVE RESOURCE
        searchRunning = true;
        currentPage = 1;

        setTimeout(function () {
            value = e.target.value.trim().toLowerCase();
            if (value) {
                //DONT QUERY SAME PARAMETER TO SAVE RESOURCE
                $(".pageNav").prop("disabled", true);
                if (value != pValue) {
                    getStationary(getQuery("default", true, value));
                    pValue = value;
                } else {
                    pValue = value;
                }
            } else {
                $(".pageNav").prop("disabled", false);
                getStationary(getQuery("default", false));
            }
            searchRunning = false;
        }, 1000);
    }
    $("#currentPage").text(currentPage);
});

//Format dates
function formatDate(date) {
    date = new Date(date);
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    return dd + "/" + mm + "/" + yyyy;
}

//SUBMIT REQUEST - ADD INTO FIRESTORE & SEND EMAIL
submit.addEventListener("submit", (e) => {
    e.preventDefault();
    $("#submitBtn").prop("disabled", true);
    var neededDate = formatDate($("#neededDate").val());

    const today = new Date();
    const requestDate = formatDate(today);

    //CHECK IF EMPTY, EMPTY JSON IS 2
    if (JSON.stringify(cart).length === 2) {
        console.log("empty");
    } else {
        main.addDoc(main.requestDB, {
            type: "stationary",
            status: "pending",
            request: { cart, neededDate, requestDate, approvedDate: "-" },
            userID: currentUser.id,
            name: currentUser.name,
        })
            .then((success) => {
                console.log("success");
                const subject = "Permohonan Alat Tulis [" + success.id + "]";
                const body = ``;
                //main.sendEmail(currentUser.email, subject, body);
                window.location.href = "request-detail.html?id=" + success.id;
            })
            .catch((error) => {
                console.log(error);
            });
    }
    $("#submitBtn").prop("disabled", false);
});

//LIST STATIONARY BASED ON QUERY INTO HTML
function getStationary(q) {
    main.onSnapshot(q, (snapshot) => {
        //CHECK FIRST AND LAST DOCUMENT
        firstVisible = snapshot.docs[0];
        lastVisible = snapshot.docs[snapshot.docs.length - 1];
        setPreviousList(firstVisible, currentPage);

        //CHECK IF INCREASE DECREASE BUTTON EXIST
        var checkExist = setInterval(function () {
            if ($(".incDecBtn").length) {
                document.querySelectorAll(".incDecBtn").forEach((btn) => {
                    btn.addEventListener("click", incDec);
                });
                clearInterval(checkExist);
            }
        }, 100);
        $("#list div").remove();
        if (!snapshot.empty) {
            snapshot.docs.forEach((doc) => {
                //CHECK EACH QUANTITY IN CART
                var quantity = 0;
                if (cart.hasOwnProperty(doc.data().id)) {
                    quantity = cart[doc.data().id].quantity;
                } else {
                }

                list.innerHTML +=
                    `
                <div class="col-lg-12 py-2">
                <div class="member">
                    <div>
                        <div class="row align-items-center">
                            <div class="col-5">
                                <h2 style="color: #37517e"><b id="itemName">` +
                    doc.data().name +
                    `</b></h2>
                            </div>

                            <div class="col-1">
                                <h4 class="d-none"><b id="itemID">` +
                    doc.data().id +
                    `</b></h4>
                            </div>

                            <div class="col-4">
                                <div class="item-number d-flex justify-content-center align-items-center">
                                    <button class="btn btn-secondary px-3 mx-3 round-50 incDecBtn" id="down" type="button" class="py-1 mx-3"><b>-</b></button>
                                    <span class="pb-0" id="item-count">` +
                    quantity +
                    `</span>
                                    <button class="btn btn-secondary px-14 mx-3 round-50 incDecBtn" id="up" type="button"><b>+</b></button>
                                </div>
                            </div>

                            <div class="col-2">
                                <input type="hidden" id="itemStock" value=` +
                    doc.data().quantity +
                    `>
                                <p class="mt-0">` +
                    doc.data().quantity +
                    " " +
                    doc.data().unit +
                    `</p>
                            </div>
                        </div>
                    </div>
                </div>
                </div>`;
            });
        }
    });
}

//RETURN QUERY FOR FIREBASE
function getQuery(page, isSearching, value) {
    if (isSearching) {
        return main.query(main.stationaryDB, main.orderBy("quantity", "desc"), main.limit(limit), main.where("tags", "array-contains-any", [value]));
    } else {
        switch (page) {
            case "default":
                return main.query(main.stationaryDB, main.orderBy("quantity", "desc"), main.limit(limit));
                break;
            case "next":
                return main.query(main.stationaryDB, main.orderBy("quantity", "desc"), main.limit(limit), main.startAfter(lastVisible));
                break;
            case "previous":
                return main.query(main.stationaryDB, main.orderBy("quantity", "desc"), main.limit(limit), main.startAt(previousFirstVisible[currentPage - 2]));
                break;
        }
    }
}

//INCREASE OR DECREASE ITEM COUNT FOR EACH INDIVIDUAL ITEM & ADD TO CART FOR TRACKING
function incDec() {
    //ITEM COUNT
    const count = this.closest(".member").querySelector("#item-count");
    const itemID = this.closest(".member").querySelector("#itemID").innerText;
    const itemName = this.closest(".member").querySelector("#itemName").innerText;
    const itemStock = parseInt(this.closest(".member").querySelector("#itemStock").value);
    var num = parseInt(count.innerText);
    if (this.matches("#up") && num + 1 <= itemStock) {
        num++;
    } else if (this.matches("#down")) {
        num--;
    }
    num = num < 0 ? 0 : num;
    count.innerText = num;

    //INSERT INTO CART
    cart = { ...cart, [itemID]: { name: itemName, quantity: num, approved: "-" } };
    if (cart[itemID].quantity == 0) {
        delete cart[itemID];
    }
}

//FUNCTION TO DEFINE THE FIRST FOR EACH PAGE OF THE LIST
function setPreviousList(doc, page) {
    page -= 1;
    if (!previousFirstVisible[page]) {
        previousFirstVisible.push(doc);
    }
}

//CART BUTTON HOVER TOGGLE
document.getElementById("cartbtn").addEventListener("click", function () {
    var cartBox = document.getElementById("cartbox");

    if (JSON.stringify(cart).length === 2) {
        $("#cartbox a").remove();
        cartBox.innerHTML += `<a href='#'>Tiada alat tulis di dalam cart</a>`;
    } else {
        $("#cartbox a").remove();
        var index = 1;
        $.each(cart, function (i, item) {
            cartBox.innerHTML += `<a href="#" id="` + i + `">` + index + `. ` + item.name + ` - ` + item.quantity + `</a>`;
            index++;
        });
    }
    if (cartBox.style.display === "block") {
        cartBox.style.display = "none";
    } else {
        cartBox.style.display = "block";
    }
});

// Optional: Close the cart box if the user clicks outside of it
window.onclick = function (event) {
    var cartBox = document.getElementById("cartbox");
    var cartBtn = document.getElementById("cartbtn");
    if (event.target !== cartBox && event.target !== cartBtn) {
        cartBox.style.display = "none";
    }
};

//untuk modal
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("Mohonbtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
    if (Object.keys(cart).length == 0) {
        alert("Tiada item di dalam troli");
    } else {
        modal.style.display = "block";
    }
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
