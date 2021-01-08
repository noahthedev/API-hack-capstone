let locations = [];

function getBreweries(zipCode) {

  const url = "https://api.openbrewerydb.org/breweries?by_postal=" + zipCode;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      locations = responseJson;
      initMap();
    }) 
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function addMarker(bounds, coordinates, map) {
  var marker = new google.maps.Marker({
     position: coordinates, 
     map: map
  });
  bounds.extend(marker.position);
  return marker;
}

function generateMarkers(bounds, locations, map) {
  locations.map(location => { 
    const coordinates = {
      lat: Number(location.latitude),
      lng: Number(location.longitude)
    }
    if (location.latitude !== null || location.longitude !== null) {
      addMarker(bounds, coordinates, map);
    }
  })
}

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"));
  let bounds = new google.maps.LatLngBounds();
  generateMarkers(bounds, locations, map);
  map.fitBounds(bounds);

}

function handleFormSubmit() {
  $('form').submit(event => {
    event.preventDefault();
    const zipCode = $('#zip-code').val();
    getBreweries(zipCode);
    $('div').removeClass("hidden");
  });
}

function handleBreweryFinder() {
  handleFormSubmit();
}

$(handleBreweryFinder);