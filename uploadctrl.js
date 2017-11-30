const formidable = require('formidable')
const fs = require('fs')

const Upload = {

    uploadFile: function (req, res) {
        var form = new formidable.IncomingForm()
        var hash_code = req.headers.hash;
        form.parse(req, function (err, fields, files) {

            var oldpath = files.data.path
            var epoch = ((new Date).getTime())
            var newpath = './uploads/archiver-' + epoch + "-" + hash_code + ".in";
            /*TODO: make sure data is valid.*/
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err

                message = 'Upload success'
                console.log(message + ' to ' + newpath)
                res.write(message)
                res.end()

            })

        })
    }

}
module.exports = Upload