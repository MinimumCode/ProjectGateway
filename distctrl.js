const fs = require('fs')

const Dist = {
    getDistFile: function(req,res) {
        var distfile = req.query.file
        var user = req.query.user
        var os = req.query.os
        var host = req.headers.host
    
        /*TODO add special instructions for different os user etc...*/
    
        fs.readFile("./dist/" + distfile, 'utf8', function (err, contents) {
            if (err) throw err
            res.write(contents)
            res.end()
        })
    }
   
}

module.exports = Dist