$(document).ready(function () {

   // firebase config
   var config = {
      apiKey: "AIzaSyBm4oVISK-6ztxP0P-n7P3nTNGzRxXq6iU",
      authDomain: "search-mashup.firebaseapp.com",
      databaseURL: "https://search-mashup.firebaseio.com",
      projectId: "search-mashup",
      storageBucket: "search-mashup.appspot.com",
      messagingSenderId: "1077728999470"
   };
   firebase.initializeApp(config);
   var database = firebase.database();


   var user = firebase.auth().currentUser;
   console.log(user);
   if (user || firebase.auth().getRedirectResult()) {
      // User is signed in.
      firebase.auth().getRedirectResult().then(function (result) {
         console.log(result)

         if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
         }
         else {
            var provider = new firebase.auth.GoogleAuthProvider();
            console.log(1)
            firebase.auth().signInWithRedirect(provider);
         }
         // The signed-in user info.
         var user = result.user;
      }).catch(function (error) {
         // Handle Errors here.
         var errorCode = error.code;
         var errorMessage = error.message;
         // The email of the user's account used.
         var email = error.email;
         // The firebase.auth.AuthCredential type that was used.
         var credential = error.credential;
         // ...
      });

   } else {
      // No user is signed in.
      console.log(1)

      console.log(1)

   }
   $(document).on('click', '#logout-btn', function (e) {
      firebase.auth().signOut().then(function () {
         // Sign-out successful.
      }).catch(function (error) {
         // An error happened.
      });
      console.log("Signed out");
   });

   var queryText;

   // seatgeek api
   var eventType;
   // event type parameters
   $(document).on('click', '#sports-argument', function (e) {
      e.preventDefault();
      eventType = 'sports';
      $(this).css({
         'border-color': '#4aaaa5',
      });
      $('#music-argument').css({
         'border-color': '#535353',
      });
   });
   $(document).on('click', '#music-argument', function (e) {
      e.preventDefault();
      eventType = 'concert';
      $(this).css({
         'border-color': '#4aaaa5',
      });
      $('#sports-argument').css({
         'border-color': '#535353',
      });
   });
   // artist/team name parameters
   $(document).on('click', '#seatgeek-btn', function (e) {
      e.preventDefault();
      var queryURL = `https://api.seatgeek.com/2/events?taxonomies.name=${eventType}
            &q=${$("#seatgeek-argument").val().trim()}&client_id=MTQ0NTM0OTl8MTU0NTA2ODg0NC43Mg`;
      queryText = $("#seatgeek-argument").val().trim();
      $('#seatgeek-argument').val('');
      axios.get(queryURL)
         .then(function (response) {
            console.log(response);
            console.log(eventType);
            if (eventType === undefined) {
               $('.modal-body').text("Please select an event type.");
               $('#myModal').modal('show');
            }
            else if (response.data.events.length === 0) {
               $('.modal-body').text("No upcoming events...");
               $('#myModal').modal('show');
            } else {
               $('#seatgeek-results').css({ 'visibility': 'visible', });
               $('#seatgeek-results').empty();
               for (var i = 0; i < 10; i++) {
                  // individual result div
                  $('#seatgeek-results').append(`<div class='result-div' 
                        id='result-${response.data.events[i].id}'></div>`);
                  // event title
                  $(`#result-${response.data.events[i].id}`).append(`<div 
                            class='info-div info-title' id='${response.data.events[i].id}-title'></div>`);
                  $(`#${response.data.events[i].id}-title`).append(`<div>
                            ${response.data.events[i].title}</div>`);
                  // performers
                  $(`#result-${response.data.events[i].id}`).append(`<div 
                            class='info-div' id='${response.data.events[i].id}-performers'></div>`);
                  $(`#${response.data.events[i].id}-performers`).append(`<div>
                            <p class='info-title'>Performers: </p></div>`);
                  // limit sport events to 2 performers so you don't get some other irrelevant info for 3rd
                  if (eventType === 'sports') {
                     for (var j = 0; j < 2; j++) {
                        $(`#${response.data.events[i].id}-performers`).append(`<p>
                                    ${response.data.events[i].performers[j].name}</p>`);
                     }
                  } else {
                     for (var j = 0; j < response.data.events[i].performers.length; j++) {
                        $(`#${response.data.events[i].id}-performers`).append(`<p>
                                    ${response.data.events[i].performers[j].name}</p>`);
                     }
                  }
                  // venue
                  $(`#result-${response.data.events[i].id}`).append(`<div 
                            class='info-div' id='${response.data.events[i].id}-venue'></div>`);
                  $(`#${response.data.events[i].id}-venue`).append(`<p class='info-title'>Venue: </p>`);
                  $(`#${response.data.events[i].id}-venue`).append(response.data.events[i].venue.name);
                  $(`#${response.data.events[i].id}-venue`).append(`<p>
                            ${response.data.events[i].venue.display_location}</p>`);
                  // time/date
                  $(`#result-${response.data.events[i].id}`).append(`<div 
                            class='info-div' id='${response.data.events[i].id}-date'></div>`);
                  $(`#${response.data.events[i].id}-date`).append(`<span 
                            class='info-title'>Date/Time: </span><span>
                        ${moment(response.data.events[i].datetime_local)
                        .format('MMMM Do YYYY, h:mm:ss a')}</span><br>`);
                  // more info
                  $(`#result-${response.data.events[i].id}`).append(`<button class='btn info-btn' 
                        id='infoBtn-${response.data.events[i].id}'
                        data-zipcode='${response.data.events[i].venue.postal_code}' 
                        data-country='${response.data.events[i].venue.country}'
                        data-date='${response.data.events[i].datetime_local}'
                        data-lat='${response.data.events[i].venue.location.lat}'
                        data-lng='${response.data.events[i].venue.location.lon}'
                        data-venueName='${response.data.events[i].venue.name}'
                        data-address='${response.data.events[i].venue.address}'
                        data-extendedAddress='${response.data.events[i].venue.extended_address}'
                        data-tickets='${response.data.events[i].url}'
                        data-title='${response.data.events[i].title}'
                        data-performers='${response.data.events[i].performers}'
                        data-id='${response.data.events[i].id}'
                        >More Info</button>`);
                  if (eventType === 'sports') {
                     $(`#infoBtn-${response.data.events[i].id}`).attr('data-performerAmount', 2);
                     for (var j = 0; j < 2; j++) {
                        $(`#infoBtn-${response.data.events[i].id}`).attr(`data-performer${j}`,
                           `${response.data.events[i].performers[j].name}`);
                     }
                  } else {
                     $(`#infoBtn-${response.data.events[i].id}`).attr('data-performerAmount',
                        response.data.events[i].performers.length);
                     for (var j = 0; j < response.data.events[i].performers.length; j++) {
                        $(`#infoBtn-${response.data.events[i].id}`).attr(`data-performer${j}`,
                           `${response.data.events[i].performers[j].name}`);
                     }
                  }
               }
            }
         });
      ;
   });

   // seatgeek additional info
   $(document).on('click', '.info-btn', function (e) {
      e.preventDefault();
      $('#additional-info').empty();
      $('#additional-info').append('<p id="additional-info-title">Detailed Info</p>');
      $('#additional-info').append(`<p class='sub-header'>${$(this).attr('data-title')}</p>`);
      $('#additional-info').append(`<p class='sub-header'>Performers:</p>`);
      for (i = 0; i < $(this).attr('data-performerAmount'); i++) {
         var dataPerformer = $(this).attr(`data-performer${i}`);
         $('#additional-info').append(`<p>${dataPerformer}</p>`);
      }
      $('#additional-info').append(`<p class='sub-header'>Venue:</p>`);
      $('#additional-info').append(`<p>${$(this).attr('data-venueName')}</p>`);
      $('#additional-info').append(`<p>${$(this).attr('data-address')}</p>`);
      $('#additional-info').append(`<p>${$(this).attr('data-extendedAddress')}</p>`);
      $('#additional-info').append(`<p class='inline-subheader'><span class='bold'>Date/Time: </span>
            <span>${moment($(this).attr('data-date')).format('MMMM Do YYYY, h:mm:ss a')}</span></p>`);
      $('#additional-info').append(`<p class='inline-subheader'><span class='bold'>Buy Tickets: </span><span>
            <a href='${$(this).attr('data-tickets')}' target='blank'>${$(this).attr('data-tickets')}</a></span></p>`);
   });

   // openweather API
   $(document).on('click', '.info-btn', function (e) {
      e.preventDefault();
      $('#additional-info').css({
         'border-width': `${2}px`,
         'border-style': 'solid',
         'border-color': '#777777',
         'padding': `${5}px`,
         'background-color': '#191a1e'
      });

      $('#additional-info').append('<div id = "weather-info">');

      $('#weather-info').empty();
      $('#weather-info').append(`<p class='sub-header'id='weather-title'>Weather:</p>`);
      var APIKey = "166a433c57516f51dfab1f7edaed8413";
      var queryURL = `https://api.openweathermap.org/data/2.5/forecast?zip=${$(this).attr('data-zipcode')},
            ${$(this).attr('data-country')}&appid=${APIKey}`;

      // round date down to nearest 3rd hour and match the response data's date format
      var dateRemainder = moment($(this).attr('data-date')).hour() % 3;
      var convertedDate = moment($(this).attr('data-date')).startOf('hour')
         .subtract(dateRemainder, 'h').format('YYYY-MM-DD HH:mm:ss');
      console.log(`Converted Date: ${convertedDate}`);
      var dataZipcode = $(this).attr('data-zipcode');
      var dataCountry = $(this).attr('data-country');

      // get weather response
      axios.get(queryURL)
         .then(function (response) {
            console.log(moment(convertedDate)
               .diff(moment(response.data.list[response.data.list.length - 1].dt_txt), 'h'));

            // if event is before first forecast
            if (moment(convertedDate).diff(moment(response.data.list[0].dt_txt), 'h') < 0) {
               var weatherURL = `https://api.openweathermap.org/data/2.5/weather?zip=${dataZipcode},
                        ${dataCountry}&appid=${APIKey}`
               axios.get(weatherURL)
                  .then(function (response) {
                     console.log('weather');
                     console.log(response);
                     appendWeatherData(response.data.weather[0].main, response.data.main.temp,
                        response.data.wind.speed, response.data.main.humidity, response.data.wind.deg);
                  });
               ;

               // if event is within the next 5 days(can't get forecast data beyond that w/o $)
            } else if (moment(convertedDate)
               .diff(moment(response.data.list[response.data.list.length - 1].dt_txt), 'h') < 0) {
               // find forecast with date equal to converted event date
               console.log('forecast');
               var i = response.data.list.findIndex(item => item.dt_txt === convertedDate);
               console.log(i);
               console.log(response);
               appendWeatherData(response.data.list[i].weather[0].main, response.data.list[i].main.temp,
                  response.data.list[i].wind.speed, response.data.list[i].main.humidity,
                  response.data.list[i].wind.deg);

               // if event is after end of 5 day forecast
            } else {
               $('#weather-info').append(`<p>Event not soon enough for accurate weather forecast.</p>`);
            }

            function appendWeatherData(main, temp, windSpeed, humidity, windDeg) {
               // main
               $('#weather-info').append(`<p>${main}</p>`);
               // temperature
               var tempKelvin = temp;
               var tempFarenheit = Math.floor((tempKelvin - 273.15) * 1.8 + 32);
               var tempCelcius = Math.floor(tempKelvin - 273.15);
               $('#weather-info').append(`<p style='cursor:default'><span id='temp-value'>${tempFarenheit}</span>
                        <span id='farenheit-converter'>F&#176;</span>
                        <span>|</span>
                        <span id='celcius-converter'>C&#176;</span></p>`);
               $('#celcius-converter').css({
                  'color': '#007bff',
                  'cursor': 'pointer',
               });
               // convert temp to celcius
               $(document).on('click', '#celcius-converter', function () {
                  $('#temp-value').text(tempCelcius);
                  $('#celcius-converter').css({
                     'color': '#FFFFFF',
                     'cursor': 'default',
                  });
                  $('#farenheit-converter').css({
                     'color': '#007bff',
                     'cursor': 'pointer',
                  });
                  $('#wind-speed').html(`Wind: ${Math.floor(windSpeed * 1.60934)} km/h 
                            ${windArrow}</p>`);
               });
               // convert temp back to farenheit
               $(document).on('click', '#farenheit-converter', function () {
                  $('#temp-value').text(tempFarenheit);
                  $('#farenheit-converter').css({
                     'color': '#FFFFFF',
                     'cursor': 'default',
                  });
                  $('#celcius-converter').css({
                     'color': '#007bff',
                     'cursor': 'pointer',
                  });
                  $('#wind-speed').html(`Wind: ${Math.floor(windSpeed)} mph 
                            ${windArrow}</p>`);
               });
               // humidity
               $('#weather-info').append(`<p>Humidity: ${humidity}%</p>`);
               // wind
               var windDirection = windDeg;
               // convert wind direction from numeric degrees to an arrow symbol
               var windArrow;
               if (windDirection <= 22.5 || windDirection > 337.5) {
                  windArrow = '&#x2191;';
               } else if (windDirection > 292.5) {
                  windArrow = '&#x2196;';
               } else if (windDirection > 247.5) {
                  windArrow = '&#x2190;';
               } else if (windDirection > 202.5) {
                  windArrow = '&#x2199;';
               } else if (windDirection > 157.5) {
                  windArrow = '&#x2193;';
               } else if (windDirection > 112.5) {
                  windArrow = '&#x2198;';
               } else if (windDirection > 67.5) {
                  windArrow = '&#x2192;';
               } else {
                  windArrow = '&#x2197;';
               }
               $('#weather-info').append(`<p id='wind-speed'>
                        Wind: ${Math.floor(windSpeed)} mph ${windArrow}</p>`);
            }
         });
      ;
   });

   // google maps API
   $(document).on('click', '.info-btn', function (e) {
      e.preventDefault();
      $('#additional-info').append('<div id = "map">');

      console.log('hey');
      var latValue = parseFloat($(this).attr('data-lat'));
      var lngValue = parseFloat($(this).attr('data-lng'));
      console.log(latValue);
      console.log(lngValue);
      var map;
      initMap();
      function initMap() {
         console.log('yo');
         map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: {
               lat: latValue,
               lng: lngValue
            }
         });
      }
      var marker = new google.maps.Marker({
         position: {
            lat: latValue,
            lng: lngValue
         },
         map: map,
      });

      var service;
      var infowindow;

      var request = {
         location: {
            lat: latValue,
            lng: lngValue
         },
         radius: '500',
         type: ['restaurant']
      };

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);

      function callback(results, status) {
         if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
               var place = results[i];
               createMarker(results[i]);
            }
         }
      }

      function createMarker(place) {
         var placeLoc = place.geometry.location;
         var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: {
               url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }
         });
         infowindow = new google.maps.InfoWindow({
            content: `<p class='marker-info'>${place.name}</p><p class='marker-info'>${place.vicinity}</p>`,
            map: map,
         });
         google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, this);
         });
      }
   });


   // twitter api
   $(document).on('click', '.info-btn', function (e) {
      e.preventDefault();

      // update title
      var query = queryText;
      $('#additional-info').append(`<p class = 'btn' id='tweet-title'>Show "${query}" tweets</p>`);

      $(document).on('click', '#tweet-title', function (e) {
         console.log("button pressed");
         $('#additional-info').append('<div id="tweets">');
         $('#tweets').append('<span id="loading">Loading tweets...</span>');

         var cb = new Codebird;
         // API TOKEN AND SECRET - DO NOT PUBLISH
         cb.setConsumerKey("GzOQlmiqQSoFVC3pxUskiFZfV", "lU4VcpQXHBdKWrgXWct0ynGqHzDEB9kRAsmt60KyiH2dtVVDNf");

         // get bearer token

         cb.__call("oauth2_token", {}, function (reply, err) {
            var bearer_token;
            if (err) {
               console.log("error response or timeout exceeded" + err.error);
            }
            if (reply) {
               bearer_token = reply.access_token;
               console.log('🐻 bearer_token', bearer_token);

               // set security token
               cb.setBearerToken(bearer_token);

               // search tweets
               var params = {
                  q: query
               };
               console.log('💹  search_tweets.params', params);
               cb.__call("search_tweets", params, function (reply) {
                  console.log('💹  search_tweets.reply', reply);
                  if (reply.statuses) {
                     console.log(reply);
                     console.log(reply.statuses);

                     // remove loading indicator
                     var loading = document.getElementById('loading');
                     loading.remove();

                     // iterate through tweets and add to list
                     reply.statuses.forEach(function (tweet) {
                        $('#tweets').append(`<div class='tweet-div'>${tweet.text}</div>`);
                     });
                  }
               });
            }
         });
      });
   });

});
