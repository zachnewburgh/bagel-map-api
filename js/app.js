var locationsList = ko.observableArray([]);

var Location = function(data) {
  that = this;

  that.lat = ko.observable(data.lat);
  that.lng = ko.observable(data.lng);
  that.title = ko.observable(data.title);
  that.content = ko.observable(data.content);
  that.attribution = ko.observable(data.attribution);

  that.contentString = 
    '<div class="content">'+
    '<h1 id="' + that.title() + '" class="firstHeading">' + that.title() + '</h1>'+
    '<dataiv class="bodyContent">'+
    '<p>' + that.content() + '</p>'+
    '<p>Attribution: ' + that.title() + 
    ', <a href="' + that.attribution() + '">' + that.attribution() + '</a>' +
    '</div>'+
    '</div>';

  // Create an infowindow for each location.
  that.infowindow = new google.maps.InfoWindow({
    content: that.contentString
  });
  
  // Create an object with lat and lng for each locationItem.
  that.markerLocation = {
    lat: that.lat(),
    lng: that.lng()
  };

  // Instantiate a new marker for each locationItem.
  that.marker = new google.maps.Marker({
    title: that.title(),
    position: that.markerLocation,
    map: map,
    infowindow: that.infowindow,
    animation: google.maps.Animation.DROP
  });

  // Hide the marker from the map.
  that.marker.setVisible(false);

  // On click, show/hide the marker's infowindow
  // and start/stop the marker's bounce animation.
  that.marker.addListener('click', function() {
    selectedMarkerActions(this);
  });

  selectedMarkerActions = function(marker) {
    closeLastOpenedInfowindow();
    marker.infowindow.open(map, marker);
    lastOpenedInfowindow = marker.infowindow;

    stopLastMarkerBounce();
    marker.setAnimation(google.maps.Animation.BOUNCE);
    lastMarkerBounce = marker;
  };

  // Close all other infowindows when another is clicked.
  lastOpenedInfowindow = ""
  closeLastOpenedInfowindow = function() {
    if (lastOpenedInfowindow) {
      lastOpenedInfowindow.close();
    };
  };

  // Stop inactive markers from bouncing.
  lastMarkerBounce = ""
  stopLastMarkerBounce = function() {
    if (lastMarkerBounce) {
      lastMarkerBounce.setAnimation(null);
    };
  };

};

var ViewModel = function() {
  var that = this;

  // Foursquare API base URL and parameters.
  fs_base = 'https://api.foursquare.com/v2/venues/search?near=New%20York,NY';
  fs_id = '&client_id=H5KKDQATDVABW3XSDBQ043GVRIQYCUII1SHKUAOVK2MUNA0P';
  fs_secret = '&client_secret=L5WYBLGJSGG4OCC4AJ5XAIWDIPM1DJRCVWZSRWAKOFJVQKUN';
  fs_query = '&query=bagels';
  fs_version = '&v=20170120';
  fs_mode = '&m=swarm';
  fs_call = fs_base + fs_query + fs_version + fs_mode + fs_id + fs_secret;

  // Using AJAX to scrape Foursquare's API to return a JSON object.
  // If successful, for each venue, create a new Location. 
  // Otherwise, display error message in the #error div.
  $.ajax({
    url: fs_call,
    dataType: 'json',
    success: function(data) {
      data.response.venues.slice(0,30).forEach(function(venue) {
        locationsList.push(new Location({
          "title": venue.name,
          "lat": venue.location.lat,
          "lng": venue.location.lng,
          "lng": venue.location.lng,
          "content": venue.categories[0].name,
          "attribution": venue.url||'https://www.google.com/#safe=off&q=' + venue.name + ' ' + venue.location.address
        }));
      });
    },
    error: function(data) {
      errorDiv = document.getElementById('error');
      errorDiv.innerHTML = ("<h2>Foursquare's API failed to load. Check your connection and refresh the page.</h2>");
    }
  });

  // Links with the text input. 
  that.searchQuery = ko.observable("");

  // Filter locations based on searchQuery and
  // set marker's visibility based on filter.
  that.filteredLocations = ko.computed(function() {
    var locationsArray = locationsList();
    return ko.utils.arrayFilter(locationsArray, function(locationItem) {
      if (locationItem.title().toLowerCase().includes(that.searchQuery().toLowerCase())) {
        locationItem.marker.setVisible(true);
        return locationItem;
      } else {
        locationItem.marker.setVisible(false);
      };
    });
  });

  // When clicking on a location in the list,
  // make the relevant marker bounce and infowindow open.
  that.selectMarker = function(locationItem) {
    let marker = locationItem.marker;
    selectedMarkerActions(marker);
  };

};
    
ko.applyBindings(new ViewModel);