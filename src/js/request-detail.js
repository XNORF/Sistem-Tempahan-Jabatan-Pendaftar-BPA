////////////////////////////MUST HAVE////////////////////////////
import $ from "jquery";
const main = require("./main.js");
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
                <th scope="row">` +
                (index + 1) +
                `</th>
                <td>` +
                item.name +
                `</td>
                <td>` +
                item.quantity +
                `</td>
                <td>` +
                item.approved +
                `</td> 
            </tr>

            `
        );
        index++;
    });
});
