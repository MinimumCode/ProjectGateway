const fs = require('fs')
const os = require("os")


module.exports = {

    clients: [],
    serverip: '',
    json_file: __dirname + "/openit_client_info.json",

    init: function (ip) {
        serverip = ip
        this.initClientJson()
    },

    initClientJson: function () {

        if (!fs.existsSync(this.json_file)) {
            fs.writeFile(this.json_file, "{}", {
                flag: 'wx'
            }, function (err) {
                if (err) throw err;
                console.log("Intialized openit_client_info.json");
            })
        } else {
            js = fs.readFileSync(this.json_file, 'utf8')
            this.clients = JSON.parse(js);
        }
        this.clients.lastupdate = Math.round((new Date).getTime() / 1000)
    },

    updateClientInfo: function (req) {

        var client = []
        client.hostname = req.query.host
        client.os = "unknown"
        client.jobs = []
        client.patches = []
        client.version = "unknown"

        var server = [];
        server.epoch = Math.round((new Date).getTime() / 1000)
        server.date = new Date()

        if (req.query.jobs != null)
            client.jobs = req.query.jobs.split(",");

        if (req.query.patches != null)
            client.patches = req.query.patches.split(",");

        if (req.query.version != null)
            client.version = req.query.version;

        if (req.query.os != null)
            client.os = req.query.os;

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
                "ip": serverip,
                "hostname": os.hostname()
            }
        }

        now = Math.round((new Date).getTime() / 1000)
        // this is a new client 
        if (this.clients[client.hostname] == null) {
            this.clients[client.hostname] = clientinfo
            console.log('Got new client(' + client.hostname + ')')
            this.writeClientInfo()
        } else {
            //save cache to file
            this.clients[client.hostnames] = clientinfo
            diff = now - this.clients.lastupdate
            if (diff > 60) {
                console.log('Last file update is more than 60s. Saving cache to file')
                this.writeClientInfo()
            }

        }
    },
    writeClientInfo: function () {

        now = Math.round((new Date).getTime() / 1000)
        this.clients.lastupdate = now

        fs.writeFileSync(this.json_file, JSON.stringify(this.clients), {
            encoding: 'utf8'
        }, function (err) {
            if (err) throw err;
        })
        console.log('Saving openit client json file(' + this.json_file + ')')
    }
}