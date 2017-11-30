const express = require('express')
const app = express()
const http = require('http');
const https = require('https')
const fs = require('fs')
const os = require("os")
const appctrl = require("./appctrl")
const clientctrl = require("./clientctrl")
const uploadctrl = require("./uploadctrl")
const distctrl = require("./distctrl")

/*-----------------------Initialize server------------------------*/
var credentials = {
    key: fs.readFileSync('./keys/rsa.private.key', 'utf8'),
    cert: fs.readFileSync('./keys/cert.pem', 'utf8')
};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

// httpServer.listen(8888, function () {
//     console.log("Listening server " + os.hostname() + ":" + httpServer.address().port);
// })

httpsServer.listen(443, function () {
    console.log("Listening secure server " + os.hostname() + ":" + httpsServer.address().port);
})

var serverip = appctrl.getServerIpAddress()
clientctrl.init(serverip[0])

/*dist mapping*/
const distmap = require("./mappingctrl")
distmap.init(__dirname + '/config/dist.map')

app.post('/clientinfo:?', function (req, res) {
    //curl -i -X POST  "https://mnl199win/clientinfo?host=mnl192win&type=client&jobs=Flexlogcollector,licpoll&version=8.0.0.0&os=windows_10_enterprise&patches=1321,1322,1323" --cacert keys/cert.pem
    console.log('Got clientinfo update request from ' + req.get('host'))
    if (appctrl.checkAuthorization(req, res))
        clientctrl.updateClientInfo(req)
    res.end()
})

app.get('/ping', function (req, res) {
    console.log('Got ping request from ' + req.get('host'))
    res.send('hello');
})

app.get('/dist:file?', function (req, res) {

    /*curl -G -X GET "https://host:443/dist/?file=cold.conf&user=fmercado&os=unix" --cacert keys/cert.pem*/

    console.log('Host ' + req.get('host') + ' is requesting for ' + req.query.file)

    if (appctrl.checkAuthorization(req, res))
        distctrl.getDistFile(req,res)
    
})

app.post('/upload:file?', function (req, res) {

    /* curl -i -X POST -H "Content-Type: multipart/form-data" -H "Authorization: openit" -H "Archive:PollCollector.license.licpoll" -F "data=@/c/Users/fmercado/Documents/dev/openit_serverd.log" https://host:443/upload --cacert keys/cert.pem*/

    if (appctrl.checkAuthorization(req, res))
        uploadctrl.uploadFile(req,res)

})


//TODO: Test is received data is valid
function isValidData() {

}