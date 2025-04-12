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

main.onSnapshot(main.query(main.vehicleDB, main.orderBy("capacity", "asc")), (snapshot) => {
    $("#vehicleList").empty();

    const docsLength = snapshot.docs.length;
    let html = ``;

    snapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        const content =
            `
        <div class="col-lg-4 d-flex">
            <div class="info php-email-form">
                <div class="vehiclepic">
                    <img src="` +
            data.img +
            `" alt="" />
                </div>
                <div class="address">
                    <h4>` +
            data.name +
            `</h4>
            <p class="mb-0 pb-0">Kapasiti: ` +
            data.capacity +
            ` orang</p>
                </div>
                <div class="text-center pt-3">
                    <a href="mohon-kenderaan.html?id=` +
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
    $("#vehicleList").append(html);
});
