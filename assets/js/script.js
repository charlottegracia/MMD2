const apiUrl = "https://charlottegracia.dk/wp-json/wp/v2/";
const apiUserCredentials = {
    username: "api.user",
    password: "API-key-1234#!",
};

const katId = 27;
const stockImagesId = 28;
const samarbejdspartnereId = 29;
const foreningenId = 32;

getToken();

function getToken() {
    fetch('https://charlottegracia.dk/wp-json/jwt-auth/v1/token', {
        method: 'POST',
        body: JSON.stringify(apiUserCredentials),
        headers: {
            'Content-Type': 'application/JSON'
        }
    })
    .then(response => { 
        return response.json(); //converts response to JSON and returns it
    })
    .then(response => {
        window.localStorage.setItem("authToken", response.token) //saves response.token in localStorage
        createPage();
    })
    .catch(error => {
        console.log(error); // logs any errors
    })
}

function createPage() {
    const url = window.location.href;
    fetch(`${apiUrl}posts?status=private&categories=${katId}&per_page=50`, {
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("authToken")}`
        }
    }) //specifies the url to fetch() method with the API key
    .then(response => response.json()) //converts response to JSON object
    .then(data => { //passing data through arrow function
        drawNav();
        if (url.indexOf('adopter') > -1) {
            drawAdopter(data);
        } else if (url.indexOf('kat-i-noed') > -1) {
            drawKatINoed();
        } else if (url.indexOf('kat') > -1) {
            drawCat(data);
        } else if (url.indexOf('stoet-os') > -1) {
            drawStoetOs();
        } else if (url.indexOf('foreningen') > -1) {
            drawForeningen();
        } else if (url.indexOf('samarbejde') > -1) {
            drawSamarbejdspartnere();
        } else if (url.indexOf('kontakt') > -1) {
            drawKontakt();
        } else {
            drawFrontpage(data);
        }
        drawFooter();
    })
    .catch(error => {
        console.log(error); // logs any errors
    })
}

function drawNav() {
    let text = "";
    text += `
        <nav>
            <a href="index.html">
                <img src="assets/images/NSK logo nyt.jpeg" alt="NSK Logo">
                <h1>Nordsjællands Kattehjælp</h1>
            </a>
            <ul>
                <li>
                    <a href="index.html?adopter">Adopter</a>
                </li>
                <li>
                    <a href="index.html?stoet-os">Støt os</a>
                </li>
                <li>
                    <a href="index.html?kat-i-noed">Kat i nød</a>
                </li>
                <li>
                    <a href="index.html?foreningen">Foreningen</a>
                </li>
                <li>
                    <a href="index.html?samarbejde">Samarbejde</a>
                </li>
                <li>
                    <a href="index.html?kontakt">Kontakt</a>
                </li>
            </ul>
        </nav>
    `;
    document.querySelector('header').innerHTML = text;
}

function drawFooter() {
    let text = "";
    text += `
        <h5>info@kattehjælp.dk | Konto: reg.: 5357 konto: 0246871 | CVR nr. 37805335</h5>
        <h5>Donationer modtages på Mobilepay 94686</h5>
    `;
    document.querySelector('footer').innerHTML = text;
}

function drawFrontpage(data) {
    let title = "<title>Nordsjællands Kattehjælp</title>";
    document.querySelector("head").innerHTML += title;
    let metaText = `<meta name="description" content="Nordsjællands Kattehjælp er et stærkt netværk af frivillige, private plejefamilier, der ønsker at forbedre forholdene for ejerløse katte i Nordsjælland.">`
    document.querySelector("head").innerHTML += metaText;
    let text = "";
    fetch(`${apiUrl}posts?status=private&categories=${stockImagesId}&per_page=50`, {
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("authToken")}`
        }
    }) //specifies the url to fetch() method with the API key
    .then(response => response.json()) //converts response to JSON object
    .then(billeder => { //passing data through arrow function
        text += `
        <h1>Nordsjællands Kattehjælp</h1>
        <section class="frontpageGrid">
            <a class="blue" href="index.html?adopter">
                <h2>Adopter</h2>
                <h3 class="darkblueText">Adoption / Bliv plejer</h3>
            </a>`
        if (data[0]) {
            text += `<a href="index.html?kat?${data[0].slug}"><img src="${data[0].acf.billeder.billede1.url}" alt="${data[0].acf.navn}"></a>`;
        } else {
            text += `<a><img src="${billeder[0].acf.billeder.stockbillede1.url}" alt="Kat></a>`;
        }
        text += `
            <a class="darkgreen" href="index.html?stoet-os">
                <h2>Støt os</h2>
                <h3 class="greenText">Donation / Bliv medlem</h3>
            </a>
        `;
        if (data[1]) {
            text += `<a href="index.html?kat?${data[1].slug}"><img src="${data[1].acf.billeder.billede1.url}" alt="${data[1].acf.navn}"></a>`;
        } else {
            text += `<a><img src="${billeder[0].acf.billeder.stockbillede2.url}" alt="Kat></a>`;
        }
        if (data[2]) {
            text += `<a href="index.html?kat?${data[2].slug}"><img src="${data[2].acf.billeder.billede1.url}" alt="${data[2].acf.navn}"></a>`;
        } else {
            text += `
            <a href="#"><img src="${billeder[0].acf.billeder.stockbillede3.url}" alt="Kat"></a>`;
        }
        text += `
            <a class="green" href="#">
                <h2>Kat i nød</h2>
                <h3 class="darkgreenText">Kattehjælp / FIV</h3>
            </a>
        `;
        if (data[3]) {
            text += `<a href="index.html?kat?${data[3].slug}"><img src="${data[3].acf.billeder.billede1.url}" alt="${data[3].acf.navn}"></a>`;
        } else {
            text += `
            <a href="#"><img src="${billeder[0].acf.billeder.stockbillede4.url}" alt="Kat"></a>`;
        }
        text += `
            <a class="darkblue" href="index.html?foreningen">
                <h2>Foreningen</h2>
                <h3 class="blueText">Vedtægter / Generalforsamling</h3>
            </a>
        </section
        `;
    document.querySelector('main').innerHTML = text;
    })
    .catch(error => {
        console.log(error); // logs any errors
    })
}

