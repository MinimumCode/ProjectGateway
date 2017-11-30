const os = require("os");
const fs = require('fs')
const crypto = require('crypto')
const AppCtrl = {

    authorization: '',
    generateServerHash: function(){
        console.log('Reading license file')
        var server_license
        keys = fs.readFileSync('./keys/license.dat',{encoding:'utf8'})
        keys = keys.split('\n')
        keys.forEach(function(key){
            if (key.indexOf('SERVER_LICENSE') !== -1) {
                key = key.split(':')[1].replace(/ /g,'')
                AppCtrl.createHash(key)
                return
            }
        })
    },
    createHash: function (key) {
        console.log('Generating secret hash')
        AppCtrl.authorization = crypto.createHash('sha256')
            .update(key, 'utf8')
            .digest('hex')
    },

    stringToMap: function (str) {
        var result = {};
        str.split('=').forEach(function (x) {
            var arr = x.split('=');
            arr[1] && (result[arr[0]] = arr[1]);
        })
        return result;
    },
    checkAuthorization: function (req, res) {
 
        authorize = false
        if (req.headers.authorization == null)
            authorize = false
        if (req.headers.authorization == AppCtrl.authorization )
            return true

        if (!authorize) {
            message = 'Transaction is not authorized host (' + req.get('host') + ')'
            console.log(message)
            res.status(401).send(message)
        }

        return false
    },

    getServerIpAddress: function () {
        console.log('Retrieving server ip address')
        var addresses = []
        var interfaces = os.networkInterfaces()
        for (var interf in interfaces) {
            for (var index in interfaces[interf]) {
                var address = interfaces[interf][index];
                if (address.family === 'IPv4' && !address.internal) {
                    addresses.push(address.address);
                }
            }
        }
        return addresses
    }


}

module.exports = AppCtrl