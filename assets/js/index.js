var User, order;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBok3MkSuQ9T-JicJ1WLPznV2em1QqO9ag",
    authDomain: "cubbychaser-8c5e4.firebaseapp.com",
    databaseURL: "https://cubbychaser-8c5e4.firebaseio.com",
    projectId: "cubbychaser-8c5e4",
    storageBucket: "",
    messagingSenderId: "900701069600"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        User = user;
        document.getElementById("display-image").src = user.photoURL;
        document.getElementById("dislplay-name").innerText = user.displayName;
        var actual_JSON = initTestData();
        populateCubbies(actual_JSON);
    } else {
        var win = window.location.href;
        if (!win.includes("login")) {
            window.location.href = "login.html";
        }
    }
});

function populateCubbies(JSONorders){
    var i;
    for(i in JSONorders){
        var loc = i;
        var tot = JSONorders[i].total;
        var cubbyImg = document.getElementById("img-" +loc);
        var count = "0/" + tot;
        cubbyImg.innerHTML = '<span class="order-count">'+ count +'</span>';
    }
}

function logout() {
    firebase.auth().signOut().then(function () {}, function (error) {
        alert("You did not log out for some reason.");
    });
}

function skpcSearch(e) {
    if (e.keyCode == 13) {
        var skupc = document.getElementById("upc-sku");
        // Replace with function to server
        console.log(skupc.value);
        order = fakeSend(skupc.value, User.email);
        // Replace above
        if (!order) {
            cubbyLoc = 0;
            alertMaterial(skupc);
            skupc.focus();
            return false;
        }
        sendToCubby();
        document.getElementById("cubby").focus();
        return false;
    }
}

function sendToCubby() {
    var cub = document.getElementById(order.location);
    var cubImg = document.getElementById("img-" + order.location);
    var cubBan = document.getElementById("band-" + order.location);
    cubImg.innerHTML = '<img src="' + order.url+'" alt="" >';
    op = order.spot / order.total;
    cubBan.style.background = "rgba(0,150,136,"+ op+ ")";
    cub.classList.add("tada");
}

function cubbyAssign(e) {
    if (e.keyCode == 13) {
        var skupc = document.getElementById("upc-sku");
        var cubby = document.getElementById("cubby");
        var pat = /[Dd][0-9]{3,}/;
        if (!pat.test(cubby.value)) {
            return;
        }
        if (order.location != cubby.value) {
            alertMaterial(cubby);
            return;
        }
        // Replace with fucntion to send to server
        // also make true/false for errors to move on
        var ok = fakeSend(cubby.value, User.email);
        document.getElementById(order.location).classList.remove("tada");
        orderCount();
        console.log(cubby.value);
        // Replace above
        if (!ok) {
            alert("An error has occrued on the server");
            return;
        }
        skupc.value = '';
        cubby.value = '';
        skupc.focus();
        return;
    }
}

function orderCount() {
    var spot = order.spot;
    var total = order.total;
    var cubbyImg = document.getElementById("img-" + order.location);
    if (spot == total) {
        cubbyImg.innerHTML = '<span style="font-size: 39px;" class="order-count">DONE</span>';
        return;
    }
    var count = order.spot+"/"+order.total;
    cubbyImg.innerHTML = '<span class="order-count">'+count+'</span>';
}

