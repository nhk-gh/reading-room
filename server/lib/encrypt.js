/**
 * Created with JetBrains WebStorm.
 * User: Naum
 * Date: 3/10/13
 * Time: 12:52 PM
 * To change this template use File | Settings | File Templates.
 */
var crypto = require("crypto");

var algorithm = "aes192";
var key = "Терпение и труд всё перетрут!";

exports.encrypt = function(data){
    var cipher = crypto.createCipher(algorithm, key);
    var encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final("hex");
    //console.log(encrypted);
    return encrypted;
};

exports.decrypt = function(data){
    var decipher = crypto.createDecipher(algorithm, key);
    var decrypted = decipher.update(data, "hex", "utf8");
    decrypted += decipher.final("utf8");
    //console.log(decrypted);
    return decrypted;
};
