const express = require('express')
const app = express()
const http = require('http')
const https = require('https')
const fs = require('fs')
const os = require("os")


/*Controllers*/
const appctrl = require("./appctrl")
const clientctrl = require("./clientctrl")
const uploadctrl = require("./uploadctrl")
const distctrl = require("./distctrl")


/*
TODO:
    Server configurable
*/

/*Initilized server*/
var credentials = {
    key: fs.readFileSync(process.env.RSA_KEY, 'utf8'),
    cert: fs.readFileSync(process.env.CERT_PEM, 'utf8')
}

var serverip = appctrl.getServerIpAddress()
clientctrl.init(serverip[0])

/*dist mapping*/
const distmap = require("./mappingctrl")
distmap.init(process.env.DIST_MAP)

var server
if (process.env.USE_HTTPS == 'TRUE')
    server =  https.createServer(credentials, app)
else 
    server = http.createServer(app)

server.listen(process.env.PORT, function () {
    if ( process.env.USE_HTTPS)
        console.log('Using https')
    console.log("Listening server " + os.hostname() + ":" + server.address().port)
})

app.post('/clientinfo:?', function (req, res) {
    //curl -i -X POST  "https://mnl199win/clientinfo?host=mnl192win&type=client&jobs=Flexlogcollector,licpoll&version=8.0.0.0&os=windows_10_enterprise&patches=1321,1322,1323" --cacert keys/cert.pem
    console.log('Got clientinfo update request from ' + req.query.host)
    if (appctrl.checkAuthorization(req, res))
        clientctrl.updateClientInfo(req)
    res.end()
})

app.get('/ping', function (req, res) {
    console.log('Got ping request from ' + req.query.host)
    res.send('hello')
})

app.get('/dist:file?', function (req, res) {

    /*curl -G -X GET "https://host:443/dist/?file=cold.conf&user=fmercado&os=unix" --cacert keys/cert.pem*/

    console.log('Host ' + req.query.host + ' is requesting for ' + req.query.file)

    if (appctrl.checkAuthorization(req, res))
        distctrl.getDistFile(req, res)

})

app.post('/upload:file?', function (req, res) {

    /* curl -i -X POST -H "Content-Type: multipart/form-data" -H "Authorization: openit" -H "Archive:PollCollector.license.licpoll" -F "data=@/c/Users/fmercado/Documents/dev/openit_serverd.log" https://host:443/upload --cacert keys/cert.pem*/

    if (appctrl.checkAuthorization(req, res))
        uploadctrl.uploadFile(req, res)

})
