let firestoreUsers = firebase.firestore().collection('users');

var userSave = {};

let userSignedIn = false;

let provider = new firebase.auth.GoogleAuthProvider();

const auth = firebase.auth();

let syncTimer = setInterval(syncDB, 10000);
// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

let authUser;

auth.useDeviceLanguage();

auth.setPersistence(firebase.auth.Auth.Persistence.NONE)
    .then(() => {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return;
    })
    .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });

function signIn() {
    auth.signInWithRedirect(provider);

    auth.getRedirectResult()
        .then((result) => {
            let credential = result.credential;
            let token = credential.accessToken;
            let user = result.user;
        }).catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            let email = error.email;
            let credential = error.credential;
        })
}

function signOut() {
    auth.signOut().then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });
}

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
                userSave = { score1: "-1", displayName: user.displayName }
                firestoreUsers.doc(user.uid).set(userSave);
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        }); //userSave set to userdata to give to indexed db (initialize or from DB)
        authUser = user;
        //sync to iDB
        syncDB();

    } else {
        authUser = null;
        console.log("signed out");
        document.getElementById('login-signin').style.display = 'block';
        document.getElementById('signed-in').style.display = 'none';
        //potentially remove display name from browser? score1 to -1 to avoid sync errors
    }

})

function syncDB() { //should only be called if user is signed in and userData is initialized (from initial or from last sync)
    if(!authUser) {return;}
    console.log("syncdb");
    let score1Cache = localStorage['score1'];
    let displayNameCache = localStorage['displayName'];

    //make sure values exist. if they don't, do nothing. we wait for WebGL to initialize data
    if(!score1Cache || !displayNameCache) {
        localStorage['score1'] = "-1";
        localStorage['displayName'] = "-1";
    }

    //get user's data from firestore
    firestoreUsers.doc(authUser.uid).get().then((doc) => {
        if(doc.exists) {
            userSave = doc.data();
        } else {
            console.log("No data in database for user, something went wrong");
            userSave = { score1: "0", displayName: authUser.displayName }
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    })

    //if current < stored, update stored
    if(parseInt(score1Cache) < parseInt(userSave.score1)) {
        localStorage['score1'] = userSave.score1;
        localStorage['displayName'] = userSave.displayName;
    } else {
        //if current <= stored, update current and update db
        userSave.score1 = score1Cache;
        userSave.displayName = displayNameCache;
        console.log(userSave)
        if(!userSave.score1) {
            console.log("something didn't initialize, skipping db sync");
            return;
        }
        firestoreUsers.doc(authUser.uid).set(userSave);
    }
    console.log("it worked?");
}