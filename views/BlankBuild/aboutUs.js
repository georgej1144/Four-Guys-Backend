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


    } else {
        console.log("signed out");
        document.getElementById('login-signin').style.display = 'block';
        document.getElementById('signed-in').style.display = 'none';
        //potentially remove display name from browser? score1 to -1 to avoid sync errors
    }
})