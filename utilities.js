const request = require('request');
const fs = require('fs');

const download = function (url, path, callback) {
    request.head(url, function (err, res, body) {
        request(url).pipe(fs.createWriteStream(path)).on('close', callback);
    });
};

module.exports = { download };