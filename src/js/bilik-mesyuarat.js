////////////////////////////MUST HAVE////////////////////////////
import $ from "jquery";
const main = require("./main.js");
/////////////////////////////////////////////////////////////////

main.onSnapshot(main.query(main.roomDB), (snapshot) => {
    $("#roomList").empty();

    const docsLength = snapshot.docs.length;
    let html = ``;

    snapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        const content =
            `
        <div class="col-lg-4 d-flex">
            <div class="info php-email-form">
                <div class="meetingroompic">
                    <img src="` +
            data.img +
            `" alt="" />
                </div>
                <div class="address">
                    <h4>` +
            data.name +
            `</h4>
                    <p>` +
            data.location +
            `</p>
                </div>
                <div class="text-center">
                    <a href="mohon-bilik.html?id=` +
            doc.id +
            `"><button type="submit">Mohon</button></a>
                </div>
            </div>
        </div>
        `;
        if (index % 3 == 0) {
            html +=
                `
                    <div class="row py-3">
                 ` + content;
        } else if (index % 3 == 2) {
            html += content + `</div>`;
        } else {
            html += content;
        }
        console.log(html);
    });
    $("#roomList").append(html);
});
