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

function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

var db = null;

function onDeviceReady() {
    apriUrlPredefinito();
    checkConnection();
    db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
    db.transaction(populateDB, errorCB, successCB);

    var applaunchCount = window.localStorage.getItem('launchCount');
    if (applaunchCount) {
        apriUrlPredefinito();
    } else {
        window.localStorage.setItem('launchCount', 1);
        apriUrlPredefinito();
    }
}

function apriUrlPredefinito() {
    //var xhr = new XMLHttpRequest();
    alert('dentro apriurl 22-10');
    getAppVersion(function (version) {
        alert('Native App Version: ' + version);
    });

    /*
    $.get("config.xml", function (data) {
        var dominioGestionale = $(data).find('widget').attr('version');
        document.location = dominioGestionale;
    });*/

    /*
    xhr.addEventListener("load", function () {
        var parser = new DOMParser();
        var doc = parser.parseFromString(xhr.responseText, "application/xml");
        alert(doc.getElementsByTagName("dominio_gestionale").item(0).textContent);
        document.location = doc.getElementsByTagName("dominio_gestionale").item(0).textContent;
    });
    xhr.open("get", "config.xml", true);
    xhr.send();*/
}

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';

    alert('Connection type: ' + states[networkState]);
}

function populateDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS DEMO');
    tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
}

function successCB() {
    alert("populate success!");
    db.transaction(queryDB, errorCB);
}

function queryDB(tx) {
    tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
}

function querySuccess(tx, results) {
    var len = results.rows.length;
    alert("DEMO table: " + len + " rows found.");
    for (var i = 0; i < len; i++) {
        alert("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
    }
}

function errorCB(err) {
    alert("Error processing SQL: " + err.code);
}

