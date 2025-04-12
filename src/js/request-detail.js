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
const requestID = urlParams.get("id");

main.getDoc(main.doc(main.db, "request", requestID)).then((doc) => {
    const requestData = doc.data();

    $("#requestDate").text(requestData.request.requestDate);
    $("#neededDate").text(requestData.request.neededDate);
    $("#approvedDate").text(requestData.request.approvedDate);

    const cart = requestData.request.cart;

    $("#tableContent").empty();
    var index = 0;
    $.each(cart, function (i, item) {
        $("#tableContent").append(
            `
            <tr>
                <th class="textCenter" scope="row">` +
                (index + 1) +
                `</th>
                <td>` +
                item.name +
                `</td>
                <td class="textCenter">` +
                item.quantity +
                `</td>
                <td class="textCenter">` +
                item.approved +
                `</td> 
            </tr>

            `
        );
        index++;
    });
});
