

/*TEXT ANIMATION PLEASE DONT MOVE */

/////////////////////////////////////////////////////////////////////
var pos,radius,addMovies;
$('.message a').click(function(){
  $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});


// Initialize Firebase
var config = {
  apiKey: "AIzaSyBxYu0ZTOj6wX-e7tjlsMFIIQKNDzGQOMw",
  authDomain: "datenight-1d83d.firebaseapp.com",
  databaseURL: "https://datenight-1d83d.firebaseio.com",
  projectId: "datenight-1d83d",
  storageBucket: "datenight-1d83d.appspot.com",
  messagingSenderId: "934240292130"
};
firebase.initializeApp(config);

// ------------ Firebase Authentication ----------------------
var txtEmailLogin = document.getElementById('txtEmail-login');
var txtPasswordLogin = document.getElementById('txtPassword-login');
var txtEmailReg = document.getElementById('txtEmail-reg');
var txtPasswordReg = document.getElementById('txtPassword-reg');
var btnLogin = document.getElementById('btnLogin');
var btnSignUp = document.getElementById('btnSignUp');
var btnLogout = document.getElementById('btnLogout');
var loginBtn = document.getElementById('loginBtn');
function userlogingDis(){
$('#registerPg').hide()
$(".modal-backdrop").remove();
$('#loginPg').hide()
$(".modal-backdrop").remove();
}
// Add login event
btnLogin.addEventListener('click', e => {
  // Get email and pass
  event.preventDefault();
  var email = txtEmailLogin.value;
  var pass = txtPasswordLogin.value;
  var auth = firebase.auth();
  // Sign In
  var promise = auth.signInWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));
  //promise.catch(e => $('#firstContainer').text('<p>'+e.message+'</p>'));
});

// Add signup Event
btnSignUp.addEventListener('click', e => {
  // Get email and pass
  event.preventDefault();
  var email = txtEmailReg.value;
  var cleanEmail = email.replace(/\./g, ','); // Convert email so it can be used in Firebase path
  var pass = txtPasswordReg.value;
  var auth = firebase.auth();
  // Sign In
  var promise = auth.createUserWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));

  firebase.database().ref('users/' + cleanEmail).set({
    movie: "",
    showtime: "",
    theater: "",
    restaurant: "",
    address: "",
    url: ""
  });
});
function logOut(){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    $('#loginBtn').show()
    $('#registerBtn').show()
    $('#user').hide()
    $('#userText').remove()
    $('#btnLogout').remove()
    
    console.log("user out")
  }).catch(function(error) {
    // An error happened.
    console.log('something wrong')
  });
}
// Add a realtime Listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    console.log(firebaseUser);
    console.log(firebaseUser.email + " is signed in");
    $('#loginBtn').hide()
    $('#registerBtn').hide()
    //$('#firstContainer').append('<div id="user">');
    $('#user').show()
    $('#user').append('<p id="userText">Hi' + ' ' + firebaseUser.email + '</p>')
    $('#user').append('<button onclick="logOut()" id="btnLogout">LogOut</button>')
   
    //btnLogout.classList.remove('hide');

  } else {
    $('#user').hide()
    console.log('not logged in');
    //btnLogout.classList.add('hide');
  }
});
// ------------ Firebase Authentication ----------------------


// var howManyResults = 50;
var inputdate = "";
var today =  new moment().format("YYYY-MM-DD");
console.log(today)
var distance = "";
function runToday() {
  inputdate = $("#date-input").val();
  if (inputdate === "") {
    (inputdate = today);
  }
};
// function userResult(){
//   var queryURL = "https://developers.zomato.com/api/v2.1/search?";
//   var $movieTable = $('#movieTable');
//   $('#movieTable').empty()
//   $('#save').hide();
  
//   $.ajax({
//     url: queryURL,
//     method: "GET",
//     headers: { 'user-key': '930bc5c593df51586e7bff08f89be982' }
//   }).then(function (response) {
//     console.log(response);
//     console.log(JSON.stringify(response))
//     var selectRestaurant = document.getElementById('selectRestaurantBtn')
//   var resVal = selectRestaurant.value
//   $movieTable.append($('<h1>').text('Your Choice:'))
//   //$('#movieTable').append('<p>'+ selectRestaurant + '</p>')
//   $('#movieTable').append($('<p>'+ resVal+ '</p>'))
//   })
// }

