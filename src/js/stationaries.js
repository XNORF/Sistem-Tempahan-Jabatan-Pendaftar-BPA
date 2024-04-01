////////////////////////////MUST HAVE////////////////////////////
import $ from "jquery";
const main = require("./main.js");
var currentUser;
main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        currentUser = user;
    }
});
/////////////////////////////////////////////////////////////////

const search = document.querySelector("#SearchAlatTulis");
const list = document.querySelector("#list");
const submit = document.querySelector("#Mohonbtn");
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

//SUBMIT REQUEST - ADD CART INTO FIRESTORE & SEND EMAIL
submit.addEventListener("click", (e) => {
    e.target.disabled = true;
    //CHECK IF EMPTY, EMPTY JSON IS 2
    if (JSON.stringify(cart).length === 2) {
        console.log("empty");
    } else {
        main.addDoc(main.cartDB, {
            approved: {},
            request: cart,
            userID: currentUser.uid,
        })
            .then((success) => {
                main.sendEmail(currentUser.email, success.id);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    e.target.disabled = false;
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
                                <h2 style="color: #37517e"><b>` +
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
        return main.query(main.stationaryDB, main.orderBy("name"), main.limit(limit), main.where("tags", "array-contains-any", [value]));
    } else {
        switch (page) {
            case "default":
                return main.query(main.stationaryDB, main.orderBy("name"), main.limit(limit));
                break;
            case "next":
                return main.query(main.stationaryDB, main.orderBy("name"), main.limit(limit), main.startAfter(lastVisible));
                break;
            case "previous":
                return main.query(main.stationaryDB, main.orderBy("name"), main.limit(limit), main.startAt(previousFirstVisible[currentPage - 2]));
                break;
        }
    }
}

//INCREASE OR DECREASE ITEM COUNT FOR EACH INDIVIDUAL ITEM & ADD TO CART FOR TRACKING
function incDec() {
    //ITEM COUNT
    const count = this.closest(".member").querySelector("#item-count");
    const itemID = this.closest(".member").querySelector("#itemID").innerText;
    var num = parseInt(count.innerText);
    if (this.matches("#up")) {
        num++;
    } else {
        num--;
    }
    num = num < 0 ? 0 : num;
    count.innerText = num;

    //INSERT INTO CART
    cart = { ...cart, [itemID]: { quantity: num } };
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
