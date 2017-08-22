const express = require('express')
const app = express()
const http = require('http');
const https = require('https');
const fs = require('fs')
const formidable = require('formidable')
const os = require("os");


/*Initialize server*/
var credentials = {
    key: fs.readFileSync('./keys/rsa.private.key', 'utf8'),
    cert: fs.readFileSync('./keys/cert.pem', 'utf8')
};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8888, function () {
    console.log("Listening server " + os.hostname() + ":" + httpServer.address().port);
});
httpsServer.listen(443, function () {
    console.log("Listening secure server " + os.hostname() + ":" + httpsServer.address().port);
});



/*process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});*/


app.get('/', function (req, res) {
    res.send('hello');
});

app.get('/dist:file?', function (req, res) {

    /*curl -G -X GET "https://host:443/dist/?file=cold.conf&user=fmercado&os=unix" --cacert keys/cert.pem*/

    var distfile = req.query.file;
    var user = req.query.user;
    var os = req.query.os;
    var host = req.headers.host;

    /*TODO add special instructions for different os user etc...*/

    fs.readFile("./dist/" + distfile, 'utf8', function (err, contents) {
        res.write(contents);
        res.end();
    })
})

app.post('/upload:file?', function (req, res) {

    /* curl -i -X POST -H "Content-Type: multipart/form-data" -H "Hash: fsudfhaufds" -H "Archive:PollCollector.license.licpoll" -F "data=@/c/Users/fmercado/Documents/dev/openit_serverd.log" https://host:443/upload --cacert keys/cert.pem*/

    var hash_code = req.headers.hash;
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.data.path;
        var epoch = ((new Date).getTime());
        var newpath = './uploads/archiver-' + epoch + "-" + hash_code + ".in";

        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.write('File uploaded and moved!');
            res.end();
        });
    });
})


//TODO: Test is received data is valid
function isValidData() {

}