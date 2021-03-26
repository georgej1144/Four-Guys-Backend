const express = require('express')
const path = require('path')
const app = express();
const PORT = process.env.PORT || 3000;
const unirest = require("unirest");
const http = require('http').createServer(app);


if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

app.use(express.static(path.join(__dirname,"views")))

//app.get('/', function(req,res) {
//    res.sendFile('views/root_redirect.html', {root: __dirname})
//});

app.get('/', function (req, res) {
    res.sendFile('views/BlankBuild/index.html', {root: __dirname})
});

//app.get('/webgl', function (req, res) {
//    res.sendFile('views/WebGL_Build/index.html', {root: __dirname})
//})

const run = http.listen(PORT, () => {
    console.log("server is running!");
})
