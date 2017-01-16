var initialLocations = [
  {
    lat: 40.7128,
    lng: -74.0059
  },
  {
    lat: 40.7312,
    lng: -73.9971
  }
]

var Location = function(data) {
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
}

var ViewModel = function() {
  var that = this;

  this.locationsList = ko.observableArray([]);

  initialLocations.forEach(function(locationItem) {
    that.locationsList.push(new Location(locationItem));
  });

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
        that.locationsList().forEach(function(locationItem) {
          
          // Create an object with lat and lng for each locationItem.
          markerLocation = {
            lat: locationItem.lat(),
            lng: locationItem.lng()
          }
          // Instantiate a new marker for each locationItem.
          marker = new google.maps.Marker({
            position: markerLocation,
            map: map
          });

        });
    }
  };

}
    
ko.applyBindings(new ViewModel);