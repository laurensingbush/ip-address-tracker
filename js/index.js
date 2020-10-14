
const ipAddress = document.getElementById("ip-address");
const ipLocation = document.getElementById("location");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("isp");
const ipInput = document.querySelector(".search-form");

// initialize the map
var map = L.map("map");

// latitude and longitude variables
let lat;
let long;

const displayMap = () => {
    // create location marker icon
    var markerIcon = L.icon ({
        iconUrl: "images/icon-location.svg",
        iconSize: [46, 56], // size of the icon
        iconAnchor: [23, 55] // point of the icon which corresponds to marker's location
    });

    // set map's view to geographical coordinates and zoom level
    map.setView([lat, long], 13);

    // add tile layer from Mapbox API
    L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`, {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "pk.eyJ1IjoibHNpbmdidXNoIiwiYSI6ImNrZzZ2cXcxbjAxZHkycXFvY25qbmx3dDAifQ.-JECJ6LH6lOH0h0qyHldkQ"
    }).addTo(map);

    // add location marker to map
    L.marker([lat, long], {icon: markerIcon}).addTo(map);
}


// render ip data
const displayIpData = (data) => {
    ipAddress.innerText = data.ip;
    ipLocation.innerText = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`;
    timezone.innerText = `UTC ${data.location.timezone}`;
    isp.innerText = data.isp;
};


// fetch the JSON data from IP Geolocation API
const getIpData = (ipAddress = "") => {
    fetch(`https://geo.ipify.org/api/v1?apiKey=at_oooRktUnyBJB1i77jSj2QWUJ2EaPj&ipAddress=${ipAddress}`)
    .then(response => response.json())
    .then(data => {
        lat = data.location.lat;
        long = data.location.lng;
        displayIpData(data);
        displayMap();
    })
    .catch(error => console.log(error))
};

getIpData();

// get ip address on submit
ipInput.addEventListener("submit", event => {
    event.preventDefault();
    getIpData(event.target[0].value);
    event.target[0].value = "";
});

