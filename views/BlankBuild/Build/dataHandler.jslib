mergeInto(LibraryManager.library, {

    readData: function () {
        let toReturn = ""
        let openRequest = indexedDB.open("saveData", 1);

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
            if(testDB) {
                toReturn = trans.get('score1').toString() + "," + trans.get('displayName').toString();
            } else {
                //key is missing, return ""
            }
        };
        return toReturn;
    }

    writeData: function(toWrite) {
        let openRequest = indexedDB.open("saveData", 1);

        openRequest.onupgradeneeded = function() {};    //idb must not have been initialized, kill read and return empty string

        openRequest.onerror = function() {
            console.log("Error", openRequest.error);
        };
        openRequest.onsuccess = function() {
            let db = openRequest.result;
            //idb exists, therefore userVars can be assumed to exist. check keys for data.
            let trans = db.transaction('userVars', "write").objectStore('userVars');

            trans.put(toWrite.split(',')[0], 'score1');
            trans.put(toWrite.split(',')[1], 'displayName');
        };
    }
});