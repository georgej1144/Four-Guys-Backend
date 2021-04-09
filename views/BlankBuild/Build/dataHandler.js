let dbVersion = 1;
let openRequest = indexedDB.open("saveData", dbVersion);

let toInput = "50,50,1,5,1";

openRequest.onupgradeneeded = function() {
    let db = openRequest.result;    //openRequest.version gives version
    //new data to write for js to take
    if(!db.objectStoreNames.contains("userVars")) {
        db.createObjectStore("test", {keyPath: 'myID'})
        console.log("it worked?")
    }
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