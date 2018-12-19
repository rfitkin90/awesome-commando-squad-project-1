$(document).ready(function () {

    // https://us-central1-search-mashup.cloudfunctions.net/search

    // giphy api
    $(document).on('click', function () {
        console.log(`Button Clicked: ${$(this).text()}`);
        var queryURL = `https://api.giphy.com/v1/gifs/search?q=${$(this).text()}
            &api_key=t0ZbKcgIFae6eHmCqLFoyUsNVYx5lbaT`;
        axios.get(queryURL)
            .then(function (response) {

            });
        ;
    });


    // unsplash api
    // https://unsplash.com/documentation#search-photos
    // https://api.unsplash.com/search/photos?page=1&query=cats&client_id=7d00297277c368bdacd0f4c3e012d098532a9bf633ed8403d5861e9112921956
    $(document).on('click', function () {
        console.log(`Button Clicked: ${$(this).text()}`);
        var queryURL = `https://api.unsplash.com/search/photos?page=1&query=cats&client_id=7d00297277c368bdacd0f4c3e012d098532a9bf633ed8403d5861e9112921956`;
        axios.get(queryURL)
            .then(function (response) {
                console.log(response);
            });
        ;
    });


    // ebay api
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
        });
    ;



    // openweather
    // ebay or amazon
    // seatgeek
    // google maps
    // twitter


});