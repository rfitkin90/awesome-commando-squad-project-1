$(document).ready(function () {

   // https://us-central1-search-mashup.cloudfunctions.net/search

   // giphy api
   // $(document).on('click', function () {
   //     console.log(`Button Clicked: ${$(this).text()}`);
   //     var queryURL = `https://api.giphy.com/v1/gifs/search?q=${$(this).text()}
   //         &api_key=t0ZbKcgIFae6eHmCqLFoyUsNVYx5lbaT`;
   //     axios.get(queryURL)
   //         .then(function (response) {

   //         });
   //     ;
   // });


   // unsplash api
   // https://unsplash.com/documentation#search-photos
   // https://api.unsplash.com/search/photos?page=1&query=cats&client_id=7d00297277c368bdacd0f4c3e012d098532a9bf633ed8403d5861e9112921956
   // $(document).on('click', function () {
   //     console.log(`Button Clicked: ${$(this).text()}`);
   //     var queryURL = `https://api.unsplash.com/search/photos?page=1&query=cats&client_id=7d00297277c368bdacd0f4c3e012d098532a9bf633ed8403d5861e9112921956`;
   //     axios.get(queryURL)
   //         .then(function (response) {
   //             console.log(response);
   //         });
   //     ;
   // });


   // ebay api
   $(document).on('click', '#ebay-btn', function (e) {
      e.preventDefault();
      var queryURL = "http://svcs.ebay.com/services/search/FindingService/v1";
      queryURL += "?OPERATION-NAME=findItemsByKeywords";
      queryURL += "&SERVICE-VERSION=1.0.0";
      queryURL += "&SECURITY-APPNAME=RichardF-awesomec-PRD-c60b1f533-cd9c86f4";
      queryURL += "&GLOBAL-ID=EBAY-US";
      queryURL += "&RESPONSE-DATA-FORMAT=JSON";
      queryURL += "&callback=_cb_findItemsByKeywords";
      queryURL += "&REST-PAYLOAD";
      queryURL += "&keywords=harry%20potter";
      queryURL += "&paginationInput.entriesPerPage=3";
      axios.get(queryURL)
         .then(function (response) {
            console.log(response);
            // console.log(response.data);
            var dataObject = response.data;
            var dataString = JSON.stringify(dataObject);
            var superObject = JSON.parse(dataString);
            console.log(superObject);
            // console.log(response.data.viewItemURL);
         });
      ;
   });

   // seatgeek api
   var eventType;
   $(document).on('click', '#seatgeek-btn', function (e) {
      e.preventDefault();
      var queryURL = `https://api.seatgeek.com/2/events?taxonomies.name=${eventType}&q=${$("#seatgeek-argument").val().trim()}&client_id=MTQ0NTM0OTl8MTU0NTA2ODg0NC43Mg`;
      axios.get(queryURL)
         .then(function (response) {
            console.log(response);
            for (var i = 0; i < 10; i++) {
               // individual result div
               $('#seatgeek-results').append(`<div class='result-div' id='result-${response.data.events[i].id}' 
                  data-zipcode='${response.data.events[i].venue.postal_code}' 
                  data-country='${response.data.events[i].venue.country}'
                  data-date='${response.data.events[i].datetime_utc}'
                  ></div>`);

               // event title
               $(`#result-${response.data.events[i].id}`).append(`<h2>${response.data.events[i].title}</h2>`);

               // performers
               $(`#result-${response.data.events[i].id}`).append(`<h3>Performers</h3>`);
               if (eventType === 'sports') {
                  for (var j = 0; j < 2; j++) {
                     $(`#result-${response.data.events[i].id}`).append(`${response.data.events[i].performers[j].name}<br>`);
                  }
               } else {
                  for (var j = 0; j < response.data.events[i].performers.length; j++) {
                     $(`#result-${response.data.events[i].id}`).append(`${response.data.events[i].performers[j].name}<br>`);
                  }
               }

               // venue
               $(`#result-${response.data.events[i].id}`).append(`<h3>Venue</h3>`);
               $(`#result-${response.data.events[i].id}`).append(response.data.events[i].venue.name);
               $(`#result-${response.data.events[i].id}`).append(`<p>${response.data.events[i].venue.extended_address}</p>`);
               $(`#result-${response.data.events[i].id}`).append(`<p class='location' 
                  id='location-${response.data.events[i].id}'
                  ${response.data.events[i].venue.address}</p>`);

               // time/date
               $(`#result-${response.data.events[i].id}`).append(`<h3>Date/Time</h3>`);
               $(`#result-${response.data.events[i].id}`).append(`<p>${moment(response.data.events[i].datetime_utc).format('MMMM Do YYYY, h:mm:ss a')}</p>`);

               // page url
               $(`#result-${response.data.events[i].id}`).append(`<h3>Shop Tickets</h3>`);
               $(`#result-${response.data.events[i].id}`).append(`<p><a href='${response.data.events[i].url}' target='blank'>${response.data.events[i].url}</a></p>`);
            }
         });
      ;
   });

   $(document).on('click', '#sports-argument', function (e) {
      e.preventDefault();
      eventType = 'sports';
   });

   $(document).on('click', '#music-argument', function (e) {
      e.preventDefault();
      eventType = 'concert';
   });


   // openweather API
   $(document).on('click', '.result-div', function (e) {
      e.preventDefault();
      // This is our API key. Add your own API key between the ""
      var APIKey = "166a433c57516f51dfab1f7edaed8413";

      // if event is less than 24 hours away
      if (Math.abs((moment().diff(moment($(this).attr('data-date')), 'h'))) <= (24)) {
         console.log(moment());
         console.log(moment($(this).attr('data-date')));
         console.log((moment().diff(moment($(this).attr('data-date')), 'h')));
         // Here we are building the URL we need to query the database
         var queryURL = `https://api.openweathermap.org/data/2.5/weather?zip=${$(this).attr('data-zipcode')},
            ${$(this).attr('data-country')}&appid=${APIKey}`;
         console.log('weather');
         // We then created an AJAX call
         appendWeather();

      } else if (Math.abs(moment().diff(moment($(this).attr('data-date')), 'd')) <= 365) {
         var queryURL = `https://api.openweathermap.org/data/2.5/forecast?zip=${$(this).attr('data-zipcode')},
            ${$(this).attr('data-country')}&appid=${APIKey}`;
         console.log('forecast');
         var originalDate = moment($(this).attr('data-date'));
         var dateToHour = originalDate.startOf('hour');
         console.log(dateToHour.hour());
         var dateRemainder = (dateToHour.hour()) % 3;
         console.log(dateRemainder);
         var dateToThirdHour = dateToHour.hour() - dateRemainder;
         console.log(dateToThirdHour);

         var formattedDate = originalDate.format('MMMM Do YYYY, h:mm:ss a');

         $.ajax({
            url: queryURL,
            method: "GET"
         }).then(function (response) {

            // Create CODE HERE to Log the queryURL
            console.log(queryURL);
            // Create CODE HERE to log the resulting object
            console.log(response);
            // Create CODE HERE to transfer content to HTML
            $(".city").text("City : " + response.name);
            $(".wind").text("Wind speed: " + response.wind.speed + ", " + response.wind.deg);
            $(".humidity").text("Humidity : " + response.main.humidity);
            $(".temp").text("<p>Temperature : ' " + response.main.temp + " ' </p>");
            // Create CODE HERE to calculate the temperature (converted from Kelvin)
            var tempToFarenheit = (response.main.temp - 273.15) * 1.80 + 32;
            $(".temp").text("Temperature in Farenheit : " + tempToFarenheit + "F");
            // Hint: To convert from Kelvin to Fahrenheit: F = (K - 273.15) * 1.80 + 32
            // Create CODE HERE to dump the temperature content into HTML
         });
      }
      function appendWeather() {
         $.ajax({
            url: queryURL,
            method: "GET"
         }).then(function (response) {

            // Create CODE HERE to Log the queryURL
            console.log(queryURL);
            // Create CODE HERE to log the resulting object
            console.log(response);
            // Create CODE HERE to transfer content to HTML
            $(".city").text("City : " + response.name);
            $(".wind").text("Wind speed: " + response.wind.speed + ", " + response.wind.deg);
            $(".humidity").text("Humidity : " + response.main.humidity);
            $(".temp").text("<p>Temperature : ' " + response.main.temp + " ' </p>");
            // Create CODE HERE to calculate the temperature (converted from Kelvin)
            var tempToFarenheit = (response.main.temp - 273.15) * 1.80 + 32;
            $(".temp").text("Temperature in Farenheit : " + tempToFarenheit + "F");
            // Hint: To convert from Kelvin to Fahrenheit: F = (K - 273.15) * 1.80 + 32
            // Create CODE HERE to dump the temperature content into HTML
         });
      }
   });



   // var twitterURL = 'https://api.twitter.com/1.1/search/tweets.json?q=geocode=-22.912214,-43.230182,1km&lang=pt&result_type=recenttwurl/1.1/search/tweets.json?q=geocode=-22.912214,-43.230182,1km&lang=pt&result_type=recent';
   // axios.get(twitterURL)
   //     .then(function (response) {
   //         console.log(response);
   //     });
   // ;


   // var queryURL = `ps://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords
   // &SERVICE-VERSION=1.0.0
   // &SECURITY-APPNAME=YourAppID
   // &RESPONSE-DATA-FORMAT=XML
   // &REST-PAYLOAD
   // &keywords=harry%20potter%20phoenix`;
   // axios.get(queryURL)
   //     .then(function (response) {
   //         console.log(response);
   //     });
   // ;

   // wikipedia api
   // $.ajax({
   //     type: "GET",
   //     url: mw.util.wikiScript('api'),
   //     data: { action: 'query', format: 'json', lgname: 'foo', lgpassword: 'foobar' },
   //     dataType: 'json',
   //     success: function (jsondata) {
   //         console.log(jsondata.result);
   //     }
   // });

   // $.ajax({
   //     url: '//www.mediawiki.org/w/api.php?format=jsonty&action=query&meta=siteinfo&siprop=general&callback=?',
   //     data: {
   //         format: 'json'
   //     },
   //     dataType: 'jsonp'
   // }).done(function (response) {
   //     console.log(response);
   // });

   // openweather
   // ebay or amazon
   // seatgeek
   // google maps
   // twitter





});