function runZomato(count,start,locObj,cuisines,$this) {
    cuisines = (cuisines = "") ? JSON.stringify($this.attr('data-fullList')) : cuisines
    event.preventDefault();
    // var randNum = Math.floor(Math.random() * 20);

    var latitude = locObj.lat;
    var longitude = locObj.lng;
    console.log(latitude)
    console.log(longitude)
    var radius = Math.round(radius*1609.34)
    var queryURL = "https://developers.zomato.com/api/v2.1/search?" + "count="+count+"&start="+start+"&lat=" + latitude + "&lon=" + longitude + "&radius="+radius+"&cuisines="+cuisines+"&sort=real_distance&order=asc";
    

    $.ajax({
    url: queryURL,
    method: "GET",
    headers: {'user-key' : '930bc5c593df51586e7bff08f89be982'}
    }).then(function(response) {
      

      console.log(response);
      // console.log($this.attr('data'))

      var restaurantsArray = response.restaurants
  
      // var currentRestaurant = restaurantsArray[randNum].restaurant.name;
      // var currentRestaurantLocal = restaurantsArray[randNum].restaurant.location.address;
      // $("#restaurant-view").text("Restaurant Name: " + currentRestaurant);
      // $("#restaurant-view").append("<br>");
      // $("#restaurant-view").append("Address: " + currentRestaurantLocal);
      // $("#restaurant-view").append("<br></br>");
        // for (i=0;i<howManyResults;i++){  
      
      for (var i=0; i<restaurantsArray.length; i++){
        $('<div>').attr({
          class:'col col-md-8 restaurant', 
          type: 'button', 
          'data-toggle': 'modal', 
          'data-target': '#movieShowtimeModal',
          'data-loc':JSON.stringify(locObj), 
          'data-restaurant':JSON.stringify(restaurantsArray[i]),
          'data-title': $this.attr('data-title'),
          'data-time' : $this.attr('data-time'),
          'data-theater' : $this.attr('data-theater'),
          'data-link': $this.attr('data-link')
        }).append(
          $('<h3>').text(restaurantsArray[i].restaurant.name),
          $('<p>').text(restaurantsArray[i].restaurant.location.address)
        ).appendTo($('#results-view'));
      }
      $('#results-view').append($('<button>').attr({id: 'moreRestaurants','data-title': $this.attr('data-title'),'data-time' : $this.attr('data-time'),'data-theater' : $this.attr('data-theater'),class:'col-md-8 text-center','data-fullList':$this.attr('data-fullList'),'data-loc':JSON.stringify(locObj),'data-cuisines': cuisines,'data-start':JSON.stringify(start)}).text('More Restaurants'))
})};

