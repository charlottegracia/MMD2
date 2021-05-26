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
        if (url.indexOf('index.html') > -1) {
            drawFrontpage(data);
        }   else if (url.indexOf('adopter.html') > -1) {
            drawAdopter(data);
        } else if (url.indexOf('kat.html') > -1) {
            drawCat(data);
        } else {
            drawFrontpage(data);
        }
    })
}

function drawFrontpage(data) {
    let text = "";
    text += `
    <h1>Nordsjællands Kattehjælp</h1>
        <section>
            <a href="adopter.html">
                <h2>Mød kattene</h2>
                <h3>Adoption / Bliv plejer</h3>
            </a>
            <a href="#">
                <h2>Støt os</h2>
                <h3>Donation / Bliv medlem</h3>
            </a>
            <a href="kat.html?${data[0].acf.navn}"><img src="${data[0].acf.billeder.billede1.url}" alt="123"></a>
            <a href="#">
                <h2>Kat i nød</h2>
                <h3>Kattehjælp / FIV</h3>
            </a>
            <a href="kat.html?${data[1].acf.navn}"><img src="${data[1].acf.billeder.billede1.url}" alt="123"></a>
            <a href="#">
                <h2>Foreningen</h2>
                <h3>Vedtægter / Generalforsamling</h3>
            </a>
            <a href="#">
                <h2>Samarbejde</h2>
                <h3>Partnere / Sponsere</h3>
            </a>
            <a href="#">
                <h2>Kontakt os</h2>
                <h3>Kontakt / GDPR</h3>
            </a>
        </section>
    `;
    document.querySelector('main').innerHTML = text;
}

function drawAdopter(data) {
    let text = "";
    text += `
    <h1>Mød kattene</h1>
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