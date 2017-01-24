var initialLocations = [
  {
    lat: 40.7128,
    lng: -74.0059,
    title: "New York",
    content: "This is New York City.",
    attribution: "http://www.nyc.gov/"
  },
  {
    lat: 40.7312,
    lng: -73.9971,
    title: "Washington Square Park",
    content: "This is WSQ Park.",
    attribution: "http://www.wsq.gov/"

  }
]

var Location = function(data) {
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
  this.title = ko.observable(data.title);
  this.content = ko.observable(data.content);
  this.attribution = ko.observable(data.attribution);
}

var ViewModel = function() {
  var that = this;

  this.locationsList = ko.observableArray([]);

  initialLocations.forEach(function(locationItem) {
    that.locationsList.push(new Location(locationItem));
  });

  foursquare_url = 'https://api.foursquare.com/v2/venues/search?near=New%20York,NY';
  foursquare_client_id = '&client_id=H5KKDQATDVABW3XSDBQ043GVRIQYCUII1SHKUAOVK2MUNA0P';
  foursquare_client_secret = '&client_secret=L5WYBLGJSGG4OCC4AJ5XAIWDIPM1DJRCVWZSRWAKOFJVQKUN';
  foursquare_query = '&query=bagels';
  foursquare_version = '&v=20170120'
  foursquare_mode = '&m=swarm'
  foursquare_api_call = foursquare_url + foursquare_query + foursquare_version + foursquare_mode + foursquare_client_id + foursquare_client_secret;

  this.foursquareLocations = ko.observableArray([]);

  $.getJSON(foursquare_api_call, function(data) {
    topFiveVenues = data.response.venues.slice(0,5);
    data.response.venues.slice(0,5).forEach(function(venue) {
      that.foursquareLocations.push({
        "title": venue.name,
        "lat": venue.location.lat,
        "lng": venue.location.lng,
        "lng": venue.location.lng,
        "content": venue.categories[0].name,
        "attribution": venue.url||"https://www.google.com/#safe=off&q=" + venue.name + " " + venue.location.address
      });
    });
  });

  this.searchQuery = ko.observable("");
  this.filtered = ko.computed(function() {
    var locationsArray = that.foursquareLocations();
    return ko.utils.arrayFilter(locationsArray, function(location) {
      if (location.title.toLowerCase().includes(that.searchQuery().toLowerCase())) {
        return location
      }
    })
  })


  // this.searchInput.bind('keypress', function() {
  //   if (that.searchQuery() != null) {
  //     that.locationsList = []
  //       initialLocations.forEach(function(locationItem) {
  //         if (locationItem.title.indexOf(that.searchQuery()) != -1) {
  //           that.locationsList.push(new Location(locationItem));
  //         }
  //       ko.bindingHandlers.map.init
  //         // console.log(locationItem.title if locationItem.title.contains())
  //       })
  //     // that.locationsList = that.locationsList.filter(function(locationItem) {
  //     //   return locationItem.title().includes(that.searchQuery());
  //     // })
  //   }
  // })

  // Google Maps
  ko.bindingHandlers.map = {
    init: function (element) {
        
        // Retrieve the first item in the locationsList and store it in centerLocation object.
        centerLocation = {
          lat: that.locationsList()[0].lat(),
          lng: that.locationsList()[0].lng()
        }

        // Set the map's center to centerLocation object.
        mapOptions = {
            zoom: 13,
            center: centerLocation
        }

        // Instantiate map.
        map = new google.maps.Map(element, mapOptions);

        // Instantiate a marker for each item in locationsList.
        console.log(that.locationsList().length)

        for (i = 0; i < that.locationsList().length; i++) { 
          locationItem = that.locationsList()[i]

          contentString = '<div class="content">'+
            '<div class="siteNotice">'+
            '</div>'+
            '<h1 id="' + locationItem.title() + '" class="firstHeading">' + locationItem.title() + '</h1>'+
            '<div class="bodyContent">'+
            '<p>' + locationItem.content() + '</p>'+
            '<p>Attribution: ' + locationItem.title() + 
            ', <a href="' + locationItem.attribution() + '">' +
            locationItem.attribution() +
            '</a> (last visited June 22, 2009).</p>'+
            '</div>'+
            '</div>';

          infowindow = new google.maps.InfoWindow({
            content: contentString
          });
          
          // Create an object with lat and lng for each locationItem.
          markerLocation = {
            lat: locationItem.lat(),
            lng: locationItem.lng()
          }
          // Instantiate a new marker for each locationItem.
          marker = new google.maps.Marker({
            position: markerLocation,
            map: map,
            infowindow: infowindow

          });

          // Close all other infowindows when another is clicked.
          lastOpenedInfowindow = ''

          closeLastOpenedInfowindow = function() {
            if (lastOpenedInfowindow) {
              lastOpenedInfowindow.close();
            }
          }

          // Provide markers with infowindow upon click.
          google.maps.event.addListener(marker, 'click', function() {
            closeLastOpenedInfowindow();
            this.infowindow.open(map, this);
            lastOpenedInfowindow = this.infowindow;
          });

          
        };
    }
  };

}
    
ko.applyBindings(new ViewModel);