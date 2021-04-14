function readData() {
    let score1Cache = localStorage['score1'];
    let displayNameCache = localStorage['displayName'];

    //make sure values exist. if they don't, do nothing. we return ""
    if(!score1Cache || !displayNameCache) {
        return "";
    }

    return score1Cache + "," + displayNameCache;
}

function writeData(toWrite) {
    localStorage['score1'] = toWrite.split(',')[0];
    localStorage['displayName'] = toWrite.split(',')[1];
}