function drawSamarbejdspartnere() {
    let title = "<title>Samarbejdspartnere og sponsorer - Nordsjællands Kattehjælp</title>";
    document.querySelector("head").innerHTML += title;
    let metaText = `<meta name="description" content="Her er en oversigt over Nordsjællands Kattehjælps samarbejdspartnere og sponsorer.">`
    document.querySelector("head").innerHTML += metaText;
    fetch(`${apiUrl}posts?status=private&categories=${samarbejdspartnereId}&per_page=50`, {
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("authToken")}`
        }
    }) //specifies the url to fetch() method with the API key
    .then(response => response.json()) //converts response to JSON object
    .then(samarbejdspartnere => { //passing data through arrow function
        let text = "";
        text += `
            <h1>Samarbejde</h1>
            <h2>Samarbejdspartnere og sponsorer</h2>`;
        text += `<section class="samarbejdsgrid">`;
        samarbejdspartnere.forEach(partner => {
            text += `
                <a href="${partner.acf.samarbejdspartner.firmalink}" target="_blank">
                    <img src="${partner.acf.samarbejdspartner.firmalogo.url}" alt="${partner.acf.samarbejdspartner.firmanavn}">
                </a>
            `;
        });
        text += `</section>`;
        document.querySelector('main').innerHTML = text;
    })
    .catch(error => {
        console.log(error); // logs any errors
    })
}

function drawAdopter(data) {
    fetch(`${apiUrl}posts?status=private&categories=${stockImagesId}&per_page=50`, {
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("authToken")}`
        }
    }) //specifies the url to fetch() method with the API key
    .then(response => response.json()) //converts response to JSON object
    .then(billeder => { //passing data through arrow function
        let title = "<title>Adopter - Nordsjællands Kattehjælp</title>";
        document.querySelector("head").innerHTML += title;
        let metaText = `<meta name="description" content="Vi formidler kun katte og killinger, der er steriliseret/kastreret, øremærket, chippet samt ormebehandlet og vaccineret 1. gang.">`
        document.querySelector("head").innerHTML += metaText;
        let text = "";
        text += `
        <h1>Adopter</h1>
        <h2>Katte som søger hjem</h2>
        <section class="katteOverblikGrid">
        `;
        data.forEach(kat => {
            text +=
            `<a href="index.html?kat?${kat.slug}">
                <img src="${kat.acf.billeder.billede1.url}" alt="${kat.acf.navn}">
                <section>
                    <p>${kat.acf.navn} - ${kat.acf.alder}</p>
                    <p>${kat.acf.inde_ude}</p>
                </section>
            </a>
            `;
        });
        text += `</section>`;
        text += `
        <article class="adoptionAfKatte">
            <article>
                <h2 class="greenText">Adoption af katte</h2>
                    <p>Nordsjællands Kattehjælp er ikke et internat. Vores katte bliver passet i private hjem og man skal "forhåndgodkendes" før et besøg. Vi bestræber os altid på at finde det bedste match mellem kat og ejer. </p>
                    <p>Vi formidler kun katte og killinger, der er steriliseret/kastreret, øremærket, chippet samt ormebehandlet og vaccineret 1. gang.</p>
                    <p>Katten medbringer sundhedsbog og madpakke til den første uge. Kønsmodne katte vil være Fiv/Felv testet.</p>
                    <p><span class="boldText">Killinger og unge katte</span> formidles for kr. 1450,-</p>
                    <p><span class="boldText">Katte over 2 år</span> formidles for kr. 1050,- </p>
                    <p>Med i prisen følger et års støttemedlemsskab af foreningen (normalt kr. 275,- pr. år). </p>
                    <p>Kattene formidles i takt med at de bliver klar til hjem. De annonceres på vores Facebook gruppe og på dba samt her på hjemmesiden under Katte som søger hjem</p>
                </article>
                <article class="white venteliste">
                    <h2 class="darkblueText">Vil du på ventelisten?</h2>
                    <p>Så send os en mail på info@kattehjaelp.dk og fortæl lidt om hvad du søger og hvilket hjem du tilbyder (inde/udeliv, børn/alder, andre dyr/hvilke osv.) og lad os hjælpe med at finde den helt rigtige kat til dit hjem.</p>
                    <p>Vores katte formidles primært som indekatte eller til hjem med lukket have eller kattegård, men vi formidler også katte til fritløb hvis man bor et egnet sted og katten forventes at kunne trives som udekat.</p>
                    <p>Unge killinger (3-4 mdr) formidles som udgangspunkt kun ud sammen 2 og 2 - medmindre der er kat i hjemmet i forvejen eller hvis vi vurderer at killingen vil egne sig godt til at være enekat.</p>
                    <h3 class="greyText">Katte der kræver lidt ekstra</h3>
                    <p>Mange af vores katte har et særligt behov for socialisering for at opnå eller genvinde tilliden til mennesker. Ofte har de strejfet omkring som ejerløse i en længere periode.</p>
                    <p>Vi søger altid familier med ekstra tålmodighed til denne type katte. </p>
                </article>
                <article>
                    <h2 class="greenText">Bliv plejer for Nordsjællands Kattehjælp</h2>
                    <p>Er du interesseret i at blive plejefamilie for Nordsjællands Kattehjælp, så skal du kontakte foreningens plejeansvarlige Joan Andersen på mail: <span class="boldText">joan@kattehjaelp.dk</span>. I mailen skal du kort fortælle hvad du kan tilbyde af hjælp, hvordan du bor, din erfaring med katte osv. Du bliver herefter kontaktet enten pr. mail eller via en telefonisk samtale.</p>
                    <p>Vi søger primært plejefamilier, som er bosat i Nordsjælland og København og du skal være indstillet på at åbne dit hjem, for et besøg af en repræsentant fra foreningen. Før et eventuelt samarbejde indgås, så fremsendes der en kontrakt til underskrift med nedenstående punkter.</p>
                    <h3 class="greyText">Krav til vores plejefamilier:</h3>
                    <ol>
                        <li>Du skal være fyldt 18 år og helst have lidt erfaring med katte/killinger.Dine eventuelt egne dyr skal kunne fungere socialt og harmonisk medplejekatte/killinger og du skal skal kunne fremvise gyldig attest på ateventuelt egne katte er vaccineret indenfor det seneste år samt at de er neutraliserede.</li>
                        <li>Det skal være tilladt at katten/killingen opholder sig i din bolig. Er derrestriktioner ift. art eller antal dyr der må være i din bolig, skalforeningen informeres om dette.</li>
                    </ul>
                    <img src="${billeder[0].acf.billeder.stockbillede2.url}" alt="Nordsjællands Kattehjælp">
                    <img src="${billeder[0].acf.billeder.stockbillede3.url}" alt="Nordsjællands Kattehjælp">
                </article>
                <article class="kravDel2">
                    <ol start="3">
                        <li>Du skal som udgangspunkt have adgang til bil/kørsel ifm.dyrlægebesøg mv. Vi har frivillige der ofte kan hjælpe med kørsel,men dette kan ikke garanteres. Vi benytter primært vores fastedyrlæger i Espergærde og i Frederikssund.</li>
                        <li>Du skal have mulighed for at isolere katten/killingen i et særskiltrum (evt. et badeværelse), som er adskilt for husets eventuelt andredyr de første dage af plejeperioden.</li>
                        <li>Du skal være indstillet på at indrette din bolig, så den tilgodeserkattens/killingens behov: fri adgang til tørfoder, rent drikkevand,kradsetræ, kattebakke og flere forskellige gode ligge/gemmesteder.Katten/killingen må under <span class="boldText">ingen</span> omstændigheder komme ud!</li>
                        <li>Foreningen sørger for tørfoder, vådfoder, kattegrus, legetøj mv.(medmindre dette fravælges), men plejefamilien skal være indstilletpå selv at afhente det på vores lager i Kvistgård eller Dronningmøllemedmindre andet aftales. </li>
                        <li>Foreningen afholder alle udgifter til dyrlæge samt loppe/ormekureog andre former for behandling. Den plejeansvarlige skal altidkontaktes, hvis plejeren vurderer et behov for dyrlægebesøg.Plejer skal løbende, holde den plejeansvarlige orienteret omhvordan det går med katten/killingen og rette henvendelse, hvisder opstår spørgsmål i plejeperioden</li>
                        <li>Såfremt katten/killingen forårsager skader på plejefamiliens hjem,interiør eller på personer, vil alle eventuelle udgifter ifm. dettetilfalde plejefamilien selv. Der er tavshedspligt for plejefamilierne,vedr. forhold omkring de katte man får i pleje, samt ting der bliveraftalt I foreningens regi. Det er foreningen der alene står forformidling af plejekatten til dens nye hjem. Dette sker dog somudgangspunkt altid i samråd med plejer.</li>
                    </ul>
                </article>
            </article>`;
        document.querySelector('main').innerHTML = text;
        })
    .catch(error => {
        console.log(error); // logs any errors
    })
}