function offsetZomato(start,$this){
  console.log($this)
  var locObj = JSON.parse($this.attr('data-loc'));
  var cuisines = $this.attr('data-cuisines)')
  console.log('locationObject')
  console.log(locObj);
  var count = 20;
  start += count;
  $this.remove()
  runZomato(count,start,locObj,cuisines);
}
function runMovies(){
    clearTimeout(addMovies);
    event.preventDefault();
    var length = 2;
    radius = $("#distance-input").val()
    console.log(radius)
    // .splice($('#distance-input').val().indexOf(match(/^\d{1,2}$/))[0]).substring(0, length);
    if (radius.match(/\d{1,3}/g) !== null){
      radius = parseInt(radius.match(/\d{1,3}/g)[0])
      if (radius > 100){
        $('#distance-input').val('').attr({placeholder: 'Max: 100 miles',style:'color:red'}).one('focus',function(){
          $this.attr({placeholder: '5 miles (optional)', style:'color:black'})   
        $('#find-theater').one('click',function(){
          $('distance-input').attr({placeholder: '5 miles (optional)', style:'color:black'})
          })
        })
      }
    }
    else
      radius = 5
    var apikey = "7byjtqn68yzm6ecsjfmcy9q3";
    //  var apikey = "7byjtqn68yzm6ecsjfmcy9q3";
    // var apikey = "sdpzqr2egk9fyp2ct7jz879v";
    // var apikey = "dxfsm4dzuvd4wxbbwu2f4gze"; //David

    var baseUrl = "https://data.tmsapi.com/v1.1";
    var showtimesUrl = baseUrl + '/movies/showings';
    var zipCode = $("#location-input").val();
    var zipTest = /^\b\d{5}(-\d{4})?\b$/.test(zipCode)
    if (!pos&&!zipTest){
      if ($('#location-input').val() != ''){
        displayMovieTable();
        $('#results-view').append($('<h3>').attr({id: 'zipError', style: 'color: red; margin: auto; display:block',class: 'text-center'}).text('Zip Code Invalid'));
        $('#location-input').one('focus', function(){
          $('#zipError').remove();
          $('#movieCard').attr('style','display:none');
        })
      }
      $("#location-input").addClass('input').attr('placeholder','zipcode (required)').one('focus',function(){
        $(this).removeClass('input');
        $('#zipError').remove();

      });
      $('#find-theater').one('click', function(){
        $("#location-input").removeClass('input')

      })
      return;
    }
    if(!pos){
      $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:'+zipCode+'&key=AIzaSyArGspblnhF4-hiENSFuiTXDuoRoxS-by8',
        method:"GET"
      }).then(function(resp){
          console.log(resp)
          if(resp.status === 'OK'){
            pos = {lat: resp.results[0].geometry.location.lat, lng: resp.results[0].geometry.location.lng}
          }
          else{
            $('#results-view').append(
              $('<h3>').attr({style: 'color: red; margin: auto; display:block',class: 'text-center'}).text('Zip Code Invalid')
            )
          }
        $.ajax({
          url: showtimesUrl,
          data: { 
            startDate: inputdate,
            // zip: zipCode,
            radius: radius,
            lat: pos.lat,
            lng: pos.lng,
            jsonp: "dataHandler",
            api_key: apikey
          },          
          dataType: "jsonp",
        });
      })
    }
    else{
      $.ajax({
        url: showtimesUrl,
        data: { 
          startDate: inputdate,
          // zip: zipCode,
          radius: radius,
          lat: pos.lat,
          lng: pos.lng,
          imageText: true,
          jsonp: "dataHandler",
          api_key: apikey
        },          
        dataType: "jsonp",
      });
    }
};

function dataHandler(data) {
  displayMovieTable();
  $('#results-view').empty()
  console.log(data)
  if (data === undefined){

      $('#results-view').append(
      $('<h3>').attr({style: 'color: red; margin: auto',class: 'text-center'}).text('Sorry, your search did not return any results.'),
      $('<br>'),
      $('<h5>').attr({style: 'width: 100%; text-align: center'}).text('Hint: try adjusting the distance or date')
    );
    return;
  }
  var zipCode = $("#location-input").val();
  var apikey = "7byjtqn68yzm6ecsjfmcy9q3";
  // var apikey = "sdpzqr2egk9fyp2ct7jz879v";
  var resultsArr = []
  var array2 = []
  var resultsObj = {}
  // console.log('Found ' + data.length + ' movies showing within ' + distance + ' miles of ' + zipCode+':');
  $.each(data, function(index, movie) {
    console.log(movie)
    console.log(this)
    console.log(index)

  
    var url =  "https://www.omdbapi.com/?t=" + movie.title + "&y=&plot=short&apikey=trilogy"
    $.ajax({url: url, method: 'GET'} ).then(function(resp){
      console.log(resp)
      if (resp.Response){
        if (resp.Poster && resp.Poster != "N/A" && resp.Title === movie.title){
          var tile = $('<div>').addClass('col-lg-2 tile col-md-4 col-sm-6 col-xs-12').append($('<img>').attr({src: resp.Poster, alt: movie.title, class: 'poster', type: 'button', 'data-toggle': 'modal', 'data-target': '#movieShowtimeModal','data-movie': JSON.stringify(movie)}))
          $("#results-view").append(tile);
          array2.push(movie.title)
        }
        else{
          //set key for timeout iteration of array
          resultsObj[movie.title] = movie;
          resultsArr.push(movie.title)
        }
      }
      else {
        //set key for timeout iteration of array
        resultsObj[movie.title] = movie;
        resultsArr.push(movie.title)
      }
    })
  });
  setTimeout(function(){
    i=0
    loopObj();
    function loopObj(){
      //timeout iteration of array
      addMovies = setTimeout(function(){
        var key = resultsArr[i]
        var tile = $('<div>').addClass('col-lg-2 tile col-md-4 col-sm-6 col-xs-12').append($('<img>').attr({src: "http://developer.tmsimg.com/" + resultsObj[key].preferredImage.uri + '?api_key='+apikey, alt: resultsObj[key].title, class: 'poster', type: 'button', 'data-toggle': 'modal', 'data-target': '#movieShowtimeModal','data-movie': JSON.stringify(resultsObj[key])}))
        if(resultsObj[key].preferredImage.uri.includes('generic'))
          tile.append($('<h6>').attr({class:'movie-title'}).text(resultsObj[key].title))
        $("#results-view").append(tile);
        i++;
        if (i <Object.keys(resultsObj).length)
          loopObj();
      },750)
    } 
  },750)

};
    
    
$(document).ready(function() {
    var today = new moment().format('YYYY-MM-DD')
    $('#date-input').attr({type: "date",value:today})
    $('.poster').hover(function() {	    
    $(this).siblings('.poster').css({'z-index':10, transform: scale(1.5)});
    $(this).css('z-index', 99);
  })
})

