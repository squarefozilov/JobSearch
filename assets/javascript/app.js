
// fallback middle of sanfrancisco address, try to find business address
// TODO: 1.use dummy array for limited api call
// 2. match location from github jobs and citycode on quandl for getcityprice function (commented below on find-housing-btn click callback function)
// 3. since citycode only have california, need to update countrywide.
// 4. after this is done, use other API to use company address to use getSearchResults zillow API.
// 5. need input validation as well

// Your web app's Firebase configuration
var firebaseConfig = {
apiKey: "AIzaSyCjqbNE-e9ctONlDBQD6LYc_iVlD77_hZ4",
authDomain: "full-stack-bootcamp-1681b.firebaseapp.com",
databaseURL: "https://full-stack-bootcamp-1681b.firebaseio.com",
projectId: "full-stack-bootcamp-1681b",
storageBucket: "full-stack-bootcamp-1681b.appspot.com",
messagingSenderId: "797802791776",
appId: "1:797802791776:web:f435d46a7d541023a4d405",
measurementId: "G-P5RN8G26LN"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize database
var database = firebase.database();

var apiKey = "X1-ZWz17l8xablyiz_2ox88";
var queryURLZillow = "https://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id="+ apiKey+ "&address=2114+Bigelow+Ave&citystatezip=Seattle%2C+WA";

var quandlApiKey ="nQsyxm1bajs_XJxtiCCu";

var cityCode = [
    ["Aliso Viejo","994"],
    ["San Diego","9"],
    ["San Francisco", "13"],
    ["Mountain View", "328"],
    ["Thousands Oaks", "CA"],
    ["Sherman Oaks", "506"],
    ["Los Angeles", "2"],
    ["Sunnyvale","195"],
    ["Santa Monica","392"]
    ["Palo Alto","402"],
    ["Universal City","5072"],
    ["Santa Clara","167"],
    ["Redwood City","299"],
    ["Cupertino","537"],
    ["Pleasanton","369"],
    ["Mill Valley","1174"],
    ["Santa Barbara","461"]
];

var indicatorCode = [
    "MRP1B", //1 Bedroom
    "MRP2B", //2 Bedroom
    "MRP3B", //3 Bedroom
    "MRP4B", //4 Bedroom
    "MR51B" // 5+ Bedroom
]

// TODO: DB stuff, will be added for limited API call.
// var cityRef = database.ref("/housing_price");

// function rentalPricePush(){
//     for (var i = 0; i < cityCode.length; i++){
//         var city = cityCode[i][0];
//         var code = cityCode[i][1];
//         var rentalPrice = getCityPrice
//         if (cityRef){
//             cityRef.push({

//             })
//         }
//     }
// }

// using herokuapp to prevent CORS error
jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

$(".submit-btn").on("click",function(event){
    // Prevent refreshing when clicking submit btn
    event.preventDefault();
    var description = $("#input-job").val().trim();
    var loc = $("#input-location").val().trim();
    var queryURLJobs = "https://jobs.github.com/positions.json?description=";
    console.log(queryURLJobs+description+"&location="+loc+ "&page=1");
    $.ajax({
        url: queryURLJobs+ description + "&location=" +loc +"&page=1",
        method: "GET"
    }).then(function(response){
        console.log(response);
        var len = response.length;
        for (var i = 0; i < len; i++){
            var title = response[i].title;
            var company = response[i].company;
            var locat = response[i].location;
            var descr = response[i].description;
            var limitLength = 300;
            // using substr to reduce the text of job description
            if (descr.length > limitLength){
                descr = descr.substr(0,limitLength-2)+'...';
            }
            var link = response[i].url;

            // dynamically making job descriptions and buttons
            var newDiv = $("<div>");
            newDiv.addClass("row");
            newDiv.addClass("job-list");

            var titleLink = $("<h4><a href='"+link+"'>"+title+"</a></h4>");
            newDiv.append(titleLink);
            newDiv.append("<h5>"+company+"</h5>");
            newDiv.append("<h5 class='job-location'>"+locat+"</h5>");
            newDiv.append("<p>"+descr+"</p>");
            newDiv.attr("href",link);
            var newBtn = $("<button type='button' class='btn btn-success find-housing-btn'>");
            newBtn.text("Find Housing price info");
            newBtn.attr("data-place",locat);
            newDiv.append(newBtn);

            newDiv.append("<hr>");
            $(".job-results").append(newDiv);
        }
    });

})

// using data attribute to track the location of the company when clicking find-housing button (UPDATING)
$(document).on("click",".find-housing-btn",function(event){
    event.preventDefault();
    var loc = $(this).attr("data-place");
    $(".job-results").empty();

    $(".housing-city").html("<h4> Median rental price of "+loc+" is");
    $(".housing-listings").css("display","block");

    // TODO: match loc and citycode then call getCityPrice function in this callback to update table

});

// This function updates table by using quandl API to retrieve median rental price
function getCityPrice(city,citycode,indicatorCode) {
    var queryURL = "https://www.quandl.com/api/v3/datasets/ZILLOW/C"+citycode+"_"+indicatorCode+".json?api_key="+quandlApiKey+"&rows=1";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        rentalPrice = response.dataset.data[0][1];
        if (indicatorCode === "MRP1B"){
            roomSize = "1 Bedroom";
        } else if (indicatorCode === "MRP2B"){
            roomSize = "2 Bedroom";
        } else if (indicatorCode === "MRP3B"){
            roomSize = "3 Bedroom";
        } else if (indicatorCode === "MRP4B"){
            roomSize = "4 Bedroom";
        } else{
            roomSize = "5 Bedroom or more";
        }

        var newTr = $("<tr>");
        $(".housing-table").append(newTr);

        addTd(roomSize,newTr);
        addTd(rentalPrice, newTr);
    })

}

// This function add the item into the bootstrap table row.
function addTd(item,Tr){
    var Td = $("<td>").text(item);
    Tr.append(Td);
}

// find-housing-btn callback function is not done yet, so it is temporary call to show at least we can get the data from quandl API
getCityPrice(cityCode[2][0],cityCode[2][1],indicatorCode[0]);
getCityPrice(cityCode[2][0],cityCode[2][1],indicatorCode[1]);
getCityPrice(cityCode[2][0],cityCode[2][1],indicatorCode[2]);
getCityPrice(cityCode[2][0],cityCode[2][1],indicatorCode[3]);

