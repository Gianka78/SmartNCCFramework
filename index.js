// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//

var hostWS = "demo2010.smartncc.it";

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
var token = '';

function onDeviceReady() {
    db = window.openDatabase("smartnccmobile_localdb", "1.0", "SmartNCCMobile Local Database", 200000);

    db.transaction(populateDB, errorCB, successCB);

    $.get(
    "http://" + hostWS + "/progettogestionale/wssmartncc/wsgd.asmx/login_ASCII?username=ncc_online_guest_api&password=ncc_guest",
    function (data) {
        if (data.indexOf("+OK:") == 0) {
            token = data.replace("+OK:", "");
            alert(token);
        }
        else {
            alert('errore login webservice');
        }
    }
    );
}

function apriUrlPredefinito() {
    getAppVersion(function (version) {
        document.location = version;
    });
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
    alert('dentro populate');
    tx.executeSql('CREATE TABLE IF NOT EXISTS elenco (id unique, codice, url_ncconline, username, password)');
    aggiornaElencoNoleggiatori(tx);
}

function aggiornaElencoNoleggiatori(tx) {
    tx.executeSql('SELECT * FROM elenco', [], okLetturaElenco, errorCB);
}

function successCB() {
    return true;
}


function okLetturaElenco(tx, results)
{
    var len = results.rows.length;
    $("#divElencoNoleggiatori").html("<lu>");
    for (var i = 0; i < len; i++) {
        var htmlLU = "<li><a href='"+results.rows.item(i).url_ncconline+"'>Noleggiatore n. = " + i + " id = " + results.rows.item(i).id 
                    + " codice =  " + results.rows.item(i).codice+"</a>"
                    + "<input id='tfUsername_" + results.rows.item(i).codice + "' type='text' value='" + results.rows.item(i).username + "'></input>"
                    + "<input id='tfPassword_" + results.rows.item(i).codice + "' type='password' value='" + results.rows.item(i).password + "'></input>"
                    + "<input id='btSalvaCredenziali_" + results.rows.item(i).codice + "' type='button' value='SALVA' onclick='salvaCredenziali(\"" + results.rows.item(i).codice + "\")' />"
                    + "</li>";
        $("#divElencoNoleggiatori").html($("#divElencoNoleggiatori").html() + htmlLU);
    }
    $("#divElencoNoleggiatori").html($("#divElencoNoleggiatori").html()+"</lu>");
}

function errorCB(err) {
    alert("SQLError (" + err.code + "): " + err.message);
    return false;

}

function aggiungiNoleggiatore() {
    db.transaction(okAggiungiNoleggiatore, errorCB, successCB);
}

function okAggiungiNoleggiatore(tx) {
    var codice = $("#tfCodiceNoleggiatore").val();
    if (codice != "") {
        $.get(
            "http://" + hostWS + "/progettogestionale/wssmartncc/ws_ncc.asmx/get_ncconline_url_bycode_ASCIIJSON?token=" + token + "&code=" + codice,
            function (data) {
                db.transaction(
                    function (tx) {
                        if (data + "" != "-Err") {
                            var str = eval(JSON.parse(data).obj);
                            var query = 'INSERT INTO elenco (codice, url_ncconline,username,password) VALUES ("' + str.split("|")[0] + '","' + str.split("|")[1] + '","","")';
                            tx.executeSql(query);
                            aggiornaElencoNoleggiatori(tx);
                        }
                        else {
                            alert('Codice non valido');
                            aggiornaElencoNoleggiatori(tx);
                        }

                    }
                    , errorCB, successCB);
            }
        );
    }
    else {
        alert("inserire prima il codice");
    }
}

function svuotaElenco() {
    db.transaction(okSvuotaelenco, errorCB, successCB);
}
function okSvuotaelenco(tx) {
    tx.executeSql('delete from elenco');
    aggiornaElencoNoleggiatori(tx);
}

function salvaCredenziali(codice)
{
    db.transaction(
        function (tx)
        {
            var query = "update elenco set username = '" + $("#tfUsername_" + codice).val() + "', password = '" + $("#tfPassword_" + codice).val() + "' where codice = '" + codice + "'";
            tx.executeSql(query);
            aggiornaElencoNoleggiatori(tx);

        }
        , errorCB, successCB);

}


function scanNewCode() {
    cordova.plugins.barcodeScanner.scan(
      function (result) {
          alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
          $("#tfCodiceNoleggiatore").val("result.text");
          
      },
      function (error) {
          alert("Scanning failed: " + error);
      }
   );
}
