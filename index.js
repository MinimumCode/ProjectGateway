const express = require('express')
const app = express()
const http = require('http');
const https = require('https');
const fs = require('fs')
const formidable = require('formidable')
const os = require("os");
var appframe = require("./appframe")
var interfaces = os.networkInterfaces();


/*-----------------------Initialize server------------------------*/
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

/*gets local server ip*/
var addresses = [];
for (var interf in interfaces) {
    for (var index in interfaces[interf]) {
        var address = interfaces[interf][index];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}
var json_file = __dirname + "/openit_client_info.json";
if (! fs.existsSync(json_file)) {
    fs.writeFile(json_file , "{}", { flag: 'wx' }, function (err) {
        if (err) throw err;
        console.log("Intialized openit_client_info.json");
    });
}



/*-----------------------Initialize server------------------------*/
   
    


/*process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});*/



/*TODO: Execute a command using rest remotely*/

/*TODO: update client information save to json file*/
app.post('/clientinfo:?', function (req, res) {

    /*
        curl -i -X POST  "https://mnl199win/clientinfo?host=mnl192win&type=client&jobs=Flexlogcollector,licpoll&version=8.0.0.0&os=windows_10_enterprise&patches=1321,1322,1323" --cacert keys/cert.pem

    */
    var json_file = __dirname + "/openit_client_info.json"
    fs.readFile(json_file, "utf8", function (err, data) {

        var client = [];
        client.hostname = req.query.host;

        client.jobs = [];
        if (req.query.jobs != null)
            client.jobs = req.query.jobs.split(",");

        client.patches = [];
        if (req.query.patches != null)
            client.patches = req.query.patches.split(",");

        client.version = "unknown";
        if (req.query.version != null)
            client.version = req.query.version;

        client.os = "unknown";
        if (req.query.os != null)
            client.os = req.query.os;

        /*
            version
            arch
            ip
            hostname
            patches
            os
        */
        var server = [];
        server.epoch = Math.round((new Date).getTime() / 1000);
        server.date = new Date();



        var clientinfo = {
            "client": {
                "jobs": client.jobs,
                "version": client.version,
                "arch": client.arch,
                "ip": client.ip,
                "hostname": client.hostname,
                "patches": client.patches,
                "os": client.os
            },
            "server": {
                "epoch": server.epoch,
                "date": server.date,
                "ip": addresses[0],
                "hostname": os.hostname()
            }
        };

        var clients = {};
        clients = JSON.parse(data);
        clients[client.hostname] = clientinfo;

        clients = JSON.stringify(clients);
        fs.writeFile(json_file, clients, function (err) {
            if (err) throw err;
            console.log('updated', clientinfo);
            res.end();
        })
    })
})
app.get('/ping', function (req, res) {
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