function initMap() {
  const miyajidakeshine = { lat: 33.7800199, lng: 130.4858554 };
  console.log(miyajidakeshine);
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: miyajidakeshine,
  });
  const marker = new google.maps.Marker({
    position: miyajidakeshine,
    map: map,
  });
}

// var map;
// var service;
// var infowindow;

// function initMap() {
//   var miyajidakeshine = new google.maps.LatLng(33.7800199, 130.4858554);

//   infowindow = new google.maps.InfoWindow();

//   map = new google.maps.Map(
//       document.getElementById('map'), {center: miyajidakeshine, zoom: 15});

//   var request = {
//     query: 'Museum of Contemporary Art Australia',
//     fields: ['name', 'geometry'],
//   };

//   var service = new google.maps.places.PlacesService(map);

//   service.findPlaceFromQuery(request, function(results, status) {
//     if (status === google.maps.places.PlacesServiceStatus.OK) {
//       for (var i = 0; i < results.length; i++) {
//         createMarker(results[i]);
//       }
//       map.setCenter(results[0].geometry.location);
//     }
//   });
// }



window.initMap = initMap;