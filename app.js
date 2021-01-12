let locations = [];

function addMarker(bounds, coordinates, map, label) {
  var marker = new google.maps.Marker({
     position: coordinates, 
     map: map,
     label: label
  });
  bounds.extend(marker.position);
  return marker;
}

function generateMarkers(bounds, locations, map, labelNumber) {
  locations.map(location => { 
    const coordinates = {
      lat: Number(location.latitude),
      lng: Number(location.longitude)
    };
    if (location.latitude !== null || location.longitude !== null) {
    let label = (labelNumber++).toString();
      addMarker(bounds, coordinates, map, label);
    };
  })
}

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"));
  let bounds = new google.maps.LatLngBounds();
  let labelNumber = 1;
  generateMarkers(bounds, locations, map, labelNumber);
  map.fitBounds(bounds);
}

function initBreweryList() {
  $('#results').empty();
  locations.map(location => {
    if (location.latitude !== null || location.longitude !== null) {
      $('#results').append(
        `<li>
           <h3>
             <a href="${location.website_url}" target="_blank">${location.name}</a>
          </h3>
        </li>`
      )
    }
  })
}

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
      console.log(locations);
      initMap();
      initBreweryList();
    }) 
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
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