function fakeSend(val, user) {
    if (val.includes("D")) {
        return true;
    }
    if (val == "21") {
        console.log(user);
        return {
            location: "D002",
            url: "https://s3.amazonaws.com/wedgenix-host/CW-762166276148+(1)-NEW.jpg",
            total: "3",
            spot: "1"
        };
    }
    if (val == "22") {
        console.log(user);
        return {
            location: "D002",
            url: "https://s3.amazonaws.com/wedgenix-host/829102001131+(1)-NEW.jpg",
            total: "3",
            spot: "2"
        };
    }
    if (val == "23") {
        console.log(user);
        return {
            location: "D002",
            url: "https://s3.amazonaws.com/wedgenix-host/CW-762166374158 (1).jpg",
            total: "3",
            spot: "3"
        };
    }

    if (val == "11") {
        console.log(user);
        return {
            location: "D001",
            url: "https://s3.amazonaws.com/wedgenix-host/CW-762166276148+(1)-NEW.jpg",
            total: "3",
            spot: "1"
        };
    }
    if (val == "12") {
        console.log(user);
        return {
            location: "D001",
            url: "https://s3.amazonaws.com/wedgenix-host/829102001131+(1)-NEW.jpg",
            total: "3",
            spot: "2"
        };
    }
    if (val == "13") {
        console.log(user);
        return {
            location: "D001",
            url: "https://s3.amazonaws.com/wedgenix-host/CW-762166374158 (1).jpg",
            total: "3",
            spot: "3"
        };
    }
    return false;
}

function alertMaterial(elem) {
    var val = elem.value;
    var title, msg;
    if (elem.id != "cubby") {
        title = "Wrong SKU";
        msg = "<b>"+ val +"</b> is not a known SKU. Try using UPC or re-enter the SKU.";
        var UPCreg = /[0-9]{12,13}$/;
        if (val == '') {
            title = "Missing UPC/SKU";
            msg = "You must provide a UPC or SKU to continue";
        }

        if (UPCreg.test(val)) {
            title = "Wrong UPC";
            msg = "<b>" + val + "</b> is not a known UPC. Try using SKU or re-enter the UPC.";
        }
    } else {
        title = "Wrong Cubby";
        msg = "<b>" + val + "</b> is not the right cubby. Check that you put the product into the right cubby.";
    }
    var dialog = document.querySelector('#dialog');
    document.getElementById("warning-title").innerHTML = title;
    document.getElementById("warning-message").innerHTML = msg;
    dialog.showModal();
}

function login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        console.log(user);
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.log(errorCode);
    });
}

function closeDialog() {
    var title = document.getElementById("warning-title").innerHTML;
    var skupc = document.getElementById("upc-sku");
    var cubby = document.getElementById("cubby");
    dialog.close();
    if (title.includes("Cubby")) {
        cubby.focus();
    } else {
        skupc.focus();
    }
}




// FOR TESTING ONLY
function initTestData() {
   
       return JSON.parse('{'+
       '"D001": {'+
           '"items": {'+
               '"11": {'+
                   '"url:": "https://s3.amazonaws.com/wedgenix-host/CW-762166276148+(1)-NEW.jpg",'+
                   '"spot": "1"'+
               '},'+
               '"12": {'+
                   '"url": "https://s3.amazonaws.com/wedgenix-host/829102001131+(1)-NEW.jpg",'+
                   '"spot": "2"'+
               '},'+
               '"13": {'+
                   '"url": "https://s3.amazonaws.com/wedgenix-host/CW-762166374158 (1).jpg",'+
                   '"spot": "3"'+
               '}'+
           '},'+
           '"orderNumber": "111-222-333",'+
           '"total": "3"'+
       '},'+
       '"D002": {'+
           '"items": {'+
               '"21": {'+
                   '"url:": "https://s3.amazonaws.com/wedgenix-host/CW-762166276148+(1)-NEW.jpg",'+
                   '"spot": "1"'+
               '},'+
               '"22": {'+
                   '"url": "https://s3.amazonaws.com/wedgenix-host/829102001131+(1)-NEW.jpg",'+
                   '"spot": "2"'+
               '},'+
               '"23": {'+
                   '"url": "https://s3.amazonaws.com/wedgenix-host/CW-762166374158 (1).jpg",'+
                   '"spot": "3"'+
               '}'+
           '},'+
           '"total": "3",'+
           '"orderNumber": "222-333-999"'+
       '}'+
   '}');
       

   }
    



