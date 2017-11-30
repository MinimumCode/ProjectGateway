const os = require("os");
const fs = require('fs')

module.exports = {

    stringToMap: function (str) {
        var result = {};
        str.split('=').forEach(function (x) {
            var arr = x.split('=');
            arr[1] && (result[arr[0]] = arr[1]);
        })
        return result;
    },
    checkAuthorization: function(req,res) {
        
        authorize = false
        if ( req.headers.authorization == null ) 
            authorize = false
        if ( req.headers.authorization == 'openit')
            return true

        if (!authorize) {
            message = 'Transaction is not authorized host (' + req.get('host') + ')' 
            console.log(message)
            res.status(401).send(message)
        }
            
        return false
    },

    getServerIpAddress: function () {

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