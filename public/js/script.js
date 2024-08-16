const socket = io();//"https://live-tracker-6dozl5a14-sushnata-sarkars-projects.vercel.app/"

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });
    }, (error)=>{
        console.error(error);
    },
    {
        enableHighAccuracy: true,
        timeout: 5000, // time out 5s
        maximumAge: 0, // for no cashing
    });
}

const map = L.map("map").setView([0,0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Susi Map"
    }).addTo(map)


const markers = {};

socket.on("receive-location", (data)=>{
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);  // set the view to current location and 16 is the zoom value
    
    //making points of location
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude])
    }
    else{
        markers[id]=L.marker([latitude, longitude]).addTo(map);
    }
})

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})