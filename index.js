// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
var onSuccess = function(position) {
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
};

// onError Callback receives a PositionError object
//
function onError(error) {

    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');

}

function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
	// Now safe to use device APIs
    //alert('CARICAMENTO TERMINATO' + window);
    /*
    if ('invokeString' in window) {
        window.alert('onDeviceReady: ' + invokeString);
    } else {
        window.alert('onDeviceReady: no invokeString');
    }*/
}

function handleOpenURL(url) {
    window.setTimeout(function () {
        alert('handleOpenURL: ' + url);
    }, 3000);
}

alert('caricato su GITHUB tramite visualstudio PIPPO');
//document.location='http://demo2010.ncconline.it';	
