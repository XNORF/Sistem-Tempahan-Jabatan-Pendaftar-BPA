////////////////////////////MUST HAVE////////////////////////////
import $ from "jquery";
const main = require("./main.js");
var currentUser;
await main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        currentUser = user;

        main.getDocs(main.query(main.requestDB, main.where("userID", "==", user.uid), main.orderBy("status", "desc"))).then((docs) => {
            $("#historyList").empty();
            docs.forEach((doc) => {
                const data = doc.data();
                var requestType;

                console.log(data);
                if (data.type == "stationary") {
                    requestType = "Alat Tulis";
                } else if (data.type == "vehicle") {
                    requestType = "Kenderaan";
                } else if (data.type == "room") {
                    requestType = "Bilik";
                }

                $("#historyList").append(
                    `
                    <div class="row">
                        <div class="col mt-4" data-aos="zoom-in" data-aos-delay="300">
                            <div class="row rh-list text-center d-flex align-items-center justify-content-between">
                                <div class="col-3">
                                    <p>Kategori:</p>
                                    <h1>` +
                        requestType +
                        `</h1>
                                </div>
                                <div class="col-3 member-info ps-0">
                                    <p>Tarikh Permohonan:</p>
                                    <h4>` +
                        data.request.neededDate +
                        `</h4>
                                </div>
                                <div class="col-3">
                                    <p>Tarikh Diluluskan:</p>
                                    <h4>` +
                        data.request.approvedDate +
                        `</h4>
                                </div>
                                <div class="col-3">
                                    <a href="request-detail.html?id=` +
                        doc.id +
                        `" class="redirect-btn">Maklumat Tempahan</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                );
            });
        });
    }
});
/////////////////////////////////////////////////////////////////
