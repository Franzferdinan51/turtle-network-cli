const fs = require('fs');
const path = require('path');

//helper to get number with commas
const numberWithCommas = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

//helper transfer kilohashes to mgh
function formatBytes(a, b) {
    if (0 == a) return "0 Bytes";
    var c = 1000,
        d = b || 2,
        e = ["Bytes", "KH/s", "MH/s", "GH/s", "TH/s", "PB", "EB", "ZB", "YB"],
        f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}

//Grabs a text file that has ASCII text to display under the "swanson" command
function grabASCII(file){
  var ascii = fs.readFileSync(path.join(__dirname, '../trtl-cli/ascii/' + file + ".txt"), 'utf8')
  console.info(ascii)
}

module.exports = {
    numberWithCommas,
    formatBytes,
    grabASCII
};
