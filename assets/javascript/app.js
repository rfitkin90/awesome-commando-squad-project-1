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

    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function (result) {
        if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // ...
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


    // seatgeek api
    var eventType;
    // event type parameters
    $(document).on('click', '#sports-argument', function (e) {
        e.preventDefault();
        eventType = 'sports';
    });
    $(document).on('click', '#music-argument', function (e) {
        e.preventDefault();
        eventType = 'concert';
    });
    // artist/team name parameters
    $(document).on('click', '#seatgeek-btn', function (e) {
        e.preventDefault();
        var queryURL = `https://api.seatgeek.com/2/events?taxonomies.name=${eventType}
            &q=${$("#seatgeek-argument").val().trim()}&client_id=MTQ0NTM0OTl8MTU0NTA2ODg0NC43Mg`;
        axios.get(queryURL)
            .then(function (response) {
                console.log(response);
                for (var i = 0; i < 10; i++) {
                    // individual result div
                    $('#seatgeek-results').append(`<div class='result-div' id='result-${response.data.events[i].id}'>
                        </div>`);
                    // event title
                    $(`#result-${response.data.events[i].id}`).append(`<h2>${response.data.events[i].title}</h2>`);
                    // performers
                    $(`#result-${response.data.events[i].id}`).append(`<h3>Performers</h3>`);
                    // limit sport events to 2 performers so you don't get some other irrelevant info for 3rd
                    if (eventType === 'sports') {
                        for (var j = 0; j < 2; j++) {
                            $(`#result-${response.data.events[i].id}`).append(`
                                ${response.data.events[i].performers[j].name}<br>`);
                        }
                    } else {
                        for (var j = 0; j < response.data.events[i].performers.length; j++) {
                            $(`#result-${response.data.events[i].id}`).append(`
                                ${response.data.events[i].performers[j].name}<br>`);
                        }
                    }
                    // venue
                    $(`#result-${response.data.events[i].id}`).append(`<h3>Venue</h3>`);
                    $(`#result-${response.data.events[i].id}`).append(response.data.events[i].venue.name);
                    $(`#result-${response.data.events[i].id}`).append(`<p>
                        ${response.data.events[i].venue.extended_address}</p>`);
                    $(`#result-${response.data.events[i].id}`).append(`<p class='location' 
                        id='location-${response.data.events[i].id}'
                        ${response.data.events[i].venue.address}</p>`);
                    // time/date
                    $(`#result-${response.data.events[i].id}`).append(`<h3>Date/Time</h3>`);
                    $(`#result-${response.data.events[i].id}`).append(`<p>
                        ${moment(response.data.events[i].datetime_utc).format('MMMM Do YYYY, h:mm:ss a')}</p>`);
                    // page url
                    $(`#result-${response.data.events[i].id}`).append(`<h3>Shop Tickets</h3>`);
                    $(`#result-${response.data.events[i].id}`).append(`<p><a href='${response.data.events[i].url}' 
                        target='blank'>${response.data.events[i].url}</a></p>`);
                    // more info
                    $(`#result-${response.data.events[i].id}`).append(`<button class='btn info-btn'
                        data-zipcode='${response.data.events[i].venue.postal_code}' 
                        data-country='${response.data.events[i].venue.country}'
                        data-date='${response.data.events[i].datetime_utc}'
                        data-lat='${response.data.events[i].venue.location.lat}'
                        data-lng='${response.data.events[i].venue.location.lon}'>More Info</button>`);
                }
            });
        ;
    });


    // openweather API
    $(document).on('click', '.info-btn', function (e) {
        e.preventDefault();
        $('#weather-info').empty();
        $('#weather-info').append(`<h4>Weather</h4>`);
        var APIKey = "166a433c57516f51dfab1f7edaed8413";
        var queryURL = `https://api.openweathermap.org/data/2.5/forecast?zip=${$(this).attr('data-zipcode')},
            ${$(this).attr('data-country')}&appid=${APIKey}`;

        // round date down to nearest 3rd hour and match the response data's date format
        var dateRemainder = moment($(this).attr('data-date')).hour() % 3;
        var convertedDate = moment($(this).attr('data-date'))
            .subtract(dateRemainder, 'h').format('YYYY-MM-DD HH:mm:ss');
        console.log(`Converted Date: ${convertedDate}`);

        // get weather response
        axios.get(queryURL)
            .then(function (response) {
                console.log(moment($(this).attr('data-date')).diff(moment(response.data.list[response.data.list.length - 1].dx_txt), 'h'));
                console.log(response.data.list.length - 1);
                console.log(response.data.list[response.data.list.length - 1]);
                console.log(response.data.list[response.data.list.length - 1].dx_txt);
                // if event is within the next 5 days(can't get forecast data beyond that w/o $)
                if (Math.abs(moment().diff(moment($(this).attr('data-date')), 'd')) <= 5) {

                    // find forecast with date equal to converted event date
                    var i = response.data.list.findIndex(item => item.dt_txt === convertedDate);
                    console.log(i);
                    console.log(response);
                    // main
                    $('#weather-info').append(`<p>${response.data.list[i].weather[0].main}</p>`);
                    // temperature
                    var tempKelvin = response.data.list[i].main.temp;
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
                            'color': '#000000',
                            'cursor': 'default',
                        });
                        $('#farenheit-converter').css({
                            'color': '#007bff',
                            'cursor': 'pointer',
                        });
                    });
                    // convert temp back to farenheit
                    $(document).on('click', '#farenheit-converter', function () {
                        $('#temp-value').text(tempFarenheit);
                        $('#farenheit-converter').css({
                            'color': '#000000',
                            'cursor': 'default',
                        });
                        $('#celcius-converter').css({
                            'color': '#007bff',
                            'cursor': 'pointer',
                        });
                    });
                    // humidity
                    $('#weather-info').append(`<p>Humidity: ${response.data.list[i].main.humidity}%</p>`);
                    // wind
                    var windDirection = response.data.list[i].wind.deg;
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
                    $('#weather-info').append(`<p>Wind: ${Math.floor(response.data.list[i].wind.speed)} mph 
                        ${windArrow}</p>`);
                } else {
                    $('#weather-info').append(`<p>Event not soon enough for accurate weather forecast.</p>`);
                }
            });
        ;
    });

    // geolocation API
    // axios.get(queryURL)
    //    .then(function (response) {
    //       // https://maps.googleapis.com/maps/api/geocode/xml?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyBJspIZnBYBASjscIsyBXVgUnt-u7SETMY
    //    });
    // ;
});
