const apiUrl = "https://charlottegracia.dk/wp-json/wp/v2/";
const apiUserCredentials = {
    username: "api.user",
    password: "API-key-1234#!",
};

const id = 10;


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
    console.log(`yay token: ${window.localStorage.getItem("authToken")}`);
    tissemand();
}

function tissemand() {
    fetch(`${apiUrl}posts?status=private&categories=${id}&per_page=50`, {
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("authToken")}`
        }
    }) //specifies the url to fetch() method with the API key
    .then(response => response.json()) //converts response to JSON object
    .then(data => { //passing data through arrow function
        console.log(data);
        jubi(data);
    })
}

function jubi(data) {
    let text = "";
    text += `<h1>${data[0].acf.titel_pa_kategori}</h1>`;
    document.querySelector('main').innerHTML = text;
}