function drawCat(data) {
    const url = window.location.href;
    let urlSplit = url.split('?');
    let text = "";
    console.log(data);
    data.forEach(kat => {
        if (urlSplit[2] == kat.slug) {
            let title = `<title>${kat.acf.navn} - Nordsjællands Kattehjælp</title>`;
            let metaText = `<meta name="description" content="${kat.acf.beskrivelse}">`;
            document.querySelector("head").innerHTML += title;
            document.querySelector("head").innerHTML += metaText;
            text += `
            <h1>${kat.acf.navn}</h1>
            <section class="katGrid">
                `;
                if (kat.acf.billeder.billede2) {
                    text +=`
                    <section class="slideshowGrid"> 
                    <i class="ikon fas fa-chevron-left" onclick="plusDivs(-1)"></i> <!-- Kilde: https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_slideshow_self --> `;
                }
            text += `<section>`;
            if (kat.acf.billeder.billede1 != false) {
                text += `<img class="firstPic mySlides" src="${kat.acf.billeder.billede1.url}"></img>`; // Kilde: https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_slideshow_self
            }
            if (kat.acf.billeder.billede2 != false) {
                text += `<img class="mySlides" src="${kat.acf.billeder.billede2.url}"></img>`; // Kilde: https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_slideshow_self
            }
            if (kat.acf.billeder.billede3 != false) {
                text += `<img class="mySlides" src="${kat.acf.billeder.billede3.url}"></img>`;// Kilde: https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_slideshow_self
            }
            if (kat.acf.billeder.billede4 != false) {
                text += `<img class="mySlides" src="${kat.acf.billeder.billede4.url}"></img>`; // Kilde: https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_slideshow_self
            }
            
            text += `
                </section>`;
            if (kat.acf.billeder.billede2) {
                text +=`
                <i class="ikon fas fa-chevron-right" onclick="plusDivs(1)"></i> <!-- Kilde: https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_slideshow_self -->
                </section>`;
            }
            text += `
                <article class="katInfo">
                    <h2>Info om kat</h2>
                    <ul>
                        <li><span class="boldText">Køn: </span>${kat.acf.kon}</li>
                        <li><span class="boldText">Miljø: </span>${kat.acf.inde_ude}</li>
                        <li><span class="boldText">Alder: </span>${kat.acf.alder}</li>
                        <li><span class="boldText">Status: </span>${kat.acf.status}</li>
                        <li><span class="boldText">Pris: </span>${kat.acf.pris},-</li>
                        <li><span class="boldText">Plejeby: </span>${kat.acf.plejeby}</li>
                        <li><span class="boldText">Formidler: </span>${kat.acf.formidler} - kontakt via <span class="boldText">${kat.acf.formidler_email}</span></li>
                    </ul>
                    <p><span class="boldText">Kastreret, vaccineret, chippet</span> og <span class="boldText">øremærket</span>.</p>
                    <p>Medbringer <span class="boldText">sundhedsbog</span> og madpakke til den første tid i nyt hjem.</p>
                    <p>Der anbefales tegning af en sygeforsikring - f.eks hos Dyreforsikringdanmark.dk</p>
                </article>
                <article class="katBeskrivelse">
                    <h3>Beskrivelse</h3>
                    <p>${kat.acf.beskrivelse}</p>
                </article>
                <article class="katPlejefamilie">
                `;
                if (kat.acf.plejefamilie_navne != "" && kat.acf.plejefamilien_fortaeller != "") {
                    text += `<h4>Plejefamilien (${kat.acf.plejefamilie_navne}) fortæller</h4>
                    <p>${kat.acf.plejefamilien_fortaeller}</p>`;
                } else if (kat.acf.plejefamilie_navne == "" && kat.acf.plejefamilien_fortaeller != "") {
                    text += `<h4>Plejefamilien fortæller</h4>
                    <p>${kat.acf.plejefamilien_fortaeller}</p>`;
                }
                text += `
                </article>
            </section>
            `;
        }
    });

    text += `
        <section class ="flereKatte">
        <h2>Se også</h2>
        <section class="katteOverblikGrid">`;
    for (let i = 0; i < 4; i++) {
        text += `
            <a href="index.html?kat?${data[i].slug}">
                <img src="${data[i].acf.billeder.billede1.url}" alt="${data[i].acf.navn}">
                <section>
                    <p>${data[i].acf.navn} - ${data[i].acf.alder}</p>
                    <p>${data[i].acf.inde_ude}</p>
                </section>
            </a> 
    `;
    }
    text += `</section></section>`;
    document.querySelector('main').innerHTML = text;
}