function fillModal(){
  $("body").css("cursor", "progress")
  var lettersU = ['&#9398;','&#9399;','&#9400;','&#9401;','&#9402;','&#9403;','&#9404;','&#9405;','&#9406','&#9407','&#9408','&#9409','&#9410','&#9411','&#9412','&#9413','&#9414','&#9415','&#9416']
  var letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S',]
  var labelIndex = 0
  var theaters = [];
  var data = JSON.parse($(this).attr('data-movie'));
  console.log(data);
  var resultsSearchDay = moment(data.showtimes[0].dateTime, 'YYYY-MM-DDThh:mm').format('dddd, MMMM Do YYYY');
  $('#movieTable').empty();
  $('#movieDescrip').empty().append($('<h3>').text(data.title), $('<p>').text(data.longDescription));
  var row1 = $('<div>').addClass('row text-center').append($('<h6>').text('Showtimes for ' + resultsSearchDay), $('<br><br>'));
  var row2 = $('<div>').addClass('row');
  //create list of theaters showing the selected movie
  for (var i=0;i<data.showtimes.length;i++){
    if (theaters.indexOf(data.showtimes[i].theatre.name) == -1)
      theaters.push(data.showtimes[i].theatre.name);
  }
  
  
  $('#movieTable').append(row1,row2,$('<div>').attr({id:'map'}));
  
  initMap();
  //use google places to get lat/long of each theater and pin on map
  var i=0; 
  pinAddress()
  function  pinAddress(){
    console.log(theaters[i])
    var request = {
      query: theaters[i],
      fields: ['name', 'geometry'],
    };
    var service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, function(results, status) {
      if (status === "OK") {
        console.log(status)
        console.log(results[0].geometry.location)
        createMarker(results[0]);
      
      function createMarker(place) {
        
        var center = map.getCenter();
        var distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(center, results[0].geometry.location);
        var distance = Math.round(distanceMeters*0.000621371)
        
        console.log(results[0].geometry.location.lat())
        var loc = {lat: results[0].geometry.location.lat(),lng: results[0].geometry.location.lng()};
        $('<table>').attr({'id':'id'+i, class: 'tableFloat table table-striped','data-loc': JSON.stringify(loc)}).append($('<tr>').append($('<th>').html(lettersU[i]+' '+theaters[i]))).appendTo(row2); 
        // if (distance > radius){
        //   i++;
        //   pinAddress();
        // }
        
        infoWindow = new google.maps.InfoWindow;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          // title: place.name,
          label: letters[i]
        });

        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.setContent(place.name)
          infoWindow.setZIndex(2);

          console.log(this)
          infoWindow.open(map, this);

        });
      }
      
     
      if (i< theaters.length-1){
        i++;
        pinAddress();
      }        
      else{
        for (var x=0;x<data.showtimes.length;x++) {
          var displayDate = moment(data.showtimes[x].dateTime, 'YYYY-MM-DDThh:mm').format('h:mm a')
          var id = "#id"+theaters.indexOf(data.showtimes[x].theatre.name)
          $(id).append($('<tr>').append($('<td>').append($('<div>').text(displayDate).attr({class:'showtime', 'data-link':data.showtimes[x].ticketURI, 'data-loc': $(id).attr('data-loc'), 'data-time':displayDate, 'data-title':data.title, 'data-theater':data.showtimes[x].theatre.name}))))
        }
        $("body").css("cursor", "default") 
        }  
      } 
      else if (i< theaters.length-1){
        i++;
        pinAddress();
      }        
      else{
        for (var x=0;x<data.showtimes.length;x++) {
          var displayDate = moment(data.showtimes[x].dateTime, 'YYYY-MM-DDThh:mm').format('h:mm a')
          var id = "#id"+theaters.indexOf(data.showtimes[x].theatre.name)
          $(id).append($('<tr>').append($('<td>').append($('<div>').text(displayDate).attr({class:'showtime', 'data-link':data.showtimes[x].ticketURI, 'data-loc': $(id).attr('data-loc'), 'data-time':displayDate, 'data-title':data.title, 'data-theater':data.showtimes[x].theatre.name}))))
        }
        $("body").css("cursor", "default") 
        }  
    });
    
  }
 
    
   
  
  
  
}

      // function getGracenoteTheaterLocation(theatreId){
      //   // var movieData = JSON.parse($(this).attr('data-movie'))
      
      //     // var apikey = "7byjtqn68yzm6ecsjfmcy9q3";
      //     //  var apikey = "7byjtqn68yzm6ecsjfmcy9q3";
      //     // var apikey = "sdpzqr2egk9fyp2ct7jz879v";
      //     var apikey = "dxfsm4dzuvd4wxbbwu2f4gze"; //David
      
      //   var baseUrl = "https://data.tmsapi.com/v1.1";
      //   var theaterInfoUrl = baseUrl +  '/theatres/'+theatreId+'?api_key'+apikey
      //   $.ajax({
      //     url: theaterInfoUrl,
      //     data: { 
      //       jsonp: "theaterLocDataHandle",
      //     },          
      //     dataType: "jsonp",
      //   });
      // }
      
      // function theaterLocDataHandle(data){
      //   console.log(data)
      // }
      
   
 


      


 
  
  


