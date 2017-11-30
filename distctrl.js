const fs = require('fs')

const Dist = {
    getDistFile: function (req, res) {
        var distfile = req.query.file
        var user = req.query.user
        var os = req.query.os
        var host = req.headers.host

        /*TODO add special instructions for different os user etc...*/
        var dist = "./dist/" + distfile
        if (fs.exists(dist)) {
            fs.readFile(dist, 'utf8', function (err, contents) {
                if (err) throw err
                res.write(contents)
                res.end()
            })
        } else {
            message = 'Requested file does not exists'
            console.log(message)
            res.status(404).send(message)
        }
    }
}

module.exports = Dist