/* KODE NEDENFOR ER FRA W3SCHOOLS. Kilde: https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_slideshow_self */
var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    if (n > x.length) {slideIndex = 1}
    if (n < 1) {slideIndex = x.length}
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";  
    }
    if (x.length > 0) {
        x[slideIndex-1].style.display = "block";  
    }
}

/* KODE OVENFOR ER FRA W3SCHOOLS. Kilde: https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_slideshow_self */


function drawStoetOs() {
    let title = "<title>Støt os - Nordsjællands Kattehjælp</title>";
    document.querySelector("head").innerHTML += title;
    let metaText = `<meta name="description" content="Nordsjællands Kattehjælp er en forening drevet af engagerede dyrevenner, der alle arbejder frivilligt og ulønnet.">`
    document.querySelector("head").innerHTML += metaText;
    let text = `
    <h1 class="stoet-osOverskrift">Støt os</h1>
        <h4 class="stoet-osUnderoverskrift">- og hjælp os med at hjælpe katte i nød</h4>
        <section class="stoet-osGrid">
            <article>
                <h2>Giv en donation</h2>
                <h4>Betal med MobilePay:</h4>
                <ol>
                    <li>Åbn MobilePay-appen</li>
                    <li>Tryk på 'Betal'</li>
                    <li>Scan QR-koden via appen</li>
                </ol>
                <h5>ELLER indtast nummeret i din app: 94686</h5>
                <ol>
                    <li>Vælg ok når du får beskeden <span class="cursive">"94686 er ikke i dine kontakter"</span></li>
                    <li>Swipe for betaling</li>
                </ol>
                <h4>Betal via bankoverførsel:</h4>
                <address>
                    <p>Arbejdernes Landsbank, Helsingør</p>
                    <p>reg. <span class="boldText">5357</span> kontonr. <span class="boldText">0246871</span></p>
                </address>
            </article>
            <article>
                <img src="assets/images/mobilepay.png" alt="Mobilepay - Nordsjællands Kattehjælp">
            </article>
        </section>
        <section class="stoet-osGrid extrawhite">
            <article>
                <h2 class="greenText">Bliv medlem</h2>
                <p>Nordsjællands Kattehjælp er en forening drevet af engagerede dyrevenner, der alle arbejder frivilligt og ulønnet. </p>
                <p>Du kan blive støttemedlem ved at udfylde blanketten på højre side. Medlemskabet giver adgang til foreningens generalforsamling i maj. </p>
                <p>Der udsendes reminder om fornyelse af medlemskab hvert år i januar/februar måned via mail og Facebook. </p>
                <p>Det er muligt at tegne erhvervsmedlemsskab og få firmalogo på hjemmesiden under samarbejdspartnere og sponsorer. Det koster kr. <span class="boldText">600,-</span> om året.</p>
                <p>Send en mail til info@kattehjaelp.dk for nærmere aftale herom. </p>
                <p>Ved adoption af en af vores katte eller killinger er der inkluderet et års støttemedlemsskab i formidlingsgebyret. </p>
            </article>
            <form>
                <h3 class="greenText">Skriv og bliv medlem</h3>
                    <input type="text" placeholder="Navn">
                    <input type="text" placeholder="E-mail">
                    <input type="number" placeholder="Telefon">
                    <input type="text" placeholder="Adresse">
                    <input type="text" placeholder="Postnummer og by">
                    <textarea placeholder="Din besked..." style="height:100px"></textarea>
                <button type="button">Send</button>
            </form>    
        </section>
    `;

    document.querySelector('main').innerHTML = text;
}

