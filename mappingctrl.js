const fs = require('fs')

const Mapping = {

    maps: [],

    parsemap: function (data) {
        lines = []
        lines = data.split('\n')

        cmap = ''
        lines.forEach(line => {
            if (line.indexOf('MAP') !== -1) {
                map = line.split(':')
                cmap = map[1]
                Mapping.maps.push({
                    name: map[1],
                    type: map[0]
                })
            }
        })
    },

    init: function (mapping_file) {

        fs.readFile(mapping_file, {
            encoding: 'utf8'
        }, function (err, data) {
            if (err) throw err
            Mapping.parsemap(data)
        })
    }




}

module.exports = Mapping