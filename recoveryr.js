if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(onSuccess, onFailure);
}
const closeButton = document.getElementById("close");
const submit = document.getElementById('submit');
const formContainer = document.getElementById("form-container");
const spotName = document.getElementById('spotName');
const locationContainer = document.getElementById('locations');
const locationType = document.getElementById('location-type');
let locationTypeClass;
let locations = [];
let myMap;
let globalAddMarkerFunction;
function onSuccess(position){
    
    mymap = L.map('map').setView([position.coords.latitude, position.coords.longitude], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 13,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);

    const marker = L.marker([position.coords.latitude, position.coords.longitude], {title:"You are here"}).addTo(mymap);
    marker.bindPopup("You're Location").openPopup();

    mymap.on('click', function(mapE){
        mapEvent = mapE;
        formContainer.classList.remove('d-none');
        formContainer.classList.add('bg-light');
        spotName.focus();
    });


    myMap = mymap;
    window.addMarkerFunction=function(lat, lng) {
        L.marker([lat, lng])
        .addTo(mymap)
        .bindPopup(
            L.popup(
                {
                    autoClose: false,
                    closeOnClick: false,
                    className: "red"
                }
            )
        )
    }
    // globalAddMarkerFunction = addMarkerFunctionForGetLocationsOnReloadOrLoad();
    const getLocations = function(){
        const data = JSON.parse(localStorage.getItem('locations'));
        if(data){
            locations = data;
            locations.forEach(item => {
                if(item.locationType=="1"){
                    locationTypeClass = "bg-danger";
                }else if(item.locationType=="2"){
                    locationTypeClass = "bg-warning";
                }else{
                    locationTypeClass = "bg-success";
                }
                
                let locationHtml = `
                    <div class="card ${locationTypeClass} mb-2">
                        <div class="card-body">
                            <h5>${item.name}</h5>
                        </div>
                    </div> 
                `
                locationContainer.insertAdjacentHTML('beforeend', locationHtml);
                L.marker([item.location.lat, item.location.lng])
                .addTo(myMap)
                .bindPopup(
                    L.popup(
                        {
                            autoClose: false,
                            closeOnClick: false,
                            className: "red"
                        }
                    )
                )
                .setPopupContent(item.name);
                // window.addMarkerFunction(item.location.lat, item.location.lng);
            });
            
        }
    };
    
    getLocations();
}




let mapEvent;

const resetForm = function() {
    spotName.value = "";
    locationType.value = "";

}
const renderLocations = function(){
    if(locationType.value=="1"){
        locationTypeClass = "bg-danger";
    }else if(locationType.value=="2"){
        locationTypeClass = "bg-warning";
    }else{
        locationTypeClass = "bg-success";
    }
    
    let locationHtml = `
        <div class="card ${locationTypeClass} mb-2">
            <div class="card-body">
                <h5>${spotName.value}</h5>
            </div>
        </div> 
    `
    locationContainer.insertAdjacentHTML('beforeend', locationHtml);
}


closeButton.addEventListener('click', ()=>{
    formContainer.classList.add('d-none');
});

submit.addEventListener('click', function(e){
    e.preventDefault();
    if(spotName.value === "" || !spotName.value){
        alert("Please enter a spot name!");
        return;
    }

    L.marker([mapEvent.latlng.lat, mapEvent.latlng.lng])
    .addTo(mymap)
    .bindPopup(
        L.popup(
            {
                autoClose: false,
                closeOnClick: false,
                className: "red"
            }
        )
    )
    .setPopupContent(spotName.value)
    .openPopup();
    
    let location = {
        'name': spotName.value,
        'locationType': locationType.value,
        'location': {
            'lat': mapEvent.latlng.lat,
            'lng': mapEvent.latlng.lng
        }
    };

    locations.push(location);
    
    localStorage.setItem('locations', JSON.stringify(locations));

    // if(locationType.value === "1"){
    //     locationTypeClass = "bg-danger";
    // }else if(locationType.value === "2"){
    //     locationTypeClass = "bg-warning";
    // }else if(locationType.value === "3"){
    //     locationTypeClass = "bg-success";
    // }

    // console.log(locationType);
    // let locationHTML = `
    //     <div class="card ${locationTypeClass} mt-2">
    //         <div class="card-body">
    //             <h5>${spotName.value}</h5>
    //         </div>
    //     </div>
    // `;
    // locationContainer.insertAdjacentHTML('beforeend', locationHTML);
    
    // spotName.value = "";

    renderLocations();

    resetForm();
})

function onFailure(){
    alert('ERROR! Browser doesn\'t support geo location!');
}