function selectShowtime() {
  $("body").css("cursor", "default") 
  var $movieTable = $('#movieTable');
  var $this = $(this)
  console.log($this.attr('data-loc'))
  var $movieDescrip = $('#movieDescrip');
  $movieDescrip.empty().append(
    $('<h4>').html('<strong>"'+$this.attr('data-title')+'"</strong> playing at <strong>'+$this.attr('data-time')+"</strong> "+$this.attr('data-theater')),
    $('<br>'),
    $('<h4>').text('Would you like to find a restaurant near the movie theater you selected?'),
    $('<div>').attr({
      class:'select-button',
      id:'find-restaurant-category',
      'data-loc': $this.attr('data-loc'),
      'data-title': $this.attr('data-title'),
      'data-time' : $this.attr('data-time'),
      'data-theater' : $this.attr('data-theater'),
      'data-link': $this.attr('data-link')
    }).text('Search Restaurants'),
    $('<a>').attr({href:$this.attr('data-link'),target:'_blank'}).append($('<div>').addClass('select-button').text('Get Movie Ticket Now'))
    
    );
  $movieTable.empty().append($('<small>').text('* We will also make the link available for you to get movie tickets after you search restaurants *'))


}

function findRestaurantcuisines(){
  var $this = $(this)
  var locObj = JSON.parse($this.attr('data-loc'))
  var queryURL = 'https://developers.zomato.com/api/v2.1/cuisines?lat='+locObj.lat+'&lon='+locObj.lng
  $.ajax({
    url: queryURL,
    method: "GET",
    headers: {'user-key' : '97fb60393f28e5322acdc4d8ff93b8a2'}
    }).then(function(response) {
      var cuisinesArray = []
      $('#movieDescrip').empty().addClass('text-center').html('<h2>Select all types of cuisine Desired</h2>')
      $('#movieTable').empty()
      console.log(response)

      response.cuisines.forEach(function(cuisine){
        console.log(cuisine);
        cuisinesArray.push(cuisine.cuisine.cuisine_id)
        $('<div>').attr({class:'cuisine cuisine-btn','data-id':cuisine.cuisine.cuisine_id,'data-state':'unfocus'}).text(cuisine.cuisine.cuisine_name).appendTo($('#movieTable'))
        // 'data-dismiss':'modal'
      })
      console.log($this.attr('data-link'))
      console.log(JSON.parse($this.attr('data-loc')))
      $('<div>').attr({class:'cuisine-btn cuisine-all','data-id':JSON.stringify(cuisinesArray),'data-state':'unfocus'}).text('Select All').appendTo($('#movieTable'))
      $('<button>').attr({
        id:'find-restaurant',
        'data-loc':$this.attr('data-loc'),
        'data-dismiss':'modal',
        'data-title': $this.attr('data-title'),
        'data-time' : $this.attr('data-time'),
        'data-theater' : $this.attr('data-theater'),
        'data-link' : $this.attr('data-link'),
        'data-fullList' : JSON.stringify(cuisinesArray)
        

      }).text('Find Restaurants').appendTo($('#movieTable'))
      console.log(cuisinesArray)
    })
  
}

