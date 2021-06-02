const apiUrl = "https://charlottegracia.dk/wp-json/wp/v2/";
const apiUserCredentials = {
    username: "api.user",
    password: "API-key-1234#!",
};

const katId = 27;
const stockImagesId = 28;
const samarbejdspartnereId = 29;

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
            drawForeningen(data);
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
        <section>
            <a class="blue" href="index.html?adopter">
                <h2>Adopter</h2>
                <h3 class="darkblueText">Adoption / Bliv plejer</h3>
            </a>`
        if (data[0]) {
            text += `<a href="index.html?kat?${data[0].acf.navn}"><img src="${data[0].acf.billeder.billede1.url}" alt="${data[0].acf.navn}"></a>`;
        } else {
            text += `<a><img src="${billeder[0].acf.billeder.stockbillede1.url}" alt="Kat></a>`;
        }
        text += `
            <a class="darkgreen" href="#">
                <h2>Støt os</h2>
                <h3 class="greenText">Donation / Bliv medlem</h3>
            </a>
        `;
        if (data[1]) {
            text += `<a href="index.html?kat?${data[1].acf.navn}"><img src="${data[1].acf.billeder.billede1.url}" alt="${data[1].acf.navn}"></a>`;
        } else {
            text += `<a><img src="${billeder[0].acf.billeder.stockbillede2.url}" alt="Kat></a>`;
        }
        if (data[2]) {
            text += `<a href="index.html?kat?${data[2].acf.navn}"><img src="${data[2].acf.billeder.billede1.url}" alt="${data[2].acf.navn}"></a>`;
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
            text += `<a href="index.html?kat?${data[3].acf.navn}"><img src="${data[3].acf.billeder.billede1.url}" alt="${data[3].acf.navn}"></a>`;
        } else {
            text += `
            <a href="#"><img src="${billeder[0].acf.billeder.stockbillede4.url}" alt="Kat"></a>`;
        }
        text += `
            <a class="darkblue" href="#">
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
            <h1>Samarbejdspartnere</h1>
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
        // meta tekst
        console.log(billeder);
        let text = "";
        text += `
        <h1>Adopter</h1>
        <h2>Katte som søger hjem</h2>
        <section class="katteOverblikGrid">
        `;
        data.forEach(kat => {
            text +=
            `<a href="index.html?kat?${kat.acf.navn}">
                <img src="${kat.acf.billeder.billede1.url}" alt="lol">
                <section>
                    <p>${kat.acf.navn} - ${kat.acf.alder}</p>
                    <p>${kat.acf.inde_ude}</p>
                </section>
            </a>`;
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
                <article class="white">
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
    console.log(data);
    data.forEach(kat => {
        if (urlSplit[2] == kat.acf.navn) {
            console.log("jubiii");
            let title = `<title>${kat.acf.navn} - Nordsjællands Kattehjælp</title>`;
            let metaText = `<meta name="description" content="${kat.acf.beskrivelse}">`
            document.querySelector("head").innerHTML += title;
            document.querySelector("head").innerHTML += metaText;
            let text = "";
            text += `
            <h1>${kat.acf.navn}</h1>
            <img class="katImg" src="${kat.acf.billeder.billede1.url}" alt="${kat.acf.navn}">
            `;
            document.querySelector('main').innerHTML = text;
        }
    });
}

function drawStoetOs() {
    console.log("halli hallo");
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

function drawForeningen(data) {
    console.log("candice");
    console.log(data);
    let text = "";
    text += `
        <h1>${data[1].acf.plejefamilie_navne}</h1>
        <img src="${data[1].acf.billeder.billede1.url}" alt="">
    `;
    document.querySelector('main').innerHTML = text;
}

function drawKontakt() {
    console.log("i woooork at the bank");
}