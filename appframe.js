const os = require("os");
var interfaces = os.networkInterfaces();

module.exports = {

    stringToMap: function (str) {
        var result = {};
        str.split('=').forEach(function (x) {
            var arr = x.split('=');
            arr[1] && (result[arr[0]] = arr[1]);
        });
        return result;
    },

}