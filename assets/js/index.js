function skpcSearch(e) {
    if (e.keyCode == 13) {
        var user = firebase.auth().currentUser;

        if (user) {
            adminAuth()
            alert(user.email)
            // User is signed in.
            var skupc = document.getElementById("upc-sku")
            // Replace with function to server
            console.log(skupc.value)
            var ok = fakeSend(skupc.value)
            // Replace above
            if (!ok) {
                alertMaterial(skupc)
                skupc.focus()
                return false
            }
            document.getElementById("cubby").focus()
            return false
        } else {
            alert("not in")
        }
    }

}

function cubbyAssign(e) {
    if (e.keyCode == 13) {
        var skupc = document.getElementById("upc-sku")
        var cubby = document.getElementById("cubby")
        var pat = /[Dd][0-9]{3,}/
        if (!pat.test(cubby.value)) {
            return
        }
        if (skupc.value == '') {
            alertMaterial(skupc)
            cubby.focus()
            return
        }
        // Replace with fucntion to send to server
        // also make true/false for errors to move on
        var ok = fakeSend(cubby.value)
        console.log(cubby.value)
        // Replace above
        if (!ok) {
            alertMaterial(cubby)
            return
        }
        skupc.value = ''
        cubby.value = ''
        skupc.focus()
        return
    }
}

function fakeSend(val) {
    if (val == "012345678912" || val == "D002") {
        return true
    }
    return false
}

function alertMaterial(elem) {
    var val = elem.value
    if (elem.id != "cubby") {
        var title = "Wrong SKU"
        var msg = "<b>" + val + "</b> is not a known SKU. " + "Try using UPC or re-enter the SKU."
        var UPCreg = /[0-9]{12,13}$/
        if (val == '') {
            title = "Missing UPC/SKU"
            msg = "You must provide a UPC or SKU to continue"
        }

        if (UPCreg.test(val)) {
            title = "Wrong UPC"
            msg = "<b>" + val + "</b> is not a known UPC. " + "Try using SKU or re-enter the UPC."
        }
    } else {
        var title = "Wrong Cubby"
        var msg = "<b>" + val + "</b> is not the right cubby. " + "Check that you put the product into the right cubby."
    }
    var dialog = document.querySelector('#dialog')
    document.getElementById("warning-title").innerHTML = title
    document.getElementById("warning-message").innerHTML = msg
    dialog.showModal()
}







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



function login() {
    // alert("hello")
    var provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        console.log(user)
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.log(errorCode)
    });
}


function adminAuth() {
    // var userId = firebase.auth().currentUser.uid;
    var dbRef = firebase.database().ref().child('test').once('value');
    dbRef.then(function (snap) {
        alert(snap.val())
    })

}