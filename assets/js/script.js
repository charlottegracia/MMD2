const apiUrl = "https://charlottegracia.dk/wp-json/wp/v2/";
const apiUserCredentials = {
    username: "api.user",
    password: "API-key-1234#!",
};

const id = 27;

getDataFromWP();

function getDataFromWP() {
    fetch('https://charlottegracia.dk/wp-json/jwt-auth/v1/token', {
        method: 'POST',
        body: JSON.stringify(apiUserCredentials),
        headers: {
            'Content-Type': 'application/JSON'
        }
    })
    .then(response => { //create variable "response" 
        return response.json(); //converts response to JSON and returns it
    })
    .then(response => { //pass the variable
        window.localStorage.setItem("authToken", response.token) //saves response.token in localStorage
        createPage();
    })
    .catch(error => {
        console.log(error); // logs any errors
    })
}

function createPage() {
    const url = window.location.href;
    console.log(`yay token: ${window.localStorage.getItem("authToken")}`);
    fetch(`${apiUrl}posts?status=private&categories=${id}&per_page=50`, {
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("authToken")}`
        }
    }) //specifies the url to fetch() method with the API key
    .then(response => response.json()) //converts response to JSON object
    .then(data => { //passing data through arrow function
        console.log(data);
        drawNav();
        if (url.indexOf('index.html') > -1) {
            drawFrontpage(data);
        }   else if (url.indexOf('adopter.html') > -1) {
            drawAdopter(data);
        } else if (url.indexOf('kat.html') > -1) {
            drawCat(data);
        } else if (url.indexOf('samarbejde.html') > -1) {
            drawSamarbejdspartnere();
        } else {
            drawFrontpage(data);
        }
        drawFooter();
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
                    <a href="adopter.html">Adopter</a>
                </li>
                <li>
                    <a href="#"">Støt os</a>
                </li>
                <li>
                    <a href="#">Kat i nød</a>
                </li>
                <li>
                    <a href="#">Foreningen</a>
                </li>
                <li>
                    <a href="samarbejde.html">Samarbejde</a>
                </li>
                <li>
                    <a href="#">Kontakt</a>
                </li>
            </ul>
        </nav>
    `;
    document.querySelector('header').innerHTML = text;
}

function drawFooter() {
    let text = "";
    text += `
        <h5>info@kattehjælp.dk | Konto: reg.: 5357 konto: 0246871 | CVR nr. 123456</h5>
        <h5>Donationer modtages på Mobilepay 12345</h5>
    `;
    document.querySelector('footer').innerHTML = text;
}

function drawFrontpage(data) {
    let text = "";
    fetch(`${apiUrl}posts?status=private&categories=${28}&per_page=50`, {
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("authToken")}`
        }
    }) //specifies the url to fetch() method with the API key
    .then(response => response.json()) //converts response to JSON object
    .then(billeder => { //passing data through arrow function
        console.log(billeder);
        text += `
        <h1>Nordsjællands Kattehjælp</h1>
        <section>
            <a class="blue" href="adopter.html">
                <h2>Adopter</h2>
                <h3 class="darkblueText">Adoption / Bliv plejer</h3>
            </a>`
        if (data[0]) {
            text += `<a href="kat.html?${data[0].acf.navn}"><img src="${data[0].acf.billeder.billede1.url}" alt="${data[0].acf.navn}"></a>`;
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
            text += `<a href="kat.html?${data[1].acf.navn}"><img src="${data[1].acf.billeder.billede1.url}" alt="${data[1].acf.navn}"></a>`;
        } else {
            text += `<a><img src="${billeder[0].acf.billeder.stockbillede2.url}" alt="Kat></a>`;
        }
        if (data[2]) {
            text += `<a href="kat.html?${data[2].acf.navn}"><img src="${data[2].acf.billeder.billede1.url}" alt="${data[2].acf.navn}"></a>`;
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
            text += `<a href="kat.html?${data[3].acf.navn}"><img src="${data[3].acf.billeder.billede1.url}" alt="${data[3].acf.navn}"></a>`;
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
}

function drawSamarbejdspartnere() {
    console.log("HALLOOOO");
    let text = "";
    text += `
    <h1>Samarbejdspartnere</h1>
    `;
    document.querySelector('main').innerHTML = text;
}

function drawAdopter(data) {
    let text = "";
    text += `
    <h1>Adopter</h1>
    <h2>Katte som søger hjem</h2>
    `;
    data.forEach(kat => {
        text += `<a href="kat.html?${kat.acf.navn}">`;
        text += `<h3>${kat.acf.navn}</h3>`;
        text += `</a>`;
    });
    document.querySelector('main').innerHTML = text;
}

function drawCat(data) {
    const url = window.location.href;
    let urlSplit = url.split('?');
    console.log(data);
    data.forEach(kat => {
        if (urlSplit[1] == kat.acf.navn) {
            console.log("jubiii");
            let text = "";
            text += `
            <h1>${kat.acf.navn}</h1>
            <img class="katImg" src="${kat.acf.billeder.billede1.url}" alt="${kat.acf.navn}">
            `;
            document.querySelector('main').innerHTML = text;
        }
    });
}