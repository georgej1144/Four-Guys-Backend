let dbVersion = 1;
let openRequest = indexedDB.open("saveData", dbVersion);

openRequest.onupgradeneeded = function() {
    let db = openRequest.result;    //openRequest.version gives version
    //new data to write for js to take
    if(!db.objectStoreNames.contains("userVars")) {
        db.createObjectStore('userVars');
    }
    console.log("it worked?");
};
openRequest.onerror = function() {
    console.log("Error", openRequest.error);
};
openRequest.onsuccess = function() {
    let db = openRequest.result;
    //continue, no new data. if version is 1, push to firebase

};
openRequest.onversionchange = function() {
    //new save data to grab and push to firebase
}

function readData() {

    let dbVersion = 1;
    let openRequest = indexedDB.open("saveData", dbVersion);

    let toReturn = ""

    openRequest.onupgradeneeded = function() {
        //idb must not have been initialized, kill read and return empty string
    };

    openRequest.onerror = function() {
        console.log("Error", openRequest.error);
    };
    openRequest.onsuccess = function() {
        let db = openRequest.result;
        //idb exists, therefore userVars can be assumed to exist. check keys for data.
        let trans = db.transaction('userVars', "readwrite").objectStore('userVars');
        let testDB = Object.keys({score1: -1, displayName: "" }).every(function(key) {
            let valueRequest = trans.get(key);
            valueRequest.onsuccess = function(event) {
                let value = valueRequest.result;
                if(value) {
                    //success
                } else {
                    //key missing
                    return false;
                }
                return true;
            }
        });
        if(!testDB) {
            //key is missing, return ""
        } else {
            //********************** */
        }

    };
    openRequest.onversionchange = function() {
        //new save data to grab and push to firebase
    }

    return toReturn;
}

function writeData(toWrite) {



}