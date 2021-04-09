mergeInto(LibraryManager.library, {
    dbCheck: function () {
        let dbVersion = 0;
        let openRequest = indexedDB.open("saveData", dbVersion);

        openRequest.onupgradeneeded = function() {
            let db = openRequest.result;    //openRequest.version gives version
            //new data to write for WebGL to take
            if(!db.objectStoreNames.contains("test")) {
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
    }
});