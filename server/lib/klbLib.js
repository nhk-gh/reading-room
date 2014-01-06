/**
 * Created with JetBrains WebStorm.
 * User: Naum
 * Date: 4/29/13
 * Time: 3:33 PM
 * To change this template use File | Settings | File Templates.
 */
exports.klbIsArray = function (obj){
    if (Array.isArray)
        return Array.isArray(obj);
    else
        return ( Object.prototype.toString.call( obj ) === '[object Array]' )
};

exports.klbThumbPath = function(path){
    var thumbPath;
    var ind = path.lastIndexOf('.');

    if (ind == -1)
        thumbPath = path + "_thumb";
    else
        thumbPath = path.substring(0,ind) + "_thumb" + path.substring(ind);

    return thumbPath;
}

exports.klb650x480Path = function(path){
    var thumbPath;
    var ind = path.lastIndexOf('.');

    if (ind == -1)
        thumbPath = path + "_650x480";
    else
        thumbPath = path.substring(0,ind) + "_650x480" + path.substring(ind);

    return thumbPath;
}