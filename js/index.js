const ipAddress = document.getElementById("ip-address");
const ipLocation = document.getElementById("location");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("isp");
const ipInput = document.querySelector(".search-form");
const inputError = document.getElementById("error");
const userInput = ipInput.searchInput;

// initialize the map
const map = L.map("map", {
    zoomControl: false
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: `&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`
}).addTo(map);

L.control.zoom({
    position: 'bottomright'
}).addTo(map);

const markerIcon = L.icon ({
    iconUrl: "images/icon-location.svg",
    iconSize: [40, 50]
});


let marker;

const displayMap = (lat, lng) => {
    // set map's view to coordinates and zoom level
    map.setView([lat, lng], 13);

    // remove previous marker before adding new one
    if (marker != null) marker.remove();

    marker = L.marker([lat, lng], {icon: markerIcon}).addTo(map);
    // marker.addTo(map);
};

// render ip data
const displayIpData = (data) => {
    ipAddress.innerText = data.ip;
    ipLocation.innerText = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`;
    timezone.innerText = `UTC ${data.location.timezone}`;
    isp.innerText = data.isp;
};

// fetch JSON data from IP Geolocation API
const getIpData = (inputValue = "", searchType= "IP") => {
    const url = 
        searchType === "IP" 
            ? `https://geo.ipify.org/api/v1?apiKey=at_oooRktUnyBJB1i77jSj2QWUJ2EaPj&ipAddress=${inputValue}`
            : `https://geo.ipify.org/api/v1?apiKey=at_oooRktUnyBJB1i77jSj2QWUJ2EaPj&domain=${inputValue}`
    fetch(url)
    .then(response => response.json())
    .then(data => {
        lat = data.location.lat;
        lng = data.location.lng;
        displayIpData(data);
        displayMap(lat, lng);
    })
    .catch((error) => {
        inputError.style.display = "block";
        setTimeout(() => {
            inputError.style.display = "none";
            userInput.value = "";
        }, 3000);
        console.log(error);
    });
};

// regex for valid user input
const validIpRegex = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$";
const validDomainRegex = "^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$";

// get ip address or domain input on submit
ipInput.addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (userInput.value.match(validIpRegex)) {
        getIpData(userInput.value);
    }
    if (userInput.value.match(validDomainRegex)) {
        getIpData(userInput.value, (searchType = "Domain"));
    }
});

getIpData();