function selectCuisine() {
  $findRestaurant = $('#find-restaurant')
  var $this = $(this)
  if ($this.attr('data-state') == 'focus')
    $this.removeClass('focus').attr({'data-state':'unfocus'})
  else 
    $this.addClass('focus').attr({'data-state':'focus'})
  var attr = $findRestaurant.attr('data')
  console.log(attr)
  if (typeof attr !== typeof undefined && typeof attr !== false) {
    var updatedSelectedCuisines = JSON.parse(attr)
  }
  else{
    var updatedSelectedCuisines = []
  }
  if (updatedSelectedCuisines.indexOf($this.attr('data-id')) == -1)
    updatedSelectedCuisines.push($this.attr('data-id'));
  else
    updatedSelectedCuisines.splice(updatedSelectedCuisines.indexOf($this.attr('data-id'),1))
  console.log(updatedSelectedCuisines)
  console.log(JSON.stringify(updatedSelectedCuisines))
  $findRestaurant.attr({'data': JSON.stringify(updatedSelectedCuisines)})
}
function selectCuisineAll(){
  $findRestaurant = $('#find-restaurant')
  var attr = $findRestaurant.attr('data')
  var $this = $(this)
  if ($this.attr('data-state') == 'focus'){
    $('.cuisine-btn').removeClass('focus').attr({'data-state':'unfocus'})
    $findRestaurant.removeAttr('data')
  }
  else{
  $('.cuisine-btn').addClass('focus').attr({'data-state':'focus'});
  $findRestaurant.attr('data', $this.attr('data-id'));
  }

}
function selectRestaurant() {
  var $movieTable = $('#movieTable');
  var $movieDescrip = $('#movieDescrip');
  $this = $(this)
  console.log($this)
  var data = JSON.parse($this.attr('data-restaurant')).restaurant
  console.log(data)
  //$('#selectRestaurantBtn').attr('class', data.name)

  $movieDescrip.empty().append($('<h3>').text(data.name))
  var tableBooking = (data.has_table_booking) ? 'Yes' : 'No';
  $movieTable.empty().append(
    $('<p>').html('<strong>Cuisines: </strong>' + data.cuisines),
    $('<p>').html('<strong>Average Cost for two: </strong>$' + data.average_cost_for_two),
    $('<p>').html('<strong>Has Table Booking: </strong>' + tableBooking),
    $('<p>').html('<strong>User Rating: </strong>' + data.user_rating.aggregate_rating + " ").append($('<span>').text(data.user_rating.rating_text).attr('style', 'color:#' + data.user_rating.rating_color)),
    $('<div>').append(
      $('<a>').attr({ 'href': data.menu_url, target: '_blank', class: 'select-button' }).text('Menu'),
      $('<a>').attr({ 'href': data.photos_url, target: '_blank', class: 'select-button' }).text('Photos'),
      $('<a>').attr({ 'href': data.events_url, target: '_blank', class: 'select-button' }).text('Events'),
      $('<button>').attr({ 
        id: 'selectRestaurantBtn', 
       
        'data-theater' : $this.attr('data-theater'),
        'data-restaurant':JSON.stringify(data),
        'data-loc': $this.attr('data-loc'),
        'data-title': $this.attr('data-title'),
        'data-time' : $this.attr('data-time'),
        'data-link' : $this.attr('data-link')
        
      }).text('Select Restaurant')
    ),
    $('<div>').attr({id:'map'}).addClass('width')
  );
  var locObj = JSON.parse($this.attr('data-loc'));
  console.log(locObj)
  var lat = locObj.lat;
  var lng = locObj.lng;
  var restlat = parseFloat(data.location.latitude);
  var restlng = parseFloat(data.location.longitude);
  console.log(restlat)
  console.log(restlng)

  initMap();
  var theater = new google.maps.Marker({
    position: {lat: lat, lng: lng}, 
    map: map,
    label: 'T'
   
  });
  var restaurant = new google.maps.Marker({
    position: {lat: restlat, lng: restlng}, 
    map: map,
    label: 'R',
    zIndex: 3
   
  });
  google.maps.event.addListener(theater, 'click', function() {
    infoWindow.setContent('Theater')
    infoWindow.setZIndex(2);

    console.log(this)
    infoWindow.open(map, this);
  });
  google.maps.event.addListener(restaurant, 'click', function() {
    infoWindow.setContent(data.name)
    infoWindow.setZIndex(2);

    console.log(this)
    infoWindow.open(map, this);
  });
}


