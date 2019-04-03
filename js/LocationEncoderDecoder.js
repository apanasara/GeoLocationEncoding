function locEncode(lat, lon, radix) {
    let sign_index = ((lat >= 0) ? 0 : 2) + ((lon >= 0) ? 0 : 1); //sign_index

    let sLat = lat.toString().replace("-", "").replace("+", "");  //removing –ve sign
    let sLon = lon.toString().replace("-", "").replace("+", "");

    //defining decimal_index
    let decimalLat = sLat.indexOf(".");
    decimalLat = ((decimalLat < 0) ? sLat.length : decimalLat) - 1;

    let decimalLon = sLon.indexOf(".");
    decimalLon = ((decimalLon < 0) ? sLon.length : decimalLon) - 1;

    let decimal_index = (decimalLat) * 3 + decimalLon;

    //defining seprator_index
    let separator_index = sLat.replace('.', '').length - 1; // omited decimal point & reducing index by 1

    //encoding...
    let bNumber = (sLat + sLon).split(".").join("");
    let encodedCords = new BigNumber(bNumber).toString(radix) + separator_index + new BigNumber(sign_index * 10 + decimal_index).toString(radix);
    return encodedCords;
}

function locDecode(enCords, radix) {
    //getting sign_index & decimal_index
    let sign_decimal = enCords.slice(-1);
    let sd = new BigNumber(sign_decimal, radix).toString();
    sd = (sd.length < 2) ? ("0" + sd) : sd;
    let sign_index = parseInt(sd.slice(-2, 1));
    let decimal_index = parseInt(sd.slice(-1));

    //getting seprator_index
    let separator_index = parseInt(enCords.substr(enCords.length - 2, 1)) + 1;

    //decoding...
    let digits = enCords.slice(0, -2);
    let bDigits = new BigNumber(digits, radix).toString();
    bDigits = (bDigits.length < 2) ? ("0" + bDigits) : bDigits;
    let latDigits = bDigits.slice(0, separator_index);
    let lonDigits = bDigits.slice(separator_index, bDigits.length);

    let decimalPlace = (decimal_index < 3) ? 1 : 2; // adding 1 
    if (decimalPlace < latDigits.length) {
        latDigits = latDigits.slice(0, decimalPlace) + "." + latDigits.slice(decimalPlace);
    }

    decimalPlace = (decimal_index < 3) ? decimal_index + 1 : decimal_index - 2; // adding 1 
    if (decimalPlace < lonDigits.length) {
        lonDigits = lonDigits.slice(0, decimalPlace) + "." + lonDigits.slice(decimalPlace);
    }

    let lat = ((sign_index < 2) ? "" : "-") + latDigits;
    let lon = ((sign_index % 2 == 0) ? "" : "-") + lonDigits;

    var decodedCordObj = {
        latitude: lat,
        longitude: lon
    };
    return decodedCordObj;
}
