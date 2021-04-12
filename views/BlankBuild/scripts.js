var firestoreUsers = firebase.firestore().collection('users');

var usersSave = {};

var userSignedIn = false;

var provider = new firebase.auth.GoogleAuthProvider();

const auth = firebase.auth();

// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

auth.useDeviceLanguage();

auth.onAuthStateChanged(function(user) {
    if(user) {
        
        //user is signed in
        console.log("signed in: " + user.displayName);
        document.getElementById('login-signin').style.display = 'none';
        document.getElementById('userMenu').innerText = user.displayName;
        document.getElementById('signed-in').style.display = 'block';

        firestoreUsers.doc(user.uid).get().then((doc) => {
            if(doc.exists) {    //TODO: user entry exists, dont initialize user's entry
                console.log("exists", doc.data());
                userSave = doc.data();
            } else {        //initialize user's entry
                console.log("does not exist", doc.data());
                userSave = { score1: -1, displayName: user.displayName }
                firestoreUsers.doc(user.uid).set(userSave);
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        }); //userSave set to userdata to give to indexed db (initialize or from DB)

        //sync to iDB
        syncDB();

    } else {
        console.log("signed out");
        document.getElementById('login-signin').style.display = 'block';
        document.getElementById('signed-in').style.display = 'none';
    }

})



var pPrefs;

let dbVersion = 1;
let openRequest = indexedDB.open("saveData", dbVersion);

openRequest.onupgradeneeded = function() {
    let db = openRequest.result;    //openRequest.version gives version
    //new data to write for WebGL to take
    db.createObjectStore('userVars');
};
openRequest.onerror = function() {
    console.log("Error", openRequest.error);
};
openRequest.onsuccess = function() {
    if(!auth.currentUser) { //if not signed in, dont bother.
        return;
    }
    syncDB();
};
openRequest.onversionchange = function() {
    //new save data to grab and push to firebase
}

function syncDB() { //should only be called if user is signed in and userData is initialized (from initial or from last sync)
    let db = openRequest.result;
    //check data version
    let trans = db.transaction('userVars', "readwrite").objectStore('userVars');
    //make sure values exist. if they don't, do nothing. we wait for WebGL to initialize data
    let testDB = Object.keys(userSave).every(function(key) {
        let valueRequest = trans.get(key)
        valueRequest.onsuccess = function(event) {
            let value = valueRequest.result;
            if(value) {
                console.log("read successful for key: " + key);
            } else {
                console.log("no data currently stored under key: " + key + ". breaking");
                saveValuesDemo(trans);      //TODO: remove when done testing
                return false;
            }
            return true;
        }
    });
    if(!testDB) {    //true if all elements exist. if false, wait return and wait for WebGL
        console.log("not all elements exist, returning. something must have went wrong");
        return;
    }

    //get user's data from firestore
    firestoreUsers.doc(user.uid).get().then((doc) => {
        if(doc.exists) {
            userSave = doc.data();
        } else {
            console.log("No data in database for user, something went wrong");
            userSave = { score1: -1, displayName: user.displayName }
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    })

    //if current > stored, update stored
    if(trans.get(score1) > usersSave.score1) {
        //set idb values to values in userSave
    }
    //if current < stored, update current and update db
    else {
        userSave  = { score1: trans.get(score1), displayName: trans.get(displayName) };
        firestoreUsers.doc(user.uid).set(userSave);
    }

    console.log("it worked?");
}

function saveValuesDemo(trans) {        //TODO: remove when done testing
    Object.keys(toInput).forEach(function(key) {
        try {
            trans.put(toInput[key], key);
        }
        catch (error) {
            trans.add(toInput[key], key);
        }
    });
};

function testFunc() {
    console.log("Winner2:");
    console.log(pPrefs);
    console.log(new TextDecoder("utf-8").decode(pPrefs.contents));
}

function testSave() {
    var initOpenReq = indexedDB.open('/idbfs')
    initOpenReq.onsuccess = function() {
        var db = initOpenReq.result;
        var objectStoreName = 'FILE_DATA';
        var transaction = db.transaction(objectStoreName, 'readonly');
        var objectStore = transaction.objectStore(objectStoreName);
        objectStore.openCursor().onsuccess = function (event){
            if (event.target.result){

                let str = event.target.result.key;
                let split = str.split("/");
                console.log(split)
                if(split[split.length-1] === "PlayerPrefs") {
                    console.log(event.target.result.key + " winner")
                    pPrefs = event.target.result.value;
                }
                var s = event.target.result.value;
                console.log(event.target.result.key + " contents=" + (s.contents ? s.contents.length : "none"));
                event.target.result['continue']();
            }
        };
    };

}       //expect serialized in b64.

function signIn() {
    auth.signInWithRedirect(provider);

    auth.getRedirectResult()
        .then((result) => {
            var credential = result.credential;
            var token = credential.accessToken;
            var user = result.user;
        }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
    })
}

function signOut() {
    auth.signOut().then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });
}