function drawKatINoed() {
    console.log("deez");
    console.log("nuts");
    let title = `<title>Kat i nød - Nordsjællands Kattehjælp</title>`;
    let metaText = `<meta name="description" content="INDSÆT TEKST">`
    document.querySelector("head").innerHTML += title;
    document.querySelector("head").innerHTML += metaText;
    let text = "";
    text += `
        <h1>Kat i nød</h1>
    `;
    document.querySelector('main').innerHTML = text;
}

function drawForeningen() {
    let title = "<title>Foreningen- Nordsjællands Kattehjælp</title>";
    document.querySelector("head").innerHTML += title;
    let metaText = `<meta name="description" content="Nordsjællands Kattehjælp er et stærkt netværk af frivillige, private plejefamilier, der ønsker at forbedre forholdene for ejerløse katte i Nordsjælland.">`
    document.querySelector("head").innerHTML += metaText;
    fetch(`${apiUrl}posts?status=private&categories=${foreningenId}&per_page=50`, {
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("authToken")}`
        }
    }) //specifies the url to fetch() method with the API key
    .then(response => response.json()) //converts response to JSON object
    .then(billeder => { //passing data through arrow function
        let text = "";
        text += `
        <h1>Foreningen</h1>
        <section class="foreningenGrid">
            <article class="white">
                <h2>Om foreningen Nordsjællands Kattehjælp</h2>
                <p>Nordsjællands Kattehjælp er et stærkt netværk af frivillige, private plejefamilier, der ønsker at forbedre forholdene for ejerløse katte i Nordsjælland.</p>
                <p>Står du med en tilløber, som du ikke kan finde ejeren til, så hjælper vi med råd og vejledning og kan tilbyde plejeophold med henblik på at finde katten et nyt hjem.</p>
                <p>Vi hjælper med neutralisering, vaccination og øremærkning af katte til genudsætning i den udstrækning det er os muligt. Dette forudsætter, at man tegner et medlemskab hos os, at katten ikke er tamkat samt at man påtager sig ansvaret som fodervært</p>
                <p>Ved akutte sager med tilskadekomne katte skal du kontakte Dyrenes Beskyttelse på 1812 eller bringe katten til nærmeste dyrlæge.</p>
                <h3>Bestyrelsen</h3>
                <ul>
                    <li><span class="boldText">Formand</span> Joan Andersen - joan@kattehjaelp.dk</li>
                    <li><span class="boldText">Næstformand</span> Annette Nielsen - annette@kattehjaelp.dk</li>
                    <li><span class="boldText">Kasserer</span> Kirsten Hammer - kirsten@kattehjaelp.dk</li>
                    <li><span class="boldText">4. bestyrelsesmedlem</span> Margit Rand - margit@kattehjaelp.dk</li>
                    <li><span class="boldText">5. bestyrelsesmedlem</span> Birgit Bauer - birgit@kattehjaelp.dk</li>
                </ul>
            </article>
            <img src="${billeder[0].acf.kort.url}" alt="Kort">
            <article>
                <h2 class="greenText">Vedtægter & generalforsamling</h2>
                <p>Regnskabsåret for Foreningen Nordsjællands Kattehjælp går fra 1. januar til 31. december. Der afholdes generalforsamling hvert år sidst i maj. Betalende medlemmer indkaldes via e-mail senest 4 uger før afholdelse.</p>
                <h3>Generalforsamling</h3>
                <address>
                    <p>Nordsjællands Kattehjælp</p>
                    <p>Lørdag den 18. juli 2020, kl. 14-16</p>
                    <p>Afholdt i Snekkersten</p>
                </address>
                <p>Generalforsamlingen var udsat fra maj til juli pga covid-19</p>
                <p><span class="boldText">Fremmødte:</span> Joan Andersen, Annette Nielsen, Kirsten Hammer, Margit Rand, Birgit Bauer, Annette Bantz, Anne Glipstrup, Carli Hækkerup, Heidi Juel Hermansen, Rikke Falk Hansen og Anne Mau.</p>
                <button class="darkgreen" type="button">Download PDF</button>
            </article>
            <img src="${billeder[0].acf.kat.url}" alt="${billeder[0].acf.kat.title}">
        </section>
        <section>
            <h4 class="green dropdown" onclick="dropdown()">Seneste generalforsamling <i class="fas fa-chevron-down"></i></h4>
            <section class="toShowOrNot2Show white dropdownContentForeningen" id="dropdownForeningen">
                <article>
                    <ol>
                        <li>Valg af dirigent (Birgit Bauer)</li>
                        <li>Valg af referent (Anne Glipstrup)</li>
                        <li>Beretning fra formanden inkl. Regnskab</li>
                    </ol>
                    <p>Nordsjællands Kattehjælp (NSK), har kontinuerligt haft mellem 30-60 katte i pleje hen over året, hvilket er nogenlunde det samme antal som de foregående år. Foreningen fyldte 4 år den 18. juni og har pt. hjulpet omkring 500 katte videre ud i kærlige hjem – plus hjulpet mere end 100 katte til et bedre liv som neutraliseret genudsætningskat med en fodervært tilknyttet.</p>
                    <p>Vi afholdt et socialt arrangement 23/11 besøg Skibsklarergården – med frokost og pakkeleg. Arrangeret af Susanne. Arrangementet var en stor succes.</p>
                    <p>Kort info om Michelle Garnier 6/9 kl 14. Gratis for medlemmer.</p>
                    <p>Der har kun været afholdt 1 fysisk bestyrelsesmøde. Herudover er der afholdt et par telefonmøder.</p>
                    <p>Der er brugt 210.257 på dyrlægehjælp i 2019. Hertil kommer dyrlægeregninger på 104.754 for Vestegnens Kattehjælp, 10.337 for Hundested Havnekatte og 4611 for Sannes foderplads. Pengene er indsamlet af de forskellige foreninger og har ikke påvirket NSK økonomi.</p>
                    <p>Vi fik desværre ikke 30.000 fra Dyrevelfærdspuljen til brug i 2020, men kun 7.560,25,- De har ændret vilkårene igen og der kommer ikke til at være helt så mange penge i puljen fremadrettet.</p>
                </article>
                <article>
                    <p>Vi valgte i efteråret at melde os ind i DOSO som har givet os adgang til at søge diverse legater og fonde. Vi har en ansøgning ude nu og har lige fået 30.000 til genudsætninger/foder fra en anden fond.</p>
                    <p>DOSO kæmper fortsat for en kattelov. Håber at have godt nyt på næste gf.</p>
                    <p>Vi havde mange katte siddende i årets første måneder som var ordnet og klar til hjem og hvor udgiften lå i 2019 og indtægten først i 2020. Regnskabet endte derfor med et lille minus på kr. 116,- Vores bankkonto har det godt pt. og vi har fået nogle store donationer af god kvalitetsmad der gør at vi er ret godt kørende pt.</p>
                    <p>Regnskab blev godkendt.</p>
                    <p>Ditte Bøgevang Kanstrup blev valgt til at stå for ekstern revision, da foreningen forventer at få mere end 50.000 via indsamlinger fremadrettet.</p>
                    <ol start="4">
                        <li>Fastsættelse af kontigent for medlemskab 2021. Kontigent forsætter uændret </li>
                        <li>Valg af formand. Joan Andersen modtager genvalg. Ingen andre kandidater </li>
                        <li>Valg af 4. bestyrelsesmedlem. Margit Rand modtager genvalg. Ingen andre kandidater </li>
                        <li>Behandling af forslag fra bestyrelse og medlemmer. Ingen punkter indkommet </li>
                        <li>Eventuelt. Fri snak om den manglende kattelovgivning og om fonde/legater, som kan søges fremadrettet. </li>
                    </ol>
                </article>
            </section>
        </section>
        `;
        document.querySelector('main').innerHTML = text;
    })
    .catch(error => {
        console.log(error); // logs any errors
    })
}

function drawKontakt() {
    console.log("i woooork at the bank");
}

function dropdown() {
    document.getElementById("dropdownForeningen").classList.toggle('toShowOrNot2Show');
}