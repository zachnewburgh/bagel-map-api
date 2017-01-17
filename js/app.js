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