////////////////////////////MUST HAVE////////////////////////////
import $ from "jquery";
const main = require("./main.js");
/////////////////////////////////////////////////////////////////

const search = document.querySelector("#SearchAlatTulis");
const list = document.querySelector("#list");
var value;
var pValue; //Previous value inputted
var cart = {}; //Temporary cart

//DISPLAY LIST WHEN PAGE IS LOADED
getStationary(getQuery(0, false));

//SEARCH
search.addEventListener("input", (e) => {
    //1 SECOND DELAY TO SAVE RESOURCE
    setTimeout(function () {
        value = e.target.value.trim().toLowerCase();
        if (value) {
            //DONT QUERY SAME PARAMETER TO SAVE RESOURCE
            if (value != pValue) {
                getStationary(getQuery(0, true, value));
                pValue = value;
            } else {
                pValue = value;
            }
        } else {
            getStationary(getQuery(0, false));
        }
    }, 1000);
});

//LIST STATIONARY BASED ON QUERY INTO HTML
function getStationary(q) {
    main.onSnapshot(q, (snapshot) => {
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
    const limit = 10;
    if (isSearching) {
        return main.query(main.stationaryDB, main.orderBy("name"), main.limit(limit), main.where("tags", "array-contains-any", [value]));
    } else {
        return main.query(main.stationaryDB, main.orderBy("name"), main.limit(limit));
    }
}

//INCREASE OR DECREASE ITEM COUNT FOR EACH INDIVIDUAL ITEM & ADD TO TEMPORARY CART FOR TRACKING
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

    //INSERT INTO TEMPORARY CART
    cart = { ...cart, [itemID]: { quantity: num } };
    console.log(cart);
}