function displayLogIn() {
  document.getElementById('loginPg').style.display = "block"
  $('<div class="modal-backdrop"></div>').appendTo(document.body);;
}
function displayRegisterForm() {
  document.getElementById('registerPg').style.display = "block";
  $('<div class="modal-backdrop"></div>').appendTo(document.body);
}
function displayMovieTable() {
  document.getElementById('movieCard').style.display = 'block';
}
function loginRegisterVisibility() {
  if (('loginPg').display = 'block') {
    ('registerPg').display = 'none'
  }
}
function loginRegisterClose() {
  document.getElementById('loginPg').style.display = "none";
  document.getElementById('registerPg').style.display = "none";
}
function registerLoginVisibility() {
  if (('registerPg').display = 'block') {
    ('loginPg').display = 'none';
  }
}
function signIna() {
  document.getElementById('loginPg').style.display = 'block';
}

//var nameR = $('#selectRestaurantBtn').val()
//var nameRs = $('#movieDescrip').val()
function userResult() {
  var $this = $(this)
  console.log($this)
  console.log($this.attr('data-title'))
  console.log($this.attr('data-link'))
  var $movieTable = $('#movieTable');
  var $movieDesc = $('#movieDescrip').empty().append($('<h1>').text('Your Choice:'));
  $movieTable.empty()
  var restData = JSON.parse($this.attr('data-restaurant'))
  $('#save').hide();
  $('#movieTable').empty().append(
  $('<div>').addClass('resText').html('Your movie is : <strong>' + $this.attr('data-title')+'</strong>'),
  $('<div>').addClass('resText').html('The showtime is : <strong>' + $this.attr('data-time')+'</strong>'),
  $('<div>').addClass('resText').html('Playing at : <strong>' + $this.attr('data-theater')+'</strong>'),
  $('<div>').addClass('resText').html('Your restaurant is : <strong>' + restData.name+'</strong>'),
  $('<div>').addClass('resText').html('Located at : <strong>' + restData.location.address+'</strong>'),
  //$('<a>').attr({href: $this.attr('data-link'),target: '_blank'}).append($('<button>').attr({href: $this.attr('data-link')}).text('Get Reservations')),
  $('<button>').attr({id: "saveResult"}).text('Save my Date Info').attr('data-dismiss', 'modal')


  )

  $("#saveResult").on("click", function (event) {
    event.preventDefault();

    function writeUserData() {

      var email = firebase.auth().currentUser.email;
      var cleanEmail = email.replace(/\./g, ',');
      var saveMovie = $this.attr('data-title');
      var saveShowTime = $this.attr('data-time');
      var saveTheater = $this.attr('data-theater');
      var saveRestaurant = restData.name;
      var saveRestAddress = restData.location.address;
      var saveURL = $this.attr('data-link');

      firebase.database().ref('users/' + cleanEmail).set({
        movie: saveMovie,
        showtime: saveShowTime,
        theater: saveTheater,
        restaurant: saveRestaurant,
        address: saveRestAddress,
        url: saveURL
      });
    }

    writeUserData()


  });
    
  }

  function displaySaved() {

    var email = firebase.auth().currentUser.email;
    var cleanEmail = email.replace(/\./g, ',');
    var user = firebase.database().ref('users/' + cleanEmail);


    user.on('value', function (snapshot) {
        console.log(snapshot.val());

        var saveMovie = snapshot.val().movie;
        var saveShowTime = snapshot.val().showtime;
        var saveTheater = snapshot.val().theater;
        var saveRestaurant = snapshot.val().restaurant;
        var saveRestAddress = snapshot.val().address;
        var saveUrl = snapshot.val().url;

        var $movieTable = $('#movieTable');
        var $movieDesc = $('#movieDescrip').empty().append($('<h1>').text('Your Choice:'));
        $movieTable.empty()
        
        $('#movieTable').empty().attr('data-toggle', 'modal').append(

        $('<div>').addClass('resText').html('Your movie is : <strong>' + saveMovie + '</strong>'),
        $('<div>').addClass('resText').html('The showtime is : <strong>' + saveShowTime + '</strong>'),
        $('<div>').addClass('resText').html('Playing at : <strong>' + saveTheater + '</strong>'),
        $('<div>').addClass('resText').html('Your restaurant is : <strong>' + saveRestaurant + '</strong>'),
        $('<div>').addClass('resText').html('Located at : <strong>' + saveRestAddress + '</strong>'),
        $('<a>').attr({ href: saveUrl, target: '_blank' }).append($('<button>').attr({ href: (saveUrl) }).text('Get Reservations')));
    });
};



function getNavigatorLocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    },function(position){
      
      if (position.code == 2){
        $('#movieCard').attr({style:'display:block'})
        $('#results-view').append(
          $('<h3>').attr({class:'text-center locError',style:'color:red'}).text('There was an error retrieving your current location'),
          $('<div>').attr({class: 'text-center locError',style:'margin:auto'}).text('Re-load the page or enter a zip code')

        )
        $('#location-input').one('focus',function(){
          $('#movieCard').attr({style:'display: none'});
          $('.locError').remove();
        })
      }  
      $("#location-input").attr('placeholder','zip code (required)')

    })
   
  }
  else{
    $("#location-input").attr('placeholder','zip code (required)')
  }

}

loginRegisterVisibility()

var map,infoWindow;
function initMap() {
  var lat = (pos) ? pos.lat : '';
  var long = (pos) ? pos.lng: '';
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lat, lng: long},
    zoom: 11
  });
 
  var pinColor = "568cfd";
  var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));
  var marker = new google.maps.Marker({
    position: {lat: lat, lng: long}, 
    map: map,
    icon: pinImage,
   
  });
  

}


function closeBackDrop(){
  $(".modal-backdrop").remove();
}
$(document).one('mousemove',getNavigatorLocation);
$(document).on('click', '#moreRestaurants',function(){
  $this = $(this)
  var start = JSON.parse($(this).attr('data-start'));
  console.log('START')
  console.log(start)
  offsetZomato(start,$this)});
  $(document).on('click', '.close', closeBackDrop)
$(document).on('click', '#btnLogin', userlogingDis)
$(document).on('click', '#btnSignUp', userlogingDis)
$(document).on('click', '#selectRestaurantBtn',userResult);
$(document).on('click', '#signInA', signIna);
$(document).on('click', '.restaurant', selectRestaurant);
$(document).on('click', '.showtime', selectShowtime); 
$(document).on('click', '.close', loginRegisterClose)
$(document).on('click', '#registerBtn', displayRegisterForm)
$(document).on('click', '#loginBtn', displayLogIn)
$(document).on("click", ".poster", fillModal);
$(document).on("click", "#find-theater", runToday);
$(document).on("click", "#find-theater", runMovies);
$(document).on("click", "#find-restaurant-category", findRestaurantcuisines);
$(document).on("click", ".cuisine", selectCuisine);
$(document).on("click", ".cuisine-all", selectCuisineAll);
$(document).on("click", "#display-saved", displaySaved);
$(document).on("click", "#find-restaurant", function(){
  console.log($(this))
  clearTimeout(addMovies);
  $('#results-view').empty();
  var locObj = JSON.parse($(this).attr('data-loc'))
  if (typeof $(this).attr('data') !== typeof undefined && $(this).attr('data') !== false) 
    var cuisines = JSON.parse($(this).attr('data')).toString()
  else
    var cuisines = ''
  runZomato(20,0,locObj,cuisines,$(this)) });
