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
    if (url.indexOf('index.html') > -1) {
        drawFrontpage();
    }   else if (url.indexOf('adopter.html') > -1) {
        drawAdopter();
    }   else if (url.indexOf('katteSomSoegerHjem.html') > -1) {
        drawKatteSomSoegerHjem();
    } else if (url.indexOf('kat.html') > -1) {
        drawCat();
    }
}

function drawKatteSomSoegerHjem() {
    fetch(`${apiUrl}posts?status=private&categories=${id}&per_page=50`, {
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("authToken")}`
        }
    }) //specifies the url to fetch() method with the API key
    .then(response => response.json()) //converts response to JSON object
    .then(data => { //passing data through arrow function
        console.log(data);
        let text = "";
        data.forEach(kat => {
            text += `<a href="kat.html?${kat.acf.navn}">`;
            text += `<h1>${kat.acf.navn}</h1>`;
            text += `</a>`;
        });
        document.querySelector('main').innerHTML = text;
    })
}

function drawFrontpage() {
    let text = "";
    text += `<h1>forside</h1>`;
    document.querySelector('main').innerHTML = text;
}

function drawAdopter() {
    let text = "";
    text += `<h1>adopter</h1>`;
    document.querySelector('main').innerHTML = text;
}

function drawCat() {

    let text = "";
    text += `<h1>kattefar</h1>`;
    document.querySelector('main').innerHTML = text;

}