const express = require('express')
const path = require('path')
const app = express();
const PORT = process.env.PORT || 3000;
const http = require('http').createServer(app);

app.use(express.static(path.join(__dirname,"views")))

app.get('/', function (req, res) {
    res.sendFile('views/BlankBuild/index.html', {root: __dirname})
});

const run = http.listen(PORT, () => {
    console.log("server is running!");
})